import datetime
from database import SessionLocal, engine, Base
import models
import auth

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # 1. Clean existing records (optional, but good for clean start)
        db.query(models.ActivityLog).delete()
        db.query(models.Announcement).delete()
        db.query(models.Notification).delete()
        db.query(models.CreditHistory).delete()
        db.query(models.BorrowedBook).delete()
        db.query(models.Reservation).delete()
        db.query(models.Book).delete()
        db.query(models.Student).delete()
        db.query(models.Librarian).delete()
        db.query(models.Department).delete()
        db.commit()

        print("Cleaned existing database records.")

        # 2. Seed Departments
        depts = [
            models.Department(name="First Year Engineering"),
            models.Department(name="Computer Engineering"),
            models.Department(name="Information Technology Engineering"),
            models.Department(name="Mechanical Engineering"),
            models.Department(name="Civil Engineering"),
            models.Department(name="E&TC Engineering"),
            models.Department(name="AI & Machine Learning Engineering"),
            models.Department(name="AI & Data Science Engineering")
        ]
        db.add_all(depts)
        db.commit()
        print("Seeded departments.")

        comp_dept = db.query(models.Department).filter(models.Department.name == "Computer Engineering").first()
        it_dept = db.query(models.Department).filter(models.Department.name == "Information Technology Engineering").first()
        mech_dept = db.query(models.Department).filter(models.Department.name == "Mechanical Engineering").first()
        civil_dept = db.query(models.Department).filter(models.Department.name == "Civil Engineering").first()

        # 3. Seed Users
        student_pw = auth.get_password_hash("password123")
        student1 = models.Student(
            full_name="Rahul Ramesh Sharma",
            prn_number="PRN202410091",
            roll_number="CO4012",
            department_id=comp_dept.id,
            year="TE",
            division="A",
            email="rahul.sharma@moze.edu.in",
            mobile_number="9876543210",
            hashed_password=student_pw,
            credit_score=95,
            is_active=True
        )

        student2 = models.Student(
            full_name="Priya Sunil Patil",
            prn_number="PRN202410095",
            roll_number="IT3015",
            department_id=it_dept.id,
            year="SE",
            division="B",
            email="priya.patil@moze.edu.in",
            mobile_number="9123456789",
            hashed_password=student_pw,
            credit_score=45,  # Low credit to demonstrate yellow status
            is_active=True
        )

        student3 = models.Student(
            full_name="Amit Vijay Kamble",
            prn_number="PRN202410098",
            roll_number="ME4022",
            department_id=mech_dept.id,
            year="BE",
            division="A",
            email="amit.kamble@moze.edu.in",
            mobile_number="9988776655",
            hashed_password=student_pw,
            credit_score=35,  # Danger credit zone
            is_active=True
        )

        db.add_all([student1, student2, student3])
        db.commit()
        print("Seeded students (rahul.sharma@moze.edu.in / password123).")

        lib_pw = auth.get_password_hash("password123")
        lib1 = models.Librarian(
            full_name="Prof. Sunita Anand Patil",
            employee_id="LIB9021",
            email="librarian@moze.edu.in",
            mobile_number="9822334455",
            hashed_password=lib_pw,
            is_approved=True
        )
        lib2 = models.Librarian(
            full_name="Mr. Sanjay K. Kadam",
            employee_id="LIB9025",
            email="sanjay.kadam@moze.edu.in",
            mobile_number="9822334466",
            hashed_password=lib_pw,
            is_approved=False  # Pending approval demo
        )
        db.add_all([lib1, lib2])
        db.commit()
        print("Seeded librarians (librarian@moze.edu.in / password123).")

        # 4. Seed Books dynamically for all subjects of all departments
        
        DEPARTMENT_CURRICULUM = {
            "IT": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Theory of Computation",
                        "Operating Systems",
                        "Machine Learning",
                        "Human Computer Interaction",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Computer Networks & Security",
                        "Data Science and Big Data Analytics",
                        "Web Application Development",
                        "Elective II"
                    ]
                }
            ],
            "FE": [
                {
                    "title": "Semester 1",
                    "subjects": [
                        "Engineering Mathematics I",
                        "Engineering Physics",
                        "Basic Electrical Engineering",
                        "Engineering Graphics",
                        "Indian Knowledge System",
                        "Professional Communication Skills"
                    ]
                },
                {
                    "title": "Semester 2",
                    "subjects": [
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
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Theory of Computation",
                        "Systems Programming & Operating System",
                        "Database Management System",
                        "Computer Networks",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Software Engineering & Project Management",
                        "Web Technology",
                        "Data Analytics",
                        "Artificial Intelligence",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "High Performance Computing",
                        "Deep Learning",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ],
            "Mechanical": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Design of Machine Elements – I",
                        "Heat Transfer",
                        "Theory of Machines",
                        "Metrology and Quality Control",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Design of Machine Elements – II",
                        "Refrigeration and Air Conditioning",
                        "Turbo Machines",
                        "Industrial Engineering",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "Finite Element Analysis",
                        "Mechatronics",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Operations Research",
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ],
            "Civil": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Design of Reinforced Concrete Structures",
                        "Geotechnical Engineering",
                        "Water Resources Engineering",
                        "Environmental Engineering",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Design of Steel Structures",
                        "Transportation Engineering",
                        "Estimation, Costing and Valuation",
                        "Construction Management",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "Advanced Structural Engineering",
                        "Foundation Engineering",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Quantity Surveying and Contracts",
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ],
            "E&TC": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Digital Communication",
                        "Digital Signal Processing",
                        "Microcontrollers",
                        "Linear Integrated Circuits",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "VLSI Design",
                        "Wireless Communication",
                        "Embedded Systems",
                        "Computer Networks",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "Microwave Engineering",
                        "Optical Communication",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Internet of Things (IoT)",
                        "Satellite Communication",
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ],
            "AI & ML": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Artificial Intelligence",
                        "Machine Learning",
                        "Data Mining & Data Warehousing",
                        "Software Engineering",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Deep Learning",
                        "Natural Language Processing",
                        "Computer Vision",
                        "Reinforcement Learning",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "MLOps",
                        "Explainable AI",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ],
            "AI & DS": [
                {
                    "title": "Semester 3",
                    "subjects": [
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
                    "title": "Semester 4",
                    "subjects": [
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
                    "title": "Semester 5",
                    "subjects": [
                        "Machine Learning",
                        "Artificial Intelligence",
                        "Data Warehousing & Data Mining",
                        "Software Engineering",
                        "Elective I"
                    ]
                },
                {
                    "title": "Semester 6",
                    "subjects": [
                        "Deep Learning",
                        "Big Data Analytics",
                        "Natural Language Processing",
                        "Computer Vision",
                        "Elective II"
                    ]
                },
                {
                    "title": "Semester 7",
                    "subjects": [
                        "Reinforcement Learning",
                        "MLOps",
                        "Elective III",
                        "Elective IV"
                    ]
                },
                {
                    "title": "Semester 8",
                    "subjects": [
                        "Elective V",
                        "Elective VI"
                    ]
                }
            ]
        }

        # Subject specifications mapping: subject_name -> (title, author, publication, edition, pages, keywords, description)
        SUBJECT_DETAILS = {
            # FE
            "Engineering Mathematics I": ("Higher Engineering Mathematics", "B. S. Grewal", "Khanna Publishers", "44th", 1210, "Calculus, Linear Algebra, Matrices", "A comprehensive textbook covering differential calculus, integral calculus, linear algebra, vector calculus, and differential equations."),
            "Engineering Physics": ("A Textbook of Engineering Physics", "M. N. Avadhanulu & P. G. Kshirsagar", "S. Chand Publishing", "11th", 720, "Physics, Optics, Quantum, Lasers", "Covers wave optics, lasers, fiber optics, quantum mechanics, and semiconductor physics for engineering undergraduate programs."),
            "Basic Electrical Engineering": ("Basic Electrical Engineering", "D. P. Kothari & I. J. Nagrath", "Tata McGraw-Hill", "4th", 650, "Electrical, AC Circuits, DC Circuits, Transformers", "Introduces fundamental network theorems, magnetic circuits, single and three phase AC circuits, transformers, and electrical machines."),
            "Engineering Graphics": ("Engineering Drawing", "N. D. Bhatt", "Charotar Publishing House", "53rd", 700, "Drawing, Projection, CAD, Curves", "The authoritative reference guide for projections of points, lines, planes, solids, section of solids, isometric projections, and CAD."),
            "Indian Knowledge System": ("Introduction to Indian Knowledge System: Concepts and Applications", "B. Mahadevan & Vinayak Rajat Bhat", "Prentice Hall India", "1st", 450, "IKS, Heritage, Ancient Indian Science", "Explores ancient Indian mathematics, metallurgy, architecture, agriculture, wellness, and management sciences."),
            "Professional Communication Skills": ("Technical Communication: Principles and Practice", "Meenakshi Raman & Sangeeta Sharma", "Oxford University Press", "3rd", 512, "Communication, English, Speaking, Professional Writing", "Helps students master technical writing, presentation skills, group discussions, business correspondence, and public speaking."),
            "Engineering Mathematics II": ("Advanced Engineering Mathematics", "Erwin Kreyszig", "Wiley", "10th", 1150, "Mathematics, Vector Calculus, Differential Equations", "Offers deep explanations on vector differential calculus, Fourier series, partial differential equations, and complex analysis."),
            "Engineering Chemistry": ("Engineering Chemistry", "Shashi Chawla", "Dhanpat Rai & Co.", "5th", 580, "Chemistry, Polymers, Corrosion, Energy Sources", "Provides a foundation in water treatment, engineering chemistry materials, corrosion, fuel technology, and green chemistry."),
            "Programming and Problem Solving": ("The C Programming Language", "Brian W. Kernighan & Dennis M. Ritchie", "Prentice Hall", "2nd", 272, "c, programming, computer science, code, pointers", "The industry-standard reference book on C programming, written by its creators. Covers basic programming structure, variables, pointers, logic structures, and standard library functionalities."),
            "Basic Electronics Engineering": ("Electronic Devices and Circuit Theory", "Robert L. Boylestad & Louis Nashelsky", "Pearson", "11th", 920, "Electronics, Diodes, Transistors, Op-amps", "A comprehensive guide on diode circuits, BJT, FET, operational amplifiers, and digital logic integrated circuits."),
            "Engineering Mechanics": ("Engineering Mechanics: Statics & Dynamics", "R. C. Hibbeler", "Pearson", "14th", 850, "Mechanics, Statics, Dynamics, Forces", "Covers vector analysis of forces, equilibrium, friction, centroids, kinematics of particles, work-energy, and impulse-momentum."),
            "Environmental Studies": ("Perspectives in Environmental Studies", "Anubha Kaushik & C. P. Kaushik", "New Age International", "6th", 310, "Environment, Ecology, Pollution, Sustainability", "Addresses ecosystems, natural resources, biodiversity conservation, waste management, global warming, and environmental laws."),

            # IT / Computer / AI & ML / AI & DS core subjects
            "Data Structures & Algorithms": ("Introduction to Algorithms", "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein", "MIT Press", "3rd", 1312, "algorithms, sorting, dynamic programming, graphs, clrs", "The definitive textbook on data structures and algorithms, covering sorting, trees, graphs, dynamic programming, and complexity."),
            "Data Structures": ("Fundamentals of Data Structures in C++", "Ellis Horowitz, Sartaj Sahni, Dinesh Mehta", "Silicon Press", "2nd", 654, "Data Structures, Stack, Queue, Tree, Graph", "Thoroughly details stacks, queues, linked lists, trees, graphs, sorting, searching, and algorithm analysis in C++."),
            "Object Oriented Programming": ("Object-Oriented Programming with C++", "E. Balagurusamy", "McGraw-Hill Education", "8th", 520, "OOP, C++, Polymorphism, Classes, Inheritance", "An introductory text exploring classes, objects, inheritance, polymorphism, templates, exception handling, and streams in C++."),
            "Object Oriented Programming and Computer Graphics": ("OOP and Computer Graphics in C++", "J. R. Hubbard & D. Hearn", "McGraw-Hill", "2nd", 680, "OOP, C++, Graphics, 2D Graphics, 3D Graphics", "Combines object-oriented paradigms in C++ with fundamental computer graphics algorithms, line drawing, and rendering."),
            "Basics of Computer Network": ("Data Communications and Networking", "Behrouz A. Forouzan", "McGraw-Hill", "5th", 1264, "Network, Communication, OSI, TCP/IP, Ethernet", "Presents data communication, physical layer protocols, data link controls, local area networks, and standard network layers."),
            "Open Elective I": ("Introduction to Intellectual Property Rights", "R. Radhakrishnan", "Excel Books", "1st", 300, "IPR, Patents, Copyright, Law", "Covers the history, laws, registration, and management of intellectual property rights, patents, copyrights, and trademarks."),
            "Digital Electronics and Logic Design": ("Digital Design", "M. Morris Mano & Michael D. Ciletti", "Pearson", "6th", 720, "Digital, Logic Gates, Flip-Flops, Combinational Circuits", "Presents the basic concepts used in the design and analysis of digital systems, registers, counters, and boolean algebra."),
            "Digital Electronics": ("Modern Digital Electronics", "R. P. Jain", "McGraw-Hill", "4th", 712, "Digital Electronics, Logic Design, ICs", "A standard textbook covering semiconductor memories, D/A converters, A/D converters, and PLDs."),
            "Principles of Management & Entrepreneurship": ("Principles of Management and Entrepreneurship", "L. M. Prasad & S. S. Khanka", "S. Chand Publishing", "2nd", 450, "Management, Entrepreneurship, Start-up, Marketing", "Explores management theories, planning, organizing, leadership, motivation, business environment, and starting new ventures."),
            "Universal Human Values and Professional Ethics": ("A Foundation Course in Human Values and Professional Ethics", "R. R. Gaur, R. Sangal, G. P. Bagaria", "Excel Books", "2nd", 280, "Ethics, Values, Professional Ethics, Harmony", "Focuses on human aspirations, self-exploration, harmony in family and society, and professional ethics."),
            "Universal Human Values & Professional Ethics": ("A Foundation Course in Human Values and Professional Ethics", "R. R. Gaur, R. Sangal, G. P. Bagaria", "Excel Books", "2nd", 280, "Ethics, Values, Professional Ethics, Harmony", "Focuses on human aspirations, self-exploration, harmony in family and society, and professional ethics."),
            "Database Management System": ("Database System Concepts", "Abraham Silberschatz, Henry F. Korth, S. Sudarshan", "McGraw-Hill", "6th", 1376, "dbms, database, sql, schema, transactions", "A foundational textbook on database management concepts. Covers relational databases, SQL queries, transaction management, query optimization, indexing, and security protocols."),
            "Database Management Systems": ("Database System Concepts", "Abraham Silberschatz, Henry F. Korth, S. Sudarshan", "McGraw-Hill", "6th", 1376, "dbms, database, sql, schema, transactions", "A foundational textbook on database management concepts. Covers relational databases, SQL queries, transaction management, query optimization, indexing, and security protocols."),
            "Computer Graphics": ("Computer Graphics: Principles and Practice", "James D. Foley & Andries van Dam", "Addison-Wesley", "3rd", 1200, "Graphics, 2D Graphics, 3D Graphics, OpenGL", "The classic textbook on computer graphics hardware, 2D/3D transformations, projections, curves, shading models, and ray tracing."),
            "Probability & Statistics": ("Probability and Statistics for Engineers and Scientists", "Ronald E. Walpole", "Pearson", "9th", 816, "Probability, Statistics, Regression, Hypothesis Testing", "Examines probability distributions, random variables, hypothesis testing, linear regression, and analysis of variance (ANOVA)."),
            "Open Elective II": ("Renewable Energy Sources", "G. D. Rai", "Khanna Publishers", "5th", 390, "Energy, Solar, Wind, Biomass, Hydro", "Examines renewable energy technologies including solar collectors, wind turbines, biomass energy conversion, and geothermal power."),
            "Processor Architecture": ("Microprocessors and Interfacing", "Douglas V. Hall", "McGraw-Hill", "3rd", 750, "Intel 8086, Assembly Language, Interfacing", "Covers the 8086 microprocessor, instruction sets, assembly programming, interrupts, and hardware interfacing circuits."),
            "Digital Marketing and Social Media": ("Digital Marketing: Strategy, Implementation and Practice", "Dave Chaffey", "Pearson", "7th", 650, "Marketing, Digital, SEO, SEM, Analytics", "Provides a comprehensive guide to SEO, PPC advertising, social media strategy, content marketing, and web analytics."),
            "Modern Indian Language (Marathi/Hindi)": ("Functional Hindi and Marathi Literature", "Dr. Ashok Kelkar", "Popular Prakashan", "1st", 250, "Marathi, Hindi, Grammar, Literature", "Covers language structures, functional vocabulary, translation exercises, essay writing, and selected literary readings."),
            "E-Commerce": ("E-Commerce: Business, Technology, Society", "Kenneth C. Laudon & Carol Guercio Traver", "Pearson", "15th", 912, "E-commerce, Business Models, Web Security, Payment Gateway", "Discusses digital storefronts, B2B models, payment systems, marketing concepts, and security issues in electronic commerce."),
            "Theory of Computation": ("Introduction to Automata Theory, Languages, and Computation", "John E. Hopcroft, Rajeev Motwani, Jeffrey D. Ullman", "Pearson", "3rd", 480, "Theory, Automata, Regular Languages, Turing Machine", "A classic textbook on formal languages, finite automata, pushdown automata, Turing machines, decidability, and complexity."),
            "Operating Systems": ("Operating System Concepts", "Abraham Silberschatz, Peter B. Galvin, Greg Gagne", "Wiley", "9th", 976, "Operating System, Processes, Threads, Memory, Scheduling", "Covers process coordination, CPU scheduling, synchronization, deadlocks, virtual memory management, storage allocation, and protection."),
            "Machine Learning": ("Pattern Recognition and Machine Learning", "Christopher M. Bishop", "Springer", "1st", 738, "Machine Learning, Pattern Recognition, Regression, SVM", "Provides a detailed mathematical introduction to supervised, unsupervised, and reinforcement learning, neural nets, and Bayesian methods."),
            "Human Computer Interaction": ("Designing the User Interface: Strategies for Effective Human-Computer Interaction", "Ben Shneiderman", "Pearson", "6th", 624, "HCI, UX, UI Design, Usability", "Explores guidelines, theories, and principles for creating high-quality, accessible, and engaging user interfaces."),
            "Elective I": ("Cloud Computing: Principles and Paradigms", "Rajkumar Buyya, James Broberg, Andrzej M. Goscinski", "Wiley", "1st", 640, "Cloud, SaaS, PaaS, Virtualization, AWS", "Covers distributed computing, grid models, hypervisors, cloud storage, container security, and Amazon Web Services (AWS)."),
            "Computer Networks & Security": ("Cryptography and Network Security: Principles and Practice", "William Stallings", "Pearson", "7th", 768, "Security, Network, Cryptography, Firewall, AES", "Examines cryptographic algorithms, IP security, SSL/TLS protocols, firewalls, intrusion detection, and wireless network security."),
            "Data Science and Big Data Analytics": ("Data Science and Big Data Analytics", "EMC Education Services", "Wiley", "1st", 432, "Data Science, Analytics, R, Big Data, MapReduce", "Covers discovery, analytics lifecycle, basic methods in R, advanced analytics, Hadoop, In-database analytics, and visualization."),
            "Web Application Development": ("Full Stack Web Development with React and Node.js", "Daniel Li", "Packt Publishing", "2nd", 480, "Web, React, Node, Express, API", "A practical guide to building responsive single-page applications, RESTful APIs, routing, token authentication, and databases."),
            "Elective II": ("Information Security: Principles and Practice", "Mark Stamp", "Wiley", "2nd", 430, "Security, Cryptography, Authentication, Malware", "Explores symmetric and public-key cryptography, key management, access control, network protocols, malware, and security policies."),
            "Software Engineering": ("Software Engineering: A Practitioner's Approach", "Roger S. Pressman", "McGraw-Hill", "8th", 976, "Software Engineering, Agile, UML, Testing, Metrics", "The definitive software engineering textbook covering agile models, requirements analysis, system architecture, testing, and metrics."),
            "Computer Organization & Architecture": ("Computer Organization and Architecture", "William Stallings", "Pearson", "10th", 864, "COA, Architecture, CPU, Cache, Pipeline", "A detailed study of computer hardware components, buses, memory hierarchy, cache design, instruction cycle, and pipelining."),
            "Full Stack Development": ("Node.js, Express and MongoDB: The Complete Developer's Guide", "Jonas Schmedtmann", "O'Reilly Media", "1st", 520, "Full Stack, Node, Express, MongoDB, REST API", "Presents step-by-step guidance on setting up Node environments, writing Express servers, defining schemas in MongoDB, and API testing."),
            "Design Thinking": ("Design Thinking: Understanding How Designers Think and Work", "Nigel Cross", "Berg Publishers", "1st", 190, "Design Thinking, Ideation, Prototyping, Empathy", "Presents methods of creative problem solving, user-centered research, brainstorming, rapid prototyping, and user verification."),
            "Systems Programming & Operating System": ("Systems Programming and Operating Systems", "D. M. Dhamdhere", "McGraw-Hill", "2nd", 620, "Assembler, Compiler, Linker, Operating System", "In-depth study of assembler design, macro processors, compiler parsing, loaders, linkers, and system execution environments."),
            "Computer Networks": ("Computer Networks", "Andrew S. Tanenbaum & David J. Wetherall", "Pearson", "5th", 960, "Computer Networks, TCP/IP, Routing, Wireless", "Explores physical layer transmission, data link protocols, routing algorithms, TCP congestion controls, DNS, and application layers."),
            "Software Engineering & Project Management": ("Software Project Management", "Bob Hughes & Mike Cotterell", "McGraw-Hill", "5th", 400, "Project Management, Estimation, Risk, Agile", "Guides project scheduling, activity planning, cost estimation, risk management, agile development, and team organization."),
            "Web Technology": ("Internet & World Wide Web How to Program", "Paul J. Deitel & Harvey M. Deitel", "Pearson", "5th", 980, "HTML, CSS, JavaScript, Web Server, XML", "Comprehensive reference on web technologies, client-side scripting, node servers, database connectivity, and XML parsing."),
            "Data Analytics": ("Data Analytics", "Anil Maheshwari", "McGraw-Hill", "2nd", 350, "Data Analytics, Machine Learning, R, SQL", "Provides clean coverage of data visualization, classification, clustering, regression models, and business intelligence applications."),
            "Artificial Intelligence": ("Artificial Intelligence: A Modern Approach", "Stuart Russell & Peter Norvig", "Pearson", "3rd", 1152, "ai, machine learning, intelligence, neural networks", "The ultimate reference textbook for artificial intelligence. Covers state searching, probabilistic agents, neural networks, machine learning paradigms, and NLP algorithms."),
            "High Performance Computing": ("Introduction to Parallel Computing", "Ananth Grama, Anshul Gupta, George Karypis, Vipin Kumar", "Pearson", "2nd", 656, "HPC, Parallel Computing, OpenMP, MPI, CUDA", "Covers design of parallel algorithms, MPI message passing, thread programming with OpenMP, and GPU programming using CUDA."),
            "Deep Learning": ("Deep Learning", "Ian Goodfellow, Yoshua Bengio, Aaron Courville", "MIT Press", "1st", 800, "Deep Learning, Neural Networks, CNN, RNN", "The definitive textbook on deep learning covering multilayer perceptrons, CNNs, RNNs, and generative models."),
            "Elective III": ("Mobile Computing", "Jochen Schiller", "Pearson", "2nd", 432, "Mobile Computing, Wireless, GSM, GPRS", "Discusses cellular systems, GSM protocols, wireless LAN architectures, mobile transport protocols, and wireless application environments."),
            "Elective IV": ("Big Data Analytics", "V. Prajapati", "Packt Publishing", "1st", 360, "Big Data, Hadoop, Spark, MapReduce", "Covers large-scale data storage using HDFS, writing MapReduce jobs, and processing datasets with Apache Spark."),
            "Elective V": ("Software Defined Networks", "Thomas D. Nadeau & Ken Gray", "O'Reilly Media", "1st", 384, "SDN, OpenFlow, Virtualization, Network Controller", "Explores network programmability, OpenFlow controller design, SDN use cases, and network configuration models."),
            "Elective VI": ("Green Computing & Sustainability", "Bud E. Smith", "CRC Press", "1st", 320, "Green IT, Energy Efficiency, Data Center, Carbon Footprint", "Focuses on building energy-efficient computer hardware, green data center practices, and sustainable environmental IT policies."),

            # Mechanical subjects
            "Engineering Mathematics III": ("Higher Engineering Mathematics Vol II", "Dr. B. S. Grewal", "Khanna Publishers", "44th", 1100, "Calculus, Transform, Partial Equations", "Covers Laplace transforms, Fourier series, Fourier transforms, partial differential equations, and complex analysis for engineers."),
            "Engineering Thermodynamics": ("Engineering Thermodynamics", "P. K. Nag", "McGraw-Hill", "6th", 850, "Thermodynamics, Heat, Entropy, Cycles", "In-depth treatment of work and heat, second law of thermodynamics, entropy, properties of pure substances, and power cycles."),
            "Engineering Mechanics": ("Vector Mechanics for Engineers: Statics and Dynamics", "Ferdinand P. Beer & E. Russell Johnston", "McGraw-Hill", "12th", 1020, "Mechanics, Vectors, Forces, Equilibrium, Motion", "Examines vector mechanics, equilibrium of rigid bodies, structural trusses, dry friction, and kinetics of particle motions."),
            "Manufacturing Processes": ("Manufacturing Technology: Foundry, Forming and Welding", "P. N. Rao", "McGraw-Hill", "5th", 560, "Foundry, Forming, Welding, Casting", "Covers metal casting techniques, powder metallurgy, plastic molding, mechanical forming, gas/arc welding, and testing methods."),
            "Material Science and Metallurgy": ("Material Science and Metallurgy for Engineers", "V. D. Kodgire & S. V. Kodgire", "Everest Publishing", "40th", 512, "Metallurgy, Materials, Steel, Phase Diagrams", "Explores crystal structures, plastic deformation, phase diagrams, heat treatments, alloy steels, and mechanical testing of metals."),
            "Fluid Mechanics": ("A Textbook of Fluid Mechanics and Hydraulic Machines", "Dr. R. K. Bansal", "Laxmi Publications", "10th", 1100, "Fluid, Flow, Pressure, Viscosity, Turbines", "Covers fluid properties, pressure measurements, flow dynamics, boundary layer flows, flow through pipes, and hydraulic turbines."),
            "Strength of Materials": ("Strength of Materials", "S. Ramamrutham & R. Narayanan", "Dhanpat Rai Publishing", "18th", 1020, "Stress, Strain, Bending, Shear, Shafts", "Detailed study of simple stresses, shear force and bending moment diagrams, deflection of beams, torsion, and thin cylinders."),
            "Manufacturing Technology": ("Manufacturing Technology: Metal Cutting and Machine Tools", "P. N. Rao", "McGraw-Hill", "5th", 640, "Cutting, Lathe, Milling, CNC, Grinding", "Focuses on machining principles, lathe operations, milling machines, gear manufacturing, grinding, and CNC programming."),
            "Machine Drawing": ("Machine Drawing", "K. L. Narayana", "New Age International", "3rd", 450, "Drawing, Assembly, Joints, Keys", "Guides orthographic projections, isometric views, keys, cotter joints, pipe joints, engine parts, and assembly drawings."),
            "Electrical and Electronics Engineering": ("Electrical and Electronics Engineering", "S. K. Bhattacharya", "Pearson", "2nd", 580, "AC Motors, Semiconductors, Operational Amplifiers", "Introduces AC/DC machines, semiconductor devices, rectifiers, amplifiers, operational amplifiers, and digital logic interfaces."),
            "Design of Machine Elements – I": ("Design of Machine Elements", "V. B. Bhandari", "McGraw-Hill", "4th", 980, "Design, Shafts, Keys, Joint, Welds", "Deals with design methodology, design of shafts, keys, cotter joints, threaded joints, welded joints, and springs under loads."),
            "Heat Transfer": ("Fundamentals of Heat and Mass Transfer", "Frank P. Incropera & David P. DeWitt", "Wiley", "7th", 1070, "Conduction, Convection, Radiation, Heat Exchanger", "Thorough exposition of conduction equations, convective correlations, radiative exchange, and design of heat exchangers."),
            "Theory of Machines": ("Theory of Machines", "S. S. Rattan", "Tata McGraw-Hill", "4th", 950, "machines, mechanical, links, gears, engineering", "Comprehensive reference for mechanical engineers. Highlights gears, governor mechanisms, linkages, gyroscopic couples, balancing, and mechanical vibration dynamics."),
            "Metrology and Quality Control": ("Engineering Metrology and Measurements", "N. V. Raghavendra & L. Krishnamurthy", "Oxford University Press", "1st", 540, "Metrology, Measurements, Quality Control, Gauges", "Covers linear/angular measurements, limits, fits, tolerances, and statistical quality control."),
            "Design of Machine Elements – II": ("Design of Machine Elements Vol II", "V. B. Bhandari", "McGraw-Hill", "4th", 850, "Design, Gears, Bearings, Clutch, Brake", "Explores detailed design of spur gears, helical gears, bevel gears, worm gears, sliding contact bearings, clutches, and brakes."),
            "Refrigeration and Air Conditioning": ("A Course in Refrigeration and Air Conditioning", "S. C. Arora & S. Domkundwar", "Dhanpat Rai & Co.", "10th", 890, "Refrigeration, Air Conditioning, Psychrometric, Cycles", "Covers gas cycle refrigeration, vapor compression systems, psychrometric properties, cooling loads, and air conditioning layouts."),
            "Turbo Machines": ("Turbo Machines", "A. Valan Arasu", "Vikas Publishing", "2nd", 450, "Turbine, Pump, Compressor, Pelton, Kaplan", "Covers energy transfer in turbomachines, centrifugal pumps, Pelton wheel, Francis and Kaplan turbines, and steam turbines."),
            "Industrial Engineering": ("Industrial Engineering and Management", "O. P. Khanna", "Dhanpat Rai Publications", "17th", 920, "Industrial, Management, Plant Layout, Work Study", "Discusses productivity metrics, work study, plant layout design, inventory control, quality control charts, and ergonomics."),
            "Finite Element Analysis": ("A First Course in the Finite Element Method", "Daryl L. Logan", "Cengage Learning", "6th", 950, "FEA, FEM, Matrix, Stress, Structural Analysis", "An introductory text detailing 1D spring elements, truss structures, beam formulations, 2D plane stress, and thermal modeling."),
            "Mechatronics": ("Mechatronics: Electronic Control Systems in Mechanical and Electrical Engineering", "W. Bolton", "Pearson", "6th", 670, "Mechatronics, Sensors, Actuators, PLC, Control", "Examines sensors, transducers, pneumatic actuators, electrical switches, system response modeling, and PLC programming."),
            "Operations Research": ("Operations Research: An Introduction", "Hamdy A. Taha", "Pearson", "10th", 848, "LPP, Simplex, Queuing, Game Theory", "A standard text on linear programming, simplex methods, transportation algorithms, network flows, queuing systems, and game theory."),

            # Civil subjects
            "Surveying": ("Surveying Vol. I & II", "Dr. B. C. Punmia", "Laxmi Publications", "17th", 980, "Surveying, Leveling, Theodolite, Contour", "Examines chain surveying, compass surveying, leveling, contouring, theodolite surveys, curves, and advanced geodetic surveys."),
            "Engineering Geology": ("Textbook of Engineering Geology", "N. Chenna Kesavulu", "Macmillan Publishers", "2nd", 490, "Geology, Rock, Minerals, Earthquake, Tunnel", "Presents mineralogy, petrology, structural geology, geological investigations for dams, reservoirs, tunnels, and mitigation."),
            "Building Materials and Construction": ("Building Construction", "S. K. Duggal", "McGraw-Hill", "5th", 670, "Cement, Bricks, Concrete, Masonry, Roof", "Examines stone, bricks, tiles, timber, steel, building masonry, plastering, doors, windows, and foundation design."),
            "Structural Analysis": ("Theory of Structures", "S. Ramamrutham", "Dhanpat Rai Publishing", "19th", 990, "Structures, Beams, Trusses, Deflection, Matrix", "Covers determinate and indeterminate structures, slope-deflection methods, moment distribution, and matrix methods of analysis."),
            "Concrete Technology": ("Concrete Technology: Theory and Practice", "M. S. Shetty", "S. Chand Publishing", "8th", 620, "Concrete, Cement, Mix Design, Admixtures", "Explores properties of cement, aggregates, fresh/hardened concrete, admixtures, mix design methodologies, and testing protocols."),
            "Transportation Engineering": ("Highway Engineering", "S. K. Khanna & C. E. G. Justo", "Nem Chand & Bros", "10th", 560, "Highway, Traffic, Pavement, Alignment", "Covers highway alignment planning, geometric design of roads, pavement materials, traffic control, and highway drainage."),
            "Design of Reinforced Concrete Structures": ("Limit State Design of Reinforced Concrete", "Dr. B. C. Punmia & Ashok K. Jain", "Laxmi Publications", "16th", 940, "Concrete, RCC, Beam, Slab, Column", "Examines limit state design philosophy of RCC beams, slabs, columns, footings, retaining walls, and staircases."),
            "Geotechnical Engineering": ("Soil Mechanics and Foundation Engineering", "Dr. K. R. Arora", "Standard Publishers Distributors", "7th", 920, "Soil, Clay, Foundation, Permeability, Compaction", "Presents soil classification, effective stress, seepage analysis, compaction, consolidation, shear strength, and earth pressure theories."),
            "Water Resources Engineering": ("Irrigation and Water Power Engineering", "Dr. B. C. Punmia", "Laxmi Publications", "16th", 1100, "Water, Irrigation, Canal, Dam, Hydrology", "Discusses crop water requirements, canal designs, gravity dams, spillways, flood routing, groundwater hydrology, and water management."),
            "Environmental Engineering": ("Environmental Engineering Vol I & II", "S. K. Garg", "Khanna Publishers", "30th", 1200, "Water Supply, Sewage, Wastewater, Pollution", "Examines water demands, water treatment systems, sewers, wastewater characteristics, sewage treatment, and solid waste disposal."),
            "Design of Steel Structures": ("Design of Steel Structures", "S. K. Duggal", "Cengage Learning", "2nd", 844, "civil, steel, structure, design, concrete", "Examines detailed design criteria for steel frames, load dynamics, tension members, compression structures, and structural integrity under high stress levels."),
            "Estimation, Costing and Valuation": ("Estimating and Costing in Civil Engineering", "B. N. Dutta", "UBS Publishers Distributors", "28th", 850, "Estimation, Costing, Valuation, Tender, Schedule", "Covers detailed estimation of buildings, roads, culverts, analysis of rates, specifications, contracts, and property valuations."),
            "Construction Management": ("Project Planning and Control with PERT & CPM", "Dr. B. C. Punmia & K. K. Khandelwal", "Laxmi Publications", "4th", 480, "Construction, CPM, PERT, Network, Project", "Covers network bar charts, CPM scheduling, PERT probability calculations, resource allocation, and project cost controls."),
            "Advanced Structural Engineering": ("Advanced Structural Analysis", "Devdas Menon", "Alpha Science International", "1st", 450, "Matrix, FEM, Dynamic, Frame", "Covers matrix displacement methods, plastic analysis of frames, structural dynamics, and shear wall behaviors."),
            "Foundation Engineering": ("Basic and Applied Soil Mechanics", "Gopal Ranjan & A. S. R. Rao", "New Age International", "3rd", 800, "Foundation, Pile, Shallow, Bearing Capacity", "Examines bearing capacity of shallow foundations, pile foundations, well foundations, soil exploration, and slope stability analysis."),
            "Quantity Surveying and Contracts": ("Quantity Surveying & Valuation", "P. L. Bhasin", "S. Chand", "3rd", 320, "Quantity, Contract, Tender, Specification", "Explores standard measurements of construction, preparing tender documents, contract laws, arbitration, and specifications."),

            # E&TC subjects
            "Electronic Devices and Circuits": ("Electronic Devices and Circuit Theory", "Robert L. Boylestad & Louis Nashelsky", "Pearson", "11th", 920, "Devices, Diode, Transistors, Amplifier", "Standard textbook on semiconductor diodes, BJT, FET, amplifier circuits, frequency response, and operational amplifiers."),
            "Network Theory": ("Network Analysis", "M. E. Van Valkenburg", "Pearson", "3rd", 520, "Network, Circuits, Transient, Laplace", "Focuses on network equations, Laplace transforms, transient responses, two-port networks, and passive filter designs."),
            "Signals and Systems": ("Signals and Systems", "Alan V. Oppenheim, Alan S. Willsky", "Prentice Hall", "2nd", 950, "signals, systems, fourier, transforms, filters", "Introduction to signals, continuous and discrete time processes, Fourier series analysis, Laplace transforms, and digital filtering structures."),
            "Analog Circuits": ("Microelectronic Circuits", "Adel S. Sedra & Kenneth C. Smith", "Oxford University Press", "7th", 1100, "Analog, Amplifier, Feedback, Op-amp", "Examines differential amplifiers, operational amplifier circuits, feedback loop analysis, oscillators, and power stages."),
            "Microprocessors": ("The Intel Microprocessors", "Barry B. Brey", "Pearson", "8th", 920, "Microprocessor, Intel, Assembly, Hardware", "Detailed reference on 8086/8088 architectures, memory interfacing, I/O programming, and interrupt handlers."),
            "Electromagnetic Engineering": ("Engineering Electromagnetics", "William H. Hayt & John A. Buck", "McGraw-Hill", "8th", 600, "Electromagnetics, Electrostatic, Magnetostatic, Maxwell", "Introduction to electrostatics, magnetostatics, Maxwell equations, transmission line theory, and plane wave propagation."),
            "Control Systems": ("Control Systems Engineering", "Norman S. Nise", "Wiley", "7th", 940, "Control, Feedback, Stability, Root Locus, Nyquist", "Covers modeling physical systems, transient response, steady-state errors, root locus, frequency domain design, and state space."),
            "Digital Communication": ("Digital Communications", "Simon Haykin", "Wiley", "4th", 800, "Communication, Digital, Modulate, Noise", "Discusses information theory, pulse modulation, digital signaling formats, error control codes, and spread spectrum modulation."),
            "Digital Signal Processing": ("Digital Signal Processing: Principles, Algorithms, and Applications", "John G. Proakis & Dimitris G. Manolakis", "Pearson", "4th", 1080, "DSP, Fourier, Filter, FFT", "Covers discrete-time signals, Z-transforms, discrete Fourier transform (DFT), fast Fourier transform (FFT), IIR/FIR filter designs."),
            "Microcontrollers": ("The 8051 Microcontroller and Embedded Systems", "Muhammad Ali Mazidi", "Pearson", "2nd", 620, "8051, Microcontroller, Assembly, Interfacing", "Comprehensive tutorial on 8051 architectural register banks, assembly coding, timer operations, serial communication, and peripherals."),
            "Linear Integrated Circuits": ("Op-Amps and Linear Integrated Circuits", "Ramakant A. Gayakwad", "Pearson", "4th", 560, "Op-amp, Integrated Circuits, Filter, Oscillator", "Explores operational amplifier specifications, active filters, 555 timers, phase-locked loops, and analog-to-digital converters."),
            "VLSI Design": ("CMOS VLSI Design: A Circuits and Systems Perspective", "Neil H. E. Weste & David Money Harris", "Pearson", "4th", 860, "VLSI, CMOS, Circuit, Silicon", "The definitive VLSI text detailing CMOS transistor operations, layout design rules, gate sizing, and sequential circuit architectures."),
            "Wireless Communication": ("Wireless Communications: Principles and Practice", "Theodore S. Rappaport", "Pearson", "2nd", 730, "Wireless, Cellular, Propagation, Channel", "Covers cellular frequency reuses, propagation models, path loss, multipath fading channels, and digital modulation standards."),
            "Embedded Systems": ("Embedded Systems: Architecture, Programming and Design", "Raj Kamal", "McGraw-Hill", "3rd", 680, "Embedded, RTOS, Microcontroller, Drivers", "Examines embedded processor cores, serial buses, device drivers, and real-time operating systems (RTOS)."),
            "Microwave Engineering": ("Microwave Engineering", "David M. Pozar", "Wiley", "4th", 752, "Microwave, Waveguide, Smith Chart, S-parameter", "Examines wave propagation in waveguides, impedance matching, network analysis, passive couplers, resonators, and active devices."),
            "Optical Communication": ("Optical Fiber Communications: Principles and Practice", "John M. Senior", "Pearson", "3rd", 1128, "Optical, Fiber, Laser, Photodiode", "Detailed reference on optical fibers, attenuation, dispersion, light-emitting diodes, lasers, photo detectors, and networks."),
            "Internet of Things (IoT)": ("Internet of Things: A Hands-on Approach", "Arshdeep Bahga & Vijay Madisetti", "Vikas Publishing", "1st", 450, "IoT, Raspberry Pi, Sensors, Cloud", "Introduction to IoT architectures, Raspberry Pi programming, sensor interfacing, web protocols, and cloud storage systems."),
            "Satellite Communication": ("Satellite Communications", "Timothy Pratt & Charles Bostian", "Wiley", "2nd", 550, "Satellite, Orbit, Link Budget, Transponder", "Explores satellite orbits, propagation path losses, link budget calculations, transponders, ground stations, and GPS."),

            # AI & ML / AI & DS subjects
            "Discrete Mathematics": ("Discrete Mathematics and its Applications", "Kenneth H. Rosen", "McGraw-Hill", "8th", 1120, "Math, Discrete, Graph, Logic", "The comprehensive standard for propositional logic, set theory, induction, combinatorics, graph theory, and boolean algebra."),
            "Machine Learning Fundamentals": ("Introduction to Machine Learning", "Ethem Alpaydin", "MIT Press", "4th", 712, "Machine Learning, Algorithms, Classification", "Explores supervised learning, decision trees, Bayesian decision theory, linear discrimination, clustering, and neural networks."),
            "Data Mining & Data Warehousing": ("Data Mining: Concepts and Techniques", "Jiawei Han, Micheline Kamber, Jian Pei", "Elsevier", "3rd", 744, "Mining, Warehouse, Data, Clustering, Association", "Covers data preprocessing, warehouse architectures, association rules, classification models, clustering algorithms, and outlier detection."),
            "Data Warehousing & Data Mining": ("Data Mining: Concepts and Techniques", "Jiawei Han, Micheline Kamber, Jian Pei", "Elsevier", "3rd", 744, "Mining, Warehouse, Data, Clustering, Association", "Covers data preprocessing, warehouse architectures, association rules, classification models, clustering algorithms, and outlier detection."),
            "Natural Language Processing": ("Speech and Language Processing", "Daniel Jurafsky & James H. Martin", "Pearson", "3rd", 820, "NLP, Speech, Language, Grammar, BERT", "The definitive book on text normalization, language modeling, part-of-speech tagging, parsing, semantics, and deep NLP transformers."),
            "Computer Vision": ("Computer Vision: Algorithms and Applications", "Richard Szeliski", "Springer", "2nd", 950, "Vision, Image, Camera, Recognition", "Covers image processing, feature detection, object tracking, camera calibration, 3D reconstructions, and deep neural vision systems."),
            "Reinforcement Learning": ("Reinforcement Learning: An Introduction", "Richard S. Sutton & Andrew G. Barto", "MIT Press", "2nd", 552, "Reinforcement, Q-learning, Policy, MDP", "The classic textbook on Markov decision processes, dynamic programming, temporal-difference learning, Q-learning, and policy gradients."),
            "MLOps": ("Designing Machine Learning Systems", "Chip Huyen", "O'Reilly Media", "1st", 380, "MLOps, System, Deploy, Pipeline", "Focuses on designing end-to-end ML pipelines, feature stores, model training, monitoring, model deployment, and data systems."),
            "Explainable AI": ("Interpretable Machine Learning", "Christoph Molnar", "Lulu.com", "2nd", 320, "XAI, Explainable, Interpretable, SHAP, LIME", "Explores global and local interpretability methods including partial dependence plots, SHAP, LIME, and adversarial explanations."),
            "Data Visualization": ("Interactive Data Visualization for the Web", "Scott Murray", "O'Reilly Media", "2nd", 472, "Visualization, D3, Chart, SVG", "Hands-on introduction to data visualization using SVG, canvas, D3.js libraries, CSS transitions, and interactive graphs."),
            "Big Data Analytics": ("Big Data: Principles and Best Practices of Scalable Real-time Data Systems", "Nathan Marz & James Warren", "Manning Publications", "1st", 328, "Big Data, Lambda Architecture, Hadoop, NoSQL", "Details Lambda architectures, distributed storage, MapReduce processing, real-time database queries, and stream operations.")
        }

        # Helper functions to get cover images and map display names to db objects
        def get_cover_image(subject, keywords):
            sub_lower = subject.lower()
            kw_lower = keywords.lower() if keywords else ""
            if "programming" in sub_lower or "code" in kw_lower or "web" in sub_lower or "software" in sub_lower:
                return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
            elif "math" in sub_lower or "probability" in sub_lower or "statistics" in sub_lower:
                return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400"
            elif "mechanic" in sub_lower or "thermodynamic" in sub_lower or "steel" in sub_lower or "machine" in sub_lower or "structure" in sub_lower or "civil" in sub_lower:
                return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"
            elif "electronic" in sub_lower or "circuit" in sub_lower or "network" in sub_lower or "signal" in sub_lower:
                return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"
            elif "value" in sub_lower or "ethics" in sub_lower or "management" in sub_lower or "english" in sub_lower or "communication" in sub_lower:
                return "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400"
            return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"

        dept_objects = {
            "FE": db.query(models.Department).filter(models.Department.name == "First Year Engineering").first(),
            "Computer": db.query(models.Department).filter(models.Department.name == "Computer Engineering").first(),
            "IT": db.query(models.Department).filter(models.Department.name == "Information Technology Engineering").first(),
            "Mechanical": db.query(models.Department).filter(models.Department.name == "Mechanical Engineering").first(),
            "Civil": db.query(models.Department).filter(models.Department.name == "Civil Engineering").first(),
            "E&TC": db.query(models.Department).filter(models.Department.name == "E&TC Engineering").first(),
            "AI & ML": db.query(models.Department).filter(models.Department.name == "AI & Machine Learning Engineering").first(),
            "AI & DS": db.query(models.Department).filter(models.Department.name == "AI & Data Science Engineering").first()
        }

        books = []
        isbn_counter = 1000000000
        
        # We also want to keep track of subjects we've generated to set rack and shelf allocations cleanly
        rack_allocations = {}  # (dept_key, sem_title) -> rack_counter
        
        for dept_key, sem_list in DEPARTMENT_CURRICULUM.items():
            dept_obj = dept_objects.get(dept_key)
            if not dept_obj:
                continue
                
            for sem_idx, sem_data in enumerate(sem_list):
                sem_title = sem_data["title"]  # "Semester 1", "Semester 2", etc.
                
                # Rack formatting based on department and semester
                rack_key = (dept_key, sem_title)
                if rack_key not in rack_allocations:
                    rack_allocations[rack_key] = len(rack_allocations) + 1
                rack_num = rack_allocations[rack_key]
                
                for sub_idx, subject in enumerate(sem_data["subjects"]):
                    isbn_counter += 1
                    isbn = f"978-0-13-{isbn_counter}"
                    
                    # Check if we have specific details
                    if subject in SUBJECT_DETAILS:
                        title, author, publication, edition, pages, keywords, description = SUBJECT_DETAILS[subject]
                    else:
                        # Fallback for electives and others
                        title = f"Reference Guide to {subject}"
                        author = "Dr. R. K. Sharma"
                        publication = "Tech India Publications"
                        edition = "2nd"
                        pages = 420
                        keywords = f"{subject.lower()}, reference, engineering"
                        description = f"A standard textbook and reference manual specifically designed for the {subject} syllabus, containing multiple solved examples, theoretical derivations, and question banks."

                    cover_image = get_cover_image(subject, keywords)
                    
                    # Specific overrides for the core books to ensure the other logs match exactly
                    if "Programming and Problem Solving" == subject and dept_key == "FE":
                        title = "The C Programming Language"
                        author = "Brian W. Kernighan, Dennis M. Ritchie"
                        publication = "Prentice Hall"
                        edition = "2nd"
                        pages = 272
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/411K54U6UnL._SX379_BO1,204,203,200_.jpg"
                    elif "Database Management Systems" == subject and dept_key == "Computer":
                        title = "Database System Concepts"
                        author = "Abraham Silberschatz, Henry F. Korth"
                        publication = "McGraw-Hill"
                        edition = "6th"
                        pages = 1376
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/51w7r4-2M+L._SX388_BO1,204,203,200_.jpg"
                    elif "Signals and Systems" == subject and dept_key == "E&TC":
                        title = "Signals and Systems"
                        author = "Alan V. Oppenheim, Alan S. Willsky"
                        publication = "Prentice Hall"
                        edition = "2nd"
                        pages = 950
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/41L3iYhGg2L._SX385_BO1,204,203,200_.jpg"
                    elif "Theory of Machines" == subject and dept_key == "Mechanical":
                        title = "Theory of Machines"
                        author = "S. S. Rattan"
                        publication = "Tata McGraw-Hill"
                        edition = "4th"
                        pages = 950
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/51p6FmKj0GL._SX382_BO1,204,203,200_.jpg"

                    # Additional original book values for Algorithms and Steel structures
                    elif "Algorithms" == subject and dept_key == "Computer":
                        title = "Introduction to Algorithms"
                        author = "Thomas H. Cormen, Charles E. Leiserson"
                        publication = "MIT Press"
                        edition = "3rd"
                        pages = 1312
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/41vtv4HjEGL._SX385_BO1,204,203,200_.jpg"
                    elif "Design of Steel Structures" == subject and dept_key == "Civil":
                        title = "Design of Steel Structures"
                        author = "S. K. Duggal"
                        publication = "Cengage Learning"
                        edition = "2nd"
                        pages = 844
                        cover_image = "https://images-na.ssl-images-amazon.com/images/I/516PecBwzTL._SX379_BO1,204,203,200_.jpg"

                    # Make sure quantity & available copies are seeded properly
                    qty = 10 if "Programming" in title or "Database" in title or "Algorithms" in title else 6
                    avail = qty - 2 if "Programming" in title or "Database" in title else qty
                    
                    book_model = models.Book(
                        isbn=isbn,
                        title=title,
                        author=author,
                        publication=publication,
                        edition=edition,
                        department_id=dept_obj.id,
                        subject=subject,
                        semester=sem_title,
                        pages=pages,
                        language="English",
                        cover_image=cover_image,
                        description=description,
                        keywords=keywords,
                        rack_number=f"RACK-{dept_key[:1].upper()}{rack_num}",
                        shelf_number=f"SHELF-0{sub_idx % 4 + 1}",
                        quantity=qty,
                        available_copies=avail,
                        status="Available"
                    )
                    books.append(book_model)
                    
        db.add_all(books)
        db.commit()
        print(f"Seeded {len(books)} books across all departments and semesters.")

        # Re-fetch entities to get IDs
        c_book = db.query(models.Book).filter(models.Book.title.like("%C Programming%")).first()
        db_book = db.query(models.Book).filter(models.Book.title.like("%Database System%")).first()
        sig_book = db.query(models.Book).filter(models.Book.title.like("%Signals and Systems%")).first()
        mach_book = db.query(models.Book).filter(models.Book.title.like("%Theory of Machines%")).first()

        # 5. Seed Borrow logs
        now = datetime.datetime.utcnow()

        # Active borrows (Rahul Sharma)
        borrow1 = models.BorrowedBook(
            student_id=student1.id,
            book_id=c_book.id,
            borrow_date=now - datetime.timedelta(days=5),
            due_date=now + datetime.timedelta(days=10),
            status="Borrowed"
        )
        # Active borrow that is overdue (Priya Patil)
        borrow2 = models.BorrowedBook(
            student_id=student2.id,
            book_id=db_book.id,
            borrow_date=now - datetime.timedelta(days=20),
            due_date=now - datetime.timedelta(days=5), # Overdue by 5 days
            status="Borrowed"
        )
        # Active borrow that is overdue (Amit Kamble)
        borrow3 = models.BorrowedBook(
            student_id=student3.id,
            book_id=sig_book.id,
            borrow_date=now - datetime.timedelta(days=18),
            due_date=now - datetime.timedelta(days=3), # Overdue by 3 days
            status="Borrowed"
        )

        # Historical borrows (returned before due date - credit increase)
        borrow_hist1 = models.BorrowedBook(
            student_id=student1.id,
            book_id=db_book.id,
            borrow_date=now - datetime.timedelta(days=30),
            due_date=now - datetime.timedelta(days=15),
            return_date=now - datetime.timedelta(days=17), # 2 days early
            status="Returned"
        )
        # Historical borrows (returned late - credit decrease)
        borrow_hist2 = models.BorrowedBook(
            student_id=student1.id,
            book_id=mach_book.id,
            borrow_date=now - datetime.timedelta(days=25),
            due_date=now - datetime.timedelta(days=10),
            return_date=now - datetime.timedelta(days=8), # 2 days late
            status="Returned"
        )

        db.add_all([borrow1, borrow2, borrow3, borrow_hist1, borrow_hist2])
        db.commit()
        print("Seeded borrow logs.")

        # 6. Seed credit histories matching the borrow returns
        hist_log1 = models.CreditHistory(
            student_id=student1.id,
            change_amount=2,
            new_score=97,
            reason=f"Book '{db_book.title}' returned early (2 days before due date)",
            timestamp=now - datetime.timedelta(days=17)
        )
        hist_log2 = models.CreditHistory(
            student_id=student1.id,
            change_amount=-10,
            new_score=87,
            reason=f"Book '{mach_book.title}' returned late by 2 days",
            timestamp=now - datetime.timedelta(days=8)
        )
        hist_log3 = models.CreditHistory(
            student_id=student1.id,
            change_amount=8,
            new_score=95,
            reason="Librarian adjustment: Approved standard reset",
            timestamp=now - datetime.timedelta(days=2)
        )
        
        # Credit history for Student 2 (Late penalty log)
        hist_log4 = models.CreditHistory(
            student_id=student2.id,
            change_amount=-25,
            new_score=45,
            reason=f"Damaged book return: 'Introduction to Algorithms'",
            timestamp=now - datetime.timedelta(days=10)
        )

        # Credit history for Student 3 (Late penalty logs)
        hist_log5 = models.CreditHistory(
            student_id=student3.id,
            change_amount=-40,
            new_score=35,
            reason=f"Lost book penalty: 'Design of Steel Structures'",
            timestamp=now - datetime.timedelta(days=12)
        )

        db.add_all([hist_log1, hist_log2, hist_log3, hist_log4, hist_log5])
        db.commit()
        print("Seeded credit logs.")

        # 7. Seed Notifications
        n1 = models.Notification(
            student_id=student1.id,
            message=f"Book Issued: '{c_book.title}' has been successfully issued. Due Date: {(now + datetime.timedelta(days=10)).strftime('%d %B %Y')}.",
            is_read=False
        )
        n2 = models.Notification(
            student_id=student1.id,
            message="Welcome to Collage Library System! Check your current profile and start browsing books.",
            is_read=True
        )
        n3 = models.Notification(
            student_id=student2.id,
            message=f"Overdue Alert: The book '{db_book.title}' is overdue by 5 days. Late penalties are affecting your score.",
            is_read=False
        )
        n4 = models.Notification(
            student_id=student3.id,
            message=f"Overdue Alert: The book '{sig_book.title}' is overdue by 3 days.",
            is_read=False
        )
        db.add_all([n1, n2, n3, n4])
        db.commit()
        print("Seeded notifications.")

        # 8. Seed Announcements
        a1 = models.Announcement(
            title="Library Timings Extended",
            message="Dear Students, in view of the upcoming end-semester examinations, the central library timings are extended from 8:00 AM to 10:00 PM starting from July 20, 2026. Happy learning!",
            created_at=now - datetime.timedelta(days=3)
        )
        a2 = models.Announcement(
            title="New Books Added in IT & AI Section",
            message="Check out the newly added titles in Artificial Intelligence and Machine Learning in Rack I1.",
            created_at=now - datetime.timedelta(days=1)
        )
        db.add_all([a1, a2])
        db.commit()
        print("Seeded announcements.")

        # 9. Seed Reservations
        r1 = models.Reservation(
            student_id=student1.id,
            book_id=mach_book.id,
            status="Pending",
            reservation_date=now - datetime.timedelta(days=1)
        )
        db.add(r1)
        db.commit()
        print("Seeded reservations.")

        print("--- Database seeding completed successfully ---")

    except Exception as e:
        print("An error occurred during seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
