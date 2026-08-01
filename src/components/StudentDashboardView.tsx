import React from 'react';
import { Course, RecentActivity, Deadline } from '../types';
import { UserProfile } from './UserProfileModal';
import { TitanLogo } from './TitanLogo';

interface StudentDashboardViewProps {
  courses: Course[];
  activities: RecentActivity[];
  deadlines: Deadline[];
  onCourseClick: (course: Course) => void;
  onOpenAnalytics: () => void;
  onOpenCalendar: () => void;
  streakDays: number;
  theme?: 'dark' | 'light';
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onOpenCertificates?: () => void;
  onOpenResources?: () => void;
  onOpenStudyPlanner?: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  courses,
  activities,
  deadlines,
  onCourseClick,
  onOpenAnalytics,
  onOpenCalendar,
  streakDays,
  theme = 'dark',
  userProfile,
  onOpenProfile,
  onOpenCertificates,
  onOpenResources,
  onOpenStudyPlanner
}) => {
  const isDark = theme === 'dark';

  const fallbackCourse: Course = {
    id: 'course-ds101',
    title: 'Data Science & Machine Learning 101',
    category: 'Data Science',
    instructor: 'Dr. Muhammad Hayn',
    progress: 65,
    completedLessons: 13,
    totalLessons: 20,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnERZySMw-RuOuYSYYDRjvOOk5IPOuUoLzmaVt-sb1qA&s=10',
    currentLessonTitle: 'Module 4: Linear Regression Equations',
    description: 'Learn fundamental data science concepts, statistical modeling, and Python tools.',
  };

  const nextLessonCourse = courses.find((c) => c.id === 'course-ds101') || courses[0] || fallbackCourse;
  const userName = userProfile?.name?.split(' ')[0] || 'Alex';

  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-8 py-8 space-y-8 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
    }`}>
      {/* Institution Banner & Hero Section */}
      <section className="reveal-card">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Welcome Banner with Titan Logo */}
          <div className={`lg:col-span-2 relative overflow-hidden border p-6 sm:p-8 md:p-9 rounded-[2rem] flex flex-col justify-between shadow-xl transition-colors duration-300 ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-white'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
          }`}>
            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Term • Spring 2025
                </span>
              </div>

              <div>
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
                  Welcome back, <span className="italic font-light text-indigo-500">{userName}</span>!
                </h1>
                <p className={`font-body text-xs sm:text-sm opacity-90 max-w-lg ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Department of Computer Science & Artificial Intelligence
                </p>
              </div>

              {/* Action Buttons arranged cleanly with clear visual hierarchy */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={onOpenAnalytics}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-bold text-xs active:scale-95 transition-all flex items-center gap-2 shadow-sm font-mono shrink-0"
                >
                  View Performance
                  <span className="material-symbols-outlined text-base">trending_up</span>
                </button>

                {onOpenStudyPlanner && (
                  <button
                    onClick={onOpenStudyPlanner}
                    className={`px-4 py-2.5 rounded-full font-mono font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs ${
                      isDark
                        ? 'bg-gradient-to-r from-indigo-600/30 to-blue-600/30 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white'
                        : 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base text-indigo-400 group-hover:text-white">auto_awesome</span>
                    AI Study Planner
                  </button>
                )}

                {onOpenResources && (
                  <button
                    onClick={onOpenResources}
                    className={`px-4 py-2.5 rounded-full font-mono font-semibold text-xs transition-all flex items-center gap-1.5 border ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 hover:border-emerald-500/30'
                        : 'border-zinc-200 bg-slate-100/80 text-zinc-700 hover:bg-slate-200 hover:text-emerald-700 hover:border-emerald-400/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base text-emerald-500">folder_open</span>
                    Resources
                  </button>
                )}

                {onOpenCertificates && (
                  <button
                    onClick={onOpenCertificates}
                    className={`px-4 py-2.5 rounded-full font-mono font-semibold text-xs transition-all flex items-center gap-1.5 border ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 hover:border-amber-500/30'
                        : 'border-zinc-200 bg-slate-100/80 text-zinc-700 hover:bg-slate-200 hover:text-amber-700 hover:border-amber-400/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base text-amber-500">workspace_premium</span>
                    Certificates
                  </button>
                )}

                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    className={`px-4 py-2.5 rounded-full font-mono font-semibold text-xs transition-all flex items-center gap-1.5 border ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-indigo-300 hover:border-indigo-500/30'
                        : 'border-zinc-200 bg-slate-100/80 text-zinc-700 hover:bg-slate-200 hover:text-indigo-700 hover:border-indigo-400/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base text-indigo-400">person</span>
                    Profile
                  </button>
                )}
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Continue Learning Bento Card */}
          <div className="isometric-hero">
            <div className={`isometric-card h-full border p-6 rounded-[2rem] shadow-sm hover:shadow-lg flex flex-col justify-between transition-colors duration-300 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold tracking-widest uppercase inline-block font-mono">
                    Next Lesson
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">25:00</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-1">
                  {nextLessonCourse.title}
                </h3>
                <p className={`text-xs font-body ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {nextLessonCourse.currentLessonTitle || 'Module 4: Linear Regression'}
                </p>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-mono text-xs text-indigo-500 font-bold">
                    {nextLessonCourse.progress}% Progress
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {nextLessonCourse.completedLessons}/{nextLessonCourse.totalLessons} Lessons
                  </span>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${nextLessonCourse.progress}%` }}
                  />
                </div>
                <button
                  onClick={() => onCourseClick(nextLessonCourse)}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-full font-bold text-xs hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Continue Learning
                  <span className="material-symbols-outlined text-base">play_circle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Active Courses & Recent Activity */}
        <div className="lg:col-span-3 space-y-8">
          {/* Active Courses Header */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs uppercase tracking-widest font-bold ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  TITAN Enrolled Programs
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              </div>
              <button
                onClick={() => alert('Viewing all active courses')}
                className="text-indigo-500 font-mono text-xs font-bold hover:underline"
              >
                View All ↗
              </button>
            </div>

            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.length === 0 ? (
                <div className={`col-span-full p-8 text-center border rounded-[2rem] ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
                }`}>
                  <span className="material-symbols-outlined text-4xl mb-2 text-zinc-500">search_off</span>
                  <p className="font-headline font-bold text-base">No courses found matching your search.</p>
                  <p className="text-xs text-zinc-500 mt-1 font-body">Try searching for other TITAN topics.</p>
                </div>
              ) : (
                courses.map((course, idx) => (
                  <div
                    key={course.id}
                    className={`reveal-card reveal-delay-${(idx % 3) + 1} group border p-6 rounded-[2rem] hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-full h-32 rounded-2xl bg-cover bg-center mb-4 border ${
                        isDark ? 'border-zinc-800' : 'border-zinc-200'
                      }`}
                      style={{ backgroundImage: `url(${course.image})` }}
                    />
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                      {course.category}
                    </span>
                    <h4 className="font-bold text-lg mb-1 font-headline">
                      {course.title}
                    </h4>
                    <p className={`text-xs mb-4 font-body ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Faculty Instructor: {course.instructor}
                    </p>

                    <div className="space-y-4">
                      <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-emerald-400 transition-all duration-1000"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {course.progress}% Completed
                        </span>
                        <button
                          onClick={() => onCourseClick(course)}
                          className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-full font-bold text-xs transition-all font-mono shadow-xs"
                        >
                          Resume Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="pt-2">
            <h3 className="font-headline text-xl font-bold mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors shadow-2xs ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      {act.type === 'completion'
                        ? 'check_circle'
                        : act.type === 'comment'
                        ? 'comment'
                        : act.type === 'grade'
                        ? 'verified'
                        : 'campaign'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{act.title}</p>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{act.subtitle}</p>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Streak, Deadlines, Certificates Banner */}
        <div className="lg:col-span-1 space-y-6">
          {/* Day Streak Widget */}
          <div className={`reveal-card reveal-delay-2 border p-6 rounded-[2rem] relative overflow-hidden ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <span className="material-symbols-outlined text-3xl fill">
                  local_fire_department
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-black">{streakDays}</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                  Day Streak
                </p>
              </div>
            </div>
            <p className={`text-xs leading-relaxed mb-4 font-body ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              You're on fire! Keep learning today to reach a {streakDays + 1}-day streak at Taj Institute.
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`h-1.5 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}
                >
                  <div
                    className={`h-full bg-amber-400 transition-all ${
                      day <= streakDays ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className={`reveal-card reveal-delay-3 border p-6 rounded-[2rem] ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
          }`}>
            <h3 className="font-bold text-base mb-4 flex items-center justify-between font-headline">
              Upcoming Deadlines
              <span className="material-symbols-outlined text-zinc-500 text-lg">event</span>
            </h3>
            <div className="space-y-3.5">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className={`relative pl-3 border-l-2 ${
                    dl.priority === 'high'
                      ? 'border-red-500'
                      : dl.priority === 'medium'
                      ? 'border-amber-500'
                      : 'border-indigo-500'
                  }`}
                >
                  <p className="font-bold text-xs">{dl.title}</p>
                  <p
                    className={`text-[11px] font-mono ${
                      dl.priority === 'high' ? 'text-red-400' : 'text-zinc-500'
                    }`}
                  >
                    {dl.dueDate}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={onOpenCalendar}
              className={`w-full mt-6 py-2.5 border rounded-full text-xs font-mono font-bold transition-colors ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  : 'border-zinc-300 text-zinc-700 hover:bg-slate-100 hover:text-zinc-900'
              }`}
            >
              View Calendar
            </button>
          </div>

          {/* Certificates Callout Card */}
          {onOpenCertificates && (
            <div className={`p-6 rounded-[2rem] border bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-emerald-500/10 flex flex-col items-center text-center ${
              isDark ? 'border-amber-500/20 text-white' : 'border-amber-500/30 text-zinc-900'
            }`}>
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl mb-3">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
              <h4 className="font-headline font-bold text-base mb-1">TITAN Certifications</h4>
              <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Earn official credentials from Taj Institute of Technology & Applied Networks.
              </p>
              <button
                onClick={onOpenCertificates}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs rounded-full shadow-md transition-all"
              >
                Generate & Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
