import React, { useState } from 'react';
import { Role } from '../types';
import { TitanLogo } from './TitanLogo';
import { motion } from 'motion/react';

interface AuthScreenProps {
  onLogin: (role: Role, userDetails: { name: string; email: string; id: string; avatar?: string }) => void;
  onRegisterStudent?: (userDetails: { name: string; email: string; id: string; avatar?: string }) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onRegisterStudent,
  theme = 'dark',
  onToggleTheme
}) => {
  const [mode, setMode] = useState<'signin' | 'access_code' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  // Access Code State
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const [showRegistrationGuide, setShowRegistrationGuide] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailManuallyEdited, setIsEmailManuallyEdited] = useState(false);
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const isDark = theme === 'dark';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to generate unique student ID
  const generateUniqueStudentId = () => {
    return `TITAN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Helper to generate institutional email format (@titan.edu)
  const generateEmailFromNames = (fn: string, ln: string) => {
    const cleanFn = fn.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLn = ln.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanFn && cleanLn) {
      return `${cleanFn}.${cleanLn}@titan.edu`;
    } else if (cleanFn) {
      return `${cleanFn}@titan.edu`;
    } else if (cleanLn) {
      return `${cleanLn}@titan.edu`;
    }
    return '';
  };

  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (!isEmailManuallyEdited) {
      setEmail(generateEmailFromNames(val, lastName));
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    if (!isEmailManuallyEdited) {
      setEmail(generateEmailFromNames(firstName, val));
    }
  };

  const handleVerifyAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toLowerCase();
    if (cleanCode === 'titan-2026') {
      setAccessCodeError('');
      setIdNumber(generateUniqueStudentId());
      setMode('signup');
    } else {
      setAccessCodeError('Invalid Access Code! Please enter the confidential code provided by your administrator.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Registered Student';
      const autoEmail = generateEmailFromNames(firstName, lastName);
      const finalEmail = email.trim() || autoEmail || 'student@titan.edu';
      const finalId = idNumber.trim() || generateUniqueStudentId();
      const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10';
      const finalAvatar = avatarPreview || defaultAvatar;

      const userDetails = {
        name: fullName,
        email: finalEmail,
        id: finalId,
        avatar: finalAvatar,
        isNewStudent: true,
      };

      if (onRegisterStudent) {
        onRegisterStudent(userDetails);
      } else {
        onLogin('student', userDetails);
      }
      return;
    }

    // Sign In Mode
    const finalName = `${firstName.trim()} ${lastName.trim()}`.trim() || (selectedRole === 'student' ? 'Masab Bin Abdul Rehman' : selectedRole === 'teacher' ? 'Prof. Dr. Shahnawaz Qureshi' : 'TITAN Admin');
    const finalEmail = email.trim() || (selectedRole === 'student' ? 'masab_bin.abdul_rehman@titan.edu.pk' : selectedRole === 'teacher' ? 'shahnawaz_qureshi@titan.edu.pk' : 'admin@titan.edu.pk');
    const finalId = idNumber.trim() || (selectedRole === 'student' ? 'TITAN-2025-468858' : selectedRole === 'teacher' ? 'FAC-TITAN-104' : 'ADM-TITAN-001');
    const finalAvatar = selectedRole === 'student' 
      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10' 
      : selectedRole === 'teacher' 
      ? 'https://media.licdn.com/dms/image/v2/D4D22AQEzbJzahRPz8A/feedshare-shrink_800/B4DZUbJYsZHAAo-/0/1739917201215?e=2147483647&v=beta&t=nSiXg3jfIgPm2EI5BjT09z-N7IUJxXxdiZng3vv5wuo' 
      : '/titan-logo.svg';

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
        name: 'TITAN Admin',
        email: 'admin@titan.edu.pk',
        id: 'ADM-TITAN-001',
        avatar: '/titan-logo.svg',
      });
    }
  };

  return (
    <div className={`min-h-screen flex font-body ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      
      {/* Left Pane - Branding & Animations */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden flex-col justify-center items-center">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0 bg-zinc-950">
           <video 
             autoPlay 
             loop 
             muted 
             playsInline
             className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
           >
             <source src="/campus-video.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/90 via-zinc-950/80 to-indigo-900/80 mix-blend-multiply" />
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
          <div className="space-y-3 mb-8">
            <div className="flex justify-center lg:hidden mb-8">
               <TitanLogo size="md" variant="horizontal" theme={theme} />
            </div>
            <span className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest inline-block rounded-full border ${
              isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
            }`}>
              {mode === 'access_code' ? 'Code Verification' : mode === 'signup' ? 'Student Registration' : 'Secure Portal'}
            </span>
            <h1 className="font-headline font-black text-3xl sm:text-4xl tracking-tight">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'access_code' && 'Enter Access Code'}
              {mode === 'signup' && 'Register Portal Account'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {mode === 'signin' && 'Please sign in to access your institutional dashboard.'}
              {mode === 'access_code' && 'Enter the student access code provided by your institutional administrator.'}
              {mode === 'signup' && 'Complete your registration details to automatically enroll in the TITAN database.'}
            </p>
          </div>

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <>
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
                    <a href="#" className="text-indigo-500 hover:text-indigo-400 font-medium">Forgot?</a>
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

                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>

              {/* Mode Switcher */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-sm">
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  New Student?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('access_code');
                      setAccessCodeError('');
                      setAccessCode('');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>Sign Up via Access Code</span>
                    <span className="material-symbols-outlined text-sm">vpn_key</span>
                  </button>
                </p>
              </div>
            </>
          )}

          {/* MODE: ACCESS CODE ENTRY */}
          {mode === 'access_code' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                isDark ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}>
                <span className="material-symbols-outlined text-indigo-400 shrink-0 mt-0.5 text-lg">admin_panel_settings</span>
                <div className="space-y-1">
                  <p className="font-bold font-mono uppercase tracking-wider text-[11px] text-indigo-400">Institutional Access Required</p>
                  <p className="leading-relaxed">New students must enter the registration access code provided confidentially by the institutional administrator to proceed with registration.</p>
                </div>
              </div>

              <form onSubmit={handleVerifyAccessCode} className="space-y-5">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Enter Access Code
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        if (accessCodeError) setAccessCodeError('');
                      }}
                      placeholder="••••••••••••"
                      className={`w-full px-4 py-3.5 pl-11 rounded-2xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDark 
                          ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' 
                          : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                      }`}
                      required
                      autoFocus
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-indigo-400 text-lg">
                      key
                    </span>
                  </div>
                </div>

                {accessCodeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5"
                  >
                    <span className="material-symbols-outlined text-base shrink-0">error</span>
                    <span>{accessCodeError}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Verify Access Code</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">lock_open</span>
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`font-semibold hover:underline text-xs flex items-center justify-center gap-1.5 mx-auto ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Back to Sign In</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* MODE: STUDENT REGISTRATION FORM */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Verified Code Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Access Code Verified</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('access_code');
                    setAccessCodeError('');
                  }}
                  className="text-[11px] font-mono underline hover:text-white transition-colors"
                >
                  Change Code
                </button>
              </div>

              {/* How to Get Started Guidance Banner */}
              <div className={`p-4 rounded-2xl border text-xs transition-all ${
                isDark ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-400">
                    <span className="material-symbols-outlined text-base">help_outline</span>
                    <span className="uppercase text-[11px] tracking-wider">How to Get Started</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRegistrationGuide(!showRegistrationGuide)}
                    className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{showRegistrationGuide ? 'Hide Guide' : 'Show Guide'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {showRegistrationGuide ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {showRegistrationGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-1 border-t border-indigo-500/20 mt-2"
                  >
                    <p className="text-[11px] text-zinc-300 dark:text-zinc-300 font-sans leading-relaxed">
                      Follow these simple steps to complete your registration in the TITAN database:
                    </p>
                    <ul className="space-y-1.5 text-[11px] font-mono pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">1.</span>
                        <span><strong>First & Last Name:</strong> Enter your names to dynamically set up your portal identity.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">2.</span>
                        <span><strong>Institutional Email:</strong> Auto-generated based on your name in <code className="text-indigo-300 font-bold">@titan.edu</code> format.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">3.</span>
                        <span><strong>Password:</strong> Create a secure password for future portal access.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">4.</span>
                        <span><strong>Unique Registration ID:</strong> Dynamically auto-assigned specifically for your student enrollment.</span>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Picture Upload Box */}
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
                }`}>
                  <label className="block text-xs font-mono font-bold mb-2 text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    Upload Student Profile Picture
                  </label>
                  <div className="relative group cursor-pointer my-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/50 shadow-lg relative bg-zinc-800 flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-indigo-400">account_circle</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono font-bold">
                        <span className="material-symbols-outlined text-xl">upload</span>
                        <span>Change</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Click or drop photo to upload profile picture"
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <label className="text-xs font-mono font-bold text-indigo-500 hover:text-indigo-400 hover:underline cursor-pointer">
                      {avatarPreview ? 'Choose Different Image' : 'Select Photo File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => setAvatarPreview('')}
                        className="text-[10px] font-mono text-rose-400 hover:underline"
                      >
                        Reset Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    PNG, JPG, or WEBP up to 5MB (Saved to Student Portal Database)
                  </p>
                </div>

                {/* First Name & Last Name Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      placeholder="Enter First Name"
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                      }`}
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                      placeholder="Enter Last Name"
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Institutional Email Address (Auto-Generated) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-mono font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Institutional Email Address
                    </label>
                    <span className="text-[10px] font-mono text-amber-500 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Auto-Generated (@titan.edu)
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailManuallyEdited(true);
                    }}
                    placeholder="firstname.lastname@titan.edu"
                    className={`w-full px-4 py-3.5 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>

                {/* Student Registration ID (Auto-Generated Unique) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-mono font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Student Registration ID
                    </label>
                    <button
                      type="button"
                      onClick={() => setIdNumber(generateUniqueStudentId())}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
                      title="Generate a new unique registration ID"
                    >
                      <span className="material-symbols-outlined text-[12px]">refresh</span> Re-generate Unique ID
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="TITAN-2026-XXXXXX"
                      className={`w-full px-4 py-3.5 pr-12 rounded-2xl text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDark ? 'bg-zinc-900/60 border border-indigo-500/30 text-indigo-200 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-indigo-50/50 border border-indigo-200 text-indigo-900 focus:bg-white focus:border-indigo-500'
                      }`}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400" title="Unique Student ID">
                      <span className="material-symbols-outlined text-base">verified</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Complete Registration & Enter Portal</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">person_add</span>
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-sm">
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
              </div>
            </motion.div>
          )}

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
