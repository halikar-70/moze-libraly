import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, User, LogOut, CheckCircle, AlertTriangle, X, Menu,
  Plus, Edit, Trash2, Calendar, Bell, Award, BarChart2, Book, 
  MapPin, Clock, Shield, RefreshCw, Send, Check, MessageSquare
} from 'lucide-react';
import './App.css';

const API_BASE = '/api';

const getDeptDisplayName = (deptName) => {
  if (!deptName) return '';
  if (deptName.includes("AI & Machine Learning")) return "AI & ML";
  if (deptName.includes("AI & Data Science")) return "AI & DS";
  if (deptName.includes("Information Technology")) return "IT";
  if (deptName.includes("First Year")) return "FE";
  if (deptName.includes("Electronics")) return "E&TC";
  if (deptName.includes("E&TC")) return "E&TC";
  return deptName.split(' ')[0];
};

const DEPARTMENT_CURRICULUM = {
  "IT": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Data Structures & Algorithms",
        "Object Oriented Programming",
        "Basics of Computer Network",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values and Professional Ethics"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Database Management System",
        "Computer Graphics",
        "Probability & Statistics",
        "Open Elective II",
        "Processor Architecture",
        "Digital Marketing and Social Media",
        "Modern Indian Language (Marathi/Hindi)",
        "E-Commerce",
        "Environmental Studies"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Theory of Computation",
        "Operating Systems",
        "Machine Learning",
        "Human Computer Interaction",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Computer Networks & Security",
        "Data Science and Big Data Analytics",
        "Web Application Development",
        "Elective II"
      ]
    }
  ],
  "FE": [
    {
      title: "First Year (FE) - Semester I",
      subjects: [
        "Engineering Mathematics I",
        "Engineering Physics",
        "Basic Electrical Engineering",
        "Engineering Graphics",
        "Indian Knowledge System",
        "Professional Communication Skills"
      ]
    },
    {
      title: "First Year (FE) - Semester II",
      subjects: [
        "Engineering Mathematics II",
        "Engineering Chemistry",
        "Programming and Problem Solving",
        "Basic Electronics Engineering",
        "Engineering Mechanics",
        "Environmental Studies"
      ]
    }
  ],
  "Computer": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Data Structures",
        "Object Oriented Programming and Computer Graphics",
        "Operating Systems",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Database Management Systems",
        "Software Engineering",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Full Stack Development",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Theory of Computation",
        "Systems Programming & Operating System",
        "Database Management System",
        "Computer Networks",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Software Engineering & Project Management",
        "Web Technology",
        "Data Analytics",
        "Artificial Intelligence",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "High Performance Computing",
        "Deep Learning",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Elective V",
        "Elective VI"
      ]
    }
  ],
  "Mechanical": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Engineering Mathematics III",
        "Engineering Thermodynamics",
        "Engineering Mechanics",
        "Manufacturing Processes",
        "Material Science and Metallurgy",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Fluid Mechanics",
        "Strength of Materials",
        "Manufacturing Technology",
        "Machine Drawing",
        "Electrical and Electronics Engineering",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Design of Machine Elements – I",
        "Heat Transfer",
        "Theory of Machines",
        "Metrology and Quality Control",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Design of Machine Elements – II",
        "Refrigeration and Air Conditioning",
        "Turbo Machines",
        "Industrial Engineering",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "Finite Element Analysis",
        "Mechatronics",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Operations Research",
        "Elective V",
        "Elective VI"
      ]
    }
  ],
  "Civil": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Engineering Mathematics III",
        "Surveying",
        "Engineering Geology",
        "Building Materials and Construction",
        "Strength of Materials",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Fluid Mechanics",
        "Structural Analysis",
        "Concrete Technology",
        "Transportation Engineering",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Design of Reinforced Concrete Structures",
        "Geotechnical Engineering",
        "Water Resources Engineering",
        "Environmental Engineering",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Design of Steel Structures",
        "Transportation Engineering",
        "Estimation, Costing and Valuation",
        "Construction Management",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "Advanced Structural Engineering",
        "Foundation Engineering",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Quantity Surveying and Contracts",
        "Elective V",
        "Elective VI"
      ]
    }
  ],
  "E&TC": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Engineering Mathematics III",
        "Electronic Devices and Circuits",
        "Digital Electronics",
        "Network Theory",
        "Signals and Systems",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics",
        "Open Elective I"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Analog Circuits",
        "Microprocessors",
        "Electromagnetic Engineering",
        "Control Systems",
        "Environmental Studies",
        "Modern Indian Language (Marathi/Hindi)",
        "Open Elective II"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Digital Communication",
        "Digital Signal Processing",
        "Microcontrollers",
        "Linear Integrated Circuits",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "VLSI Design",
        "Wireless Communication",
        "Embedded Systems",
        "Computer Networks",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "Microwave Engineering",
        "Optical Communication",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Internet of Things (IoT)",
        "Satellite Communication",
        "Elective V",
        "Elective VI"
      ]
    }
  ],
  "AI & ML": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Data Structures",
        "Object Oriented Programming",
        "Discrete Mathematics",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Database Management Systems",
        "Probability & Statistics",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Machine Learning Fundamentals",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Mining & Data Warehousing",
        "Software Engineering",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Reinforcement Learning",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "MLOps",
        "Explainable AI",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Elective V",
        "Elective VI"
      ]
    }
  ],
  "AI & DS": [
    {
      title: "Second Year (SE) - Semester I",
      subjects: [
        "Data Structures",
        "Object Oriented Programming",
        "Discrete Mathematics",
        "Open Elective I",
        "Digital Electronics and Logic Design",
        "Principles of Management & Entrepreneurship",
        "Universal Human Values & Professional Ethics"
      ]
    },
    {
      title: "Second Year (SE) - Semester II",
      subjects: [
        "Database Management Systems",
        "Probability & Statistics",
        "Computer Organization & Architecture",
        "Open Elective II",
        "Processor Architecture",
        "Data Visualization",
        "Modern Indian Language (Marathi/Hindi)",
        "Design Thinking",
        "Environmental Studies"
      ]
    },
    {
      title: "Third Year (TE) - Semester I",
      subjects: [
        "Machine Learning",
        "Artificial Intelligence",
        "Data Warehousing & Data Mining",
        "Software Engineering",
        "Elective I"
      ]
    },
    {
      title: "Third Year (TE) - Semester II",
      subjects: [
        "Deep Learning",
        "Big Data Analytics",
        "Natural Language Processing",
        "Computer Vision",
        "Elective II"
      ]
    },
    {
      title: "Final Year (BE) - Semester I",
      subjects: [
        "Reinforcement Learning",
        "MLOps",
        "Elective III",
        "Elective IV"
      ]
    },
    {
      title: "Final Year (BE) - Semester II",
      subjects: [
        "Elective V",
        "Elective VI"
      ]
    }
  ]
};

const DEPARTMENT_SUBJECTS = {};
Object.entries(DEPARTMENT_CURRICULUM).forEach(([dept, semList]) => {
  const allSubjects = [];
  semList.forEach(sem => {
    sem.subjects.forEach(sub => {
      if (!allSubjects.includes(sub)) {
        allSubjects.push(sub);
      }
    });
  });
  DEPARTMENT_SUBJECTS[dept] = allSubjects;
});

const getSubjectsForDepartment = (deptId, departmentsList) => {
  const dept = departmentsList.find(d => d.id === parseInt(deptId));
  const deptKey = dept ? getDeptDisplayName(dept.name) : '';
  
  if (deptKey && DEPARTMENT_SUBJECTS[deptKey]) {
    return DEPARTMENT_SUBJECTS[deptKey];
  }
  
  const all = [];
  Object.values(DEPARTMENT_SUBJECTS).forEach(list => {
    list.forEach(s => {
      if (!all.includes(s)) {
        all.push(s);
      }
    });
  });
  return all.sort();
};

const getSubjectsForAcademicResources = (year, deptKey) => {
  const yearMap = {
    'First Year (FE)': ['First Year', 'FE', 'Semester 1', 'Semester 2'],
    'Second Year (SE)': ['Second Year', 'SE', 'Semester 3', 'Semester 4'],
    'Third Year (TE)': ['Third Year', 'TE', 'Semester 5', 'Semester 6'],
    'Final Year (BE)': ['Final Year', 'BE', 'Semester 7', 'Semester 8']
  };

  const searchTerms = year ? yearMap[year] : null;
  let departmentsToSearch = deptKey ? [deptKey] : Object.keys(DEPARTMENT_CURRICULUM);
  
  const matchedSubjects = new Set();

  departmentsToSearch.forEach(dk => {
    const semesters = DEPARTMENT_CURRICULUM[dk] || [];
    semesters.forEach(sem => {
      let isYearMatch = true;
      if (searchTerms) {
        isYearMatch = searchTerms.some(term => 
          sem.title.toLowerCase().includes(term.toLowerCase())
        );
      }
      if (isYearMatch) {
        sem.subjects.forEach(sub => matchedSubjects.add(sub));
      }
    });
  });

  return Array.from(matchedSubjects).sort();
};

const matchesAcademicYear = (bookSemester, selectedYear) => {
  if (!selectedYear) return true;
  if (!bookSemester) return false;
  
  const semClean = bookSemester.toLowerCase();
  const yearClean = selectedYear.toLowerCase();
  
  if (yearClean.includes("first") || yearClean.includes("fe")) {
    return semClean.includes("semester 1") || semClean.includes("semester 2") || semClean.includes("first year") || semClean.includes("fe");
  }
  if (yearClean.includes("second") || yearClean.includes("se")) {
    return semClean.includes("semester 3") || semClean.includes("semester 4") || semClean.includes("second year") || semClean.includes("se");
  }
  if (yearClean.includes("third") || yearClean.includes("te")) {
    return semClean.includes("semester 5") || semClean.includes("semester 6") || semClean.includes("third year") || semClean.includes("te");
  }
  if (yearClean.includes("final") || yearClean.includes("be") || yearClean.includes("fourth")) {
    return semClean.includes("semester 7") || semClean.includes("semester 8") || semClean.includes("final year") || semClean.includes("be");
  }
  return true;
};

const MOCK_TEACHERS = [
  { id: 1, name: "Dr. A. P. Patil", employeeId: "TCH1001", department: "Computer Engineering", email: "ap.patil@moze.edu.in", mobile: "9876543210" },
  { id: 2, name: "Prof. S. R. Kale", employeeId: "TCH1002", department: "Information Technology Engineering", email: "sr.kale@moze.edu.in", mobile: "9876543211" },
  { id: 3, name: "Prof. M. N. Deshmukh", employeeId: "TCH1003", department: "E&TC Engineering", email: "mn.deshmukh@moze.edu.in", mobile: "9876543212" },
  { id: 4, name: "Dr. K. V. Joshi", employeeId: "TCH1004", department: "Mechanical Engineering", email: "kv.joshi@moze.edu.in", mobile: "9876543213" },
  { id: 5, name: "Prof. P. B. Mane", employeeId: "TCH1005", department: "Civil Engineering", email: "pb.mane@moze.edu.in", mobile: "9876543214" }
];

function LibrarianNavbar({ 
  pendingLibrariansCount, 
  fullName, 
  handleLogout, 
  setCurrentTab, 
  setSelectedStudentDetail,
  isSidebarOpen,
  setIsSidebarOpen
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  return (
    <header className="librarian-navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          type="button" 
          className="librarian-hamburger-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <div className="logo-section" onClick={() => { setCurrentTab('dashboard'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}>
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px' }}>College Library</span>
        </div>
      </div>
      
      <div className="title-section">Librarian control panel</div>
      
      <div className="user-section">
        <div className="bell-icon-container" onClick={() => { setCurrentTab('librarian-admin'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }} title="Pending Approvals">
          <Bell size={20} />
          {pendingLibrariansCount > 0 && (
            <span className="bell-badge">{pendingLibrariansCount}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <div className="avatar-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="/admin_profile.png" 
              alt="Admin Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <User size={20} color="#00364d" style={{ display: 'none' }} />
          </div>
          <div 
            className="user-dropdown" 
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }} 
            title="User Settings"
          >
            <span>{fullName || 'admin'}</span>
            <span style={{ fontSize: '0.75rem' }}>▼</span>
          </div>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #edf2f7',
              width: '160px',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div 
                style={{
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                  borderBottom: '1px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                className="user-dropdown-item"
                onClick={() => {
                  setCurrentTab('profile');
                  setSelectedStudentDetail(null);
                  setIsSidebarOpen(false);
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </div>
              <div 
                style={{
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  color: '#d1493b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
                className="user-dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function LibrarianSidebar({ 
  currentTab, 
  setCurrentTab, 
  fullName, 
  setSelectedStudentDetail,
  manageBookDropdown,
  setManageBookDropdown,
  issueBookDropdown,
  setIssueBookDropdown,
  manageUsersDropdown,
  setManageUsersDropdown,
  sendMessageDropdown,
  setSendMessageDropdown,
  setShowAddBookModal,
  setShowIssueBookModal,
  setShowAnnouncementModal,
  isSidebarOpen,
  setIsSidebarOpen,
  pendingReservationsCount,
  pendingReturnsCount
}) {
  return (
    <aside className={`librarian-sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="welcome-section">
        <div className="welcome-avatar-circle">
          <img 
            src="/admin_profile.png" 
            alt="Admin" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <User size={30} color="#093044" style={{ display: 'none' }} />
        </div>
        <div className="welcome-text-container">
          <span className="welcome-text">Welcome!</span>
          <span className="welcome-name">{fullName || 'admin'}</span>
        </div>
      </div>

      <div className="section-header">General</div>

      <ul className="nav-menu">
        <li>
          <div 
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('dashboard'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-content">
              <BarChart2 className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </div>
          </div>
        </li>

        <li>
          <div 
            className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('profile'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-content">
              <User className="nav-icon" />
              <span className="nav-label">Profile</span>
            </div>
          </div>
        </li>

        <li>
          <div 
            className={`nav-item ${currentTab === 'student-list' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('student-list'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-content">
              <Menu className="nav-icon" />
              <span className="nav-label">All Student Information</span>
            </div>
          </div>
        </li>

        <li>
          <div 
            className={`nav-item ${currentTab === 'teacher-list' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('teacher-list'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-content">
              <Menu className="nav-icon" />
              <span className="nav-label">All Teacher Information</span>
            </div>
          </div>
        </li>

        {/* Dropdown: Manage Book */}
        <li>
          <div 
            className={`nav-item ${['search'].includes(currentTab) ? 'active' : ''}`}
            onClick={() => setManageBookDropdown(!manageBookDropdown)}
          >
            <div className="nav-item-content">
              <Plus className="nav-icon" />
              <span className="nav-label">Manage Book</span>
            </div>
            <span className={`submenu-arrow ${manageBookDropdown ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-list ${manageBookDropdown ? 'open' : ''}`}>
            <li 
              className="submenu-item"
              onClick={() => { setShowAddBookModal(true); setIsSidebarOpen(false); }}
            >
              + Add Book
            </li>
            <li 
              className={`submenu-item ${currentTab === 'search' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('search'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
            >
              Book Catalog
            </li>
          </ul>
        </li>

        {/* Dropdown: Issue Book */}
        <li>
          <div 
            className={`nav-item ${['issued-loans', 'requested-books'].includes(currentTab) ? 'active' : ''}`}
            onClick={() => setIssueBookDropdown(!issueBookDropdown)}
          >
            <div className="nav-item-content">
              <BookOpen className="nav-icon" />
              <span className="nav-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Issue Book
                {(pendingReservationsCount > 0 || pendingReturnsCount > 0) && (
                  <span style={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: '#d1493b',
                    borderRadius: '50%',
                    display: 'inline-block',
                    boxShadow: '0 0 0 2px rgba(209, 73, 59, 0.25)'
                  }} />
                )}
              </span>
            </div>
            <span className={`submenu-arrow ${issueBookDropdown ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-list ${issueBookDropdown ? 'open' : ''}`}>
            <li 
              className="submenu-item"
              onClick={() => { setShowIssueBookModal(true); setIsSidebarOpen(false); }}
            >
              Lend Book Form
            </li>
            <li 
              className={`submenu-item ${currentTab === 'requested-books' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('requested-books'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>View Requested Books</span>
              {pendingReservationsCount > 0 && (
                <span style={{
                  backgroundColor: '#d1493b',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  marginRight: '8px'
                }}>
                  {pendingReservationsCount}
                </span>
              )}
            </li>
            <li 
              className={`submenu-item ${currentTab === 'issued-loans' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('issued-loans'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Issued Books</span>
              {pendingReturnsCount > 0 && (
                <span style={{
                  backgroundColor: '#d1493b',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  marginRight: '8px'
                }}>
                  {pendingReturnsCount}
                </span>
              )}
            </li>
          </ul>
        </li>

        {/* Dropdown: Manage Users */}
        <li>
          <div 
            className={`nav-item ${['student-list', 'teacher-list', 'librarian-admin'].includes(currentTab) ? 'active' : ''}`}
            onClick={() => setManageUsersDropdown(!manageUsersDropdown)}
          >
            <div className="nav-item-content">
              <User className="nav-icon" />
              <span className="nav-label">Manage Users</span>
            </div>
            <span className={`submenu-arrow ${manageUsersDropdown ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-list ${manageUsersDropdown ? 'open' : ''}`}>
            <li 
              className={`submenu-item ${currentTab === 'student-list' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('student-list'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
            >
              Student Registry
            </li>
            <li 
              className={`submenu-item ${currentTab === 'teacher-list' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('teacher-list'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
            >
              Teacher Registry
            </li>
            <li 
              className={`submenu-item ${currentTab === 'librarian-admin' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('librarian-admin'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
            >
              Pending Approvals
            </li>
          </ul>
        </li>

        {/* Dropdown: Send Message */}
        <li>
          <div 
            className={`nav-item ${['librarian-admin'].includes(currentTab) ? 'active' : ''}`}
            onClick={() => setSendMessageDropdown(!sendMessageDropdown)}
          >
            <div className="nav-item-content">
              <Send className="nav-icon" />
              <span className="nav-label">Send Message To User</span>
            </div>
            <span className={`submenu-arrow ${sendMessageDropdown ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-list ${sendMessageDropdown ? 'open' : ''}`}>
            <li 
              className="submenu-item"
              onClick={() => { setShowAnnouncementModal(true); setIsSidebarOpen(false); }}
            >
              Broadcast Announcement
            </li>
            <li 
              className={`submenu-item ${currentTab === 'librarian-admin' ? 'active' : ''}`}
              onClick={() => { setCurrentTab('librarian-admin'); setSelectedStudentDetail(null); setIsSidebarOpen(false); }}
            >
              Announcements Log
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}

function LibrarianProfile({ currentUser }) {
  return (
    <div className="librarian-content-section animate-fade-in">
      <h3>Librarian Profile Details</h3>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <img 
            src="/admin_profile.png" 
            alt="Librarian Avatar" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00364d' }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#00364d', color: '#ffffff', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {currentUser?.full_name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{currentUser?.full_name}</h4>
            <p style={{ color: '#777777', margin: 0 }}>System Administrator / Librarian</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
            <div>Email: <strong>{currentUser?.email}</strong></div>
            <div>Employee ID: <strong>{currentUser?.employee_id || 'EMP1001'}</strong></div>
            <div>Mobile Number: <strong>{currentUser?.mobile_number}</strong></div>
            <div>Joined: <strong>{currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherRegistry({ 
  teacherSearchQuery, 
  setTeacherSearchQuery, 
  teacherDeptFilter, 
  setTeacherDeptFilter, 
  departments,
  showToast 
}) {
  return (
    <div className="librarian-content-section animate-fade-in">
      <h3>All Teacher Registry</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: '#f7fafc', padding: '1rem', borderRadius: '4px', border: '1px solid #edf2f7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555555' }}>Search Teachers</label>
          <input 
            type="text" 
            placeholder="Search by teacher name..." 
            value={teacherSearchQuery}
            onChange={(e) => setTeacherSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555555' }}>Department Filter</label>
          <select value={teacherDeptFilter} onChange={(e) => setTeacherDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Teacher Name</th>
              <th>Department Branch</th>
              <th>Email Address</th>
              <th>Contact Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TEACHERS.filter(tch => {
              const nameMatch = !teacherSearchQuery || tch.name.toLowerCase().includes(teacherSearchQuery.toLowerCase());
              const deptMatch = !teacherDeptFilter || tch.department.toLowerCase().includes(teacherDeptFilter.toLowerCase()) || teacherDeptFilter.toLowerCase().includes(tch.department.toLowerCase());
              return nameMatch && deptMatch;
            }).map(tch => (
              <tr key={tch.id}>
                <td><code>{tch.employeeId}</code></td>
                <td><strong>{tch.name}</strong></td>
                <td>{tch.department}</td>
                <td>{tch.email}</td>
                <td>{tch.mobile}</td>
                <td>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => showToast(`Message channel opened for ${tch.name}`)}
                  >
                    Send Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IssuedLoansRegistry({ 
  allStudents, 
  loansSearchQuery, 
  setLoansSearchQuery, 
  handleReturnBook 
}) {
  const loans = [];
  allStudents.forEach(st => {
    if (st.borrowed_books) {
      st.borrowed_books.forEach(b => {
        if (b.status === 'Borrowed' || b.status === 'Return Pending') {
          loans.push({ ...b, student: st });
        }
      });
    }
  });

  const filteredLoans = loans.filter(l => {
    if (!loansSearchQuery) return true;
    const query = loansSearchQuery.toLowerCase();
    return (
      l.student?.full_name?.toLowerCase().includes(query) ||
      l.student?.prn_number?.toLowerCase().includes(query) ||
      l.book?.title?.toLowerCase().includes(query) ||
      l.book?.isbn?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="librarian-content-section animate-fade-in">
      <h3>Active Lending Returns Registry</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f7fafc', padding: '1rem', borderRadius: '4px', border: '1px solid #edf2f7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555555' }}>Filter active logs</label>
          <input 
            type="text" 
            placeholder="Search by student name, book title, PRN, ISBN..."
            value={loansSearchQuery}
            onChange={(e) => setLoansSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Info</th>
              <th>Book Info</th>
              <th>Lending Dates</th>
              <th>Return Status Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No active borrowings on register.</td>
              </tr>
            ) : (
              filteredLoans.map(loan => (
                <tr key={loan.id} style={loan.status === 'Return Pending' ? { backgroundColor: 'rgba(245, 158, 11, 0.05)' } : {}}>
                  <td>
                    <strong>{loan.student?.full_name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#777777' }}>PRN: {loan.student?.prn_number}</div>
                    {loan.status === 'Return Pending' && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#f7a016', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                        Return Requested
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{loan.book?.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#777777' }}>ISBN: {loan.book?.isbn}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      Lent: {new Date(loan.borrow_date).toLocaleDateString()}<br />
                      Due: {new Date(loan.due_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="button" className="btn btn-primary" style={{ backgroundColor: '#00b050', borderColor: '#00b050' }} onClick={() => handleReturnBook(loan.id, 'Returned')}>Return</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleReturnBook(loan.id, 'Damaged')}>Damaged</button>
                      <button type="button" className="btn btn-danger" style={{ backgroundColor: '#d1493b', borderColor: '#d1493b' }} onClick={() => handleReturnBook(loan.id, 'Lost')}>Lost</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestedReservationsQueue({ allReservations, handleReservationAction }) {
  return (
    <div className="librarian-content-section animate-fade-in">
      <h3>Pending Reservations Queue</h3>
      <div className="table-container">
        {allReservations.length === 0 ? (
          <p style={{ color: '#777777', textAlign: 'center', padding: '2rem' }}>No reservation history found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book Info</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allReservations.map(res => (
                <tr key={res.id}>
                  <td>
                    <strong>{res.student?.full_name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#777777' }}>PRN: {res.student?.prn_number}</div>
                  </td>
                  <td>
                    <strong>{res.book?.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#777777' }}>Available Stock: {res.book?.available_copies} copies</div>
                  </td>
                  <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                  <td>
                    <strong style={{ color: res.status === 'Pending' ? '#f7a016' : res.status === 'Approved' ? '#00b050' : '#777777' }}>
                      {res.status}
                    </strong>
                  </td>
                  <td>
                    {res.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button"
                          className="btn btn-primary" 
                          style={{ backgroundColor: '#00b050', borderColor: '#00b050' }}
                          disabled={res.book?.available_copies <= 0}
                          onClick={() => handleReservationAction(res.id, 'Approve')}
                        >
                          Approve
                        </button>
                        <button 
                          type="button"
                          className="btn btn-danger" 
                          style={{ backgroundColor: '#d1493b', borderColor: '#d1493b' }}
                          onClick={() => handleReservationAction(res.id, 'Cancel')}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#777777', fontSize: '0.8rem' }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LibrarianMainLayout({
  currentUser,
  currentTab,
  setCurrentTab,
  pendingLibrarians,
  handleLogout,
  setSelectedStudentDetail,
  selectedStudentDetail,
  libManageBookDropdown,
  setLibManageBookDropdown,
  libIssueBookDropdown,
  setLibIssueBookDropdown,
  libManageUsersDropdown,
  setLibManageUsersDropdown,
  libSendMessageDropdown,
  setLibSendMessageDropdown,
  setShowAddBookModal,
  setShowIssueBookModal,
  setShowAnnouncementModal,
  analytics,
  allStudents,
  filteredStudents,
  studentSearchQuery,
  setStudentSearchQuery,
  studentYearFilter,
  setStudentYearFilter,
  studentDeptFilter,
  setStudentDeptFilter,
  departments,
  handleViewStudentDetails,
  setShowCreditAdjustModal,
  teacherSearchQuery,
  setTeacherSearchQuery,
  teacherDeptFilter,
  setTeacherDeptFilter,
  showToast,
  searchQuery,
  setSearchQuery,
  selectedDeptFilter,
  setSelectedDeptFilter,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  getSubjectsForDepartment,
  books,
  openEditModal,
  handleDeleteBook,
  newMaterialForm,
  setNewMaterialForm,
  handleUploadMaterial,
  getSubjectsForAcademicResources,
  setSelectedMaterialFile,
  academicResourceMaterials,
  handleDeleteMaterial,
  loansSearchQuery,
  setLoansSearchQuery,
  handleReturnBook,
  allReservations,
  handleReservationAction,
  handleApproveLibrarian,
  announcements,
  isSidebarOpen,
  setIsSidebarOpen
}) {
  const pendingReturnsCount = allStudents.reduce((acc, st) => 
    acc + (st.borrowed_books ? st.borrowed_books.filter(b => b.status === 'Return Pending').length : 0), 0
  );

  return (
    <div className="librarian-layout-root">
      <LibrarianNavbar
        pendingLibrariansCount={pendingLibrarians.length}
        fullName={currentUser?.full_name}
        handleLogout={handleLogout}
        setCurrentTab={setCurrentTab}
        setSelectedStudentDetail={setSelectedStudentDetail}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="librarian-body-wrapper">
        <LibrarianSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          fullName={currentUser?.full_name}
          setSelectedStudentDetail={setSelectedStudentDetail}
          manageBookDropdown={libManageBookDropdown}
          setManageBookDropdown={setLibManageBookDropdown}
          issueBookDropdown={libIssueBookDropdown}
          setIssueBookDropdown={setLibIssueBookDropdown}
          manageUsersDropdown={libManageUsersDropdown}
          setManageUsersDropdown={setLibManageUsersDropdown}
          sendMessageDropdown={libSendMessageDropdown}
          setSendMessageDropdown={setLibSendMessageDropdown}
          setShowAddBookModal={setShowAddBookModal}
          setShowIssueBookModal={setShowIssueBookModal}
          setShowAnnouncementModal={setShowAnnouncementModal}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          pendingReservationsCount={allReservations.filter(r => r.status === 'Pending').length}
          pendingReturnsCount={pendingReturnsCount}
        />
        
        {isSidebarOpen && (
          <div 
            className="librarian-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="librarian-main-panel">
          {/* Breadcrumbs */}
          <div className="librarian-breadcrumbs-container">
            <div className="librarian-breadcrumbs-left">
              {currentTab === 'dashboard' && (
                <>
                  <h2>Dashboard</h2>
                  <p>Control panel</p>
                </>
              )}
              {currentTab === 'profile' && (
                <>
                  <h2>Profile</h2>
                  <p>Librarian profile details</p>
                </>
              )}
              {currentTab === 'student-list' && (
                <>
                  <h2>Students Registry</h2>
                  <p>All Student Information</p>
                </>
              )}
              {currentTab === 'teacher-list' && (
                <>
                  <h2>Teachers Registry</h2>
                  <p>All Teacher Information</p>
                </>
              )}
              {currentTab === 'search' && (
                <>
                  <h2>Central Book Catalog</h2>
                  <p>Manage Book Inventory</p>
                </>
              )}
              {currentTab === 'academic-resources' && (
                <>
                  <h2>Academic Resources</h2>
                  <p>Publish Notes & PDFs</p>
                </>
              )}
              {currentTab === 'issued-loans' && (
                <>
                  <h2>Issued Books</h2>
                  <p>Lending Logs</p>
                </>
              )}
              {currentTab === 'requested-books' && (
                <>
                  <h2>View Requested Books</h2>
                  <p>Pending Reservations</p>
                </>
              )}
              {currentTab === 'librarian-admin' && (
                <>
                  <h2>Administration</h2>
                  <p>System Controls & Approvals</p>
                </>
              )}
            </div>
          </div>

          {/* Views */}
          {currentTab === 'dashboard' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* 8 Tiles Grid */}
              <div className="librarian-tiles-grid">
                <div className="librarian-tile blue span-top" onClick={() => setCurrentTab('student-list')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number">{analytics?.counters?.registered_students || 0}</div>
                    <div className="librarian-tile-label">Members</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <User className="librarian-tile-icon" />
                  </div>
                </div>

                <div className="librarian-tile green span-top" onClick={() => setCurrentTab('issued-loans')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number">{analytics?.counters?.issued_books || 0}</div>
                    <div className="librarian-tile-label">Issued Books</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <Send className="librarian-tile-icon" />
                  </div>
                </div>

                <div className="librarian-tile red span-top" onClick={() => setCurrentTab('search')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number">{analytics?.counters?.total_books || 0}</div>
                    <div className="librarian-tile-label">Books</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <Book className="librarian-tile-icon" />
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="librarian-tile red span-bottom" onClick={() => setCurrentTab('search')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number" style={{ fontSize: '1.45rem', fontWeight: '600' }}>Manage Book</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <Book className="librarian-tile-icon" />
                  </div>
                </div>

                <div className="librarian-tile yellow span-bottom" onClick={() => setCurrentTab('student-list')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number" style={{ fontSize: '1.45rem', fontWeight: '600' }}>Manage User</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <User className="librarian-tile-icon" />
                  </div>
                </div>

                <div className="librarian-tile blue span-bottom" onClick={() => setCurrentTab('librarian-admin')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number" style={{ fontSize: '1.45rem', fontWeight: '600' }}>Status</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <Shield className="librarian-tile-icon" />
                  </div>
                </div>

                <div className="librarian-tile green span-bottom" onClick={() => setCurrentTab('requested-books')}>
                  <div className="librarian-tile-left">
                    <div className="librarian-tile-number" style={{ fontSize: '1.45rem', fontWeight: '600' }}>Requested Books</div>
                  </div>
                  <div className="librarian-tile-icon-container">
                    <BookOpen className="librarian-tile-icon" />
                  </div>
                  {allReservations.filter(r => r.status === 'Pending').length > 0 && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.4)',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
              </div>

              {analytics && (
                <div className="analytics-grid">
                  <div className="glass-panel chart-card" style={{ background: '#ffffff', color: '#333333', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <h3>Department-wise Borrowings</h3>
                    <p style={{ color: '#777777', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Borrow counts categorized by engineering branches.</p>
                    <div className="chart-container">
                      {analytics.department_borrowing.map((item, index) => {
                        const maxCount = Math.max(...analytics.department_borrowing.map(d => d.count), 1);
                        const barHeight = (item.count / maxCount) * 180;
                        return (
                          <div className="chart-bar-wrapper" key={index}>
                            <div className="chart-bar" style={{ height: `${barHeight}px`, backgroundColor: '#2ca8e4' }} />
                            <span className="chart-label" style={{ color: '#555555' }}>{item.department.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass-panel chart-card" style={{ background: '#ffffff', color: '#333333', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <h3>Student Credit Zones</h3>
                    <p style={{ color: '#777777', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Distribution of borrowers across credit zones.</p>
                    <div className="donut-chart-container">
                      {(() => {
                        const total = analytics.credit_stats.green + analytics.credit_stats.yellow + analytics.credit_stats.red;
                        const gPer = total > 0 ? Math.round((analytics.credit_stats.green / total) * 100) : 0;
                        const yPer = total > 0 ? Math.round((analytics.credit_stats.yellow / total) * 100) : 0;
                        return (
                          <>
                            <div className="pie-chart" style={{ background: `conic-gradient(#00b050 0% ${gPer}%, #f7a016 ${gPer}% ${gPer + yPer}%, #d1493b ${gPer + yPer}% 100%)` }} />
                            <div className="chart-legend" style={{ color: '#555555' }}>
                              <div className="legend-item"><div className="legend-color green" style={{ backgroundColor: '#00b050' }} /><span>Green Zone (80-100): <strong>{analytics.credit_stats.green}</strong></span></div>
                              <div className="legend-item"><div className="legend-color yellow" style={{ backgroundColor: '#f7a016' }} /><span>Yellow Zone (50-79): <strong>{analytics.credit_stats.yellow}</strong></span></div>
                              <div className="legend-item"><div className="legend-color red" style={{ backgroundColor: '#d1493b' }} /><span>Red Zone (0-49): <strong>{analytics.credit_stats.red}</strong></span></div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="glass-panel chart-card" style={{ background: '#ffffff', color: '#333333', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <h3>Top Readers Ranking</h3>
                    <div className="table-container">
                      <table>
                        <thead><tr><th>Rank</th><th>Name</th><th>PRN</th><th>Total Borrowed</th></tr></thead>
                        <tbody>
                          {analytics.top_readers.map((r, index) => (
                            <tr key={index}><td><strong># {index + 1}</strong></td><td>{r.name}</td><td><code>{r.prn}</code></td><td>{r.count} Books</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="glass-panel chart-card" style={{ background: '#ffffff', color: '#333333', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <h3>Low Stock Alerts</h3>
                    <div className="table-container">
                      <table>
                        <thead><tr><th>Title</th><th>Rack Code</th><th>In Stock</th><th>Action</th></tr></thead>
                        <tbody>
                          {analytics.low_stock.map((b, index) => (
                            <tr key={index}>
                              <td>{b.title}</td><td><code>{b.rack_number}/{b.shelf_number}</code></td>
                              <td><span style={{ color: b.available_copies === 0 ? '#d1493b' : '#f7a016', fontWeight: 'bold' }}>{b.available_copies}/{b.quantity}</span></td>
                              <td><button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => openEditModal(b)}>Restock</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'profile' && <LibrarianProfile currentUser={currentUser} />}

          {currentTab === 'student-list' && (
            selectedStudentDetail ? (
              <div className="librarian-content-section animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #edf2f7', paddingBottom: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedStudentDetail(null)}>&larr; Back to Registry</button>
                  <button type="button" className="btn btn-secondary" onClick={() => handleViewStudentDetails(selectedStudentDetail.student.id)}><RefreshCw size={14} /> Refresh</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                  <div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #00364d, #00b050)', color: '#fff', fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                        {selectedStudentDetail.student.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <h3>{selectedStudentDetail.student.full_name}</h3>
                      <p>{selectedStudentDetail.student.email}</p>
                      <div style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', display: 'inline-block', background: selectedStudentDetail.student.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: selectedStudentDetail.student.is_active ? '#00b050' : '#d1493b' }}>
                        {selectedStudentDetail.student.is_active ? 'Active' : 'Suspended'}
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <div>PRN: <strong>{selectedStudentDetail.student.prn_number}</strong></div>
                      <div>Roll: <strong>{selectedStudentDetail.student.roll_number}</strong></div>
                      <div>Branch: <strong>{selectedStudentDetail.student.department?.name}</strong></div>
                      <div>Year/Div: <strong>{selectedStudentDetail.student.year}/{selectedStudentDetail.student.division}</strong></div>
                    </div>
                  </div>
                  <div>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <h4>Active borrowed books</h4>
                      {selectedStudentDetail.active_borrows.map(loan => (
                        <div key={loan.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #edf2f7' }}>
                          <span>{loan.book.title}</span>
                          <span style={{ color: loan.is_overdue ? '#d1493b' : '#00b050' }}>Due: {new Date(loan.due_date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="librarian-content-section animate-fade-in">
                <h3>Registered Students Registry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: '#f7fafc', padding: '1rem', borderRadius: '4px' }}>
                  <input type="text" placeholder="Search..." value={studentSearchQuery} onChange={(e) => setStudentSearchQuery(e.target.value)} />
                  <select value={studentYearFilter} onChange={(e) => setStudentYearFilter(e.target.value)}>
                    <option value="">All Years</option>
                    <option value="FE">FE</option><option value="SE">SE</option><option value="TE">TE</option><option value="BE">BE</option>
                  </select>
                </div>
                <table>
                  <thead><tr><th>Name</th><th>PRN</th><th>Branch</th><th>Credit</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td><button type="button" style={{ background: 'none', border: 'none', color: '#00364d', cursor: 'pointer', textDecoration: 'underline', padding: 0 }} onClick={() => handleViewStudentDetails(student.id)}>{student.full_name}</button></td>
                        <td>{student.prn_number}</td>
                        <td>{student.department?.name}</td>
                        <td>{student.credit_score}</td>
                        <td><button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setShowCreditAdjustModal(student)}>Adjust Credit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {currentTab === 'teacher-list' && (
            <TeacherRegistry
              teacherSearchQuery={teacherSearchQuery}
              setTeacherSearchQuery={setTeacherSearchQuery}
              teacherDeptFilter={teacherDeptFilter}
              setTeacherDeptFilter={setTeacherDeptFilter}
              departments={departments}
              showToast={showToast}
            />
          )}

          {currentTab === 'search' && (
            <div className="librarian-content-section animate-fade-in">
              <h3>Central book catalog</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#f7fafc', padding: '1rem' }}>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1 }} />
                <select value={selectedDeptFilter} onChange={(e) => { setSelectedDeptFilter(e.target.value); setSelectedSubjectFilter(''); }}>
                  <option value="">All Departments</option>
                  {departments.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
                <button type="button" className="btn btn-primary" style={{ backgroundColor: '#00364d', borderColor: '#00364d' }} onClick={() => setShowAddBookModal(true)}>+ Add Book</button>
              </div>
              <table>
                <thead><tr><th>Book</th><th>ISBN</th><th>Branch</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {books.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.title}</strong><br />{b.author}</td>
                      <td><code>{b.isbn}</code></td>
                      <td>{b.subject}</td>
                      <td>{b.available_copies}/{b.quantity}</td>
                      <td>
                        <button type="button" className="btn btn-secondary" style={{ marginRight: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => openEditModal(b)}>Edit</button>
                        <button type="button" className="btn btn-danger" style={{ backgroundColor: '#d1493b', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDeleteBook(b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === 'academic-resources' && (
            <div className="librarian-content-section animate-fade-in">
              <h3>Academic resource management</h3>
              <div style={{ background: '#f7fafc', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4>Publish lecture notes (PDF)</h4>
                <form onSubmit={handleUploadMaterial} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                  <input type="text" required placeholder="Title" value={newMaterialForm.title} onChange={(e) => setNewMaterialForm({...newMaterialForm, title: e.target.value})} />
                  <select required value={newMaterialForm.academicYear} onChange={(e) => setNewMaterialForm({...newMaterialForm, academicYear: e.target.value})}>
                    <option value="">Year</option>
                    <option value="First Year (FE)">FE</option><option value="Second Year (SE)">SE</option><option value="Third Year (TE)">TE</option><option value="Final Year (BE)">BE</option>
                  </select>
                  <select required value={newMaterialForm.departmentId} onChange={(e) => setNewMaterialForm({...newMaterialForm, departmentId: e.target.value})}>
                    <option value="">Branch</option>
                    {departments.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                  </select>
                  <select required value={newMaterialForm.subject} onChange={(e) => setNewMaterialForm({...newMaterialForm, subject: e.target.value})}>
                    <option value="">Subject</option>
                    {getSubjectsForAcademicResources(newMaterialForm.academicYear, departments.find(d => d.id === parseInt(newMaterialForm.departmentId)) ? getDeptDisplayName(departments.find(d => d.id === parseInt(newMaterialForm.departmentId)).name) : '').map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <input type="file" required accept=".pdf" id="material-file-input" onChange={(e) => setSelectedMaterialFile(e.target.files[0])} />
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#00364d', borderColor: '#00364d' }}>Upload</button>
                </form>
              </div>
              <table>
                <thead><tr><th>Title</th><th>Subject</th><th>Year</th><th>Action</th></tr></thead>
                <tbody>
                  {academicResourceMaterials.map(m => (
                    <tr key={m.id}>
                      <td>{m.title}</td><td>{m.subject}</td><td>{m.academic_year}</td>
                      <td>
                        <a href={m.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginRight: '4px', textDecoration: 'none' }}>View PDF</a>
                        <button type="button" className="btn btn-danger" style={{ backgroundColor: '#d1493b' }} onClick={() => handleDeleteMaterial(m.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === 'issued-loans' && (
            <IssuedLoansRegistry
              allStudents={allStudents}
              loansSearchQuery={loansSearchQuery}
              setLoansSearchQuery={setLoansSearchQuery}
              handleReturnBook={handleReturnBook}
            />
          )}

          {currentTab === 'requested-books' && (
            <RequestedReservationsQueue
              allReservations={allReservations}
              handleReservationAction={handleReservationAction}
            />
          )}

          {currentTab === 'librarian-admin' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="librarian-content-section">
                <h3>Pending librarian approvals</h3>
                {pendingLibrarians.length === 0 ? <p style={{ color: '#777777' }}>No pending approvals.</p> : (
                  <table>
                    <thead><tr><th>Emp ID</th><th>Name</th><th>Email</th><th>Action</th></tr></thead>
                    <tbody>
                      {pendingLibrarians.map(lib => (
                        <tr key={lib.id}>
                          <td>{lib.employee_id}</td><td>{lib.full_name}</td><td>{lib.email}</td>
                          <td><button type="button" className="btn btn-primary" style={{ backgroundColor: '#00364d', borderColor: '#00364d' }} onClick={() => handleApproveLibrarian(lib.id)}>Approve</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="librarian-content-section">
                <h3>Broadcasted announcements</h3>
                <table>
                  <thead><tr><th>Date</th><th>Title</th><th>Message</th></tr></thead>
                  <tbody>
                    {announcements.map(a => (
                      <tr key={a.id}><td>{new Date(a.created_at).toLocaleDateString()}</td><td>{a.title}</td><td>{a.message}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  // Global Auth and Theme states
  const [token, setToken] = useState(localStorage.getItem('moze_lib_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Sidebar dropdown toggle states for Librarian layout
  const [libManageBookDropdown, setLibManageBookDropdown] = useState(false);
  const [libIssueBookDropdown, setLibIssueBookDropdown] = useState(false);
  const [libManageUsersDropdown, setLibManageUsersDropdown] = useState(false);
  const [libSendMessageDropdown, setLibSendMessageDropdown] = useState(false);

  // Search state for teachers
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('');

  // Search state for active loans
  const [loansSearchQuery, setLoansSearchQuery] = useState('');
  
  // Auth view states
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState('student'); // 'student' or 'librarian'
  const [authForm, setAuthForm] = useState({
    email: '', password: '', fullName: '', prnNumber: '', 
    rollNumber: '', departmentId: '', year: 'FE', division: 'A',
    mobileNumber: '', employeeId: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Core Data States
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState({ recent: [], recommended: [], popular: [] });
  
  // Academic Resources states
  const [academicResourceYear, setAcademicResourceYear] = useState('');
  const [academicResourceDept, setAcademicResourceDept] = useState('');
  const [academicResourceSubject, setAcademicResourceSubject] = useState('');
  const [academicResourceMaterials, setAcademicResourceMaterials] = useState([]);
  const [academicResourceLoading, setAcademicResourceLoading] = useState(false);

  // Upload study material states for librarian
  const [newMaterialForm, setNewMaterialForm] = useState({
    title: '',
    academicYear: '',
    departmentId: '',
    subject: '',
    unit: ''
  });
  const [selectedMaterialFile, setSelectedMaterialFile] = useState(null);
  // Student dashboard states
  const [studentBorrowData, setStudentBorrowData] = useState({ active_borrows: [], history: [], reservations: [], credit_history: [] });
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Librarian dashboard states
  const [analytics, setAnalytics] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentYearFilter, setStudentYearFilter] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('');
  const [studentDivFilter, setStudentDivFilter] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [pendingLibrarians, setPendingLibrarians] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]); // for return mapping

  // Modals state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [showCreditAdjustModal, setShowCreditAdjustModal] = useState(null); // student object
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReservationLibrarianModal, setShowReservationLibrarianModal] = useState(false);
  
  // Form input states for modals
  const [bookForm, setBookForm] = useState({
    isbn: '', title: '', author: '', publication: '', edition: '',
    department_id: '', subject: '', semester: 'Semester 1', pages: 100,
    language: 'English', cover_image: '', description: '', keywords: '',
    rack_number: '', shelf_number: '', quantity: 1
  });
  const [issueForm, setIssueForm] = useState({ prnNumber: '', isbn: '' });
  const [creditAdjustForm, setCreditAdjustForm] = useState({ amount: '', reason: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  
  // Action notifications/alerts
  const [actionAlert, setActionAlert] = useState(null);

  // Compute filtered students list dynamically
  const filteredStudents = allStudents.filter(student => {
    const query = studentSearchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      student.full_name?.toLowerCase().includes(query) ||
      student.prn_number?.toLowerCase().includes(query) ||
      student.roll_number?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.mobile_number?.includes(query);

    const matchesYear = !studentYearFilter || student.year === studentYearFilter;
    const matchesDept = !studentDeptFilter || student.department_id === parseInt(studentDeptFilter);
    const matchesDiv = !studentDivFilter || student.division?.toUpperCase() === studentDivFilter.toUpperCase();

    return matchesSearch && matchesYear && matchesDept && matchesDiv;
  });

  // Fetch departments and profile on boot
  useEffect(() => {
    fetchDepartments();
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Load contextual data based on roles and tabs
  useEffect(() => {
    if (currentUser) {
      fetchAnnouncements();
      if (currentUser.role === 'student') {
        fetchStudentDashboard();
      } else {
        fetchLibrarianDashboard();
      }
    }
  }, [currentUser, currentTab]);


  // Fetch books lists on search/filter changes
  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedDeptFilter, selectedSubjectFilter, selectedAvailabilityFilter]);

  // Fetch academic resources on filter/tab changes
  useEffect(() => {
    if (currentTab === 'academic-resources') {
      fetchAcademicResourceMaterials();
    }
  }, [academicResourceYear, academicResourceDept, academicResourceSubject, currentTab]);

  // Live query suggestions effect
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/books/suggestions?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
          }
        } catch (err) {}
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const showToast = (message, type = 'success') => {
    setActionAlert({ message, type });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(prevUser => {
          if (prevUser && prevUser.role === 'student' && prevUser.credit_score !== data.credit_score) {
            const difference = data.credit_score - prevUser.credit_score;
            const changeStr = difference > 0 ? `+${difference}` : `${difference}`;
            showToast(`Credit score updated: ${changeStr} (Current: ${data.credit_score})`, difference < 0 ? 'danger' : 'success');
          }
          return data;
        });
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0 && !authForm.departmentId) {
          setAuthForm(prev => ({ ...prev, departmentId: data[0].id }));
          setBookForm(prev => ({ ...prev, department_id: data[0].id }));
        }
      }
    } catch (err) {}
  };

  const fetchBooks = async () => {
    try {
      let url = `${API_BASE}/books?`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      if (selectedDeptFilter) url += `department_id=${selectedDeptFilter}&`;
      if (selectedSubjectFilter) url += `subject=${encodeURIComponent(selectedSubjectFilter)}&`;
      if (selectedAvailabilityFilter) url += `available_only=true&`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {}
  };

  const fetchAcademicResourceMaterials = async (isSilent = false) => {
    if (!isSilent) setAcademicResourceLoading(true);
    try {
      let url = `${API_BASE}/study-materials?`;
      if (academicResourceDept) url += `department_id=${academicResourceDept}&`;
      if (academicResourceSubject) url += `subject=${encodeURIComponent(academicResourceSubject)}&`;
      if (academicResourceYear) url += `academic_year=${encodeURIComponent(academicResourceYear)}&`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAcademicResourceMaterials(data);
      }
    } catch (err) {
      console.error("Error fetching study materials:", err);
    } finally {
      if (!isSilent) setAcademicResourceLoading(false);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedMaterialFile) {
      showToast('Please select a PDF file to upload', 'danger');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', newMaterialForm.title);
    formData.append('academic_year', newMaterialForm.academicYear);
    formData.append('department_id', newMaterialForm.departmentId);
    formData.append('subject', newMaterialForm.subject);
    if (newMaterialForm.unit) {
      formData.append('unit', newMaterialForm.unit);
    }
    formData.append('file', selectedMaterialFile);

    try {
      const res = await fetch(`${API_BASE}/study-materials`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (res.ok) {
        showToast('Study material uploaded successfully!');
        setNewMaterialForm({
          title: '',
          academicYear: '',
          departmentId: '',
          subject: '',
          unit: ''
        });
        setSelectedMaterialFile(null);
        const fileInput = document.getElementById('material-file-input');
        if (fileInput) fileInput.value = '';
        fetchAcademicResourceMaterials();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Upload failed', 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error during upload', 'danger');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to permanently delete this study resource?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/study-materials/${materialId}`, {
        method: 'DELETE',
        headers: headers()
      });

      if (res.ok) {
        showToast('Study material deleted successfully.');
        fetchAcademicResourceMaterials();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Deletion failed', 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error during deletion', 'danger');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {}
  };

  const fetchStudentDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/borrow/student-records`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setStudentBorrowData(data);
      }
      
      // Also fetch notifications
      const notifRes = await fetch(`${API_BASE}/notifications`, { headers: headers() });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(prevNotifs => {
          if (prevNotifs && prevNotifs.length > 0) {
            const prevIds = new Set(prevNotifs.map(n => n.id));
            const newUnread = notifData.filter(n => !n.is_read && !prevIds.has(n.id));
            newUnread.forEach(n => {
              showToast(n.message, n.message.includes('adjusted') || n.message.includes('credit') ? 'warning' : 'success');
            });
          }
          return notifData;
        });
      }

      // Featured & Category browsing
      const featuredRes = await fetch(`${API_BASE}/books/featured`);
      if (featuredRes.ok) {
        const fData = await featuredRes.json();
        setFeaturedBooks(fData);
      }

      // Run reminders simulation
      await fetch(`${API_BASE}/notifications/run-reminders`, { method: 'POST' });
    } catch (err) {}
  };

  const fetchLibrarianDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }

      const studRes = await fetch(`${API_BASE}/librarian/students`, { headers: headers() });
      if (studRes.ok) {
        const students = await studRes.json();
        setAllStudents(students);
      }

      const pendRes = await fetch(`${API_BASE}/librarian/pending-list`, { headers: headers() });
      if (pendRes.ok) {
        const pending = await pendRes.json();
        setPendingLibrarians(pending);
      }

      const resRes = await fetch(`${API_BASE}/librarian/reservations`, { headers: headers() });
      if (resRes.ok) {
        const resv = await resRes.json();
        setAllReservations(resv);
      }

      // Gather active loans from analytics context for simple returns
      const bRes = await fetch(`${API_BASE}/books`);
      if (bRes.ok) {
        const allBooks = await bRes.json();
        // Extract borrow records dynamically for simplicity, or query the db
        // For local display, we can reconstruct the active list
      }
    } catch (err) {}
  };

  // Keep stable references to data fetching functions
  const fetchProfileRef = useRef(fetchProfile);
  useEffect(() => {
    fetchProfileRef.current = fetchProfile;
  }, [fetchProfile]);

  const fetchStudentDashboardRef = useRef(fetchStudentDashboard);
  useEffect(() => {
    fetchStudentDashboardRef.current = fetchStudentDashboard;
  }, [fetchStudentDashboard]);

  const fetchLibrarianDashboardRef = useRef(fetchLibrarianDashboard);
  useEffect(() => {
    fetchLibrarianDashboardRef.current = fetchLibrarianDashboard;
  }, [fetchLibrarianDashboard]);

  const fetchAnnouncementsRef = useRef(fetchAnnouncements);
  useEffect(() => {
    fetchAnnouncementsRef.current = fetchAnnouncements;
  }, [fetchAnnouncements]);

  const fetchAcademicResourceMaterialsRef = useRef(fetchAcademicResourceMaterials);
  useEffect(() => {
    fetchAcademicResourceMaterialsRef.current = fetchAcademicResourceMaterials;
  }, [fetchAcademicResourceMaterials]);

  const fetchBooksRef = useRef(fetchBooks);
  useEffect(() => {
    fetchBooksRef.current = fetchBooks;
  }, [fetchBooks]);

  // Auto refresh dashboard data based on roles every 3 seconds
  useEffect(() => {
    let intervalId;
    if (currentUser) {
      if (currentUser.role === 'student') {
        intervalId = setInterval(() => {
          fetchStudentDashboardRef.current();
          fetchAnnouncementsRef.current();
          fetchAcademicResourceMaterialsRef.current(true); // silent refresh (no spinner)
          fetchBooksRef.current();
          fetchProfileRef.current();
        }, 3000);
      } else if (currentUser.role === 'librarian') {
        intervalId = setInterval(() => {
          fetchLibrarianDashboardRef.current();
          fetchAnnouncementsRef.current();
          fetchAcademicResourceMaterialsRef.current(true); // silent refresh (no spinner)
          fetchBooksRef.current();
        }, 3000);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser]);

  // Auth logic
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isLogin) {
      // Login
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
            role: authRole
          })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('moze_lib_token', data.access_token);
          setToken(data.access_token);
          showToast(`Welcome back, ${data.user_name}!`);
        } else {
          setAuthError(data.detail || 'Login failed');
        }
      } catch (err) {
        setAuthError('Server connection failed');
      }
    } else {
      // Registration
      const isStudent = authRole === 'student';
      const endpoint = isStudent ? 'register/student' : 'register/librarian';
      const bodyPayload = isStudent ? {
        full_name: authForm.fullName,
        prn_number: authForm.prnNumber,
        roll_number: authForm.rollNumber,
        department_id: parseInt(authForm.departmentId),
        year: authForm.year,
        division: authForm.division,
        email: authForm.email,
        mobile_number: authForm.mobileNumber,
        password: authForm.password
      } : {
        full_name: authForm.fullName,
        employee_id: authForm.employeeId,
        email: authForm.email,
        mobile_number: authForm.mobileNumber,
        password: authForm.password
      };

      try {
        const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        const data = await res.json();
        if (res.ok) {
          setAuthSuccess(isStudent 
            ? 'Student Registration successful! You can now log in.' 
            : 'Librarian Registration successful! Account is pending administrative approval.'
          );
          setIsLogin(true);
        } else {
          setAuthError(data.detail || 'Registration failed');
        }
      } catch (err) {
        setAuthError('Server connection failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('moze_lib_token');
    setToken('');
    setCurrentUser(null);
    setCurrentTab('dashboard');
  };

  const markNotificationRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'POST',
        headers: headers()
      });
      if (res.ok) {
        fetchStudentDashboard();
      }
    } catch (err) {}
  };

  // Student Actions
  const handleReserve = async (bookId) => {
    try {
      const res = await fetch(`${API_BASE}/books/${bookId}/reserve`, {
        method: 'POST',
        headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Book reserved successfully! Pending librarian approval.');
        fetchStudentDashboard();
        setSelectedBook(null);
      } else {
        showToast(data.detail || 'Reservation failed', 'danger');
      }
    } catch (err) {}
  };

  const handleRequestReturn = async (borrowId) => {
    try {
      const res = await fetch(`${API_BASE}/borrow/${borrowId}/request-return`, {
        method: 'POST',
        headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Return request submitted successfully! Pending librarian approval.');
        fetchStudentDashboard();
      } else {
        showToast(data.detail || 'Return request failed', 'danger');
      }
    } catch (err) {}
  };

  // Librarian Actions
  const handleApproveLibrarian = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/librarian/${id}/approve`, {
        method: 'POST',
        headers: headers()
      });
      if (res.ok) {
        showToast('Librarian account approved successfully!');
        fetchLibrarianDashboard();
      }
    } catch (err) {}
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          ...bookForm,
          department_id: parseInt(bookForm.department_id),
          pages: parseInt(bookForm.pages),
          quantity: parseInt(bookForm.quantity)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('New book successfully catalogued!');
        setShowAddBookModal(false);
        fetchBooks();
        fetchLibrarianDashboard();
      } else {
        showToast(data.detail || 'Failed to add book', 'danger');
      }
    } catch (err) {}
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({
          ...bookForm,
          department_id: parseInt(bookForm.department_id),
          pages: parseInt(bookForm.pages),
          quantity: parseInt(bookForm.quantity)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Book details updated successfully!');
        setShowEditBookModal(false);
        setSelectedBook(null);
        fetchBooks();
        fetchLibrarianDashboard();
      } else {
        showToast(data.detail || 'Failed to update book', 'danger');
      }
    } catch (err) {}
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`${API_BASE}/books/${bookId}`, {
        method: 'DELETE',
        headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Book deleted successfully');
        setSelectedBook(null);
        fetchBooks();
        fetchLibrarianDashboard();
      } else {
        showToast(data.detail || 'Failed to delete book', 'danger');
      }
    } catch (err) {}
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/borrow/issue?prn_number=${issueForm.prnNumber}&isbn=${issueForm.isbn}`, {
        method: 'POST',
        headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Book issued successfully to PRN: ${issueForm.prnNumber}`);
        setShowIssueBookModal(false);
        setIssueForm({ prnNumber: '', isbn: '' });
        fetchLibrarianDashboard();
      } else {
        showToast(data.detail || 'Failed to issue book', 'danger');
      }
    } catch (err) {}
  };

  const handleReturnBook = async (borrowId, status) => {
    try {
      const res = await fetch(`${API_BASE}/borrow/return?borrow_id=${borrowId}&return_status=${status}`, {
        method: 'POST',
        headers: headers()
      });
      if (res.ok) {
        showToast(`Return logged successfully. Status: ${status}`);
        fetchLibrarianDashboard();
      } else {
        const data = await res.json();
        showToast(data.detail || 'Failed to return book', 'danger');
      }
    } catch (err) {}
  };

  const handleReservationAction = async (resId, action) => {
    try {
      const res = await fetch(`${API_BASE}/librarian/reservations/${resId}/action?action=${action}`, {
        method: 'POST',
        headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Reservation successfully ${action}d`);
        fetchLibrarianDashboard();
      } else {
        showToast(data.detail || 'Action failed', 'danger');
      }
    } catch (err) {}
  };

  const handleViewStudentDetails = async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/librarian/students/${studentId}/details`, {
        headers: headers()
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedStudentDetail(data);
      } else {
        showToast('Failed to load student details', 'danger');
      }
    } catch (err) {
      showToast('Network error loading student details', 'danger');
    }
  };

  const handleAdjustCredit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE}/librarian/students/${showCreditAdjustModal.id}/credit?adjustment=${parseInt(creditAdjustForm.amount)}&reason=${encodeURIComponent(creditAdjustForm.reason)}`,
        { method: 'POST', headers: headers() }
      );
      if (res.ok) {
        showToast(`Credit adjusted successfully for ${showCreditAdjustModal.full_name}`);
        const adjustedStudentId = showCreditAdjustModal.id;
        setShowCreditAdjustModal(null);
        setCreditAdjustForm({ amount: '', reason: '' });
        fetchLibrarianDashboard();
        // Refresh the detail page if it is open for this student
        if (selectedStudentDetail && selectedStudentDetail.student.id === adjustedStudentId) {
          handleViewStudentDetails(adjustedStudentId);
        }
      }
    } catch (err) {}
  };

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/librarian/announcements`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(announcementForm)
      });
      if (res.ok) {
        showToast('Announcement broadcasted to all student dashboards!');
        setShowAnnouncementModal(false);
        setAnnouncementForm({ title: '', message: '' });
        fetchAnnouncements();
      }
    } catch (err) {}
  };

  // Helper renderer for credit score zonal colors
  const getCreditScoreDetails = (score) => {
    if (score >= 80) return { color: '#10b981', label: 'Excellent', class: 'green' };
    if (score >= 50) return { color: '#f59e0b', label: 'Average', class: 'yellow' };
    return { color: '#ef4444', label: 'Restricted', class: 'red' };
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Prepare Edit book modal form
  const openEditModal = (book) => {
    setSelectedBook(book);
    setBookForm({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publication: book.publication,
      edition: book.edition,
      department_id: book.department_id,
      subject: book.subject,
      semester: book.semester,
      pages: book.pages,
      language: book.language,
      cover_image: book.cover_image || '',
      description: book.description || '',
      keywords: book.keywords || '',
      rack_number: book.rack_number,
      shelf_number: book.shelf_number,
      quantity: book.quantity
    });
    setShowEditBookModal(true);
  };

  return (
    <div className={`app-root ${theme === 'light' ? 'light' : ''}`}>
      {/* Toast message alert */}
      {actionAlert && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          background: actionAlert.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {actionAlert.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {!token ? (
        // Authenticated Login/Register Wrapper
        <div className="auth-wrapper">
          <div className="auth-card animate-fade-in">
            <div className="auth-header">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '0.75rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#851c1c' }}>College Library</h2>
              </div>
              <p style={{ color: '#807065' }}>Gyanba Sopanrao Moze College of Engineering</p>
            </div>

            <div className="auth-toggle">
              <button 
                type="button"
                className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>User Role</label>
                <select value={authRole} onChange={(e) => setAuthRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="librarian">Librarian</option>
                </select>
              </div>

              {authError && <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{authError}</div>}
              {authSuccess && <div style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>{authSuccess}</div>}

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" required placeholder="Enter full name"
                      value={authForm.fullName} onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                    />
                  </div>

                  {authRole === 'student' ? (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>PRN Number</label>
                          <input 
                            type="text" required placeholder="PRN Number"
                            value={authForm.prnNumber} onChange={(e) => setAuthForm({...authForm, prnNumber: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Roll Number</label>
                          <input 
                            type="text" required placeholder="Roll Number"
                            value={authForm.rollNumber} onChange={(e) => setAuthForm({...authForm, rollNumber: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Department</label>
                        <select 
                          value={authForm.departmentId} 
                          onChange={(e) => setAuthForm({...authForm, departmentId: e.target.value})}
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Year</label>
                          <select value={authForm.year} onChange={(e) => setAuthForm({...authForm, year: e.target.value})}>
                            <option value="FE">First Year (FE)</option>
                            <option value="SE">Second Year (SE)</option>
                            <option value="TE">Third Year (TE)</option>
                            <option value="BE">Final Year (BE)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Division</label>
                          <input 
                            type="text" required placeholder="e.g. A, B"
                            value={authForm.division} onChange={(e) => setAuthForm({...authForm, division: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="form-group">
                      <label>Employee ID</label>
                      <input 
                        type="text" required placeholder="Librarian Employee ID"
                        value={authForm.employeeId} onChange={(e) => setAuthForm({...authForm, employeeId: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="text" required placeholder="Mobile number"
                      value={authForm.mobileNumber} onChange={(e) => setAuthForm({...authForm, mobileNumber: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" required placeholder="name@moze.edu.in"
                  value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      ) : currentUser?.role === 'librarian' ? (
        <LibrarianMainLayout
          currentUser={currentUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          pendingLibrarians={pendingLibrarians}
          handleLogout={handleLogout}
          setSelectedStudentDetail={setSelectedStudentDetail}
          selectedStudentDetail={selectedStudentDetail}
          libManageBookDropdown={libManageBookDropdown}
          setLibManageBookDropdown={setLibManageBookDropdown}
          libIssueBookDropdown={libIssueBookDropdown}
          setLibIssueBookDropdown={setLibIssueBookDropdown}
          libManageUsersDropdown={libManageUsersDropdown}
          setLibManageUsersDropdown={setLibManageUsersDropdown}
          libSendMessageDropdown={libSendMessageDropdown}
          setLibSendMessageDropdown={setLibSendMessageDropdown}
          setShowAddBookModal={setShowAddBookModal}
          setShowIssueBookModal={setShowIssueBookModal}
          setShowAnnouncementModal={setShowAnnouncementModal}
          analytics={analytics}
          allStudents={allStudents}
          filteredStudents={filteredStudents}
          studentSearchQuery={studentSearchQuery}
          setStudentSearchQuery={setStudentSearchQuery}
          studentYearFilter={studentYearFilter}
          setStudentYearFilter={setStudentYearFilter}
          studentDeptFilter={studentDeptFilter}
          setStudentDeptFilter={setStudentDeptFilter}
          departments={departments}
          handleViewStudentDetails={handleViewStudentDetails}
          setShowCreditAdjustModal={setShowCreditAdjustModal}
          teacherSearchQuery={teacherSearchQuery}
          setTeacherSearchQuery={setTeacherSearchQuery}
          teacherDeptFilter={teacherDeptFilter}
          setTeacherDeptFilter={setTeacherDeptFilter}
          showToast={showToast}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDeptFilter={selectedDeptFilter}
          setSelectedDeptFilter={setSelectedDeptFilter}
          selectedSubjectFilter={selectedSubjectFilter}
          setSelectedSubjectFilter={setSelectedSubjectFilter}
          getSubjectsForDepartment={getSubjectsForDepartment}
          books={books}
          openEditModal={openEditModal}
          handleDeleteBook={handleDeleteBook}
          newMaterialForm={newMaterialForm}
          setNewMaterialForm={setNewMaterialForm}
          handleUploadMaterial={handleUploadMaterial}
          getSubjectsForAcademicResources={getSubjectsForAcademicResources}
          setSelectedMaterialFile={setSelectedMaterialFile}
          academicResourceMaterials={academicResourceMaterials}
          handleDeleteMaterial={handleDeleteMaterial}
          loansSearchQuery={loansSearchQuery}
          setLoansSearchQuery={setLoansSearchQuery}
          handleReturnBook={handleReturnBook}
          allReservations={allReservations}
          handleReservationAction={handleReservationAction}
          handleApproveLibrarian={handleApproveLibrarian}
          announcements={announcements}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      ) : (
        // Logged In Application View
        <div className="app-container">
          {/* SIDEBAR NAVIGATION */}
          <aside className={`sidebar ${currentUser?.role === 'student' ? 'student-sidebar' : ''} ${isSidebarOpen ? 'open' : ''}`}>
            <div className="brand">
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                onClick={() => {
                  setCurrentTab('dashboard');
                  setSelectedStudentDetail(null);
                  setIsSidebarOpen(false);
                }}
              >
                <img src="/logo.png" alt="Logo" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                <span className="logo-text">College Library</span>
              </div>
              <button 
                type="button" 
                className="sidebar-close-btn"
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <ul className="nav-menu" style={{ flexGrow: 1 }}>
              <li>
                <div 
                  className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab('dashboard');
                    setIsSidebarOpen(false);
                  }}
                >
                  <BarChart2 size={20} />
                  <span className="nav-label">Dashboard</span>
                </div>
              </li>
              <li>
                <div 
                  className={`nav-item ${currentTab === 'search' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab('search');
                    setIsSidebarOpen(false);
                  }}
                >
                  <Search size={20} />
                  <span className="nav-label">Smart Search</span>
                </div>
              </li>
              <li>
                <div 
                  className={`nav-item ${currentTab === 'academic-resources' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab('academic-resources');
                    setIsSidebarOpen(false);
                  }}
                >
                  <BookOpen size={20} />
                  <span className="nav-label">Academic Resources</span>
                </div>
              </li>

              {currentUser?.role === 'student' ? (
                <li>
                  <div 
                    className={`nav-item ${currentTab === 'student-borrow' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentTab('student-borrow');
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Book size={20} />
                    <span className="nav-label">Borrow Records</span>
                  </div>
                </li>
              ) : (
                <>
                  <li>
                    <div 
                      className={`nav-item ${currentTab === 'student-list' ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentTab('student-list');
                        setIsSidebarOpen(false);
                      }}
                    >
                      <User size={20} />
                      <span className="nav-label">Students Registry</span>
                    </div>
                  </li>
                  <li>
                    <div 
                      className={`nav-item ${currentTab === 'librarian-admin' ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentTab('librarian-admin');
                        setIsSidebarOpen(false);
                      }}
                    >
                      <Shield size={20} />
                      <span className="nav-label">Administration</span>
                    </div>
                  </li>
                </>
              )}
            </ul>

            <div className="profile-section" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--accent-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyURI: 'center', justifyContent: 'center' }}>
                  <User size={20} color="white" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.full_name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{currentUser?.role}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '0.5rem', flex: 1 }}>
                  <RefreshCw size={16} />
                </button>
                <button type="button" className="btn btn-danger" onClick={handleLogout} style={{ padding: '0.5rem', flex: 2 }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Sidebar Drawer Overlay for Mobile */}
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* MAIN PAGE INTERFACE */}
          <main className={`main-content ${currentUser?.role === 'student' ? 'student-main-content' : ''}`}>
            <header className="top-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="sidebar-toggle-btn"
                  onClick={() => setIsSidebarOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h2>{currentTab.toUpperCase().replace('-', ' ')}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moze Smart Library portal</p>
                </div>
              </div>

              {currentUser?.role === 'student' && (
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Credit score indicator */}
                  <div className="user-badge">
                    <Award size={18} color={getCreditScoreDetails(currentUser.credit_score).color} />
                    <span>Credit Score: <strong>{currentUser.credit_score}</strong></span>
                  </div>
                </div>
              )}
            </header>

            {/* TAB VIEWS */}
            {currentTab === 'dashboard' && currentUser?.role === 'student' && (
              // STUDENT DASHBOARD
              <div className="student-dashboard animate-fade-in">
                
                {/* Credit Score & Info banner */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>Welcome back, {currentUser.full_name}!</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Keep your credit score high to maintain full borrowing access.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        background: getCreditScoreDetails(currentUser.credit_score).color + '20', 
                        color: getCreditScoreDetails(currentUser.credit_score).color,
                        padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 'bold'
                      }}>
                        {getCreditScoreDetails(currentUser.credit_score).label}
                      </span>
                    </div>
                  </div>

                  <div className="credit-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span>Credit Status</span>
                      <span>{currentUser.credit_score} / 100 Credits</span>
                    </div>
                    <div className="credit-bar-bg">
                      <div 
                        className="credit-bar-fill" 
                        style={{ 
                          width: `${currentUser.credit_score}%`, 
                          backgroundColor: getCreditScoreDetails(currentUser.credit_score).color 
                        }}
                      />
                    </div>
                    {currentUser.credit_score < 40 && (
                      <p style={{ color: 'var(--danger-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertTriangle size={14} /> Borrowing locked. Please consult the librarian to request activation.
                      </p>
                    )}
                  </div>
                </div>

                {/* Active Borrow Countdown section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Currently Borrowed Books</h3>
                  {studentBorrowData.active_borrows.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active book borrows. Use the Smart Search page to find and request books!
                    </div>
                  ) : (
                    <div className="dashboard-grid">
                      {studentBorrowData.active_borrows.map(rec => (
                        <div key={rec.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '80px', borderRadius: '6px', background: 'rgba(15,23,42,0.4)', overflow: 'hidden' }}>
                              {rec.book.cover_image ? (
                                <img src={rec.book.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                  <Book size={24} color="var(--text-muted)" />
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <h4 style={{ fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.book.title}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rec.book.author}</p>
                              <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', padding: '0.15rem 0.5rem', borderRadius: '8px', color: 'var(--accent-color)' }}>
                                {rec.book.rack_number} / {rec.book.shelf_number}
                              </span>
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                              <strong style={{ color: rec.is_overdue ? 'var(--danger-color)' : 'var(--text-main)' }}>
                                {new Date(rec.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </strong>
                            </div>

                            <div className={`countdown-box ${rec.is_overdue ? '' : 'safe'}`}>
                              <Clock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                              {rec.is_overdue ? (
                                <span>{rec.overdue_days} Days OVERDUE</span>
                              ) : (
                                <span>{rec.remaining_days} Days Remaining</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamic Department Curriculum Subjects */}
                {(() => {
                  const deptKey = getDeptDisplayName(currentUser?.department?.name);
                  const curriculum = DEPARTMENT_CURRICULUM[deptKey];
                  if (!curriculum) return null;
                  return (
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <h3 style={{ color: '#4a3525', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {deptKey === 'FE' ? 'First Year Engineering' : deptKey === 'IT' ? 'Information Technology' : deptKey} Department Curriculum & Subjects
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click any subject to instantly filter/search for matching reference books in central catalog.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {curriculum.map((sem, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#5c4e40', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sem.title}</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {sem.subjects.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.8rem',
                                    borderRadius: '8px',
                                    background: 'rgba(74, 53, 37, 0.08)',
                                    color: '#4a3525',
                                    border: '1px solid rgba(195, 170, 140, 0.3)'
                                  }}
                                  onClick={() => {
                                    setSearchQuery(sub);
                                    setCurrentTab('search');
                                  }}
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Split list: Notifications, Reservations, Announcements */}
                <div className="notif-announce-grid">
                  
                  {/* Notifications */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>In-App Notifications</h3>
                      <Bell size={18} color="var(--accent-color)" />
                    </div>

                    <div className="glass-panel notif-list" style={{ padding: '1rem' }}>
                      {notifications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No recent notifications.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`glass-panel notif-item ${!n.is_read ? 'unread' : ''}`} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.9rem' }}>{n.message}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(n.created_at).toLocaleString()}
                              </span>
                            </div>
                            {!n.is_read && (
                              <button 
                                type="button"
                                className="btn btn-secondary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                onClick={() => markNotificationRead(n.id)}
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Broadcast Announcements */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>College Announcements</h3>
                      <MessageSquare size={18} color="var(--warning-color)" />
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                      {announcements.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No announcements broadcasted recently.</p>
                      ) : (
                        announcements.map(a => (
                          <div key={a.id} style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                            <h4 style={{ color: 'var(--accent-color)', fontSize: '1rem' }}>{a.title}</h4>
                            <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{a.message}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Posted on {new Date(a.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Recommended Books grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <h3>Recommended Academic Reading</h3>
                  <div className="book-shelf">
                    {featuredBooks.recommended.slice(0, 4).map(b => (
                      <div 
                        key={b.id} 
                        className="glass-panel glass-panel-hover book-card"
                        onClick={() => setSelectedBook(b)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="book-cover-container">
                          {b.cover_image ? (
                            <img src={b.cover_image} alt="" className="book-cover" />
                          ) : (
                            <BookOpen size={48} color="var(--text-muted)" />
                          )}
                          <span className={`book-badge ${b.available_copies > 0 ? 'badge-available' : 'badge-unavailable'}`}>
                            {b.available_copies > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                        <div className="book-details">
                          <h4 className="book-title">{b.title}</h4>
                          <p className="book-author">{b.author}</p>
                        </div>
                        <div className="book-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
                            <span style={{ fontWeight: '600' }}>{getDeptDisplayName(b.department?.name)}</span>
                            <span style={{ opacity: 0.9 }}>{b.subject}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rack {b.rack_number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {currentTab === 'dashboard' && currentUser?.role === 'librarian' && (
              // LIBRARIAN DASHBOARD & ANALYTICS
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Statistics Grid */}
                {analytics && (
                  <div className="dashboard-grid">
                    <div className="glass-panel stat-card">
                      <div className="stat-info">
                        <p>Total Books</p>
                        <h3>{analytics.counters.total_books}</h3>
                      </div>
                      <div className="stat-icon-wrapper">
                        <Book size={24} />
                      </div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-info">
                        <p>Available Stock</p>
                        <h3>{analytics.counters.available_books}</h3>
                      </div>
                      <div className="stat-icon-wrapper success">
                        <Check size={24} />
                      </div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-info">
                        <p>Issued Books</p>
                        <h3>{analytics.counters.issued_books}</h3>
                      </div>
                      <div className="stat-icon-wrapper warning">
                        <Clock size={24} />
                      </div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-info">
                        <p>Overdue Books</p>
                        <h3>{analytics.counters.overdue_books}</h3>
                      </div>
                      <div className="stat-icon-wrapper danger">
                        <AlertTriangle size={24} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Fast Action Panels */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setShowAddBookModal(true)}>
                    <Plus size={18} />
                    <span>Catalog New Book</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowIssueBookModal(true)}>
                    <BookOpen size={18} style={{ color: 'var(--accent-color)' }} />
                    <span>Issue Book (Lending)</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAnnouncementModal(true)}>
                    <Send size={18} style={{ color: 'var(--warning-color)' }} />
                    <span>Broadcast Announcement</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowReservationLibrarianModal(true)}>
                    <Clock size={18} style={{ color: 'var(--success-color)' }} />
                    <span>Manage Reservations ({allReservations.filter(r=>r.status==='Pending').length})</span>
                  </button>
                </div>

                {/* Analytical Charts and Data Summary */}
                {analytics && (
                  <div className="analytics-grid">
                    
                    {/* Department-wise borrowing bar chart */}
                    <div className="glass-panel chart-card animate-fade-in">
                      <h3>Department-wise Borrowings</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Borrow counts categorized by engineering branches.</p>
                      
                      <div className="chart-container">
                        {analytics.department_borrowing.map((item, index) => {
                          const maxCount = Math.max(...analytics.department_borrowing.map(d => d.count), 1);
                          const barHeight = (item.count / maxCount) * 180;
                          return (
                            <div className="chart-bar-wrapper" key={index}>
                              <div 
                                className="chart-bar" 
                                style={{ height: `${barHeight}px` }}
                                data-value={item.count}
                              />
                              <span className="chart-label" title={item.department}>{item.department.split(' ')[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Credit Score distribution pie/donut chart */}
                    <div className="glass-panel chart-card animate-fade-in">
                      <h3>Student Credit Scores Zone</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Distribution of borrowers across credit zones.</p>

                      <div className="donut-chart-container">
                        {/* Conic-gradient simulation */}
                        {(() => {
                          const total = analytics.credit_stats.green + analytics.credit_stats.yellow + analytics.credit_stats.red;
                          const gPer = total > 0 ? Math.round((analytics.credit_stats.green / total) * 100) : 0;
                          const yPer = total > 0 ? Math.round((analytics.credit_stats.yellow / total) * 100) : 0;
                          const rPer = total > 0 ? Math.round((analytics.credit_stats.red / total) * 100) : 0;
                          return (
                            <>
                              <div 
                                className="pie-chart" 
                                style={{
                                  background: `conic-gradient(
                                    var(--success-color) 0% ${gPer}%,
                                    var(--warning-color) ${gPer}% ${gPer + yPer}%,
                                    var(--danger-color) ${gPer + yPer}% 100%
                                  )`
                                }}
                              />
                              <div className="chart-legend">
                                <div className="legend-item">
                                  <div className="legend-color green" />
                                  <span>Green Zone (80-100): <strong>{analytics.credit_stats.green}</strong></span>
                                </div>
                                <div className="legend-item">
                                  <div className="legend-color yellow" />
                                  <span>Yellow Zone (50-79): <strong>{analytics.credit_stats.yellow}</strong></span>
                                </div>
                                <div className="legend-item">
                                  <div className="legend-color red" />
                                  <span>Red Zone (0-49): <strong>{analytics.credit_stats.red}</strong></span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Top Readers Ranking */}
                    <div className="glass-panel chart-card animate-fade-in">
                      <h3>Top Readers Ranking</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Students with the highest borrowing counts.</p>
                      
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Name</th>
                              <th>PRN Number</th>
                              <th>Total Borrowed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.top_readers.map((r, index) => (
                              <tr key={index}>
                                <td><strong># {index + 1}</strong></td>
                                <td>{r.name}</td>
                                <td><code>{r.prn}</code></td>
                                <td>{r.count} Books</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="glass-panel chart-card animate-fade-in">
                      <h3>Low Stock & Book Inventory Alerts</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Books running low in central racks (&lt; 3 copies).</p>
                      
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Rack Code</th>
                              <th>In Stock</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.low_stock.map((b, index) => (
                              <tr key={index}>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600 }}>{b.title}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.author}</span>
                                  </div>
                                </td>
                                <td><code>{b.rack_number} / {b.shelf_number}</code></td>
                                <td>
                                  <span style={{ 
                                    color: b.available_copies === 0 ? 'var(--danger-color)' : 'var(--warning-color)',
                                    fontWeight: 'bold'
                                  }}>
                                    {b.available_copies} / {b.quantity} copies
                                  </span>
                                </td>
                                <td>
                                  <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => openEditModal(b)}>
                                    Restock
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Return register shortcut panel in librarian dashboard */}
                    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3>Process Active Lending Returns</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select a lending record to register returned resources and calculate score penalizations.</p>
                      
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Student Info</th>
                              <th>Book Info</th>
                              <th>Lending Dates</th>
                              <th>Return Status Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Search / gather active loans dynamically from students borrows */}
                            {(() => {
                              // Flatten active borrows from all students for demonstration returns registry
                              const loans = [];
                              allStudents.forEach(st => {
                                if (st.borrowed_books) {
                                  st.borrowed_books.forEach(b => {
                                    if (b.status === 'Borrowed' || b.status === 'Return Pending') {
                                      loans.push({ ...b, student: st });
                                    }
                                  });
                                }
                              });

                              if (loans.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                      No active loan logs on register.
                                    </td>
                                  </tr>
                                );
                              }

                              return loans.map(loan => (
                                <tr key={loan.id} style={loan.status === 'Return Pending' ? { backgroundColor: 'rgba(245, 158, 11, 0.08)' } : {}}>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <strong>{loan.student?.full_name}</strong>
                                        {loan.status === 'Return Pending' && (
                                          <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--warning-color)', color: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                                            Return Requested
                                          </span>
                                        )}
                                      </div>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRN: {loan.student?.prn_number}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <strong>{loan.book?.title}</strong>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISBN: {loan.book?.isbn}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                                      <span>Lent: {new Date(loan.borrow_date).toLocaleDateString()}</span>
                                      <span>Due: {new Date(loan.due_date).toLocaleDateString()}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button 
                                        type="button"
                                        className="btn btn-primary" 
                                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', backgroundColor: 'var(--success-color)' }}
                                        onClick={() => handleReturnBook(loan.id, 'Returned')}
                                      >
                                        Return
                                      </button>
                                      <button 
                                        type="button"
                                        className="btn btn-secondary" 
                                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                                        onClick={() => handleReturnBook(loan.id, 'Damaged')}
                                      >
                                        Damaged
                                      </button>
                                      <button 
                                        type="button"
                                        className="btn btn-danger" 
                                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                                        onClick={() => handleReturnBook(loan.id, 'Lost')}
                                      >
                                        Lost
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}
                
              </div>
            )}

            {currentTab === 'search' && (
              // SMART BOOK SEARCH AND CATALOG LISTING
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Search Bar + Auto Suggestions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', position: 'relative', flexWrap: 'wrap' }}>
                  <div className="search-wrapper">
                    <Search className="search-icon-inside" size={20} />
                    <input 
                      type="text" 
                      className="search-input-field"
                      placeholder="Search books by title, author, publication, subject, keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {/* Auto suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <div className="suggestions-dropdown glass-panel">
                        {suggestions.map((s, idx) => (
                          <div 
                            key={idx} 
                            className="suggestion-item"
                            onClick={() => {
                              setSearchQuery(s);
                              setSuggestions([]);
                            }}
                          >
                            <BookOpen size={16} color="var(--text-muted)" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <select 
                    value={selectedDeptFilter} 
                    onChange={(e) => {
                      setSelectedDeptFilter(e.target.value);
                      setSelectedSubjectFilter(''); // Reset subject filter when department changes
                    }}
                    style={{ minWidth: '200px' }}
                  >
                    <option value="">All Departments</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedSubjectFilter} 
                    onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">All Subjects</option>
                    {getSubjectsForDepartment(selectedDeptFilter, departments).map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedAvailabilityFilter} 
                      onChange={(e) => setSelectedAvailabilityFilter(e.target.checked)} 
                    />
                    <span>Available Stock Only</span>
                  </label>
                </div>

                {/* Reset filters button */}
                {(searchQuery || selectedDeptFilter || selectedSubjectFilter || selectedAvailabilityFilter) && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDeptFilter('');
                        setSelectedSubjectFilter('');
                        setSelectedAvailabilityFilter(false);
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Catalog Listing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="section-header">
                    <h3>Library Book Catalog ({books.length})</h3>
                  </div>

                  {books.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No books found matching your current filter criteria.
                    </div>
                  ) : (
                    <div className="book-shelf">
                      {books.map(b => (
                        <div 
                          key={b.id} 
                          className="glass-panel glass-panel-hover book-card"
                          onClick={() => setSelectedBook(b)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="book-cover-container">
                            {b.cover_image ? (
                              <img src={b.cover_image} alt="" className="book-cover" />
                            ) : (
                              <BookOpen size={48} color="var(--text-muted)" />
                            )}
                            <span className={`book-badge ${b.available_copies > 0 ? 'badge-available' : 'badge-unavailable'}`}>
                              {b.available_copies > 0 ? 'Available' : 'Out of Stock'}
                            </span>
                          </div>
                          <div className="book-details">
                            <h4 className="book-title">{b.title}</h4>
                            <p className="book-author">{b.author}</p>
                          </div>
                          <div className="book-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: '600' }}>{getDeptDisplayName(b.department?.name)}</span>
                              <span style={{ opacity: 0.9 }}>{b.subject}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rack {b.rack_number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {currentTab === 'academic-resources' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Librarian PDF Upload Form */}
                {currentUser?.role === 'librarian' && (
                  <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={20} color="var(--accent-color)" />
                      <h3 style={{ margin: 0 }}>Publish Academic Resource (PDF)</h3>
                    </div>
                    <form onSubmit={handleUploadMaterial} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Resource Title</label>
                        <input 
                          type="text" required placeholder="e.g., Unit 1 Stack Notes"
                          value={newMaterialForm.title}
                          onChange={(e) => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Academic Year</label>
                        <select 
                          required
                          value={newMaterialForm.academicYear} 
                          onChange={(e) => setNewMaterialForm({ ...newMaterialForm, academicYear: e.target.value })}
                        >
                          <option value="">Select Year</option>
                          <option value="First Year (FE)">First Year (FE)</option>
                          <option value="Second Year (SE)">Second Year (SE)</option>
                          <option value="Third Year (TE)">Third Year (TE)</option>
                          <option value="Final Year (BE)">Final Year (BE)</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Department</label>
                        <select 
                          required
                          value={newMaterialForm.departmentId} 
                          onChange={(e) => setNewMaterialForm({ ...newMaterialForm, departmentId: e.target.value })}
                        >
                          <option value="">Select Department</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Subject</label>
                        <select 
                          required
                          value={newMaterialForm.subject} 
                          onChange={(e) => setNewMaterialForm({ ...newMaterialForm, subject: e.target.value })}
                        >
                          <option value="">Select Subject</option>
                          {getSubjectsForAcademicResources(
                            newMaterialForm.academicYear, 
                            departments.find(d => d.id === parseInt(newMaterialForm.departmentId)) ? getDeptDisplayName(departments.find(d => d.id === parseInt(newMaterialForm.departmentId)).name) : ''
                          ).map((sub, idx) => (
                            <option key={idx} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Unit (Optional)</label>
                        <select 
                          value={newMaterialForm.unit} 
                          onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unit: e.target.value })}
                        >
                          <option value="">Common Notes / Question Papers</option>
                          <option value="Unit 1">Unit 1</option>
                          <option value="Unit 2">Unit 2</option>
                          <option value="Unit 3">Unit 3</option>
                          <option value="Unit 4">Unit 4</option>
                          <option value="Unit 5">Unit 5</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>PDF File</label>
                        <input 
                          id="material-file-input"
                          type="file" required accept=".pdf"
                          onChange={(e) => setSelectedMaterialFile(e.target.files[0])}
                          style={{ padding: '0.35rem 0.5rem', background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                        />
                      </div>

                      <div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                          <Plus size={16} style={{ marginRight: '0.25rem' }} />
                          <span>Upload Material</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Filter Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BookOpen size={24} color="var(--accent-color)" />
                    <div>
                      <h3 style={{ margin: 0 }}>Academic Resources & Study Notes</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                        Access study notes, syllabus reference sheets, and curriculum materials shared by your librarian.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Academic Year</label>
                      <select 
                        value={academicResourceYear} 
                        onChange={(e) => {
                          setAcademicResourceYear(e.target.value);
                          setAcademicResourceSubject('');
                        }}
                      >
                        <option value="">All Academic Years</option>
                        <option value="First Year (FE)">First Year (FE)</option>
                        <option value="Second Year (SE)">Second Year (SE)</option>
                        <option value="Third Year (TE)">Third Year (TE)</option>
                        <option value="Final Year (BE)">Final Year (BE)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Department</label>
                      <select 
                        value={academicResourceDept} 
                        onChange={(e) => {
                          setAcademicResourceDept(e.target.value);
                          setAcademicResourceSubject('');
                        }}
                      >
                        <option value="">All Departments</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Subject</label>
                      <select 
                        value={academicResourceSubject} 
                        onChange={(e) => setAcademicResourceSubject(e.target.value)}
                      >
                        <option value="">All Subjects</option>
                        {getSubjectsForAcademicResources(
                          academicResourceYear, 
                          departments.find(d => d.id === parseInt(academicResourceDept)) ? getDeptDisplayName(departments.find(d => d.id === parseInt(academicResourceDept)).name) : ''
                        ).map((sub, idx) => (
                          <option key={idx} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(academicResourceYear || academicResourceDept || academicResourceSubject) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          setAcademicResourceYear('');
                          setAcademicResourceDept('');
                          setAcademicResourceSubject('');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Study Notes Listing grouped by Unit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="section-header">
                    <h3 style={{ margin: 0 }}>Matching Academic Notes ({academicResourceMaterials.length})</h3>
                  </div>

                  {academicResourceLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', display: 'block' }} />
                      <span>Loading notes...</span>
                    </div>
                  ) : academicResourceMaterials.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <BookOpen size={48} style={{ opacity: 0.5 }} />
                      <span>No study materials or notes found matching the selected filters.</span>
                    </div>
                  ) : (
                    <div>
                      {["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Common Notes / Question Papers"].map((unitName, uIdx) => {
                        const materials = academicResourceMaterials.filter(m => {
                          if (unitName === "Common Notes / Question Papers") {
                            return !m.unit;
                          }
                          return m.unit === unitName;
                        });
                        
                        if (materials.length === 0) return null;
                        
                        return (
                          <div key={uIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                            <h4 style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '0.5rem', color: currentUser?.role === 'student' ? '#faf6eb' : 'var(--text-main)', margin: '0.5rem 0 0.25rem' }}>{unitName}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                              {materials.map(m => (
                                <div key={m.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                    <div style={{ background: 'var(--accent-light)', color: 'var(--accent-color)', borderRadius: '8px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      <BookOpen size={24} />
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                      <h4 style={{ fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.title}>{m.title}</h4>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>{m.subject}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                    <a 
                                      href={m.file_path} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="btn btn-primary" 
                                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                      <Send size={12} />
                                      <span>View PDF</span>
                                    </a>
                                    {currentUser?.role === 'librarian' && (
                                      <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                                        onClick={() => handleDeleteMaterial(m.id)}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'student-borrow' && currentUser?.role === 'student' && (
              // STUDENT BORROW RECORDS & COUNTDOWNS
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Active loans */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Active Lends & Countdown Timers</h3>
                  {studentBorrowData.active_borrows.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      You do not have any books currently borrowed.
                    </div>
                  ) : (
                    <div className="dashboard-grid">
                      {studentBorrowData.active_borrows.map(rec => (
                        <div key={rec.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                            <div style={{ width: '80px', height: '110px', borderRadius: '8px', background: 'rgba(15,23,42,0.4)', overflow: 'hidden' }}>
                              {rec.book.cover_image ? (
                                <img src={rec.book.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                  <BookOpen size={32} color="var(--text-muted)" />
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: '160px' }}>
                              <h4 style={{ fontSize: '1.05rem' }}>{rec.book.title}</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rec.book.author}</p>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                ISBN: <code>{rec.book.isbn}</code>
                              </p>
                              <div style={{ marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '8px', color: 'var(--accent-color)' }}>
                                  Location: Rack {rec.book.rack_number}, Shelf {rec.book.shelf_number}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Lent On:</span>
                              <span>{new Date(rec.borrow_date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Due On:</span>
                              <strong style={{ color: rec.is_overdue ? 'var(--danger-color)' : 'var(--text-main)' }}>
                                {new Date(rec.due_date).toLocaleDateString()}
                              </strong>
                            </div>

                            <div className={`countdown-box ${rec.is_overdue ? '' : 'safe'}`}>
                              <Clock size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                              {rec.is_overdue ? (
                                <span>LATE: {rec.overdue_days} Days Overdue</span>
                              ) : (
                                <span>{rec.remaining_days} Days Left</span>
                              )}
                            </div>

                            {rec.status === 'Return Pending' ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                disabled
                                style={{ width: '100%', marginTop: '0.5rem', opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                              >
                                <Clock size={14} />
                                Return Pending Approval
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                onClick={() => handleRequestReturn(rec.id)}
                              >
                                <Send size={14} />
                                Request Return
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reservations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Pending Book Reservations</h3>
                  {studentBorrowData.reservations.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active reservations.
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Book Title</th>
                              <th>Reserved Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentBorrowData.reservations.map(r => (
                              <tr key={r.id}>
                                <td><strong>{r.book?.title}</strong> ({r.book?.author})</td>
                                <td>{new Date(r.reservation_date).toLocaleDateString()}</td>
                                <td>
                                  <span style={{
                                    color: r.status === 'Pending' ? 'var(--warning-color)' : r.status === 'Approved' ? 'var(--success-color)' : 'var(--text-muted)',
                                    fontWeight: 'bold'
                                  }}>
                                    {r.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Credit Score History log */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Credit Score History Logs</h3>
                  {studentBorrowData.credit_history.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No credit adjustments recorded yet. Score is stable at 100.
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Score Shift</th>
                              <th>New Score</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentBorrowData.credit_history.map(h => (
                              <tr key={h.id}>
                                <td>{new Date(h.timestamp).toLocaleDateString()}</td>
                                <td>
                                  <span style={{
                                    color: h.change_amount > 0 ? 'var(--success-color)' : h.change_amount < 0 ? 'var(--danger-color)' : 'var(--text-muted)',
                                    fontWeight: 'bold'
                                  }}>
                                    {h.change_amount > 0 ? `+${h.change_amount}` : h.change_amount}
                                  </span>
                                </td>
                                <td><strong>{h.new_score}</strong> / 100</td>
                                <td>{h.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Return History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Lending & Return History</h3>
                  {studentBorrowData.history.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No historical borrow logs.
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Book Title</th>
                              <th>Borrow Date</th>
                              <th>Return Date</th>
                              <th>Final Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentBorrowData.history.map(h => (
                              <tr key={h.id}>
                                <td><strong>{h.book?.title}</strong> ({h.book?.author})</td>
                                <td>{new Date(h.borrow_date).toLocaleDateString()}</td>
                                <td>{h.return_date ? new Date(h.return_date).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                  <span style={{
                                    color: h.status === 'Returned' ? 'var(--success-color)' : 'var(--danger-color)',
                                    fontWeight: 'bold'
                                  }}>
                                    {h.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {currentTab === 'student-list' && currentUser?.role === 'librarian' && (
              selectedStudentDetail ? (
                // STUDENT PROFILE DETAIL VIEW
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
                  {/* Header Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setSelectedStudentDetail(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span>Back to Registry</span>
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => handleViewStudentDetails(selectedStudentDetail.student.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <RefreshCw size={14} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Two Column Profile Info */}
                  <div className="profile-detail-grid">
                    
                    {/* Left Column: Student Bio Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                          color: '#fff',
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem auto',
                          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
                        }}>
                          {selectedStudentDetail.student.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <h3 style={{ marginBottom: '0.25rem' }}>{selectedStudentDetail.student.full_name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{selectedStudentDetail.student.email}</p>
                        
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: selectedStudentDetail.student.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: selectedStudentDetail.student.is_active ? 'var(--success-color)' : 'var(--danger-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedStudentDetail.student.is_active ? 'var(--success-color)' : 'var(--danger-color)' }} />
                          {selectedStudentDetail.student.is_active ? 'Active Account' : 'Suspended'}
                        </div>
                      </div>

                      {/* Details specs */}
                      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>PRN Number:</span>
                          <strong style={{ fontFamily: 'monospace' }}>{selectedStudentDetail.student.prn_number}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Roll Number:</span>
                          <strong>{selectedStudentDetail.student.roll_number}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                          <strong>{selectedStudentDetail.student.department?.name}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Year / Div:</span>
                          <strong>{selectedStudentDetail.student.year} (Div {selectedStudentDetail.student.division})</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Mobile:</span>
                          <strong>{selectedStudentDetail.student.mobile_number}</strong>
                        </div>
                      </div>

                      {/* Credit Score status */}
                      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Credit Rating</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getCreditScoreDetails(selectedStudentDetail.student.credit_score).color }}>
                          {selectedStudentDetail.student.credit_score}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
                          Status: <strong style={{ color: getCreditScoreDetails(selectedStudentDetail.student.credit_score).color }}>{getCreditScoreDetails(selectedStudentDetail.student.credit_score).label}</strong>
                        </span>
                        
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          style={{ width: '100%', padding: '0.6rem' }}
                          onClick={() => setShowCreditAdjustModal(selectedStudentDetail.student)}
                        >
                          Adjust Credit Score
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Active Loans & Log History */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      
                      {/* Active Loans ("Books Owned") */}
                      <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                          <Book size={18} style={{ color: 'var(--accent-color)' }} />
                          <span>Books Currently Owned (Active Loans)</span>
                          <span style={{ marginLeft: 'auto', background: 'var(--accent-light)', color: 'var(--accent-color)', fontSize: '0.8rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
                            {selectedStudentDetail.active_borrows.length} Active
                          </span>
                        </h4>

                        {selectedStudentDetail.active_borrows.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Candidate currently has no active borrowed books.</p>
                        ) : (
                          <div className="table-container">
                            <table style={{ minWidth: '650px' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '45%' }}>Book Details</th>
                                  <th style={{ width: '18%' }}>Borrow Date</th>
                                  <th style={{ width: '18%' }}>Due Date</th>
                                  <th style={{ width: '19%' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedStudentDetail.active_borrows.map(loan => (
                                  <tr key={loan.id}>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
                                        {loan.book.cover_image ? (
                                          <img src={loan.book.cover_image} alt={loan.book.title} style={{ width: '35px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                                        ) : (
                                          <div style={{ width: '35px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Book size={16} /></div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                          <strong style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{loan.book.title}</strong>
                                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'normal', wordBreak: 'break-word' }}>By {loan.book.author} (ISBN: {loan.book.isbn})</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{new Date(loan.borrow_date).toLocaleDateString()}</td>
                                    <td>{new Date(loan.due_date).toLocaleDateString()}</td>
                                    <td>
                                      {loan.is_overdue ? (
                                        <span style={{ color: 'var(--danger-color)', fontWeight: 'bold', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                          Overdue by {loan.overdue_days} days
                                        </span>
                                      ) : (
                                        <span style={{ color: 'var(--success-color)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                          Due in {loan.remaining_days} days
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Credit Score History logs */}
                      <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Award size={18} style={{ color: 'var(--warning-color)' }} />
                          <span>Credit Rating Logs</span>
                        </h4>

                        {selectedStudentDetail.credit_history.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No credit adjustment logs recorded yet.</p>
                        ) : (
                          <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <table style={{ minWidth: '550px' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '20%' }}>Date</th>
                                  <th style={{ width: '15%' }}>Shift</th>
                                  <th style={{ width: '18%' }}>Score</th>
                                  <th style={{ width: '47%' }}>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedStudentDetail.credit_history.map(log => (
                                  <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                                    <td>
                                      <span style={{ color: log.change_amount > 0 ? 'var(--success-color)' : log.change_amount < 0 ? 'var(--danger-color)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                                        {log.change_amount > 0 ? `+${log.change_amount}` : log.change_amount}
                                      </span>
                                    </td>
                                    <td><strong>{log.new_score}</strong>/100</td>
                                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{log.reason}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Historical Checkouts */}
                      <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={18} style={{ color: 'var(--text-muted)' }} />
                          <span>All-time Lending History</span>
                        </h4>

                        {selectedStudentDetail.history.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No historical lending logs.</p>
                        ) : (
                          <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <table style={{ minWidth: '600px' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '45%' }}>Book Title</th>
                                  <th style={{ width: '20%' }}>Borrow Date</th>
                                  <th style={{ width: '20%' }}>Return Date</th>
                                  <th style={{ width: '15%' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedStudentDetail.history.map(h => (
                                  <tr key={h.id}>
                                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}><strong>{h.book.title}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {h.book.author}</span></td>
                                    <td>{new Date(h.borrow_date).toLocaleDateString()}</td>
                                    <td>{h.return_date ? new Date(h.return_date).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                      <span style={{
                                        color: h.status === 'Returned' ? 'var(--success-color)' : 'var(--danger-color)',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                      }}>
                                        {h.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              ) : (
                // REGISTERED STUDENTS REGISTRY TABLE
                <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Registered Students Registry</h3>
                    <button type="button" className="btn btn-secondary" onClick={fetchLibrarianDashboard}>
                      <RefreshCw size={16} />
                      <span>Sync Lists</span>
                    </button>
                  </div>
                  {/* Search & Filters */}
                  <div className="glass-panel" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Search Student</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="Search Name, PRN, Roll..." 
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          style={{ paddingLeft: '2.25rem', width: '100%', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</label>
                      <select 
                        value={studentYearFilter}
                        onChange={(e) => setStudentYearFilter(e.target.value)}
                        style={{ width: '100%', fontSize: '0.9rem' }}
                      >
                        <option value="">All Years</option>
                        <option value="FE">First Year (FE)</option>
                        <option value="SE">Second Year (SE)</option>
                        <option value="TE">Third Year (TE)</option>
                        <option value="BE">Final Year (BE)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</label>
                      <select 
                        value={studentDeptFilter}
                        onChange={(e) => setStudentDeptFilter(e.target.value)}
                        style={{ width: '100%', fontSize: '0.9rem' }}
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Division</label>
                      <select 
                        value={studentDivFilter}
                        onChange={(e) => setStudentDivFilter(e.target.value)}
                        style={{ width: '100%', fontSize: '0.9rem' }}
                      >
                        <option value="">All Divisions</option>
                        <option value="A">Division A</option>
                        <option value="B">Division B</option>
                        <option value="C">Division C</option>
                        <option value="D">Division D</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>PRN / Roll</th>
                          <th>Department & Year</th>
                          <th>Credit Score</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Search size={24} style={{ opacity: 0.5 }} />
                                <span>No students match the selected search & filter criteria.</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => (
                            <tr key={student.id}>
                              <td>
                                <button 
                                  type="button"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--accent-color)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    padding: 0,
                                    textAlign: 'left',
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => handleViewStudentDetails(student.id)}
                                >
                                  {student.full_name}
                                </button>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <strong>{student.prn_number}</strong>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Roll: {student.roll_number}</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span>{student.department?.name}</span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year: {student.year} (Div {student.division})</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{
                                    display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
                                    backgroundColor: getCreditScoreDetails(student.credit_score).color
                                  }} />
                                  <strong>{student.credit_score}</strong>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                                  <span>{student.email}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>Mob: {student.mobile_number}</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    type="button"
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                                    onClick={() => setShowCreditAdjustModal(student)}
                                  >
                                    Adjust Credit
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {currentTab === 'librarian-admin' && currentUser?.role === 'librarian' && (
              // LIBRARIAN ADMINISTRATIVE VIEWS (APPROVVALS, LOGS, DISPATCHES)
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Pending Librarian Approvals */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3>Pending Librarian Account Approvals</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Newly registered librarians requiring validation before active access.</p>

                  {pendingLibrarians.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No pending approvals.</p>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Employee ID</th>
                            <th>Librarian Name</th>
                            <th>Email Address</th>
                            <th>Contact</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingLibrarians.map(lib => (
                            <tr key={lib.id}>
                              <td><code>{lib.employee_id}</code></td>
                              <td>{lib.full_name}</td>
                              <td>{lib.email}</td>
                              <td>{lib.mobile_number}</td>
                              <td>
                                <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApproveLibrarian(lib.id)}>
                                  Approve
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* General announcements log */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3>Announcements History log</h3>
                  <div className="table-container" style={{ marginTop: '1rem' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Announcement Title</th>
                          <th>Broadcast message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map(a => (
                          <tr key={a.id}>
                            <td>{new Date(a.created_at).toLocaleDateString()}</td>
                            <td><strong style={{ color: 'var(--accent-color)' }}>{a.title}</strong></td>
                            <td style={{ fontSize: '0.875rem' }}>{a.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      )}

      {/* ================= MODALS SECTION ================= */}
      
      {/* 1. Book Details Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <X className="modal-close" onClick={() => setSelectedBook(null)} />
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ width: '180px', height: '240px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedBook.cover_image ? (
                  <img src={selectedBook.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <BookOpen size={64} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--accent-color)', width: 'fit-content' }}>
                  {selectedBook.subject}
                </span>

                <h2>{selectedBook.title}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>By {selectedBook.author}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Publisher: <strong>{selectedBook.publication}</strong></span>
                  <span>Edition: <strong>{selectedBook.edition}</strong></span>
                  <span>Semester: <strong>{selectedBook.semester}</strong></span>
                  <span>Pages: <strong>{selectedBook.pages} Pages</strong></span>
                  <span>Language: <strong>{selectedBook.language}</strong></span>
                  <span>ISBN: <strong>{selectedBook.isbn}</strong></span>
                </div>

                <div style={{ background: 'rgba(15,23,42,0.4)', padding: '0.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <MapPin size={18} color="var(--accent-color)" />
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</p>
                      <strong style={{ fontSize: '0.85rem' }}>Rack {selectedBook.rack_number}, Shelf {selectedBook.shelf_number}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Copies</p>
                    <strong style={{ fontSize: '1rem', color: selectedBook.available_copies > 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                      {selectedBook.available_copies} / {selectedBook.quantity}
                    </strong>
                  </div>
                </div>

                {selectedBook.description && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>About Book:</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{selectedBook.description}</p>
                  </div>
                )}

                {/* Action button conditional by role */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {currentUser?.role === 'student' ? (
                    <button 
                      type="button"
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                      disabled={currentUser.credit_score < 40}
                      onClick={() => handleReserve(selectedBook.id)}
                    >
                      Reserve Book
                    </button>
                  ) : currentUser?.role === 'librarian' ? (
                    <>
                      <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => openEditModal(selectedBook)}>
                        <Edit size={16} />
                        <span>Edit Book</span>
                      </button>
                      <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteBook(selectedBook.id)}>
                        <Trash2 size={16} />
                        <span>Remove Book</span>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Catalog Book Add Modal */}
      {showAddBookModal && (
        <div className="modal-overlay" onClick={() => setShowAddBookModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <X className="modal-close" onClick={() => setShowAddBookModal(false)} />
            <h3>Catalog New Book</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Register a new resource in the library database.</p>

            <form onSubmit={handleAddBook}>
              <div className="form-row">
                <div className="form-group">
                  <label>ISBN Number</label>
                  <input 
                    type="text" required placeholder="e.g. 978-0131103627"
                    value={bookForm.isbn} onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Book Title</label>
                  <input 
                    type="text" required placeholder="e.g. Database Systems"
                    value={bookForm.title} onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author(s)</label>
                  <input 
                    type="text" required placeholder="Brian Kernighan"
                    value={bookForm.author} onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input 
                    type="text" required placeholder="Pearson / Prentice Hall"
                    value={bookForm.publication} onChange={(e) => setBookForm({...bookForm, publication: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Edition</label>
                  <input 
                    type="text" required placeholder="e.g. 3rd"
                    value={bookForm.edition} onChange={(e) => setBookForm({...bookForm, edition: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={bookForm.department_id} 
                    onChange={(e) => setBookForm({...bookForm, department_id: e.target.value})}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject Classification</label>
                  <input 
                    type="text" required placeholder="e.g. Database Systems"
                    value={bookForm.subject} onChange={(e) => setBookForm({...bookForm, subject: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={bookForm.semester} onChange={(e) => setBookForm({...bookForm, semester: e.target.value})}>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Pages</label>
                  <input 
                    type="number" required placeholder="320"
                    value={bookForm.pages} onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input 
                    type="text" required placeholder="English"
                    value={bookForm.language} onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rack Location</label>
                  <input 
                    type="text" required placeholder="e.g. RACK-C1"
                    value={bookForm.rack_number} onChange={(e) => setBookForm({...bookForm, rack_number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Shelf Location</label>
                  <input 
                    type="text" required placeholder="e.g. SHELF-02"
                    value={bookForm.shelf_number} onChange={(e) => setBookForm({...bookForm, shelf_number: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Inventory Copies</label>
                  <input 
                    type="number" required placeholder="5"
                    value={bookForm.quantity} onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input 
                    type="text" placeholder="https://..."
                    value={bookForm.cover_image} onChange={(e) => setBookForm({...bookForm, cover_image: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input 
                  type="text" placeholder="databases, sql, coding, backend"
                  value={bookForm.keywords} onChange={(e) => setBookForm({...bookForm, keywords: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Description Details</label>
                <textarea 
                  placeholder="Enter brief description of the book" rows={3}
                  value={bookForm.description} onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Save Book to Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Catalog Book Edit Modal */}
      {showEditBookModal && (
        <div className="modal-overlay" onClick={() => setShowEditBookModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <X className="modal-close" onClick={() => setShowEditBookModal(false)} />
            <h3>Edit Book Details</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Modify properties for: {selectedBook?.title}</p>

            <form onSubmit={handleEditBook}>
              {/* Form elements mirrored from AddBook */}
              <div className="form-row">
                <div className="form-group">
                  <label>ISBN Number</label>
                  <input 
                    type="text" required value={bookForm.isbn} 
                    onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Book Title</label>
                  <input 
                    type="text" required value={bookForm.title} 
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author(s)</label>
                  <input 
                    type="text" required value={bookForm.author} 
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input 
                    type="text" required value={bookForm.publication} 
                    onChange={(e) => setBookForm({...bookForm, publication: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Edition</label>
                  <input 
                    type="text" required value={bookForm.edition} 
                    onChange={(e) => setBookForm({...bookForm, edition: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={bookForm.department_id} 
                    onChange={(e) => setBookForm({...bookForm, department_id: e.target.value})}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject Classification</label>
                  <input 
                    type="text" required value={bookForm.subject} 
                    onChange={(e) => setBookForm({...bookForm, subject: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={bookForm.semester} onChange={(e) => setBookForm({...bookForm, semester: e.target.value})}>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Pages</label>
                  <input 
                    type="number" required value={bookForm.pages} 
                    onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input 
                    type="text" required value={bookForm.language} 
                    onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rack Location</label>
                  <input 
                    type="text" required value={bookForm.rack_number} 
                    onChange={(e) => setBookForm({...bookForm, rack_number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Shelf Location</label>
                  <input 
                    type="text" required value={bookForm.shelf_number} 
                    onChange={(e) => setBookForm({...bookForm, shelf_number: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Inventory Copies</label>
                  <input 
                    type="number" required value={bookForm.quantity} 
                    onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input 
                    type="text" value={bookForm.cover_image} 
                    onChange={(e) => setBookForm({...bookForm, cover_image: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input 
                  type="text" value={bookForm.keywords} 
                  onChange={(e) => setBookForm({...bookForm, keywords: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Description Details</label>
                <textarea 
                  value={bookForm.description} rows={3}
                  onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Update Book Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Issue Book (Lending) Modal */}
      {showIssueBookModal && (
        <div className="modal-overlay" onClick={() => setShowIssueBookModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <X className="modal-close" onClick={() => setShowIssueBookModal(false)} />
            <h3>Issue Library Book</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Create an active lending log link for a student.</p>

            <form onSubmit={handleIssueBook}>
              <div className="form-group">
                <label>Student PRN Number</label>
                <input 
                  type="text" required placeholder="PRN202410091"
                  value={issueForm.prnNumber} onChange={(e) => setIssueForm({...issueForm, prnNumber: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Book ISBN Code</label>
                <input 
                  type="text" required placeholder="978-0131103627"
                  value={issueForm.isbn} onChange={(e) => setIssueForm({...issueForm, isbn: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Approve Lending & Issue Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Adjust Credit score modal */}
      {showCreditAdjustModal && (
        <div className="modal-overlay" onClick={() => setShowCreditAdjustModal(null)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <X className="modal-close" onClick={() => setShowCreditAdjustModal(null)} />
            <h3>Adjust Credit Score</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Adjusting credit score for student: <strong>{showCreditAdjustModal.full_name}</strong> (Current score: {showCreditAdjustModal.credit_score})
            </p>

            <form onSubmit={handleAdjustCredit}>
              <div className="form-group">
                <label>Score Adjustment Amount (+ / -)</label>
                <input 
                  type="number" required placeholder="e.g. 10 or -15"
                  value={creditAdjustForm.amount} onChange={(e) => setCreditAdjustForm({...creditAdjustForm, amount: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Reason for adjustment</label>
                <input 
                  type="text" required placeholder="e.g. Manual credit reset / Approved restore"
                  value={creditAdjustForm.reason} onChange={(e) => setCreditAdjustForm({...creditAdjustForm, reason: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Apply Score Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Broadcast Announcement Modal */}
      {showAnnouncementModal && (
        <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <X className="modal-close" onClick={() => setShowAnnouncementModal(false)} />
            <h3>Broadcast Library Announcement</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Send a general alert notification to all student dashboards.</p>

            <form onSubmit={handleBroadcastAnnouncement}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input 
                  type="text" required placeholder="e.g. Holiday Announcement / Extension"
                  value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Alert Message Description</label>
                <textarea 
                  required placeholder="Enter message details..." rows={4}
                  value={announcementForm.message} onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Broadcast Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Manage Reservations (Librarian Modal) */}
      {showReservationLibrarianModal && (
        <div className="modal-overlay" onClick={() => setShowReservationLibrarianModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <X className="modal-close" onClick={() => setShowReservationLibrarianModal(false)} />
            <h3>Pending Reservations Queue</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Review student reservations and issue/cancel requests.</p>

            <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {allReservations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reservation history found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Book Info</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReservations.map(res => (
                      <tr key={res.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong>{res.student?.full_name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.student?.prn_number}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{res.book?.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock: {res.book?.available_copies} copies</span>
                          </div>
                        </td>
                        <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                        <td>
                          <strong style={{ 
                            color: res.status === 'Pending' ? 'var(--warning-color)' : res.status === 'Approved' ? 'var(--success-color)' : 'var(--text-muted)'
                          }}>
                            {res.status}
                          </strong>
                        </td>
                        <td>
                          {res.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                type="button"
                                className="btn btn-primary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                disabled={res.book?.available_copies <= 0}
                                onClick={() => handleReservationAction(res.id, 'Approve')}
                              >
                                Approve
                              </button>
                              <button 
                                type="button"
                                className="btn btn-danger" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => handleReservationAction(res.id, 'Cancel')}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
