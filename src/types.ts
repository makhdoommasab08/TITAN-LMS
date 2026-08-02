export type Role = 'student' | 'teacher' | 'admin';

export type StudentTab = 'dashboard' | 'courses' | 'assignments' | 'grades' | 'attendance' | 'resources' | 'study_planner' | 'quizzes';
export type TeacherTab = 'dashboard' | 'library' | 'students' | 'assignments' | 'grading' | 'schedule' | 'attendance' | 'quizzes';
export type AdminTab = 'dashboard' | 'courses' | 'users' | 'revenue' | 'health';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, number>;
  score?: number;
  status: 'submitted' | 'graded';
  submittedAt: string;
}

export interface StudentCourseGrade {
  courseId: string;
  courseTitle: string;
  currentGrade: string; // e.g. '88%' or 'A-'
  gradePercent: number; // e.g. 88
  gradeLetter: string; // 'A', 'B+', etc.
  targetGrade?: string;
  focusWeight: 'high' | 'medium' | 'normal'; // user preference
}

export interface StudyBlock {
  id: string;
  timeSlot: string;
  courseTitle: string;
  activityTitle: string;
  durationMinutes: number;
  focusLevel: 'High' | 'Medium' | 'Light';
  studyTip?: string;
  completed: boolean;
}

export interface StudyPlan {
  headline: string;
  summaryStrategy: string;
  dailyTargetHours: number;
  priorityFocusCourse: string;
  scheduleBlocks: StudyBlock[];
  weeklyGoalSummary: string;
  aiRecommendations: string[];
  createdAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  summary?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  image: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  category: string;
  currentLessonTitle?: string;
  currentModuleTitle?: string;
  description: string;
  modules?: CourseModule[];
  enrolledStudentsCount?: number;
}

export interface CourseResource {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  type: 'pdf' | 'slides' | 'link' | 'code' | 'worksheet';
  fileSize?: string;
  downloadUrl?: string;
  externalUrl?: string;
  author: string;
  dateAdded: string;
  category?: string;
  bookmarked?: boolean;
  downloadsCount?: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'completion' | 'comment' | 'grade' | 'announcement';
}

export interface Deadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  dueLabel: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submittedAt: string;
}

export interface GradingQueueItem {
  id: string;
  title: string;
  course: string;
  submissionsCount: number;
  dueDateLabel: string;
  isAutoGraded?: boolean;
  studentName?: string;
  submittedAgo?: string;
  type: 'project' | 'quiz' | 'late';
  status: 'pending' | 'graded';
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'Active' | 'Suspended' | 'Pending';
  joinedDate: string;
  performanceLabel: string;
  performancePercent: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  diskLatency: number;
  uptime: string;
  monthlyRevenue: number;
  revenueTarget: number;
  revenueAchievement: number;
  totalStudents: number;
  activeCourses: number;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  course: string;
  startDate: string;
  endDate: string;
  reasonCategory: 'Medical' | 'Personal' | 'Academic' | 'Emergency';
  reasonDetails: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewComment?: string;
  reviewedAt?: string;
}
