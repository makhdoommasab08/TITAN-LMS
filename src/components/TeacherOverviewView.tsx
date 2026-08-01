import React, { useState } from 'react';
import { Course, GradingQueueItem } from '../types';

interface TeacherOverviewViewProps {
  courses: Course[];
  gradingQueue: GradingQueueItem[];
  onOpenGrading: (item: GradingQueueItem) => void;
  onCreateLesson: () => void;
  onPostAnnouncement: () => void;
  onInviteStudents: () => void;
  theme?: 'dark' | 'light';
}

export const TeacherOverviewView: React.FC<TeacherOverviewViewProps> = ({
  courses,
  gradingQueue,
  onOpenGrading,
  onCreateLesson,
  onPostAnnouncement,
  onInviteStudents,
  theme = 'dark',
}) => {
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const isDark = theme === 'dark';

  // Bar height percentages for Grade 11-A (Indigo) and Grade 11-B (Purple)
  const barData = [
    { label: 'Algebra II', a: 85, b: 60 },
    { label: 'Geometry', a: 92, b: 75 },
    { label: 'Calculus', a: 80, b: 45 },
    { label: 'Physics', a: 88, b: 70 },
  ];

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-8 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      {/* Header Section */}
      <section className={`relative pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className={`font-headline text-3xl md:text-5xl font-bold mb-2 tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Teacher Overview
            </h1>
            <p className={`font-body text-sm md:text-base max-w-2xl ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Manage your classroom, track student growth, and stay on top of pending evaluations with precision data tools.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-sm fill">check_circle</span>
              4 Classes Active
            </span>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-sm fill">warning</span>
              12 Assignments Due
            </span>
          </div>
        </div>
        <div className="section-tick"></div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Chart (Large Bento) */}
        <div className={`md:col-span-2 border rounded-[2rem] p-6 shadow-2xs transition-all duration-300 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-white'
            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className={`font-headline text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Student Performance
              </h3>
              <p className={`font-body text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Class average vs. Individual mastery
              </p>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className={`border rounded-full px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-slate-100 border-zinc-300 text-zinc-800'
              }`}
            >
              <option>Last 30 Days</option>
              <option>Current Semester</option>
            </select>
          </div>

          {/* Interactive Bar Chart Representation */}
          <div className={`h-64 flex items-end gap-3 px-4 border-b border-l relative rounded-t-xl ${
            isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-200 bg-slate-100/50'
          }`}>
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className={`border-t border-dashed w-full ${isDark ? 'border-zinc-700' : 'border-zinc-400'}`} />
              <div className={`border-t border-dashed w-full ${isDark ? 'border-zinc-700' : 'border-zinc-400'}`} />
              <div className={`border-t border-dashed w-full ${isDark ? 'border-zinc-700' : 'border-zinc-400'}`} />
            </div>

            {barData.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Grade 11-A Bar */}
                <div
                  className="flex-1 bg-indigo-600 rounded-t-sm relative group transition-all duration-500 hover:brightness-125 cursor-pointer"
                  style={{ height: `${item.a}%` }}
                >
                  <div className={`opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 border px-2 py-1 rounded text-[10px] whitespace-nowrap z-10 transition-opacity font-mono ${
                    isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-900 text-white border-zinc-700'
                  }`}>
                    Grade 11-A ({item.label}): {item.a}%
                  </div>
                </div>
                {/* Grade 11-B Bar */}
                <div
                  className="flex-1 bg-purple-500 rounded-t-sm relative group transition-all duration-500 hover:brightness-125 cursor-pointer"
                  style={{ height: `${item.b}%` }}
                >
                  <div className={`opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 border px-2 py-1 rounded text-[10px] whitespace-nowrap z-10 transition-opacity font-mono ${
                    isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-900 text-white border-zinc-700'
                  }`}>
                    Grade 11-B ({item.label}): {item.b}%
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full" />
              <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Grade 11-A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Grade 11-B</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (Small Bento) */}
        <div className={`border rounded-[2rem] p-6 flex flex-col justify-between shadow-2xs transition-all duration-300 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-white'
            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div>
            <h3 className={`font-headline text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={onCreateLesson}
                className={`flex items-center gap-3 p-3 border rounded-full transition-all group text-left shadow-2xs ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-indigo-500 hover:text-white'
                    : 'bg-slate-100 border-zinc-200 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-zinc-500 group-hover:text-indigo-500">
                  add_circle
                </span>
                <span className="font-mono text-xs font-bold">Create New Course</span>
              </button>
              <button
                onClick={onPostAnnouncement}
                className={`flex items-center gap-3 p-3 border rounded-full transition-all group text-left shadow-2xs ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-indigo-500 hover:text-white'
                    : 'bg-slate-100 border-zinc-200 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-zinc-500 group-hover:text-indigo-500">
                  campaign
                </span>
                <span className="font-mono text-xs font-bold">Post Announcement</span>
              </button>
              <button
                onClick={onInviteStudents}
                className={`flex items-center gap-3 p-3 border rounded-full transition-all group text-left shadow-2xs ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-indigo-500 hover:text-white'
                    : 'bg-slate-100 border-zinc-200 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-zinc-500 group-hover:text-indigo-500">
                  group_add
                </span>
                <span className="font-mono text-xs font-bold">Invite Students</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className={`p-4 border rounded-2xl shadow-xs ${
              isDark
                ? 'bg-indigo-600/20 border-indigo-500/30 text-white'
                : 'bg-indigo-50 border-indigo-200 text-indigo-950'
            }`}>
              <p className={`text-[10px] font-bold font-mono tracking-wider mb-1 ${
                isDark ? 'text-indigo-400' : 'text-indigo-700'
              }`}>
                PRO TIP
              </p>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Schedule announcements for multiple classes at once to save 30% more time.
              </p>
            </div>
          </div>
        </div>

        {/* Active Courses Card */}
        <div className={`border rounded-[2rem] p-6 shadow-2xs transition-all duration-300 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-white'
            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-headline text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Active Courses
            </h3>
            <span className="material-symbols-outlined text-zinc-400">arrow_forward</span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Advanced Calculus</span>
                <span className="font-mono text-indigo-500 font-bold">82% Comp.</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: '82%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Physics: Mechanics</span>
                <span className="font-mono text-indigo-500 font-bold">45% Comp.</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: '45%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Intro to Logic</span>
                <span className="font-mono text-emerald-500 font-bold">100% Comp.</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grading Queue (Large Bento) */}
        <div className={`md:col-span-2 border rounded-[2rem] p-6 shadow-2xs transition-all duration-300 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-white'
            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`font-headline text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Grading Queue
              </h3>
              <p className={`font-body text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Priority items requiring your feedback
              </p>
            </div>
            <button
              onClick={() => onOpenGrading(gradingQueue[0])}
              className="text-indigo-500 font-mono text-xs font-bold flex items-center gap-1 hover:underline"
            >
              View All <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>

          <div className="space-y-3">
            {gradingQueue.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl transition-colors gap-4 ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    : 'bg-slate-50 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      {item.type === 'project'
                        ? 'description'
                        : item.type === 'quiz'
                        ? 'quiz'
                        : 'assignment_late'}
                    </span>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.title}</p>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {item.submissionsCount} Submissions •{' '}
                      <span className="text-red-500 font-medium">{item.dueDateLabel}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenGrading(item)}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-mono transition-all shrink-0 ${
                    item.type === 'project'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : isDark
                      ? 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900'
                  }`}
                >
                  {item.type === 'project' ? 'Start Grading' : 'Review'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <footer className={`mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-xs gap-4 ${
        isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-500'
      }`}>
        <p className="font-mono uppercase tracking-widest text-[11px]">
          © 2025 TITAN NETWORK • TEACHER INSTANCE TR-402
        </p>
        <div className="flex gap-4 font-mono text-[11px]">
          <span className="text-emerald-500 font-bold">System Health: 100%</span>
          <a href="#" className="hover:text-indigo-500">Compliance</a>
          <a href="#" className="hover:text-indigo-500">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};
