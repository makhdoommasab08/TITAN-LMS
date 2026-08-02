import React from 'react';
import { Role, StudentTab, TeacherTab, AdminTab } from '../types';
import { TitanLogo } from './TitanLogo';

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: any) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onUpgradeClick: () => void;
  onHelpClick: () => void;
  theme?: 'dark' | 'light';
  onOpenProfile?: () => void;
  onOpenCertificates?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onUpgradeClick,
  onHelpClick,
  theme = 'dark',
  onOpenProfile,
  onOpenCertificates,
  onLogout
}) => {
  const isDark = theme === 'dark';

  const getNavItems = () => {
    if (role === 'student') {
      return [
        { id: 'dashboard' as StudentTab, label: 'Dashboard', icon: 'dashboard' },
        { id: 'courses' as StudentTab, label: 'Courses', icon: 'school' },
        { id: 'assignments' as StudentTab, label: 'Assignments', icon: 'assignment' },
        { id: 'study_planner' as StudentTab, label: 'AI Study Planner', icon: 'auto_awesome' },
        { id: 'quizzes' as StudentTab, label: 'Quizzes', icon: 'quiz' },
        { id: 'grades' as StudentTab, label: 'Grades', icon: 'grade' },
        { id: 'attendance' as StudentTab, label: 'Attendance', icon: 'co_present' },
        { id: 'resources' as StudentTab, label: 'Resources', icon: 'library_books' },
      ];
    }
    if (role === 'teacher') {
      return [
        { id: 'dashboard' as TeacherTab, label: 'Dashboard', icon: 'dashboard' },
        { id: 'library' as TeacherTab, label: 'Library', icon: 'school' },
        { id: 'students' as TeacherTab, label: 'Students', icon: 'group' },
        { id: 'assignments' as TeacherTab, label: 'Assignments & Grading', icon: 'assignment_turned_in' },
        { id: 'attendance' as TeacherTab, label: 'Attendance', icon: 'fact_check' },
        { id: 'schedule' as TeacherTab, label: 'Schedule', icon: 'calendar_month' },
        { id: 'quizzes' as TeacherTab, label: 'AI Quizzes', icon: 'quiz' },
      ];
    }
    return [
      { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: 'dashboard' },
      { id: 'courses' as AdminTab, label: 'Courses', icon: 'school' },
      { id: 'users' as AdminTab, label: 'Users', icon: 'group' },
      { id: 'revenue' as AdminTab, label: 'Revenue', icon: 'payments' },
      { id: 'health' as AdminTab, label: 'System Health', icon: 'monitoring' },
    ];
  };

  const navItems = getNavItems();

  const renderSidebarInner = (isForMobile: boolean) => {
    const collapsed = !isForMobile && isCollapsed;

    return (
      <div className="flex flex-col h-full py-5 gap-5">
        {/* Brand Title / Header */}
        <div className={`px-4 flex items-center ${collapsed ? 'justify-center flex-col gap-3' : 'justify-between'}`}>
          {collapsed ? (
            <TitanLogo size="sm" variant="icon" theme={theme} />
          ) : (
            <TitanLogo size="md" variant="sidebar" theme={theme} />
          )}

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            {!isForMobile && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={`hidden lg:flex p-1.5 rounded-xl transition-all duration-200 border ${
                  isDark
                    ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'bg-slate-100 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:bg-slate-200'
                }`}
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <span className="material-symbols-outlined text-lg">
                  {collapsed ? 'chevron_right' : 'chevron_left'}
                </span>
              </button>
            )}

            {/* Mobile Close Button */}
            {isForMobile && (
              <button
                onClick={onCloseMobile}
                className={`lg:hidden p-1.5 rounded-lg ${isDark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-zinc-600 hover:bg-slate-200'}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-1 overflow-y-auto px-2.5 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (isForMobile) onCloseMobile();
                }}
                className={`group relative w-full flex items-center transition-all font-mono text-xs tracking-wider uppercase ${
                  collapsed
                    ? 'justify-center p-3 rounded-2xl'
                    : 'gap-3 py-2.5 px-4 rounded-full text-left'
                } ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : isDark
                    ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    : 'text-zinc-600 hover:bg-slate-200 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}

                {/* Floating Tooltip when Collapsed */}
                {collapsed && (
                  <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                    isDark ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-slate-900 text-white border-slate-700'
                  }`}>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Student Specific Quick Links */}
          {role === 'student' && (
            <div className={`pt-3 border-t my-2 space-y-1.5 ${isDark ? 'border-zinc-800/60' : 'border-zinc-200'}`}>
              {onOpenCertificates && (
                <button
                  onClick={() => {
                    if (isForMobile) onCloseMobile();
                    onOpenCertificates();
                  }}
                  className={`group relative w-full flex items-center transition-all font-mono text-xs tracking-wider uppercase border shadow-xs ${
                    collapsed
                      ? 'justify-center p-3 rounded-2xl'
                      : 'justify-between py-2.5 px-4 rounded-full text-left'
                  } ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-xl shrink-0">workspace_premium</span>
                    {!collapsed && <span className="font-bold">Certificates</span>}
                  </div>
                  {!collapsed && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      VERIFIED
                    </span>
                  )}
                  {collapsed && (
                    <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                      isDark ? 'bg-zinc-900 text-amber-400 border-zinc-700' : 'bg-slate-900 text-amber-400 border-slate-700'
                    }`}>
                      Certificates (Verified)
                    </div>
                  )}
                </button>
              )}

              {onOpenProfile && (
                <button
                  onClick={() => {
                    if (isForMobile) onCloseMobile();
                    onOpenProfile();
                  }}
                  className={`group relative w-full flex items-center transition-all font-mono text-xs tracking-wider uppercase ${
                    collapsed
                      ? 'justify-center p-3 rounded-2xl'
                      : 'gap-3 py-2.5 px-4 rounded-full text-left'
                  } ${
                    isDark
                      ? 'text-indigo-400 hover:bg-zinc-900 hover:text-indigo-300'
                      : 'text-indigo-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl shrink-0">account_circle</span>
                  {!collapsed && <span>My Profile</span>}
                  {collapsed && (
                    <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                      isDark ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-slate-900 text-white border-slate-700'
                    }`}>
                      My Profile
                    </div>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Status / Pro Card */}
        <div className="mt-auto px-3 space-y-3">
          {collapsed ? (
            <button
              onClick={onUpgradeClick}
              className={`group relative w-full p-3 rounded-2xl border flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                isDark ? 'bg-zinc-900 text-indigo-400 border-zinc-700' : 'bg-slate-900 text-indigo-300 border-slate-700'
              }`}>
                {role === 'student' ? 'TITAN Excellence' : role === 'teacher' ? 'Faculty Tools' : 'Admin Controls'}
              </div>
            </button>
          ) : (
            role === 'student' ? (
              <div className={`p-4 rounded-2xl border relative overflow-hidden ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-slate-100 border-zinc-300 text-zinc-900'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase font-mono">
                    TITAN ACADEMICS
                  </span>
                  <span className="text-xs text-amber-400">✦</span>
                </div>
                <p className="font-headline text-sm font-bold mb-3">Academic Excellence</p>
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-full text-xs font-bold transition-colors shadow-xs"
                >
                  Explore Programs
                </button>
              </div>
            ) : role === 'teacher' ? (
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-slate-100 border-zinc-300 text-zinc-900'
              }`}>
                <p className="font-mono text-[10px] text-emerald-400 font-bold mb-1 tracking-widest uppercase">
                  FACULTY ACTIVE
                </p>
                <p className="font-headline text-sm font-bold mb-3">Classroom Portal</p>
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-indigo-600 text-white py-2 px-3 rounded-full text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Faculty Tools
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-slate-100 border-zinc-300 text-zinc-900'
              }`}>
                <p className="font-mono text-[10px] text-indigo-400 font-bold mb-1 tracking-widest uppercase">
                  ADMIN CONTROL
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold">TITAN System Live</span>
                </div>
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-indigo-600 text-white py-2 rounded-full text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  System Controls
                </button>
              </div>
            )
          )}

          {/* Support & Logout Links */}
          <div className={`pt-3 border-t space-y-1 font-mono text-xs ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <button
              onClick={onHelpClick}
              className={`group relative w-full flex items-center transition-all ${
                collapsed ? 'justify-center p-3 rounded-2xl' : 'py-2 px-4 gap-3 rounded-full text-left'
              } ${
                isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white' : 'text-zinc-600 hover:bg-slate-200 hover:text-zinc-900'
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0">help</span>
              {!collapsed && <span>Help Center</span>}
              {collapsed && (
                <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                  isDark ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-slate-900 text-white border-slate-700'
                }`}>
                  Help Center
                </div>
              )}
            </button>

            <button
              onClick={() => {
                if (isForMobile) onCloseMobile();
                if (onLogout) {
                  onLogout();
                } else {
                  alert('Signed out successfully.');
                }
              }}
              className={`group relative w-full flex items-center transition-all ${
                collapsed ? 'justify-center p-3 rounded-2xl' : 'py-2 px-4 gap-3 rounded-full text-left'
              } ${
                isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-red-400' : 'text-zinc-600 hover:bg-slate-200 hover:text-red-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0">logout</span>
              {!collapsed && <span>Sign Out</span>}
              {collapsed && (
                <div className={`hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border ${
                  isDark ? 'bg-zinc-900 text-red-400 border-zinc-700' : 'bg-slate-900 text-red-400 border-slate-700'
                }`}>
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`h-screen fixed left-0 top-0 hidden lg:flex flex-col border-r z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-white border-zinc-200'
      }`}>
        {renderSidebarInner(false)}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className={`fixed left-0 top-0 bottom-0 w-72 border-r shadow-2xl z-50 transition-colors duration-300 ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            {renderSidebarInner(true)}
          </aside>
        </div>
      )}
    </>
  );
};
