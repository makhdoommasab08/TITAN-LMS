import React from 'react';
import { Role } from '../types';
import { UserProfile } from './UserProfileModal';
import { TitanLogo } from './TitanLogo';

interface NavbarProps {
  role: Role;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  userProfile?: UserProfile;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  searchQuery,
  setSearchQuery,
  unreadNotifications,
  onOpenNotifications,
  onOpenSettings,
  onToggleMobileSidebar,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  userProfile,
  theme = 'dark',
  onToggleTheme,
  onOpenProfile,
  onLogout
}) => {
  const getSearchPlaceholder = () => {
    if (role === 'student') return 'Search TITAN courses, lessons, certifications...';
    if (role === 'teacher') return 'Search student performance, courses...';
    return 'Search system logs, users, faculty...';
  };

  const isDark = theme === 'dark';

  const userName = userProfile?.name || 'Masab Bin Abdul Rehman';
  const userAvatar = userProfile?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10';
  const userSub = role === 'student' ? 'TITAN Scholar' : role === 'teacher' ? 'Faculty Lead' : 'Super Admin';

  return (
    <header className={`w-full sticky top-0 z-40 border-b shadow-xl backdrop-blur-md transition-colors duration-300 ${
      isDark ? 'bg-zinc-950/85 border-zinc-800/80 text-white' : 'bg-white/90 border-zinc-200/80 text-zinc-900'
    }`}>
      <div className="flex justify-between items-center px-4 sm:px-8 py-2.5 max-w-[1280px] mx-auto gap-4">
        {/* Left Mobile Menu Toggle & Titan Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <TitanLogo size="sm" variant="horizontal" theme={theme} />
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getSearchPlaceholder()}
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs font-body transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500'
                  : 'bg-slate-100 border border-zinc-300 text-zinc-900 placeholder-zinc-500'
              }`}
            />
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Role Switcher, Profile & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:text-amber-300 hover:border-amber-500/30'
                  : 'bg-slate-100 border-zinc-300 text-indigo-600 hover:bg-slate-200 hover:text-indigo-700 hover:border-indigo-400/40'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-lg">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}


          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-full transition-all duration-200 active:scale-95 ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-zinc-950"></span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
            }`}
            title="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          {/* User Profile Trigger Avatar */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-2.5 pl-3 border-l transition-all duration-200 rounded-full p-1 hover:scale-[1.02] active:scale-95 ${
              isDark
                ? 'border-zinc-800 hover:bg-zinc-900/80 text-white'
                : 'border-zinc-300/80 hover:bg-slate-200/60 text-zinc-900'
            }`}
            title="View & Edit Profile"
          >
            <div className="text-right hidden md:block">
              <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{userName}</p>
              <p className={`text-[10px] font-mono font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{userSub}</p>
            </div>
            <img
              src={userAvatar}
              alt={userName}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 transition-all duration-300 ${
                isDark
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 filter contrast-[1.05] brightness-105'
                  : 'border-indigo-600 ring-2 ring-indigo-500/30 filter brightness-[1.02] contrast-[1.02] shadow-xs'
              }`}
            />
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
                isDark ? 'text-zinc-400 hover:text-red-400 hover:bg-zinc-900' : 'text-zinc-600 hover:text-red-600 hover:bg-slate-100'
              }`}
              title="Sign Out of TITAN Portal"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
