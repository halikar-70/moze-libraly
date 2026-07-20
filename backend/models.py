import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    students = relationship("Student", back_populates="department")
    books = relationship("Book", back_populates="department")

class Author(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    prn_number = Column(String, unique=True, index=True, nullable=False)
    roll_number = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    year = Column(String, nullable=False)  # FE, SE, TE, BE
    division = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile_number = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    credit_score = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    department = relationship("Department", back_populates="students")
    borrowed_books = relationship("BorrowedBook", back_populates="student")
    reservations = relationship("Reservation", back_populates="student")
    notifications = relationship("Notification", back_populates="student")
    credit_history = relationship("CreditHistory", back_populates="student")

class Librarian(Base):
    __tablename__ = "librarians"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile_number = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_approved = Column(Boolean, default=False)  # Admin approval required
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    author = Column(String, nullable=False)
    publication = Column(String, nullable=False)
    edition = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    subject = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    pages = Column(Integer, nullable=False)
    language = Column(String, default="English")
    cover_image = Column(String, nullable=True)  # URL or path
    description = Column(Text, nullable=True)
    keywords = Column(String, nullable=True)  # Comma separated
    rack_number = Column(String, nullable=False)
    shelf_number = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    status = Column(String, default="Available")  # Available, Out of Stock, Reference
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    department = relationship("Department", back_populates="books")
    borrowed_records = relationship("BorrowedBook", back_populates="book")
    reservations = relationship("Reservation", back_populates="book")

class BorrowedBook(Base):
    __tablename__ = "borrowed_books"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrow_date = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)
    status = Column(String, default="Borrowed")  # Borrowed, Returned, Lost, Damaged

    student = relationship("Student", back_populates="borrowed_books")
    book = relationship("Book", back_populates="borrowed_records")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    reservation_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Pending")  # Pending, Approved, Completed, Cancelled

    student = relationship("Student", back_populates="reservations")
    book = relationship("Book", back_populates="reservations")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="notifications")

class CreditHistory(Base):
    __tablename__ = "credit_history"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    change_amount = Column(Integer, nullable=False)
    new_score = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="credit_history")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StudyMaterial(Base):
    __tablename__ = "study_materials"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    academic_year = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    subject = Column(String, nullable=False)
    unit = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    department = relationship("Department")
