# Moze College Library Management System

A full-stack College Library Management web application built with **FastAPI** (Python) and **React + Vite**.

---

## 🚀 Features

- **📚 Books Catalog & Search**: Real-time search by title, author, department, rack & shelf locator.
- **🎓 Student Portal**: Login, issue/return request tracking, due dates, countdown reminders, and credit score monitoring.
- **⚡ Admin & Librarian Dashboard**: Manage catalog, verify borrow/return requests, manage student profiles, and track library analytics.
- **📁 Study Materials & PYQs**: Department and semester-wise curated syllabus resources, notes, and previous year question papers.
- **⭐ Credit Scoring System**: Gamified student rating rewarding punctual book returns.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, SQLite, Pydantic, Passlib / JWT
- **Frontend**: React 19, Vite, Lucide React, Modern CSS

---

## 📦 Setup & Installation

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed sample data (optional)
python seed.py

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

Backend will be live at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

---

### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## 📄 License

MIT License.
