import { Course, RecentActivity, Deadline, GradingQueueItem, UserItem, SystemMetrics, CourseResource } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ds101',
    title: 'Data Science 101',
    instructor: 'Dr. Muhammad Hayan',
    image: 'https://i.ytimg.com/vi/Xnv1yB13GHA/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CIAC0AWKAgwIABABGBggEyh_MA8=&rs=AOn4CLAQKnZFqx4V_ZqR7wnyE76IqAx-pQ',
    progress: 65,
    completedLessons: 24,
    totalLessons: 36,
    category: 'Data Science',
    currentLessonTitle: 'Module 4: Linear Regression',
    currentModuleTitle: 'Module 4: Supervised Learning',
    description: 'Master core data science concepts, probability, linear regression models, and data manipulation in Python and R.',
    enrolledStudentsCount: 1420,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Foundations of Probability & Stats',
        lessons: [
          { id: 'l1', title: 'Welcome & Course Overview', duration: '12 min', completed: true, videoUrl: 'https://youtu.be/sQqniayndb4?si=KXWFlmNfP9omRbCa' },
          { id: 'l2', title: 'Probability Distributions', duration: '28 min', completed: true, videoUrl: 'https://youtu.be/b_ev4Hdzh-U?si=exPejJa-ZwmKmc2k' },
          { id: 'l3', title: 'Hypothesis Testing Basics', duration: '35 min', completed: true, videoUrl: 'https://youtu.be/cJ914xcxOYs?si=WOORtzTcBqI2RSCa' },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Data Wrangling with Pandas',
        lessons: [
          { id: 'l4', title: 'Cleaning Messy Data', duration: '40 min', completed: true , videoUrl: 'https://youtu.be/sQqniayndb4?si=KXWFlmNfP9omRbCa' },
          { id: 'l5', title: 'Feature Engineering', duration: '32 min', completed: true , videoUrl: 'https://youtu.be/b_ev4Hdzh-U?si=exPejJa-ZwmKmc2k' }, 
        ]
      },
      {
        id: 'm3',
        title: 'Module 4: Linear Regression & Correlation',
        lessons: [
          { id: 'l6', title: 'Simple Linear Regression Equations', duration: '25 min', completed: true, videoUrl: 'https://youtu.be/VmbA0pi2cRQ?si=L0lpBsKhH5ene4wY' },
          { id: 'l7', title: 'Multiple Regression & Overfitting', duration: '30 min', completed: false, summary: 'Learn how to detect multi-collinearity and balance bias vs variance in linear models.', videoUrl: 'https://youtu.be/DCAV6LxxbGk?si=9O_49EP_J4l3WQ_K' },
          { id: 'l8', title: 'Evaluating Models with R-Squared', duration: '22 min', completed: false, videoUrl: 'https://youtu.be/LbX4X71-TFI?si=eGkuWe8OLv5E0yUr' },
        ]
      }
    ]
  },
  {
    id: 'course-uiux',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Prof. Momina Hussain',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXXEgbo8yz8dsJc469Wag9wUzj_DS3brnWrcL8OHcCpDjrxzZL9DCldJ-PRwi7BpqabG8okq_LTloB3PAbvO0_Mnf4g6bHoNnrey6W_NIk45FICuRQ-QNNv-G1fNp3N9tMPvDp_wz5CrXFgBbCk77nFB-KWIkPxaTLPqFDEjuWgvvXNxiNbpFLVTgYLLWwRpFfVlFAU_bZRUX1CipZblWzniUA2kt8L1RcJl1KXDASPow8CzsTVrwX65_J_8LyRr144VBUzO3GKuM',
    progress: 42,
    completedLessons: 11,
    totalLessons: 26,
    category: 'Design',
    currentLessonTitle: 'Design Systems & Component Libraries',
    currentModuleTitle: 'Module 2: Interface Systems',
    description: 'Learn wireframing, high-fidelity prototyping, design tokens, optical spacing rules, and usability testing.',
    enrolledStudentsCount: 890,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Design systems and libraries',
        lessons: [
          { id: '1', title: 'Welcome & Course Overview', duration: '12 min', completed: true, videoUrl: 'https://youtu.be/ODpB9-MCa5s?si=mJic7U18lam2QAqy' },
          { id: '2', title: 'UI/UX Designing', duration: '28 min', completed: true, videoUrl: 'https://youtube.com/shorts/TdDhFGQXxkY?si=WIiJHsCE-zKqxkIn' },
        ]
      }
    ]
  },
  {
    id: 'course-webdev',
    title: 'Advanced Web Development',
    instructor: 'Prof. Shahnawaz Qureshi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVak2NwIRbwzngRO8zBRTZ5yTWAR0-lyRRhN2ZLXous8y0YgUrcurrxkvP7eXqtIIUvIucbd9yeZCOT_aEtpeH7CrS4v2b2W-rerxR7Hbf9YghlpAG4EkfZ8PyUjFgpUwWXz8NOU_In6WHnFXGhaoM2a-ynLlvCsRP34f_Zdh2rYufMpNqpVNdq9megQV44zrwXdoUTvjruMgCRhKqA_f7WCQJdiwxpbUJEiX9ydQvoOCvI17ZtzbWzT4Nv6vQld2sNh4KwtKrRg0',
    progress: 88,
    completedLessons: 22,
    totalLessons: 25,
    category: 'Engineering',
    currentLessonTitle: 'Performance Profiling & WebGL Shaders',
    currentModuleTitle: 'Module 5: Optimization',
    description: 'Deep dive into React 19, TypeScript, server rendering architectures, Vite plugin builds, and WebGL canvas shaders.',
    enrolledStudentsCount: 1650,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Async Patterns & Performance',
        lessons: [
          { id: 'l1', title: 'Event Loop & Microtasks', duration: '35 min', completed: true ,videoUrl: 'https://youtu.be/vFJbKR6zfCE?si=7f_zZ1N5r1F2e1gX' },
          { id: 'l2', title: 'Custom WebGL Fragment Shaders', duration: '50 min', completed: true,videoUrl: 'https://youtu.be/46Gt9Q2flDQ?si=ALYHdDoQ-YAvE6xN' },
        ]
      }
    ]
  },
  {
    id: 'course-reactnative',
    title: 'Mobile App Dev (React Native)',
    instructor: 'Prof. Ambreen Noor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKDj8HgtRTUPPEFgE105vvjFFN0lDTKD-7bVpem4gseiVA8dZ5SHVHcWMg41uF6ssLmw-oc4k6johBYESI53G2u3dFR37WMNVCZfFBSmRserttrJdnUKiI6na1lU2VRVdxSIhw_n846ucLtj9u4Ik05S2w9ibk5PGC9srB9_jiwUzFqZ_cd6VUDb9OKG3oMy1E1DW1fhNk3YUuyMWuqRlFwFe7b0KH61d2x4Co_ZC3U78Ra6jVyybWLhVK6kJ-9r48-Dz1S7QhM6g',
    progress: 15,
    completedLessons: 3,
    totalLessons: 20,
    category: 'Mobile',
    currentLessonTitle: 'Setting up Expo & Navigation',
    currentModuleTitle: 'Module 1: Mobile Basics',
    description: 'Cross-platform mobile development using React Native, Reanimated 3, native module bridges, and offline storage.',
    enrolledStudentsCount: 540,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Getting Started with React Native',
        lessons: [
          { id: 'l1', title: 'Component Primitives & Flexbox', duration: '18 min', completed: true ,videoUrl: 'https://youtu.be/ESnrn1kAD4E?si=IcRyInnVLfaFulfw' },
          { id: 'l2', title: 'State & Touch Gestures', duration: '28 min', completed: false ,videoUrl: 'https://youtu.be/ESnrn1kAD4E?si=IcRyInnVLfaFulfw' },
        ]
      }
    ]
  }
];

export const INITIAL_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    title: "You completed 'Introduction to Data Visualization'",
    subtitle: 'Data Science 101 • 2 hours ago',
    time: '14:20',
    type: 'completion'
  },
  {
    id: 'act-2',
    title: 'Instructor Sarah replied to your question',
    subtitle: 'UI/UX Design • 5 hours ago',
    time: '11:05',
    type: 'comment'
  },
  {
    id: 'act-3',
    title: 'Your assignment "Final UI Wireframes" was graded (A+)',
    subtitle: 'UI/UX Design • Yesterday',
    time: '09:15',
    type: 'grade'
  },
  {
    id: 'act-4',
    title: 'New announcement: Live Q&A Session on Thursday',
    subtitle: 'Advanced Web Development • 2 days ago',
    time: '16:45',
    type: 'announcement'
  }
];

export const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'd1',
    title: 'Final UI Project',
    course: 'UI/UX Design Fundamentals',
    dueDate: 'Tomorrow, 11:59 PM',
    dueLabel: 'Tomorrow',
    priority: 'high'
  },
  {
    id: 'd2',
    title: 'Data Analysis Quiz',
    course: 'Data Science 101',
    dueDate: 'Thursday, Oct 12',
    dueLabel: 'In 3 days',
    priority: 'medium'
  },
  {
    id: 'd3',
    title: 'React Basics Submission',
    course: 'Advanced Web Development',
    dueDate: 'Monday, Oct 16',
    dueLabel: 'Next week',
    priority: 'low'
  }
];

export const INITIAL_GRADING_QUEUE: GradingQueueItem[] = [
  {
    id: 'g1',
    title: 'Midterm Project: AI & Data science',
    course: 'Linear regression',
    submissionsCount: 24,
    dueDateLabel: 'Due in 2 days',
    type: 'project',
    status: 'pending'
  },
  {
    id: 'g2',
    title: 'Weekly Quiz #4: RAG chatbots',
    course: 'RAGBOTS:RAG AI ',
    submissionsCount: 158,
    dueDateLabel: 'Auto-graded pending review',
    type: 'quiz',
    isAutoGraded: true,
    status: 'pending'
  }
];

export const INITIAL_USERS: UserItem[] = [
  {
    id: 'u1',
    name: 'Khalid Hussain',
    email: 'k.hussain@titan.edu',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9BCPzJu5UkpFUgCRSIUph2TVCefepdrYOAzNhg2iaIM-J0PMx2zgIWeE&s=10',
    role: 'STUDENT',
    status: 'Active',
    joinedDate: 'Oct 12, 2023',
    performanceLabel: 'GPA',
    performancePercent: 82
  },
  {
    id: 'u2',
    name: 'Dr. Sarah',
    email: 'sarah@faculty.edu',
    avatar: 'https://t4.ftcdn.net/jpg/04/42/52/59/360_F_442525963_7F1PYJnhv0ABoiXO6o1KSmeAKgJt0dJf.jpg',
    role: 'TEACHER',
    status: 'Active',
    joinedDate: 'Jan 05, 2022',
    performanceLabel: 'Rating',
    performancePercent: 94
  },
  {
    id: 'u3',
    name: 'Hassan Khan',
    email: 'khan_hassan@edutech.pro',
    role: 'STUDENT',
    status: 'Suspended',
    joinedDate: 'Mar 22, 2024',
    performanceLabel: 'Completion',
    performancePercent: 12
  },
  {
    id: 'u4',
    name: 'Syeda Umaima',
    email: 'syeda_umaima@edutech.pro',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMWoU6XeBavLXJGpPkN_mvznM4KsopLZjrlmT-VezruQ&s=10',
    role: 'STUDENT',
    status: 'Active',
    joinedDate: 'Feb 10, 2024',
    performanceLabel: 'GPA',
    performancePercent: 91
  },
  {
    id: 'u5',
    name: 'Dawood Malik',
    email: 'd_malik@faculty.edu',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROq1IsZTqOl93DIf8sqF-asufq94IrHASt0ZkRYVKSsA&s=10',
    role: 'TEACHER',
    status: 'Active',
    joinedDate: 'Aug 14, 2021',
    performanceLabel: 'Rating',
    performancePercent: 98
  }
];

export const INITIAL_METRICS: SystemMetrics = {
  cpu: 24,
  memory: 68,
  diskLatency: 12,
  uptime: '99.98%',
  monthlyRevenue: 142840.00,
  revenueTarget: 150000.00,
  revenueAchievement: 95,
  totalStudents: 24512,
  activeCourses: 842
};

export const INITIAL_RESOURCES: CourseResource[] = [
  {
    id: 'res-1',
    courseId: 'course-ds101',
    courseTitle: 'Data Science 101',
    title: 'Linear Regression & Matrix Calculus Handbook',
    description: 'Complete mathematical formulations for Ordinary Least Squares (OLS), gradient descent steps, and matrix derivations.',
    type: 'pdf',
    fileSize: '4.8 MB',
    downloadUrl: '#',
    author: 'Dr. Muhammad Hayan',
    dateAdded: 'Oct 14, 2025',
    category: 'Lecture Notes',
    bookmarked: true,
    downloadsCount: 342
  },
  {
    id: 'res-2',
    courseId: 'course-ds101',
    courseTitle: 'Data Science 101',
    title: 'Module 4 Presentation: Regression & Model Evaluation',
    description: 'Official slide deck covering multi-collinearity, adjusted R-squared, residual analysis, and bias-variance tradeoff.',
    type: 'slides',
    fileSize: '12.4 MB',
    downloadUrl: '#',
    author: 'Dr. Muhammad Hayan',
    dateAdded: 'Oct 18, 2025',
    category: 'Slide Decks',
    bookmarked: false,
    downloadsCount: 289
  },
  {
    id: 'res-3',
    courseId: 'course-ds101',
    courseTitle: 'Data Science 101',
    title: 'Interactive Google Colab GPU Notebooks Repository',
    description: 'Hands-on Python notebooks pre-configured with PyTorch, Scikit-Learn, and Pandas datasets for regression labs.',
    type: 'link',
    externalUrl: 'https://colab.research.google.com',
    author: 'TITAN AI Faculty',
    dateAdded: 'Oct 20, 2025',
    category: 'Interactive Labs',
    bookmarked: true,
    downloadsCount: 512
  },
  {
    id: 'res-4',
    courseId: 'course-ds101',
    courseTitle: 'Data Science 101',
    title: 'Lab 03: Feature Engineering Starter Code Zip',
    description: 'Source code skeleton containing synthetic housing datasets, outlier filtering functions, and model evaluation benchmarks.',
    type: 'code',
    fileSize: '2.1 MB',
    downloadUrl: '#',
    author: 'Dr. Muhammad Hayan',
    dateAdded: 'Oct 22, 2025',
    category: 'Code Assets',
    bookmarked: false,
    downloadsCount: 198
  },
  {
    id: 'res-5',
    courseId: 'course-uiux',
    courseTitle: 'UI/UX Design Fundamentals',
    title: 'Optical Spacing & Typography Token Reference Sheet',
    description: 'A comprehensive visual guide detailing 8px spatial rhythms, WCAG AA contrast pairings, and nested radius formulas.',
    type: 'pdf',
    fileSize: '3.2 MB',
    downloadUrl: '#',
    author: 'Sarah Ali',
    dateAdded: 'Sep 28, 2025',
    category: 'Design Guides',
    bookmarked: true,
    downloadsCount: 410
  },
  {
    id: 'res-6',
    courseId: 'course-uiux',
    courseTitle: 'UI/UX Design Fundamentals',
    title: 'Figma Token Library & Responsive Layout Wireframes',
    description: 'External link to the official TITAN Figma UI Component kit with auto-layout v5 components and variable tokens.',
    type: 'link',
    externalUrl: 'https://figma.com',
    author: 'Sarah Ali',
    dateAdded: 'Oct 02, 2025',
    category: 'Design Systems',
    bookmarked: false,
    downloadsCount: 630
  },
  {
    id: 'res-7',
    courseId: 'course-uiux',
    courseTitle: 'UI/UX Design Fundamentals',
    title: 'Usability Heuristics & User Interview Worksheet',
    description: 'Printable evaluation matrix to record user pain points, severity ratings, and task completion times during usability testing.',
    type: 'worksheet',
    fileSize: '1.5 MB',
    downloadUrl: '#',
    author: 'Sarah Ali',
    dateAdded: 'Oct 10, 2025',
    category: 'Worksheets',
    bookmarked: false,
    downloadsCount: 154
  },
  {
    id: 'res-8',
    courseId: 'course-webdev',
    courseTitle: 'Advanced Web Development',
    title: 'Custom WebGL Shader Architecture & Matrix Math',
    description: 'Detailed PDF guide explaining fragment shaders, GLSL uniform buffers, vertex attributes, and frame rate optimization.',
    type: 'pdf',
    fileSize: '6.1 MB',
    downloadUrl: '#',
    author: 'Dawood Malik',
    dateAdded: 'Nov 01, 2025',
    category: 'Technical Papers',
    bookmarked: true,
    downloadsCount: 275
  },
  {
    id: 'res-9',
    courseId: 'course-webdev',
    courseTitle: 'Advanced Web Development',
    title: 'Vite & ESBuild Production Bundle Configuration Deck',
    description: 'Slides on CommonJS/ESM bundling, tree-shaking, code-splitting strategies, and containerized dev environments.',
    type: 'slides',
    fileSize: '15.8 MB',
    downloadUrl: '#',
    author: 'Dawood Malik',
    dateAdded: 'Nov 05, 2025',
    category: 'Slide Decks',
    bookmarked: false,
    downloadsCount: 190
  },
  {
    id: 'res-10',
    courseId: 'course-webdev',
    courseTitle: 'Advanced Web Development',
    title: 'MDN WebGL & Shader Reference Documentation',
    description: 'Curated external developer links to Mozilla Developer Network API docs for Canvas2D, WebGL2, and Web Audio.',
    type: 'link',
    externalUrl: 'https://developer.mozilla.org',
    author: 'Dawood Malik',
    dateAdded: 'Nov 08, 2025',
    category: 'API Docs',
    bookmarked: false,
    downloadsCount: 380
  }
];

