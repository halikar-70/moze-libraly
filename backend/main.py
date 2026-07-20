import datetime
from typing import List, Optional
import os
import shutil
import time
from fastapi import FastAPI, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
import auth
from database import engine, Base, get_db

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Moze Smart Library API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static/uploads directory on startup if it doesn't exist
os.makedirs("static/uploads", exist_ok=True)

# Mount static files for uploads
app.mount("/static", StaticFiles(directory="static"), name="static")

# Seed default departments if missing
@app.on_event("startup")
def startup_populate():
    db = next(get_db())
    try:
        departments = [
            "First Year Engineering",
            "Computer Engineering",
            "Information Technology Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "E&TC Engineering",
            "AI & Machine Learning Engineering",
            "AI & Data Science Engineering"
        ]
        for name in departments:
            exists = db.query(models.Department).filter(models.Department.name == name).first()
            if not exists:
                db.add(models.Department(name=name))
        db.commit()
    except Exception as e:
        print("Startup seeding error:", e)
    finally:
        db.close()

# ----------------- AUTHENTICATION -----------------

@app.post("/api/auth/register/student", response_model=schemas.StudentOut)
def register_student(payload: schemas.StudentRegister, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(models.Student).filter(models.Student.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Check duplicate PRN
    if db.query(models.Student).filter(models.Student.prn_number == payload.prn_number).first():
        raise HTTPException(status_code=400, detail="PRN number already registered")
    # Validate department
    dept = db.query(models.Department).filter(models.Department.id == payload.department_id).first()
    if not dept:
        raise HTTPException(status_code=400, detail="Invalid Department ID")

    hashed = auth.get_password_hash(payload.password)
    student = models.Student(
        full_name=payload.full_name,
        prn_number=payload.prn_number,
        roll_number=payload.roll_number,
        department_id=payload.department_id,
        year=payload.year,
        division=payload.division,
        email=payload.email,
        mobile_number=payload.mobile_number,
        hashed_password=hashed,
        credit_score=100,
        is_active=True
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    # Log action
    log = models.ActivityLog(user_email=student.email, role="student", action="Registered as student")
    db.add(log)
    db.commit()
    
    return student

@app.post("/api/auth/register/librarian", response_model=schemas.LibrarianOut)
def register_librarian(payload: schemas.LibrarianRegister, db: Session = Depends(get_db)):
    if db.query(models.Librarian).filter(models.Librarian.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(models.Librarian).filter(models.Librarian.employee_id == payload.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already registered")

    # If it's the first librarian, approve automatically, otherwise require approval
    count = db.query(models.Librarian).count()
    should_approve = (count == 0)

    hashed = auth.get_password_hash(payload.password)
    librarian = models.Librarian(
        full_name=payload.full_name,
        employee_id=payload.employee_id,
        email=payload.email,
        mobile_number=payload.mobile_number,
        hashed_password=hashed,
        is_approved=should_approve
    )
    db.add(librarian)
    db.commit()
    db.refresh(librarian)

    log = models.ActivityLog(user_email=librarian.email, role="librarian", action=f"Registered librarian (Approved: {should_approve})")
    db.add(log)
    db.commit()

    return librarian

@app.post("/api/auth/login", response_model=schemas.Token)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    if payload.role == "student":
        student = db.query(models.Student).filter(models.Student.email == payload.email).first()
        if not student or not auth.verify_password(payload.password, student.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        if not student.is_active:
            raise HTTPException(status_code=400, detail="Student profile is deactivated")
        
        token = auth.create_access_token({"sub": student.email, "role": "student"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "student",
            "user_name": student.full_name,
            "email": student.email
        }
    elif payload.role == "librarian":
        librarian = db.query(models.Librarian).filter(models.Librarian.email == payload.email).first()
        if not librarian or not auth.verify_password(payload.password, librarian.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        if not librarian.is_approved:
            raise HTTPException(status_code=403, detail="Librarian account is pending approval by administrator")
        
        token = auth.create_access_token({"sub": librarian.email, "role": "librarian"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "librarian",
            "user_name": librarian.full_name,
            "email": librarian.email
        }
    raise HTTPException(status_code=400, detail="Invalid login role")

@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(auth.get_current_user)):
    user = current_user["user"]
    role = current_user["role"]
    if role == "student":
        return {
            "role": "student",
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "prn_number": user.prn_number,
            "roll_number": user.roll_number,
            "division": user.division,
            "year": user.year,
            "credit_score": user.credit_score,
            "mobile_number": user.mobile_number,
            "department_id": user.department_id,
            "department_name": user.department.name if user.department else None
        }
    else:
        return {
            "role": "librarian",
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "employee_id": user.employee_id,
            "mobile_number": user.mobile_number
        }

# ----------------- DEPARTMENTS -----------------

@app.get("/api/departments", response_model=List[schemas.DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()

# ----------------- BOOKS -----------------

DEPARTMENT_SUBJECTS = {
    "IT": [
        "Data Structures & Algorithms",
        "Object Oriented Programming",
        "Basics of Computer Network",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values and Professional Ethics",
        "Database Management System",
        "Computer Graphics",
        "Probability & Statistics",
        "Open Elective II",
        "Processor Architecture",
        "Digital Marketing and Social Media",
        "Modern Indian Language (Marathi/Hindi)",
        "E-Commerce",
        "Environmental Studies",
        "Theory of Computation",
        "Operating Systems",
        "Machine Learning",
        "Human Computer Interaction",
        "Elective I",
        "Computer Networks & Security",
        "Data Science and Big Data Analytics",
        "Web Application Development",
        "Elective II"
    ],
    "Computer": [
        "Data Structures",
        "Object Oriented Programming and Computer Graphics",
        "Operating Systems",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Database Management Systems",
        "Software Engineering",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Full Stack Development",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies",
        "Theory of Computation",
        "Systems Programming & Operating System",
        "Database Management System",
        "Computer Networks",
        "Elective I",
        "Software Engineering & Project Management",
        "Web Technology",
        "Data Analytics",
        "Artificial Intelligence",
        "Elective II",
        "High Performance Computing",
        "Deep Learning",
        "Elective III",
        "Elective IV",
        "Elective V",
        "Elective VI"
    ],
    "Mechanical": [
        "Engineering Mathematics III",
        "Engineering Thermodynamics",
        "Engineering Mechanics",
        "Manufacturing Processes",
        "Material Science and Metallurgy",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I",
        "Fluid Mechanics",
        "Strength of Materials",
        "Manufacturing Technology",
        "Machine Drawing",
        "Electrical and Electronics Engineering",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II",
        "Design of Machine Elements – I",
        "Heat Transfer",
        "Theory of Machines",
        "Metrology and Quality Control",
        "Elective I",
        "Design of Machine Elements – II",
        "Refrigeration and Air Conditioning",
        "Turbo Machines",
        "Industrial Engineering",
        "Elective II",
        "Finite Element Analysis",
        "Mechatronics",
        "Elective III",
        "Elective IV",
        "Operations Research",
        "Elective V",
        "Elective VI"
    ],
    "Civil": [
        "Engineering Mathematics III",
        "Surveying",
        "Engineering Geology",
        "Building Materials and Construction",
        "Strength of Materials",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I",
        "Fluid Mechanics",
        "Structural Analysis",
        "Concrete Technology",
        "Transportation Engineering",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II",
        "Design of Reinforced Concrete Structures",
        "Geotechnical Engineering",
        "Water Resources Engineering",
        "Environmental Engineering",
        "Elective I",
        "Design of Steel Structures",
        "Transportation Engineering",
        "Estimation, Costing and Valuation",
        "Construction Management",
        "Elective II",
        "Advanced Structural Engineering",
        "Foundation Engineering",
        "Elective III",
        "Elective IV",
        "Quantity Surveying and Contracts",
        "Elective V",
        "Elective VI"
    ],
    "E&TC": [
        "Engineering Mathematics III",
        "Electronic Devices and Circuits",
        "Digital Electronics",
        "Network Theory",
        "Signals and Systems",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I",
        "Analog Circuits",
        "Microprocessors",
        "Electromagnetic Engineering",
        "Control Systems",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II",
        "Digital Communication",
        "Digital Signal Processing",
        "Microcontrollers",
        "Linear Integrated Circuits",
        "Elective I",
        "VLSI Design",
        "Wireless Communication",
        "Embedded Systems",
        "Computer Networks",
        "Elective II",
        "Microwave Engineering",
        "Optical Communication",
        "Elective III",
        "Elective IV",
        "Internet of Things (IoT)",
        "Satellite Communication",
        "Elective V",
        "Elective VI"
    ],
    "FE": [
        "Engineering Mathematics I",
        "Engineering Physics",
        "Basic Electrical Engineering",
        "Engineering Graphics",
        "Indian Knowledge System",
        "Professional Communication Skills",
        "Engineering Mathematics II",
        "Engineering Chemistry",
        "Programming and Problem Solving",
        "Basic Electronics Engineering",
        "Engineering Mechanics",
        "Environmental Studies"
    ],
    "AI & ML": [
        "Data Structures",
        "Object Oriented Programming",
        "Discrete Mathematics",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Database Management Systems",
        "Probability & Statistics",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Machine Learning Fundamentals",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Mining & Data Warehousing",
        "Software Engineering",
        "Elective I",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Reinforcement Learning",
        "Elective II",
        "MLOps",
        "Explainable AI",
        "Elective III",
        "Elective IV",
        "Elective V",
        "Elective VI"
    ],
    "AI & DS": [
        "Data Structures",
        "Object Oriented Programming",
        "Discrete Mathematics",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Database Management Systems",
        "Probability & Statistics",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Data Visualization",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies",
        "Machine Learning",
        "Artificial Intelligence",
        "Data Warehousing & Data Mining",
        "Software Engineering",
        "Elective I",
        "Deep Learning",
        "Big Data Analytics",
        "Natural Language Processing",
        "Computer Vision",
        "Elective II",
        "Reinforcement Learning",
        "MLOps",
        "Elective III",
        "Elective IV",
        "Elective V",
        "Elective VI"
    ]
}

def get_dept_display_name(name: str) -> str:
    if not name:
        return ""
    if "AI & Machine Learning" in name:
        return "AI & ML"
    if "AI & Data Science" in name:
        return "AI & DS"
    if "Information Technology" in name:
        return "IT"
    if "First Year" in name:
        return "FE"
    if "Electronics" in name or "E&TC" in name:
        return "E&TC"
    return name.split(' ')[0]

@app.get("/api/books", response_model=List[schemas.BookOut])
def get_books(
    q: Optional[str] = Query(None, description="Search term for title, author, publication, description or keywords"),
    department_id: Optional[int] = None,
    subject: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Book)
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (models.Book.title.like(search_filter)) |
            (models.Book.author.like(search_filter)) |
            (models.Book.publication.like(search_filter)) |
            (models.Book.description.like(search_filter)) |
            (models.Book.keywords.like(search_filter)) |
            (models.Book.subject.like(search_filter))
        )
    if subject:
        query = query.filter(models.Book.subject.like(f"%{subject}%"))
    if available_only:
        query = query.filter(models.Book.available_copies > 0)
        
    books = query.all()
    if department_id:
        dept = db.query(models.Department).filter(models.Department.id == department_id).first()
        if dept:
            dept_key = get_dept_display_name(dept.name)
            allowed_subjects = DEPARTMENT_SUBJECTS.get(dept_key, [])
            
            # Normalize list of allowed subjects for flexible matching
            normalized_allowed = set()
            for s in allowed_subjects:
                s_clean = s.lower().replace("&", "and").replace("–", "-").replace("  ", " ").strip()
                normalized_allowed.add(s_clean)
            
            filtered_books = []
            for b in books:
                # Keep if department matches directly
                if b.department_id == department_id:
                    filtered_books.append(b)
                    continue
                # Keep if subject matches any in the allowed subjects list for this department
                if b.subject:
                    b_sub_clean = b.subject.lower().replace("&", "and").replace("–", "-").replace("  ", " ").strip()
                    if b_sub_clean in normalized_allowed:
                        filtered_books.append(b)
            books = filtered_books
            
    return books

@app.get("/api/books/suggestions")
def get_suggestions(q: str = Query("", min_length=1), db: Session = Depends(get_db)):
    if not q:
        return []
    search_filter = f"%{q}%"
    titles = db.query(models.Book.title).filter(models.Book.title.like(search_filter)).limit(5).all()
    authors = db.query(models.Book.author).filter(models.Book.author.like(search_filter)).distinct().limit(3).all()
    suggestions = [t[0] for t in titles] + [a[0] for a in authors]
    return list(set(suggestions))

@app.get("/api/books/categories")
def get_categories(db: Session = Depends(get_db)):
    # Distinct subjects
    subjects = db.query(models.Book.subject).distinct().all()
    return [s[0] for s in subjects if s[0]]

@app.get("/api/books/featured")
def get_featured_books(db: Session = Depends(get_db)):
    # Recently added books
    recent = db.query(models.Book).order_by(models.Book.date_added.desc()).limit(4).all()
    # Recommended (mock list, or based on top stock)
    recommended = db.query(models.Book).order_by(models.Book.id.asc()).limit(4).all()
    # Popular books (most borrowed)
    popular_subquery = db.query(
        models.BorrowedBook.book_id, func.count(models.BorrowedBook.id).label("borrow_count")
    ).group_by(models.BorrowedBook.book_id).subquery()
    
    popular = db.query(models.Book).join(
        popular_subquery, models.Book.id == popular_subquery.c.book_id
    ).order_by(popular_subquery.c.borrow_count.desc()).limit(4).all()

    if not popular:
        popular = db.query(models.Book).limit(4).all()

    return {
        "recent": recent,
        "recommended": recommended,
        "popular": popular
    }

@app.get("/api/books/{book_id}", response_model=schemas.BookOut)
def get_book_details(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.post("/api/books", response_model=schemas.BookOut)
def add_book(payload: schemas.BookCreate, admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    # Check if ISBN duplicate
    if db.query(models.Book).filter(models.Book.isbn == payload.isbn).first():
        raise HTTPException(status_code=400, detail="ISBN already exists")
    
    dept = db.query(models.Department).filter(models.Department.id == payload.department_id).first()
    if not dept:
        raise HTTPException(status_code=400, detail="Invalid Department ID")

    book = models.Book(
        isbn=payload.isbn,
        title=payload.title,
        author=payload.author,
        publication=payload.publication,
        edition=payload.edition,
        department_id=payload.department_id,
        subject=payload.subject,
        semester=payload.semester,
        pages=payload.pages,
        language=payload.language or "English",
        cover_image=payload.cover_image or "",
        description=payload.description or "",
        keywords=payload.keywords or "",
        rack_number=payload.rack_number,
        shelf_number=payload.shelf_number,
        quantity=payload.quantity,
        available_copies=payload.quantity,
        status="Available" if payload.quantity > 0 else "Out of Stock"
    )
    db.add(book)
    db.commit()
    db.refresh(book)

    log = models.ActivityLog(user_email=admin.email, role="librarian", action=f"Added book: {book.title}")
    db.add(log)
    db.commit()

    return book

@app.put("/api/books/{book_id}", response_model=schemas.BookOut)
def edit_book(book_id: int, payload: schemas.BookUpdate, admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data = payload.dict(exclude_unset=True)
    
    # Handle quantity modifications and sync available copies
    if "quantity" in update_data:
        diff = update_data["quantity"] - book.quantity
        book.quantity = update_data["quantity"]
        book.available_copies = max(0, book.available_copies + diff)
        book.status = "Available" if book.available_copies > 0 else "Out of Stock"
        del update_data["quantity"]

    for key, value in update_data.items():
        setattr(book, key, value)

    db.commit()
    db.refresh(book)

    log = models.ActivityLog(user_email=admin.email, role="librarian", action=f"Edited book: {book.title}")
    db.add(log)
    db.commit()

    return book

@app.delete("/api/books/{book_id}")
def delete_book(book_id: int, admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if there are active loans
    active_loans = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.book_id == book_id,
        models.BorrowedBook.status == "Borrowed"
    ).first()
    if active_loans:
        raise HTTPException(status_code=400, detail="Cannot delete book with active borrow operations")

    db.delete(book)
    db.commit()

    log = models.ActivityLog(user_email=admin.email, role="librarian", action=f"Deleted book ID: {book_id}")
    db.add(log)
    db.commit()

    return {"message": "Book successfully deleted"}

# ----------------- BORROW SYSTEM -----------------

@app.post("/api/borrow/issue", response_model=schemas.BorrowedBookOut)
def issue_book(
    prn_number: str = Query(...), 
    isbn: str = Query(...), 
    admin=Depends(auth.require_librarian), 
    db: Session = Depends(get_db)
):
    # Find student
    student = db.query(models.Student).filter(models.Student.prn_number == prn_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Find book
    book = db.query(models.Book).filter(models.Book.isbn == isbn).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check credit score
    if student.credit_score < 40:
        raise HTTPException(
            status_code=400, 
            detail=f"Borrowing blocked: Credit score ({student.credit_score}) is below 40. Requires librarian approval."
        )

    # Check availability
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book out of stock")

    # Issue book
    book.available_copies -= 1
    if book.available_copies == 0:
        book.status = "Out of Stock"
    
    borrow_date = datetime.datetime.utcnow()
    due_date = borrow_date + datetime.timedelta(days=15) # Default 15 days borrow time

    record = models.BorrowedBook(
        student_id=student.id,
        book_id=book.id,
        borrow_date=borrow_date,
        due_date=due_date,
        status="Borrowed"
    )
    db.add(record)
    
    # Clear matching pending reservation if it exists
    res = db.query(models.Reservation).filter(
        models.Reservation.student_id == student.id,
        models.Reservation.book_id == book.id,
        models.Reservation.status == "Pending"
    ).first()
    if res:
        res.status = "Approved"

    db.commit()
    db.refresh(record)

    # Create notification for student
    notif = models.Notification(
        student_id=student.id,
        message=f"Book Issued: '{book.title}' has been successfully issued to you. Due date: {due_date.strftime('%d %B %Y')}."
    )
    db.add(notif)
    
    log = models.ActivityLog(
        user_email=admin.email, 
        role="librarian", 
        action=f"Issued book '{book.title}' to student {student.full_name} ({student.prn_number})"
    )
    db.add(log)
    db.commit()

    return record

@app.post("/api/borrow/return", response_model=schemas.BorrowedBookOut)
def return_book(
    borrow_id: int, 
    return_status: str = Query("Returned", description="Returned, Lost, Damaged"),
    admin=Depends(auth.require_librarian), 
    db: Session = Depends(get_db)
):
    record = db.query(models.BorrowedBook).filter(models.BorrowedBook.id == borrow_id).first()
    if not record or record.status not in ["Borrowed", "Return Pending"]:
        raise HTTPException(status_code=400, detail="Invalid active borrow record")

    student = record.student
    book = record.book
    return_date = datetime.datetime.utcnow()
    
    record.return_date = return_date
    record.status = return_status

    # Recalculate book stock if returned
    if return_status == "Returned":
        book.available_copies = min(book.quantity, book.available_copies + 1)
        book.status = "Available"
    elif return_status in ["Lost", "Damaged"]:
        # Book is removed from total inventory
        book.quantity = max(0, book.quantity - 1)
        book.status = "Available" if book.available_copies > 0 else "Out of Stock"

    # Credit modification calculations
    credit_change = 0
    reason = "Returned book"

    if return_status == "Returned":
        days_late = (return_date.date() - record.due_date.date()).days
        if days_late < 0:
            # Returned early
            credit_change = 2
            reason = f"Book '{book.title}' returned early ({abs(days_late)} days before due date)"
        elif days_late == 0:
            credit_change = 0
            reason = f"Book '{book.title}' returned exactly on due date"
        else:
            # Late return
            if days_late == 1:
                credit_change = -5
            elif days_late == 2:
                credit_change = -10
            elif days_late <= 7:
                credit_change = -20
            else:
                credit_change = -20  # More than 7 days
            reason = f"Book '{book.title}' returned late by {days_late} days"
    elif return_status == "Lost":
        credit_change = -40
        reason = f"Lost book: '{book.title}'"
    elif return_status == "Damaged":
        credit_change = -25
        reason = f"Damaged book: '{book.title}'"

    # Update credit
    old_credit = student.credit_score
    new_credit = max(0, min(100, student.credit_score + credit_change))
    student.credit_score = new_credit
    
    # Save Credit History log if credit changed or lost/damaged recorded
    if credit_change != 0 or return_status in ["Lost", "Damaged"]:
        cred_history = models.CreditHistory(
            student_id=student.id,
            change_amount=credit_change,
            new_score=new_credit,
            reason=reason
        )
        db.add(cred_history)

    # In-app notification for student
    notif_msg = f"Book return logged: '{book.title}'. Status: {return_status}. "
    if credit_change > 0:
        notif_msg += f"Credit Score increased by {credit_change} points (Now: {new_credit})."
    elif credit_change < 0:
        notif_msg += f"Credit Score decreased by {abs(credit_change)} points (Now: {new_credit}). Reason: {reason}."
    else:
        notif_msg += f"No change to credit score (Now: {new_credit})."

    notif = models.Notification(student_id=student.id, message=notif_msg)
    db.add(notif)

    log = models.ActivityLog(
        user_email=admin.email, 
        role="librarian", 
        action=f"Returned book ID {book.id} for student ID {student.id} (Status: {return_status}, Credit change: {credit_change})"
    )
    db.add(log)
    db.commit()
    db.refresh(record)

    return record

@app.post("/api/books/{book_id}/reserve", response_model=schemas.ReservationOut)
def reserve_book(book_id: int, current_student=Depends(auth.require_student), db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # Check if student credit score < 40
    if current_student.credit_score < 40:
        raise HTTPException(
            status_code=400, 
            detail=f"Reservation blocked: Credit score ({current_student.credit_score}) is below 40."
        )

    # Check if already reserved / active borrow of same book by this student
    existing_res = db.query(models.Reservation).filter(
        models.Reservation.student_id == current_student.id,
        models.Reservation.book_id == book_id,
        models.Reservation.status == "Pending"
    ).first()
    if existing_res:
        raise HTTPException(status_code=400, detail="You already have a pending reservation for this book")

    existing_borrow = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.student_id == current_student.id,
        models.BorrowedBook.book_id == book_id,
        models.BorrowedBook.status == "Borrowed"
    ).first()
    if existing_borrow:
        raise HTTPException(status_code=400, detail="You currently have this book borrowed")

    reservation = models.Reservation(
        student_id=current_student.id,
        book_id=book_id,
        status="Pending"
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    # Log action
    log = models.ActivityLog(
        user_email=current_student.email,
        role="student",
        action=f"Reserved book: {book.title}"
    )
    db.add(log)
    db.commit()

    return reservation

@app.get("/api/borrow/student-records")
def get_student_borrow_records(current_student=Depends(auth.require_student), db: Session = Depends(get_db)):
    # Get active borrows (either Borrowed or Return Pending)
    active_borrows = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.student_id == current_student.id,
        models.BorrowedBook.status.in_(["Borrowed", "Return Pending"])
    ).all()

    # Get history (exclude active and pending return records)
    history = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.student_id == current_student.id,
        models.BorrowedBook.status.notin_(["Borrowed", "Return Pending"])
    ).order_by(models.BorrowedBook.return_date.desc()).all()

    # Get reservations
    reservations = db.query(models.Reservation).filter(
        models.Reservation.student_id == current_student.id
    ).order_by(models.Reservation.reservation_date.desc()).all()

    # Get credit history
    credit_logs = db.query(models.CreditHistory).filter(
        models.CreditHistory.student_id == current_student.id
    ).order_by(models.CreditHistory.timestamp.desc()).all()

    # Build response records with countdown calculation
    active_list = []
    now = datetime.datetime.utcnow()
    for rec in active_borrows:
        remaining_delta = rec.due_date - now
        remaining_days = remaining_delta.days
        # Remaining time description
        active_list.append({
            "id": rec.id,
            "book": {
                "id": rec.book.id,
                "title": rec.book.title,
                "author": rec.book.author,
                "isbn": rec.book.isbn,
                "rack_number": rec.book.rack_number,
                "shelf_number": rec.book.shelf_number,
                "cover_image": rec.book.cover_image
            },
            "borrow_date": rec.borrow_date,
            "due_date": rec.due_date,
            "status": rec.status,
            "remaining_days": remaining_days if remaining_days >= 0 else 0,
            "is_overdue": remaining_days < 0,
            "overdue_days": abs(remaining_days) if remaining_days < 0 else 0
        })

    # Build history list
    history_list = []
    for rec in history:
        history_list.append({
            "id": rec.id,
            "book": {
                "id": rec.book.id,
                "title": rec.book.title,
                "author": rec.book.author,
                "isbn": rec.book.isbn,
                "rack_number": rec.book.rack_number,
                "shelf_number": rec.book.shelf_number,
                "cover_image": rec.book.cover_image
            } if rec.book else None,
            "borrow_date": rec.borrow_date,
            "due_date": rec.due_date,
            "return_date": rec.return_date,
            "status": rec.status
        })

    # Build reservations list
    reservations_list = []
    for rec in reservations:
        reservations_list.append({
            "id": rec.id,
            "book": {
                "id": rec.book.id,
                "title": rec.book.title,
                "author": rec.book.author,
                "isbn": rec.book.isbn,
                "rack_number": rec.book.rack_number,
                "shelf_number": rec.book.shelf_number,
                "cover_image": rec.book.cover_image
            } if rec.book else None,
            "reservation_date": rec.reservation_date,
            "status": rec.status
        })

    # Build credit logs list
    credit_list = []
    for rec in credit_logs:
        credit_list.append({
            "id": rec.id,
            "change_amount": rec.change_amount,
            "new_score": rec.new_score,
            "reason": rec.reason,
            "timestamp": rec.timestamp
        })

    return {
        "active_borrows": active_list,
        "history": history_list,
        "reservations": reservations_list,
        "credit_history": credit_list
    }

@app.post("/api/borrow/{borrow_id}/request-return", response_model=schemas.BorrowedBookOut)
def request_return(borrow_id: int, current_student=Depends(auth.require_student), db: Session = Depends(get_db)):
    record = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.id == borrow_id,
        models.BorrowedBook.student_id == current_student.id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Borrow record not found")
        
    if record.status != "Borrowed":
        raise HTTPException(status_code=400, detail="Book is not in active borrowed state")
        
    record.status = "Return Pending"
    db.commit()
    db.refresh(record)
    
    # Log student action
    log = models.ActivityLog(
        user_email=current_student.email,
        role="student",
        action=f"Requested return for book: {record.book.title}"
    )
    db.add(log)
    db.commit()
    
    return record

# ----------------- LIBRARIAN OPERATIONS -----------------

@app.get("/api/librarian/students", response_model=List[schemas.StudentOut])
def get_students(admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.get("/api/librarian/students/{student_id}/details")
def get_student_details(
    student_id: int,
    admin=Depends(auth.require_librarian),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    borrows = db.query(models.BorrowedBook).filter(models.BorrowedBook.student_id == student_id).all()
    
    active_list = []
    history_list = []
    
    now = datetime.datetime.utcnow()
    for rec in borrows:
        remaining_days = (rec.due_date.date() - now.date()).days if rec.due_date else 0
        record_data = {
            "id": rec.id,
            "book": {
                "id": rec.book.id,
                "title": rec.book.title,
                "author": rec.book.author,
                "isbn": rec.book.isbn,
                "rack_number": rec.book.rack_number,
                "shelf_number": rec.book.shelf_number,
                "cover_image": rec.book.cover_image
            },
            "borrow_date": rec.borrow_date,
            "due_date": rec.due_date,
            "return_date": rec.return_date,
            "status": rec.status,
            "remaining_days": max(0, remaining_days),
            "is_overdue": remaining_days < 0 and rec.status == "Borrowed",
            "overdue_days": abs(remaining_days) if remaining_days < 0 else 0
        }
        if rec.status == "Borrowed":
            active_list.append(record_data)
        else:
            history_list.append(record_data)
            
    credit_logs = db.query(models.CreditHistory).filter(models.CreditHistory.student_id == student_id).order_by(models.CreditHistory.timestamp.desc()).all()
    
    credit_list = []
    for log in credit_logs:
        credit_list.append({
            "id": log.id,
            "change_amount": log.change_amount,
            "new_score": log.new_score,
            "reason": log.reason,
            "timestamp": log.timestamp
        })
        
    return {
        "student": {
            "id": student.id,
            "full_name": student.full_name,
            "prn_number": student.prn_number,
            "roll_number": student.roll_number,
            "department": {
                "id": student.department.id,
                "name": student.department.name
            } if student.department else None,
            "year": student.year,
            "division": student.division,
            "email": student.email,
            "mobile_number": student.mobile_number,
            "credit_score": student.credit_score,
            "is_active": student.is_active,
            "created_at": student.created_at
        },
        "active_borrows": active_list,
        "history": history_list,
        "credit_history": credit_list
    }

@app.post("/api/librarian/students/{student_id}/credit")
def adjust_student_credit(
    student_id: int, 
    adjustment: int = Query(...), 
    reason: str = Query(...), 
    admin=Depends(auth.require_librarian), 
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_credit = max(0, min(100, student.credit_score + adjustment))
    student.credit_score = new_credit
    
    cred_history = models.CreditHistory(
        student_id=student.id,
        change_amount=adjustment,
        new_score=new_credit,
        reason=f"Adjustment by librarian: {reason}"
    )
    db.add(cred_history)

    notif = models.Notification(
        student_id=student.id,
        message=f"Your credit score has been adjusted by the librarian. Change: {adjustment:+} (Now: {new_credit}). Reason: {reason}."
    )
    db.add(notif)
    
    log = models.ActivityLog(
        user_email=admin.email, 
        role="librarian", 
        action=f"Manually adjusted student {student.full_name} credit by {adjustment:+} (Score: {new_credit})"
    )
    db.add(log)
    db.commit()

    return {"message": "Student credit score updated successfully", "new_credit": new_credit}

@app.get("/api/librarian/reservations", response_model=List[schemas.ReservationOut])
def get_reservations(admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    return db.query(models.Reservation).order_by(models.Reservation.reservation_date.desc()).all()

@app.get("/api/librarian/borrows", response_model=List[schemas.BorrowedBookOut])
def get_all_borrows(admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    return db.query(models.BorrowedBook).order_by(models.BorrowedBook.borrow_date.desc()).all()

@app.post("/api/librarian/reservations/{res_id}/action")
def manage_reservation(
    res_id: int, 
    action: str = Query(..., description="Approve, Cancel"), 
    admin=Depends(auth.require_librarian), 
    db: Session = Depends(get_db)
):
    res = db.query(models.Reservation).filter(models.Reservation.id == res_id).first()
    if not res or res.status != "Pending":
        raise HTTPException(status_code=400, detail="Invalid active reservation record")

    if action == "Approve":
        # Ensure book is in stock
        if res.book.available_copies <= 0:
            raise HTTPException(status_code=400, detail="Cannot approve: Book currently out of stock")
        
        # Issue the book
        res.book.available_copies -= 1
        if res.book.available_copies == 0:
            res.book.status = "Out of Stock"
            
        res.status = "Approved"
        
        # Create borrow record
        borrow_date = datetime.datetime.utcnow()
        due_date = borrow_date + datetime.timedelta(days=15)
        
        borrow_record = models.BorrowedBook(
            student_id=res.student_id,
            book_id=res.book_id,
            borrow_date=borrow_date,
            due_date=due_date,
            status="Borrowed"
        )
        db.add(borrow_record)

        notif = models.Notification(
            student_id=res.student_id,
            message=f"Reservation Approved: Your reservation for '{res.book.title}' is approved and the book is issued. Due date: {due_date.strftime('%d %B %Y')}."
        )
        db.add(notif)
    elif action == "Cancel":
        res.status = "Cancelled"
        notif = models.Notification(
            student_id=res.student_id,
            message=f"Reservation Cancelled: Your reservation for '{res.book.title}' was cancelled by the librarian."
        )
        db.add(notif)

    db.commit()
    return {"message": f"Reservation successfully {action}d"}

@app.post("/api/librarian/announcements", response_model=schemas.AnnouncementOut)
def make_announcement(payload: schemas.AnnouncementCreate, admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    ann = models.Announcement(title=payload.title, message=payload.message)
    db.add(ann)
    db.commit()
    db.refresh(ann)
    
    # Broadcast in-app notification to all students
    students = db.query(models.Student).all()
    for student in students:
        notif = models.Notification(
            student_id=student.id,
            message=f"Library Announcement: '{ann.title}' - {ann.message}"
        )
        db.add(notif)
    db.commit()

    return ann

@app.get("/api/announcements", response_model=List[schemas.AnnouncementOut])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).limit(10).all()

# Approved list of librarians (for admin check)
@app.get("/api/librarian/pending-list", response_model=List[schemas.LibrarianOut])
def list_pending_librarians(admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    return db.query(models.Librarian).filter(models.Librarian.is_approved == False).all()

@app.post("/api/librarian/{lib_id}/approve")
def approve_librarian(lib_id: int, admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    librarian = db.query(models.Librarian).filter(models.Librarian.id == lib_id).first()
    if not librarian:
        raise HTTPException(status_code=404, detail="Librarian not found")
    
    librarian.is_approved = True
    db.commit()
    return {"message": f"Librarian {librarian.full_name} has been approved."}

# ----------------- ANALYTICS & REPORTS -----------------

@app.get("/api/analytics/summary")
def get_analytics_summary(admin=Depends(auth.require_librarian), db: Session = Depends(get_db)):
    total_books = db.query(models.Book).count()
    available_books = db.query(func.sum(models.Book.available_copies)).scalar() or 0
    issued_books = db.query(models.BorrowedBook).filter(models.BorrowedBook.status == "Borrowed").count()
    
    now = datetime.datetime.utcnow()
    overdue_books = db.query(models.BorrowedBook).filter(
        models.BorrowedBook.status == "Borrowed",
        models.BorrowedBook.due_date < now
    ).count()

    registered_students = db.query(models.Student).count()
    total_librarians = db.query(models.Librarian).count()

    # Low stock books (< 3 copies total)
    low_stock = db.query(models.Book).filter(models.Book.available_copies < 3).limit(5).all()

    # Most Borrowed Books
    popular_subquery = db.query(
        models.BorrowedBook.book_id, func.count(models.BorrowedBook.id).label("borrow_count")
    ).group_by(models.BorrowedBook.book_id).subquery()
    
    most_borrowed = db.query(models.Book, popular_subquery.c.borrow_count).join(
        popular_subquery, models.Book.id == popular_subquery.c.book_id
    ).order_by(popular_subquery.c.borrow_count.desc()).limit(5).all()

    most_borrowed_list = [
        {"title": b[0].title, "author": b[0].author, "borrow_count": b[1]} for b in most_borrowed
    ]

    # Department borrowing analytics
    dept_borrowing = db.query(
        models.Department.name, func.count(models.BorrowedBook.id)
    ).join(models.Student, models.Student.department_id == models.Department.id)\
     .join(models.BorrowedBook, models.BorrowedBook.student_id == models.Student.id)\
     .group_by(models.Department.name).all()
    
    dept_stats = [{"department": d[0], "count": d[1]} for d in dept_borrowing]

    # Credit score distributions
    green_zone = db.query(models.Student).filter(models.Student.credit_score >= 80).count()
    yellow_zone = db.query(models.Student).filter(models.Student.credit_score >= 50, models.Student.credit_score < 80).count()
    red_zone = db.query(models.Student).filter(models.Student.credit_score < 50).count()

    # Top readers
    top_readers = db.query(
        models.Student.full_name, models.Student.prn_number, func.count(models.BorrowedBook.id).label("count")
    ).join(models.BorrowedBook, models.BorrowedBook.student_id == models.Student.id)\
     .group_by(models.Student.id).order_by(func.count(models.BorrowedBook.id).desc()).limit(5).all()
     
    readers_list = [{"name": r[0], "prn": r[1], "count": r[2]} for r in top_readers]

    # Monthly borrowing trends (last 6 months)
    # Simple query for SQLite dates
    monthly_stats = []
    for i in range(5, -1, -1):
        target_month = (datetime.date.today().month - i - 1) % 12 + 1
        year_adjust = datetime.date.today().year if (datetime.date.today().month - i - 1) >= 0 else datetime.date.today().year - 1
        month_name = datetime.date(year_adjust, target_month, 1).strftime("%B")
        
        # Approximate check
        count = db.query(models.BorrowedBook).filter(
            func.strftime('%m', models.BorrowedBook.borrow_date) == f"{target_month:02d}"
        ).count()
        monthly_stats.append({"month": month_name, "count": count})

    return {
        "counters": {
            "total_books": total_books,
            "available_books": available_books,
            "issued_books": issued_books,
            "overdue_books": overdue_books,
            "registered_students": registered_students,
            "total_librarians": total_librarians
        },
        "low_stock": low_stock,
        "most_borrowed": most_borrowed_list,
        "department_borrowing": dept_stats,
        "top_readers": readers_list,
        "credit_stats": {
            "green": green_zone,
            "yellow": yellow_zone,
            "red": red_zone
        },
        "monthly_borrowing": monthly_stats
    }

# ----------------- NOTIFICATIONS -----------------

@app.get("/api/notifications", response_model=List[schemas.NotificationOut])
def get_student_notifications(current_student=Depends(auth.require_student), db: Session = Depends(get_db)):
    return db.query(models.Notification).filter(
        models.Notification.student_id == current_student.id
    ).order_by(models.Notification.created_at.desc()).all()

@app.post("/api/notifications/{notif_id}/read")
def read_notification(notif_id: int, current_student=Depends(auth.require_student), db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notif_id,
        models.Notification.student_id == current_student.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

@app.post("/api/notifications/run-reminders")
def run_due_reminders(db: Session = Depends(get_db)):
    """
    Simulates checking borrow records and generating reminders for:
    - 7 days before due date
    - 3 days before due date
    - 1 day before due date
    - On due date
    - Overdue (every day after due date)
    """
    active_borrows = db.query(models.BorrowedBook).filter(models.BorrowedBook.status == "Borrowed").all()
    now = datetime.datetime.utcnow()
    notifications_created = 0

    for record in active_borrows:
        days_remaining = (record.due_date.date() - now.date()).days
        book_title = record.book.title
        student_id = record.student_id
        
        message = None
        if days_remaining == 7:
            message = f"Reminder: The book '{book_title}' is due in 7 days ({record.due_date.strftime('%d %B %Y')})."
        elif days_remaining == 3:
            message = f"Important Reminder: The book '{book_title}' is due in 3 days. Please return it to avoid penalty."
        elif days_remaining == 1:
            message = f"Urgent Reminder: The book '{book_title}' is due tomorrow. Please plan to return it."
        elif days_remaining == 0:
            message = f"Due Date Alert: The book '{book_title}' is due TODAY. Return it today to maintain your credit score."
        elif days_remaining < 0:
            message = f"Overdue Alert: The book '{book_title}' is OVERDUE by {abs(days_remaining)} days. Late penalties are being applied to your credit score."

        if message:
            # Avoid duplicate notifications on the same day for same reminder
            today_start = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
            duplicate = db.query(models.Notification).filter(
                models.Notification.student_id == student_id,
                models.Notification.message.like(f"%{book_title}%"),
                models.Notification.created_at >= today_start
            ).first()
            
            if not duplicate:
                notif = models.Notification(student_id=student_id, message=message)
                db.add(notif)
                notifications_created += 1
                
                # Check credit score penalty for overdue dynamically (e.g. daily trigger logic)
                if days_remaining < 0:
                    # Apply daily decrement simulation or trigger late deduction
                    # Simple daily decay model: -5 for day 1, -10 for day 2, -20 for day 7
                    # In real practice, we'd log credit change history once when the returns happen,
                    # but we can notify the user of their current expected penalty here.
                    pass

    db.commit()
    return {"message": f"Reminder batch complete. Created {notifications_created} notifications."}

# ----------------- STUDY MATERIALS (ACADEMIC RESOURCES) -----------------

@app.post("/api/study-materials", response_model=schemas.StudyMaterialOut)
def upload_study_material(
    title: str = Form(...),
    academic_year: str = Form(...),
    department_id: int = Form(...),
    subject: str = Form(...),
    unit: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Librarian = Depends(auth.require_librarian)
):
    # Validate department
    dept = db.query(models.Department).filter(models.Department.id == department_id).first()
    if not dept:
        raise HTTPException(status_code=400, detail="Invalid Department ID")

    # Validate file extension (only allow PDF)
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Generate a unique file name
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"material_{int(time.time())}_{file.filename}"
    filename = "".join(c for c in filename if c.isalnum() or c in (".", "_", "-")).strip()
    
    file_path = f"static/uploads/{filename}"
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    db_material = models.StudyMaterial(
        title=title,
        academic_year=academic_year,
        department_id=department_id,
        subject=subject,
        unit=unit if unit else None,
        file_path=f"/static/uploads/{filename}"
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)

    log = models.ActivityLog(user_email=current_user.email, role="librarian", action=f"Uploaded study material: {title} for {subject}")
    db.add(log)
    db.commit()

    return db_material

@app.get("/api/study-materials", response_model=List[schemas.StudyMaterialOut])
def get_study_materials(
    academic_year: Optional[str] = None,
    department_id: Optional[int] = None,
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.StudyMaterial)
    if academic_year:
        query = query.filter(models.StudyMaterial.academic_year == academic_year)
    if department_id:
        query = query.filter(models.StudyMaterial.department_id == department_id)
    if subject:
        query = query.filter(models.StudyMaterial.subject.like(f"%{subject}%"))
    return query.all()

@app.delete("/api/study-materials/{material_id}")
def delete_study_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: models.Librarian = Depends(auth.require_librarian)
):
    material = db.query(models.StudyMaterial).filter(models.StudyMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    
    # Delete local file from disk if it exists
    relative_path = material.file_path.lstrip("/")
    if os.path.exists(relative_path):
        try:
            os.remove(relative_path)
        except Exception as e:
            print("Failed to delete file:", e)
            
    db.delete(material)
    db.commit()
    
    log = models.ActivityLog(user_email=current_user.email, role="librarian", action=f"Deleted study material: {material.title}")
    db.add(log)
    db.commit()
    
    return {"detail": "Study material deleted successfully"}
