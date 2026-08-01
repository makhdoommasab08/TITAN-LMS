import React, { useState } from 'react';
import { Role } from '../types';
import { TitanLogo } from './TitanLogo';
import { motion } from 'motion/react';

interface AuthScreenProps {
  onLogin: (role: Role, userDetails: { name: string; email: string; id: string; avatar?: string }) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  theme = 'dark',
  onToggleTheme
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (selectedRole === 'student' ? 'Masab Bin Abdul Rehman' : selectedRole === 'teacher' ? 'Prof. Dr. Shahnawaz Qureshi' : 'Lionel Messi');
    const finalEmail = email.trim() || (selectedRole === 'student' ? 'masab_bin.abdul_rehman@titan.edu.pk' : selectedRole === 'teacher' ? 'shahnawaz_qureshi@titan.edu.pk' : 'admin@titan.edu.pk');
    const finalId = idNumber.trim() || (selectedRole === 'student' ? 'TITAN-2025-468858' : selectedRole === 'teacher' ? 'FAC-TITAN-104' : 'ADM-TITAN-001');
    const finalAvatar = selectedRole === 'student' 
      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10' 
      : selectedRole === 'teacher' 
      ? 'https://media.licdn.com/dms/image/v2/D4D22AQEzbJzahRPz8A/feedshare-shrink_800/B4DZUbJYsZHAAo-/0/1739917201215?e=2147483647&v=beta&t=nSiXg3jfIgPm2EI5BjT09z-N7IUJxXxdiZng3vv5wuo' 
      : 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg';

    onLogin(selectedRole, {
      name: finalName,
      email: finalEmail,
      id: finalId,
      avatar: finalAvatar,
    });
  };

  const handleDemoLogin = (role: Role) => {
    if (role === 'student') {
      onLogin('student', {
        name: 'Masab Bin Abdul Rehman',
        email: 'masab_bin.abdul_rehman@titan.edu.pk',
        id: 'TITAN-2025-468858',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10',
      });
    } else if (role === 'teacher') {
      onLogin('teacher', {
        name: 'Prof. Dr. Shahnawaz Qureshi',
        email: 'shahnawaz_qureshi@titan.edu.pk',
        id: 'FAC-TITAN-104',
        avatar: 'https://media.licdn.com/dms/image/v2/D4D22AQEzbJzahRPz8A/feedshare-shrink_800/B4DZUbJYsZHAAo-/0/1739917201215?e=2147483647&v=beta&t=nSiXg3jfIgPm2EI5BjT09z-N7IUJxXxdiZng3vv5wuo',
      });
    } else {
      onLogin('admin', {
        name: 'Lionel Messi',
        email: 'lionel.messi@titan.edu.pk',
        id: 'ADM-GOAT-10',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
      });
    }
  };

  return (
    <div className={`min-h-screen flex font-body ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      
      {/* Left Pane - Branding & Animations */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden flex-col justify-center items-center">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://www.instagram.com/reel/DL9WC1DqwO3/?utm_source=ig_web_button_share_sheet" 
             alt="University Campus" 
             className="w-full h-full object-cover opacity-20"
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-zinc-950/80 to-indigo-950/90 mix-blend-multiply" />
           {/* Ripple Effect */}
           <motion.div
             initial={{ scale: 0, opacity: 0.8 }}
             animate={{ scale: 3, opacity: 0 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-2xl z-0 pointer-events-none"
           />
        </div>

        {/* Floating Animated Shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl z-0"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl z-0"
        />

        {/* Content */}
        <div className="relative z-10 p-12 text-center max-w-xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8 
            }}
            className="mb-10 relative drop-shadow-2xl"
          >
             {/* Sleek modern glow behind the logo */}
             <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-[2]" />
             <div className="relative z-10">
               <TitanLogo size="xl" variant="full" theme="dark" />
             </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-headline font-black text-white mb-4 tracking-tight"
          >
            Empowering the Future of Tech
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-400 leading-relaxed text-lg"
          >
            Access world-class resources, manage your academic journey, and connect with brilliant minds at the Taj Institute of Technology and Applied Networks.
          </motion.p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className={`w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto relative ${
        isDark ? 'bg-zinc-950' : 'bg-slate-50'
      }`}>
        
        {/* Theme Toggle in top right */}
        {onToggleTheme && (
          <div className="absolute top-8 right-8">
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center border shadow-sm ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800' : 'bg-white border-zinc-300 text-indigo-600 hover:bg-slate-100'
              }`}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-lg">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        )}

        <div className="w-full max-w-md">
          {/* Header Title */}
          <div className="space-y-3 mb-10">
            <div className="flex justify-center lg:hidden mb-8">
               <TitanLogo size="md" variant="horizontal" theme={theme} />
            </div>
            <span className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest inline-block rounded-full border ${
              isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
            }`}>
              Secure Portal
            </span>
            <h1 className="font-headline font-black text-3xl sm:text-4xl tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Please {mode === 'signin' ? 'sign in' : 'register'} to access your institutional dashboard.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-8">
            <div className={`p-1.5 rounded-2xl border grid grid-cols-3 gap-1 text-xs font-mono font-bold ${
              isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-zinc-300'
            }`}>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 sm:flex-row ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">school</span>
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`py-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 sm:flex-row ${
                  selectedRole === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 sm:flex-row ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masab Bin Abdul Rehman"
                  className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDark ? 'bg-zinc-900/20 backdrop-blur-2xl border border-white/10 hover:bg-zinc-800/40 hover:border-white/30 text-white placeholder-zinc-500 focus:bg-zinc-900/60 focus:border-indigo-500 shadow-inner hover:shadow-indigo-500/10' : 'bg-white/30 backdrop-blur-2xl border border-zinc-200/50 hover:bg-white/60 hover:border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-400 shadow-inner hover:shadow-indigo-500/10'
                  }`}
                  required
                />
              </div>
            )}

            <div>
              <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'student' ? 'masab_bin.abdul_rehman@titan.edu.pk' : selectedRole === 'teacher' ? 'shahnawaz_qureshi@titan.edu.pk' : 'admin@titan.edu.pk'}
                className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-zinc-900/20 backdrop-blur-2xl border border-white/10 hover:bg-zinc-800/40 hover:border-white/30 text-white placeholder-zinc-500 focus:bg-zinc-900/60 focus:border-indigo-500 shadow-inner hover:shadow-indigo-500/10' : 'bg-white/30 backdrop-blur-2xl border border-zinc-200/50 hover:bg-white/60 hover:border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-400 shadow-inner hover:shadow-indigo-500/10'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono font-bold mb-1.5 flex justify-between ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Password</span>
                {mode === 'signin' && (
                  <a href="#" className="text-indigo-500 hover:text-indigo-400 font-medium">Forgot?</a>
                )}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-zinc-900/20 backdrop-blur-2xl border border-white/10 hover:bg-zinc-800/40 hover:border-white/30 text-white placeholder-zinc-500 focus:bg-zinc-900/60 focus:border-indigo-500 shadow-inner hover:shadow-indigo-500/10' : 'bg-white/30 backdrop-blur-2xl border border-zinc-200/50 hover:bg-white/60 hover:border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-400 shadow-inner hover:shadow-indigo-500/10'
                }`}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {selectedRole === 'student' ? 'Student Registration ID' : 'Faculty Serial Code'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="TITAN-2025-XXXX"
                  className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDark ? 'bg-zinc-900/20 backdrop-blur-2xl border border-white/10 hover:bg-zinc-800/40 hover:border-white/30 text-white placeholder-zinc-500 focus:bg-zinc-900/60 focus:border-indigo-500 shadow-inner hover:shadow-indigo-500/10' : 'bg-white/30 backdrop-blur-2xl border border-zinc-200/50 hover:bg-white/60 hover:border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-400 shadow-inner hover:shadow-indigo-500/10'
                  }`}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-sm">
            {mode === 'signin' ? (
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                New to TITAN?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Apply Here
                </button>
              </p>
            ) : (
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Access */}
          <div className="mt-8 text-center">
            <p className={`text-[10px] font-mono uppercase tracking-widest font-bold mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              One-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  isDark
                    ? 'bg-zinc-900/50 border-zinc-800 text-emerald-400 hover:bg-zinc-800 hover:border-emerald-500/30'
                    : 'bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  isDark
                    ? 'bg-zinc-900/50 border-zinc-800 text-indigo-400 hover:bg-zinc-800 hover:border-indigo-500/30'
                    : 'bg-indigo-50/50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                Faculty
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  isDark
                    ? 'bg-zinc-900/50 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:border-amber-500/30'
                    : 'bg-amber-50/50 border-amber-200 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
