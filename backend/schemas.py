from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class DepartmentOut(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class StudentRegister(BaseModel):
    full_name: str
    prn_number: str
    roll_number: str
    department_id: int
    year: str
    division: str
    email: EmailStr
    mobile_number: str
    password: str

class LibrarianRegister(BaseModel):
    full_name: str
    employee_id: str
    email: EmailStr
    mobile_number: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str # 'student' or 'librarian'

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_name: str
    email: str

class BookCreate(BaseModel):
    isbn: str
    title: str
    author: str
    publication: str
    edition: str
    department_id: int
    subject: str
    semester: str
    pages: int
    language: Optional[str] = "English"
    cover_image: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    rack_number: str
    shelf_number: str
    quantity: int

class BookUpdate(BaseModel):
    isbn: Optional[str] = None
    title: Optional[str] = None
    author: Optional[str] = None
    publication: Optional[str] = None
    edition: Optional[str] = None
    department_id: Optional[int] = None
    subject: Optional[str] = None
    semester: Optional[str] = None
    pages: Optional[int] = None
    language: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    rack_number: Optional[str] = None
    shelf_number: Optional[str] = None
    quantity: Optional[int] = None

class BookOut(BaseModel):
    id: int
    isbn: str
    title: str
    author: str
    publication: str
    edition: str
    department_id: int
    department: Optional[DepartmentOut] = None
    subject: str
    semester: str
    pages: int
    language: str
    cover_image: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    rack_number: str
    shelf_number: str
    quantity: int
    available_copies: int
    status: str
    date_added: datetime

    class Config:
        from_attributes = True

class BorrowedBookShort(BaseModel):
    id: int
    student_id: int
    book_id: int
    book: Optional[BookOut] = None
    borrow_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True

class StudentOut(BaseModel):
    id: int
    full_name: str
    prn_number: str
    roll_number: str
    department: Optional[DepartmentOut] = None
    year: str
    division: str
    email: EmailStr
    mobile_number: str
    credit_score: int
    is_active: bool
    created_at: datetime
    borrowed_books: List[BorrowedBookShort] = []

    class Config:
        from_attributes = True

class LibrarianOut(BaseModel):
    id: int
    full_name: str
    employee_id: str
    email: EmailStr
    mobile_number: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

class BorrowedBookOut(BaseModel):
    id: int
    student_id: int
    student: Optional[StudentOut] = None
    book_id: int
    book: Optional[BookOut] = None
    borrow_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True

class ReservationOut(BaseModel):
    id: int
    student_id: int
    student: Optional[StudentOut] = None
    book_id: int
    book: Optional[BookOut] = None
    reservation_date: datetime
    status: str

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    student_id: int
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CreditHistoryOut(BaseModel):
    id: int
    student_id: int
    change_amount: int
    new_score: int
    reason: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AnnouncementCreate(BaseModel):
    title: str
    message: str

class AnnouncementOut(BaseModel):
    id: int
    title: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class StudyMaterialCreate(BaseModel):
    title: str
    academic_year: str
    department_id: int
    subject: str
    unit: Optional[str] = None
    file_path: str

class StudyMaterialOut(BaseModel):
    id: int
    title: str
    academic_year: str
    department_id: int
    department: Optional[DepartmentOut] = None
    subject: str
    unit: Optional[str] = None
    file_path: str
    date_added: datetime

    class Config:
        from_attributes = True
