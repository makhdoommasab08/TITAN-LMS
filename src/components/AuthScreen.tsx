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
    if (selectedRole === 'student') {
      onLogin('student', {
        name: 'Masab Bin Abdul Rehman',
        email: 'masab_bin.abdul_rehman@titan.edu.pk',
        id: 'TITAN-2025-468858',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10',
      });
    } else if (selectedRole === 'teacher') {
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
        {/* Animated Video Background Overlay */}
        <div className="absolute inset-0 z-0">
           <video 
             autoPlay 
             loop 
             muted 
             playsInline
             className="w-full h-full object-cover opacity-60"
           >
             <source src="/VID_20260815_221826_1.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-zinc-950/40 to-indigo-950/60 mix-blend-multiply" />
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
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl z-0 pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl z-0 pointer-events-none"
        />

        {/* Content with Glassmorphism */}
        <div className="relative z-10 p-12 text-center w-full max-w-2xl flex flex-col items-center">
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
             {/* Logo Container */}
             <div className="relative flex justify-center items-center">
               <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-[2]" />
               <div className="relative z-10">
                 <TitanLogo size="xl" variant="full" theme="dark" />
               </div>
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Role Selection Tabs */}
              <div className="mb-8">
                <div className={`p-1.5 rounded-2xl border grid grid-cols-3 gap-1 text-xs font-mono font-bold ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-zinc-300'
                }`}>
                  <button
                    onClick={() => { setSelectedRole('student'); setEmail('masab_bin.abdul_rehman@titan.edu.pk'); setPassword('password123'); }}
                    className={`py-3 rounded-xl transition-all ${
                      selectedRole === 'student'
                        ? 'bg-emerald-500/20 text-emerald-500 shadow-sm border border-emerald-500/20'
                        : isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => { setSelectedRole('teacher'); setEmail('shahnawaz_qureshi@titan.edu.pk'); setPassword('password123'); }}
                    className={`py-3 rounded-xl transition-all ${
                      selectedRole === 'teacher'
                        ? 'bg-indigo-500/20 text-indigo-500 shadow-sm border border-indigo-500/20'
                        : isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
                    }`}
                  >
                    Faculty
                  </button>
                  <button
                    onClick={() => { setSelectedRole('admin'); setEmail('admin@titan.edu.pk'); setPassword('password123'); }}
                    className={`py-3 rounded-xl transition-all ${
                      selectedRole === 'admin'
                        ? 'bg-amber-500/20 text-amber-500 shadow-sm border border-amber-500/20'
                        : isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>
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
                <button
                  type="submit"
                  className={`w-full py-4 text-white rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group ${
                    selectedRole === 'student' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' :
                    selectedRole === 'teacher' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' :
                    'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                  }`}
                >
                  <span>Enter {selectedRole === 'student' ? 'Student' : selectedRole === 'teacher' ? 'Faculty' : 'Admin'} Portal</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>

              <div className="pt-8 text-center text-sm">
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  New Student?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('access_code')}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Register with Access Code
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* MODE: ACCESS CODE */}
          {mode === 'access_code' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <form onSubmit={handleVerifyAccessCode} className="space-y-5">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    12-Digit Access Code
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="TITAN-XXXX-XXXX"
                    className={`w-full px-4 py-3.5 rounded-2xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Verify Code
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>
              
              <div className="pt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          )}

          {/* MODE: SIGN UP */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Upload Profile Picture"
                    />
                    <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                      isDark ? 'border-zinc-700 bg-zinc-900/50 group-hover:border-indigo-500 group-hover:bg-zinc-800' : 'border-zinc-300 bg-slate-50 group-hover:border-indigo-500 group-hover:bg-slate-100'
                    }`}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-zinc-400">
                          <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                          <span className="text-[10px] mt-1 font-mono font-bold">UPLOAD</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-[10px] font-mono mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Max size: 5MB (JPEG/PNG)</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
