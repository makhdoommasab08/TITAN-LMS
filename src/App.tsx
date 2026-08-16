import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Role, Course, GradingQueueItem, UserItem, Deadline, CourseResource, Quiz, QuizAttempt, Assignment, AssignmentSubmission, LeaveRequest } from './types';
import {
  INITIAL_COURSES,
  INITIAL_ACTIVITIES,
  INITIAL_DEADLINES,
  INITIAL_GRADING_QUEUE,
  INITIAL_USERS,
  INITIAL_METRICS,
  INITIAL_RESOURCES,
} from './data/mockData';
import { VideoAnalysisView } from './components/VideoAnalysisView';

import { BackgroundShader } from './components/BackgroundShader';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboardView } from './components/StudentDashboardView';
import { StudentAttendanceView } from './components/StudentAttendanceView';
import { CourseResourcesView } from './components/CourseResourcesView';
import { TeacherOverviewView } from './components/TeacherOverviewView';
import { TeacherAttendanceView } from './components/TeacherAttendanceView';
import { AdminPortalView } from './components/AdminPortalView';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { GradingModal } from './components/GradingModal';
import { OnboardTeacherModal } from './components/OnboardTeacherModal';
import { CalendarModal } from './components/CalendarModal';
import { UserProfileModal, UserProfile } from './components/UserProfileModal';
import { CertificatesModal } from './components/CertificatesModal';
import { AuthScreen } from './components/AuthScreen';
import { GeminiChatbot } from './components/GeminiChatbot';
import { ToastAlert } from './components/ToastAlert';
import { StudyPlannerView } from './components/StudyPlannerView';
import { TeacherQuizzesView } from './components/TeacherQuizzesView';
import { StudentQuizzesView } from './components/StudentQuizzesView';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { StudentAssignmentsView } from './components/StudentAssignmentsView';
import { TeacherAssignmentsView } from './components/TeacherAssignmentsView';
import { LeaderboardProvider } from './context/LeaderboardContext';

const ThemeTransitionOverlay = ({ isDark }: { isDark: boolean }) => (
  <AnimatePresence initial={false}>
    <motion.div
      key={isDark ? 'dark' : 'light'}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`fixed inset-0 z-[99999] pointer-events-none ${isDark ? 'bg-slate-50' : 'bg-zinc-950'}`}
    />
  </AnimatePresence>
);

export default function App() {
  const [role, setRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('titan_auth_logged_in') === 'true';
  });

  const handleLogin = (
    selectedRole: Role,
    userDetails: { name: string; email: string; id: string; avatar?: string }
  ) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    localStorage.setItem('titan_auth_logged_in', 'true');
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        name: userDetails.name,
        email: userDetails.email,
        studentId: userDetails.id,
        avatar: userDetails.avatar || prev.avatar,
      };
      localStorage.setItem('titan_user_profile', JSON.stringify(updated));
      return updated;
    });
    showToast(`Welcome, ${userDetails.name}!`, `Authenticated to TITAN Portal as ${selectedRole.toUpperCase()}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('titan_auth_logged_in');
    showToast('Signed Out', 'You have been logged out of TITAN Portal.');
  };

  // Global Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('titan_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Collapsible Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('titan_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('titan_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('titan_theme', nextTheme);
    showToast(
      `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`,
      'Visual theme interface updated.'
    );
  };

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('titan_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    return {
      name: 'Masab Bin Abdul Rehman',
      email: 'masab_abdul.rehman@titan.edu.pk',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10',
      bio: 'Computer Science & Artificial Intelligence student at Taj Institute of Technology & Applied Networks.',
      studentId: 'TITAN-2025-468858',
      department: 'Department of Applied Networks & AI',
      joinedDate: 'Fall 2025',
      gpa: '3.92'
    };
  });

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('titan_user_profile', JSON.stringify(updated));
    showToast('Profile Updated Successfully!', `Saved details for ${updated.name}`);
  };

  // Data States
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [gradingQueue, setGradingQueue] = useState<GradingQueueItem[]>(INITIAL_GRADING_QUEUE);
  const [users, setUsers] = useState<UserItem[]>(() => {
    const saved = localStorage.getItem('titan_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [metrics] = useState(INITIAL_METRICS);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('titan_leave_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'leave-101',
        studentId: 'TITAN-2026-889123',
        studentName: 'Alex Rivers',
        studentEmail: 'alex@titan.edu',
        course: 'CS101 • Advanced AI',
        startDate: '2026-08-10',
        endDate: '2026-08-12',
        reasonCategory: 'Medical',
        reasonDetails: 'Scheduled dental procedure requiring 2 days of home rest.',
        status: 'Pending',
        submittedAt: '2026-08-01 09:30 AM'
      }
    ];
  });

  const handleApplyLeave = (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newReq, ...leaveRequests];
    setLeaveRequests(updated);
    localStorage.setItem('titan_leave_requests', JSON.stringify(updated));
    showToast('Leave Request Dispatched!', `Absence application sent to Admin Portal for review.`);
  };

  const handleApproveLeave = (id: string, comment?: string) => {
    const updated = leaveRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Approved' as const,
          reviewComment: comment || 'Approved by Academic Admin Board',
          reviewedBy: 'Academic Admin Board',
          reviewedAt: new Date().toLocaleString()
        };
      }
      return r;
    });
    setLeaveRequests(updated);
    localStorage.setItem('titan_leave_requests', JSON.stringify(updated));
    showToast('Leave Approved!', `Request ${id} status updated to Approved.`);
  };

  const handleRejectLeave = (id: string, comment?: string) => {
    const updated = leaveRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Rejected' as const,
          reviewComment: comment || 'Rejected due to administrative policy.',
          reviewedBy: 'Academic Admin Board',
          reviewedAt: new Date().toLocaleString()
        };
      }
      return r;
    });
    setLeaveRequests(updated);
    localStorage.setItem('titan_leave_requests', JSON.stringify(updated));
    showToast('Leave Application Rejected', `Request ${id} status updated to Rejected.`);
  };


  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const savedProfile = localStorage.getItem('titan_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        const savedEnrolled = localStorage.getItem(`titan_enrolled_${parsed.studentId}`);
        if (savedEnrolled) return JSON.parse(savedEnrolled);
        if (parsed.isNewStudent) return [];
      } catch (e) {
        console.error(e);
      }
    }
    return ['course-ds101', 'course-uiux', 'course-webdev', 'course-reactnative'];
  });

  const handleEnrollCourse = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      showToast('Already Enrolled', 'You are already enrolled in this course.');
      return;
    }
    const updated = [...enrolledCourseIds, courseId];
    setEnrolledCourseIds(updated);
    if (userProfile?.studentId) {
      localStorage.setItem(`titan_enrolled_${userProfile.studentId}`, JSON.stringify(updated));
    }
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          progress: 0,
          completedLessons: 0,
        };
      }
      return c;
    }));

    const courseObj = courses.find(c => c.id === courseId);
    showToast('Enrolled in Course!', `Successfully enrolled in ${courseObj?.title || 'Program'}. It is now live on your dashboard.`);
  };

  const handleRegisterStudent = (userDetails: { name: string; email: string; id: string; avatar?: string; isNewStudent?: boolean }) => {
    const newProfile: UserProfile = {
      name: userDetails.name,
      email: userDetails.email,
      avatar: userDetails.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10',
      bio: `Enrolled student at Taj Institute of Technology & Applied Networks (${userDetails.id}).`,
      studentId: userDetails.id,
      department: 'Department of Computer Science & Artificial Intelligence',
      joinedDate: 'Spring 2026 (New Student)',
      gpa: '0.00',
      isNewStudent: true,
    };

    setUserProfile(newProfile);
    localStorage.setItem('titan_user_profile', JSON.stringify(newProfile));

    setEnrolledCourseIds([]);
    localStorage.setItem(`titan_enrolled_${userDetails.id}`, JSON.stringify([]));

    localStorage.setItem(`titan_attendance_${userDetails.id}`, JSON.stringify({ attendedCount: 0, totalCount: 0, logs: [] }));

    const newUserItem: UserItem = {
      id: `u-${Date.now()}`,
      name: userDetails.name,
      email: userDetails.email,
      avatar: newProfile.avatar,
      role: 'STUDENT',
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      performanceLabel: 'GPA',
      performancePercent: 0
    };

    setUsers((prev) => {
      const updated = [newUserItem, ...prev];
      localStorage.setItem('titan_users', JSON.stringify(updated));
      return updated;
    });

    handleLogin('student', userDetails);
    showToast('Fresh Student Portal Initialized!', `Welcome ${userDetails.name}! Please explore and enroll in courses to populate your dashboard.`);
  };
  const [streakDays] = useState(5);

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('titan_quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('titan_quiz_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('titan_assignments');
    if (saved) return JSON.parse(saved);
    // Seed some initial assignments
    return [
      { id: 'a1', title: 'Chapter 4 Problem Set', courseTitle: 'Algebra II', description: 'Solve equations on pages 45-48.', dueDate: '2026-08-01', createdAt: new Date().toISOString() },
      { id: 'a2', title: 'Lab Report: Pendulum', courseTitle: 'Physics', description: 'Write up the pendulum lab experiment.', dueDate: '2026-08-05', createdAt: new Date().toISOString() }
    ];
  });

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('titan_assignment_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateAssignment = (newAssignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: `a-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [assignment, ...assignments];
    setAssignments(updated);
    localStorage.setItem('titan_assignments', JSON.stringify(updated));
    showToast('Assignment Posted', `Successfully created ${assignment.title}`);
  };

  const handleSubmitAssignment = (assignmentId: string, content: string) => {
    const submission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId: userProfile.studentId,
      studentName: userProfile.name,
      content,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString()
    };
    const updated = [...assignmentSubmissions, submission];
    setAssignmentSubmissions(updated);
    localStorage.setItem('titan_assignment_submissions', JSON.stringify(updated));
    showToast('Submission Complete', 'Your assignment has been sent for evaluation.');
  };

  const handleGradeAssignmentSubmission = (submissionId: string, score: number, feedback: string) => {
    const updated = assignmentSubmissions.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'graded', score, feedback } : sub
    );
    setAssignmentSubmissions(updated);
    localStorage.setItem('titan_assignment_submissions', JSON.stringify(updated));
    showToast('Grading Complete', 'Submission has been evaluated successfully.');
  };

  const handleCreateQuiz = (quiz: Quiz) => {
    const updated = [quiz, ...quizzes];
    setQuizzes(updated);
    localStorage.setItem('titan_quizzes', JSON.stringify(updated));
    showToast('Quiz Created', `Generated AI Quiz: ${quiz.title}`);
  };

  const handleSubmitQuizAttempt = (attempt: QuizAttempt) => {
    const updated = [attempt, ...quizAttempts];
    setQuizAttempts(updated);
    localStorage.setItem('titan_quiz_attempts', JSON.stringify(updated));
    showToast('Quiz Submitted', 'Your attempt has been submitted for evaluation.');
  };

  const handleGradeQuizAttempt = (attemptId: string, score: number) => {
    const updated = quizAttempts.map(a => 
      a.id === attemptId ? { ...a, score, status: 'graded' as const } : a
    );
    setQuizAttempts(updated);
    localStorage.setItem('titan_quiz_attempts', JSON.stringify(updated));
    showToast('Attempt Graded', `Assigned score of ${score}`);
  };

  // Resources State with persistence
  const [resources, setResources] = useState<CourseResource[]>(() => {
    const saved = localStorage.getItem('titan_course_resources');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse resources from localStorage:', e);
      }
    }
    return INITIAL_RESOURCES;
  });

  const handleToggleBookmarkResource = (resourceId: string) => {
    setResources((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== resourceId) return r;
        const isNowBookmarked = !r.bookmarked;
        showToast(
          isNowBookmarked ? 'Resource Bookmarked ★' : 'Bookmark Removed',
          `"${r.title}"`
        );
        return { ...r, bookmarked: isNowBookmarked };
      });
      localStorage.setItem('titan_course_resources', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddResource = (newResource: Omit<CourseResource, 'id' | 'downloadsCount'>) => {
    const item: CourseResource = {
      ...newResource,
      id: `res-${Date.now()}`,
      downloadsCount: 0,
    };
    setResources((prev) => {
      const updated = [item, ...prev];
      localStorage.setItem('titan_course_resources', JSON.stringify(updated));
      return updated;
    });
  };

  // Modal States
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedGradingItem, setSelectedGradingItem] = useState<GradingQueueItem | null>(null);
  const [actionModalType, setActionModalType] = useState<
    'teacher' | 'lesson' | 'announcement' | 'settings' | null
  >(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);

  // Toast Alert State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    subtitle?: string;
  }>({
    isVisible: false,
    message: '',
  });

  const showToast = (message: string, subtitle?: string) => {
    setToast({ isVisible: true, message, subtitle });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };


  // Course Lesson Progress Toggle
  const handleToggleLesson = (courseId: string, lessonId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules?.map((m) => {
          const updatedLessons = m.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: !l.completed } : l
          );
          return { ...m, lessons: updatedLessons };
        });

        const total = c.totalLessons || 1;
        const completedCount =
          updatedModules?.reduce(
            (acc, mod) => acc + mod.lessons.filter((l) => l.completed).length,
            0
          ) || c.completedLessons;

        const newProgress = Math.min(100, Math.round((completedCount / total) * 100));

        return {
          ...c,
          completedLessons: completedCount,
          progress: newProgress,
          modules: updatedModules,
        };
      })
    );

    showToast('Lesson progress updated!', 'Your activity stats reflect this change.');
  };

  // Grade Submission
  const handleGradeSubmit = (itemId: string, score: string, feedback: string) => {
    setGradingQueue((prev) => prev.filter((g) => g.id !== itemId));
    showToast(`Graded submission! Score: ${score}/100`, `Feedback: "${feedback.slice(0, 30)}..."`);
  };

  // Onboard Action Submit
  const handleActionSubmit = (field1: string, field2: string, field3?: string) => {
    if (actionModalType === 'teacher') {
      const newUser: UserItem = {
        id: `u-${Date.now()}`,
        name: field1,
        email: `${field1.toLowerCase().replace(/\s+/g, '.')}@titan.edu.pk`,
        role: 'TEACHER',
        status: 'Active',
        joinedDate: 'Just now',
        performanceLabel: 'Rating',
        performancePercent: 100,
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast(`Onboarded TITAN Faculty: ${field1}`, `Specialization: ${field2}`);
    } else if (actionModalType === 'announcement') {
      showToast(`Broadcast Sent: "${field1}"`, field2);
    } else if (actionModalType === 'lesson') {
      setCourses(prev => {
        const newCourse = {
          id: `course-${Date.now()}`,
          title: field1,
          instructor: userProfile.name || 'Faculty',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTAE_4Ct02_hWHsgCetQeLEk-zG3ruMvVHfhlBfahvhA&s=10',
          progress: 0,
          completedLessons: 0,
          totalLessons: 1,
          category: 'New Course',
          currentLessonTitle: field1,
          currentModuleTitle: 'Module 1',
          description: field2,
          enrolledStudentsCount: 0,
          modules: [
            {
              id: `m-${Date.now()}`,
              title: 'Module 1',
              lessons: [
                {
                  id: `l-${Date.now()}`,
                  title: field1,
                  duration: '15 min',
                  completed: false,
                  summary: field2,
                  videoUrl: field3
                }
              ]
            }
          ]
        };
        return [newCourse as any, ...prev];
      });
      showToast(`Created New TITAN Course: "${field1}"`, field2);
    } else {
      showToast('Settings saved successfully.', field1);
    }
  };

  // User Actions (Suspend/Activate)
  const handleUserAction = (userId: string, action: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: newStatus };
      })
    );
    showToast(`User status updated to ${action}`);
  };

  // Add Calendar Deadline
  const handleAddDeadline = (title: string, course: string, dueDate: string) => {
    const newDl: Deadline = {
      id: `d-${Date.now()}`,
      title,
      course,
      dueDate,
      dueLabel: 'Scheduled',
      priority: 'medium',
    };
    setDeadlines((prev) => [newDl, ...prev]);
    showToast(`Added Event: ${title}`, `Due: ${dueDate}`);
  };

  // Filter Courses by search query & student enrollments
  const userEnrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const filteredCourses = (role === 'student' ? userEnrolledCourses : courses).filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = theme === 'dark';

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen font-body relative transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
      }`}>
        <ThemeTransitionOverlay isDark={isDark} />
        {isDark && <BackgroundShader />}
        <AuthScreen
          onLogin={handleLogin}
          onRegisterStudent={handleRegisterStudent}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ToastAlert message={toast.message} subtitle={toast.subtitle} isVisible={toast.isVisible} onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))} />
      </div>
    );
  }

  return (
    <LeaderboardProvider quizAttempts={quizAttempts} currentUserName={userProfile?.name || 'Student'}>
      <div className={`min-h-screen font-body selection:bg-indigo-500 selection:text-white relative transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
      }`}>
        <ThemeTransitionOverlay isDark={isDark} />
        {/* Background Animated WebGL Canvas Shader in Dark Mode */}
        {isDark && <BackgroundShader />}

        <div className="relative z-10 flex min-h-screen">
        {/* Navigation Sidebar */}
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onUpgradeClick={() => showToast('TITAN Network Pro', 'Academic tools and faculty features active!')}
          onHelpClick={() => showToast('Taj Institute Support', 'Help desk notified!')}
          theme={theme}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCertificates={() => setIsCertificatesOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className={`flex-1 relative min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          {/* Top Bar Navigation */}
          <Navbar
            role={role}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            unreadNotifications={2}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebarCollapse={handleToggleSidebarCollapse}
            userProfile={userProfile}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />

          {/* View Container */}
          <div className="flex-1 relative overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${role}-${activeTab}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-h-full"
              >
                {/* STUDENT VIEWS */}
            {role === 'student' && activeTab === 'dashboard' && (
              <StudentDashboardView
                courses={filteredCourses}
                allAvailableCourses={courses}
                activities={activities}
                deadlines={deadlines}
                onCourseClick={(course) => setSelectedCourse(course)}
                onEnrollCourse={handleEnrollCourse}
                onOpenAnalytics={() => setIsAnalyticsOpen(true)}
                onOpenCalendar={() => setIsCalendarOpen(true)}
                streakDays={streakDays}
                theme={theme}
                userProfile={userProfile}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenCertificates={() => setIsCertificatesOpen(true)}
                onOpenResources={() => setActiveTab('resources')}
                onOpenStudyPlanner={() => setActiveTab('study_planner')}
              />
            )}

            {role === 'student' && activeTab === 'study_planner' && (
              <StudyPlannerView
                courses={courses}
                deadlines={deadlines}
                theme={theme}
                userName={userProfile?.name?.split(' ')[0] || 'Alex'}
              />
            )}

            {role === 'student' && activeTab === 'quizzes' && (
              <StudentQuizzesView
                courses={courses}
                quizzes={quizzes}
                attempts={quizAttempts}
                theme={theme}
                onSubmitAttempt={handleSubmitQuizAttempt}
                studentId={userProfile.studentId}
                studentName={userProfile.name}
              />
            )}

            {role === 'student' && activeTab === 'courses' && (
              <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-6 border-x min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">My Enrolled Courses</h1>
                    <p className={`font-body text-sm mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Access your registered TITAN subjects, lectures, and interactive materials.
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                    {filteredCourses.length} Registered Courses
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`group border rounded-[2rem] p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] ${
                        theme === 'dark'
                          ? 'bg-zinc-900 border-zinc-800 hover:border-indigo-500 text-white'
                          : 'bg-white border-zinc-200 hover:border-indigo-400 text-zinc-900 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full text-[10px] font-mono font-bold tracking-wider">
                            {course.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-500">
                            {course.progress}%
                          </span>
                        </div>
                        <h3 className="font-headline text-lg font-bold group-hover:text-indigo-500 transition-colors mb-2">
                          {course.title}
                        </h3>
                        <p className={`text-xs line-clamp-2 mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="flex justify-between text-xs font-mono">
                          <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
                            {course.instructor}
                          </span>
                          <span className="font-bold">{course.completedLessons}/{course.totalLessons} Lessons</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <button className="w-full mt-2 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2">
                          <span>Continue Course</span>
                          <span className="material-symbols-outlined text-base">play_circle</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}            {role === 'student' && activeTab === 'assignments' && (
              <StudentAssignmentsView
                courses={courses}
                assignments={assignments}
                submissions={assignmentSubmissions}
                onSubmitAssignment={handleSubmitAssignment}
                studentId={userProfile.studentId}
                theme={theme}
              />
            )}
            
            {role === 'student' && activeTab === 'grades' && (
              <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-6 border-x min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Academic Grades & Progress</h1>
                    <p className={`font-body text-sm mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Comprehensive GPA metrics, attendance records, and transcript analytics.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAnalyticsOpen(true)}
                    className="px-4 py-2 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">analytics</span>
                    Detailed Chart Analytics
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className={`p-6 border rounded-[2rem] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <p className="text-xs font-mono tracking-wider text-zinc-500">Cumulative GPA</p>
                    <h2 className="text-4xl font-bold font-headline mt-2 text-indigo-500">3.92 / 4.0</h2>
                    <p className="text-xs text-emerald-500 font-mono mt-2">✦ Top 5% of Department</p>
                  </div>
                  <div className={`p-6 border rounded-[2rem] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <p className="text-xs font-mono tracking-wider text-zinc-500">Credits Completed</p>
                    <h2 className="text-4xl font-bold font-headline mt-2 text-emerald-500">42 / 60</h2>
                    <p className="text-xs text-zinc-400 font-mono mt-2">70% Degree Completion</p>
                  </div>
                  <div className={`p-6 border rounded-[2rem] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <p className="text-xs font-mono tracking-wider text-zinc-500">Class Attendance</p>
                    <h2 className="text-4xl font-bold font-headline mt-2 text-amber-500">98.4%</h2>
                    <p className="text-xs text-emerald-500 font-mono mt-2">Perfect Record</p>
                  </div>
                </div>
              </div>
            )}

            {role === 'student' && activeTab === 'attendance' && (
              <StudentAttendanceView
                theme={theme}
                onShowToast={showToast}
                userProfile={userProfile}
                leaveRequests={leaveRequests}
                onApplyLeave={handleApplyLeave}
              />
            )}

            {role === 'student' && activeTab === 'resources' && (
              <CourseResourcesView
                resources={resources}
                courses={courses}
                onToggleBookmark={handleToggleBookmarkResource}
                onAddResource={handleAddResource}
                theme={theme}
                onShowToast={showToast}
              />
            )}

            {/* TEACHER VIEWS */}
            {role === 'teacher' && activeTab === 'dashboard' && (
              <TeacherOverviewView
                courses={filteredCourses}
                gradingQueue={gradingQueue}
                onOpenGrading={(item) => setSelectedGradingItem(item)}
                onCreateLesson={() => setActionModalType('lesson')}
                onPostAnnouncement={() => setActionModalType('announcement')}
                onInviteStudents={() => setActionModalType('teacher')}
                theme={theme}
              />
            )}

            {role === 'teacher' && activeTab === 'library' && (
              <CourseResourcesView
                resources={resources}
                courses={courses}
                onToggleBookmark={handleToggleBookmarkResource}
                onAddResource={handleAddResource}
                theme={theme}
                onShowToast={showToast}
              />
            )}

            {role === 'teacher' && activeTab === 'attendance' && (
              <TeacherAttendanceView theme={theme} onShowToast={showToast} />
            )}

            {role === 'teacher' && activeTab === 'students' && (
              <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-6 border-x min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Classroom Roster & Students</h1>
                    <p className={`font-body text-sm mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Monitor student progress across Grade 11-A, 11-B, Calculus, and Physics.
                    </p>
                  </div>
                  <button
                    onClick={() => setActionModalType('teacher')}
                    className="px-4 py-2 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Invite Student
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.filter(u => u.role === 'STUDENT').map((student) => (
                    <div
                      key={student.id}
                      className={`p-5 border rounded-[2rem] flex items-center justify-between gap-4 ${
                        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-500 font-mono font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-sm">{student.name}</h3>
                          <p className={`text-xs font-mono ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{student.email}</p>
                          <span className="text-[10px] font-mono text-emerald-500 font-semibold">{student.performancePercent}% Mastery Score</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Report generated for ${student.name}`, 'Downloaded student progress dossier.')}
                        className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-mono"
                        title="View Report"
                      >
                        <span className="material-symbols-outlined text-base">analytics</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {role === 'teacher' && activeTab === 'assignments' && (
              <TeacherAssignmentsView
                courses={courses}
                assignments={assignments}
                submissions={assignmentSubmissions}
                onCreateAssignment={handleCreateAssignment}
                onGradeSubmission={handleGradeAssignmentSubmission}
                theme={theme}
              />
            )}
            
            {role === 'teacher' && activeTab === 'schedule' && (
              <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-6 border-x min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Faculty Schedule & Calendar</h1>
                    <p className={`font-body text-sm mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Lecture slots, office hours, and assessment schedules.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCalendarOpen(true)}
                    className="px-4 py-2 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    Open Full Calendar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Monday', 'Wednesday', 'Friday'].map((day) => (
                    <div key={day} className={`p-6 border rounded-[2rem] space-y-4 ${
                      theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                    }`}>
                      <h3 className="font-mono text-xs font-bold tracking-wider text-indigo-500">{day} Lectures</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <p className="font-bold text-xs">09:00 AM - Algebra II</p>
                          <p className="text-[10px] text-zinc-500">Hall B • Grade 11-A</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <p className="font-bold text-xs">02:00 PM - Calculus Lab</p>
                          <p className="text-[10px] text-zinc-500">Lab 3 • Faculty Lead</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'teacher' && activeTab === 'quizzes' && (
              <TeacherQuizzesView
                courses={courses}
                quizzes={quizzes}
                attempts={quizAttempts}
                theme={theme}
                onCreateQuiz={handleCreateQuiz}
                onGradeAttempt={handleGradeQuizAttempt}
              />
            )}

            {/* ADMIN VIEWS */}
            {role === 'admin' && (
              <AdminPortalView
                users={users}
                metrics={metrics}
                onOnboardTeacher={() => setActionModalType('teacher')}
                onGlobalSettings={() => setActionModalType('settings')}
                onDatabaseBackup={() => showToast('System Backup Complete', 'Archived TITAN database state.')}
                onBroadcastAnnouncement={() => setActionModalType('announcement')}
                onUserAction={handleUserAction}
                theme={theme}
                leaveRequests={leaveRequests}
                onApproveLeave={handleApproveLeave}
                onRejectLeave={handleRejectLeave}
              />
            )}
              </motion.div>
            </AnimatePresence>
          </div>
            {activeTab === 'video_analysis' && (
              <VideoAnalysisView theme={theme} />
            )}

        </main>
      </div>

      {/* Interactive Modals */}
      <CoursePlayerModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleLesson={handleToggleLesson}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <GradingModal
        item={selectedGradingItem}
        onClose={() => setSelectedGradingItem(null)}
        onGradeSubmit={handleGradeSubmit}
      />

      <OnboardTeacherModal
        type={actionModalType}
        onClose={() => setActionModalType(null)}
        onSubmitAction={handleActionSubmit}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        deadlines={deadlines}
        onClose={() => setIsCalendarOpen(false)}
        onAddDeadline={handleAddDeadline}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        theme={theme}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
      />

      <CertificatesModal
        isOpen={isCertificatesOpen}
        onClose={() => setIsCertificatesOpen(false)}
        courses={courses}
        profile={userProfile}
        theme={theme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        userRole={role}
      />

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        theme={theme}
      />

      {/* Integrated Gemini AI Chatbot Widget */}
      <GeminiChatbot
        userName={userProfile.name}
        userRole={role}
        theme={theme}
      />

      {/* Toast Notification Micro-interaction */}
      <ToastAlert
        message={toast.message}
        subtitle={toast.subtitle}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
      </div>
    </LeaderboardProvider>
  );
}
