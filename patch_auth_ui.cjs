const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// We'll replace the entire return block for the AuthScreen
const newReturn = `  return (
    <div className={\`min-h-screen flex font-body \${isDark ? 'bg-[#09090b] text-white' : 'bg-slate-50 text-zinc-900'}\`}>
      
      {/* Left Pane - Branding & Animations */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden flex-col justify-center items-center">
        {/* Animated Video Background Overlay */}
        <div className="absolute inset-0 z-0">
           <video 
             autoPlay 
             loop 
             muted 
             playsInline
             className="w-full h-full object-cover opacity-50"
           >
             <source src="/VID_20260815_221826_1.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/50" />
           <div className="absolute inset-0 bg-[#09090b]/40 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 text-center w-full max-w-2xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
             <TitanLogo size="xl" variant="full" theme="dark" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-headline font-black text-white tracking-tight">
              Excellence in Technology
            </h2>
            <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
              Access world-class resources, manage your academic journey, and connect with brilliant minds.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className={\`w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto relative \${
        isDark ? 'bg-[#09090b]' : 'bg-white'
      }\`}>
        {/* Theme Toggle in top right */}
        {onToggleTheme && (
          <div className="absolute top-8 right-8">
            <button
              onClick={onToggleTheme}
              className={\`p-2.5 rounded-full transition-all flex items-center justify-center border shadow-sm \${
                isDark ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-indigo-600 hover:bg-slate-50'
              }\`}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-lg">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        )}

        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden mb-10">
             <TitanLogo size="lg" variant="horizontal" theme={theme} />
          </div>

          {/* Header Title */}
          <div className="space-y-2 mb-10 text-center lg:text-left">
            <h1 className="font-headline font-black text-3xl tracking-tight">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'access_code' && 'Enter Access Code'}
              {mode === 'signup' && 'Create an account'}
            </h1>
            <p className={\`text-sm \${isDark ? 'text-zinc-400' : 'text-zinc-500'}\`}>
              {mode === 'signin' && 'Enter your details to access your portal.'}
              {mode === 'access_code' && 'Enter the student access code to continue.'}
              {mode === 'signup' && 'Register to join the TITAN database.'}
            </p>
          </div>

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              {/* Role Tabs */}
              <div className={\`p-1 rounded-xl flex gap-1 mb-8 \${isDark ? 'bg-zinc-900' : 'bg-slate-100'}\`}>
                <button
                  onClick={() => setRole('student')}
                  className={\`flex-1 py-2 text-xs font-semibold rounded-lg transition-all \${
                    role === 'student' 
                      ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm') 
                      : (isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')
                  }\`}
                >
                  Student
                </button>
                <button
                  onClick={() => setRole('teacher')}
                  className={\`flex-1 py-2 text-xs font-semibold rounded-lg transition-all \${
                    role === 'teacher' 
                      ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm') 
                      : (isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')
                  }\`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={\`flex-1 py-2 text-xs font-semibold rounded-lg transition-all \${
                    role === 'admin' 
                      ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm') 
                      : (isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')
                  }\`}
                >
                  Admin
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                      Password
                    </label>
                    <a href="#" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('access_code')}
                    className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
                  >
                    Register here
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
                <div className="space-y-1.5">
                  <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                    12-Digit Access Code
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="TITAN-XXXX-XXXX"
                    className={\`w-full px-4 py-3 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Verify Code
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </form>
              
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={\`font-semibold \${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'}\`}
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
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      placeholder="Jane"
                      className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                        isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                      }\`}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                      placeholder="Doe"
                      className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                        isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                      }\`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                      Email Address
                    </label>
                    <span className="text-[10px] text-indigo-500 font-medium">Auto-Generated</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailManuallyEdited(true);
                    }}
                    placeholder="jane.doe@titan.edu"
                    className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={\`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className={\`block text-xs font-semibold \${isDark ? 'text-zinc-300' : 'text-zinc-700'}\`}>
                      Student ID
                    </label>
                    <button
                      type="button"
                      onClick={() => setIdNumber(generateUniqueStudentId())}
                      className="text-[10px] text-indigo-500 hover:text-indigo-400 font-medium flex items-center"
                    >
                      <span className="material-symbols-outlined text-[12px] mr-0.5">refresh</span> Re-generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="TITAN-2026-XXXXXX"
                    className={\`w-full px-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all \${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:bg-zinc-800' : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white'
                    }\`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
                >
                  Complete Registration
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={\`font-semibold \${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'}\`}
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick Demo Access (For Dev/Demo Only) */}
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={\`w-full border-t \${isDark ? 'border-zinc-800' : 'border-zinc-200'}\`}></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className={\`px-2 \${isDark ? 'bg-[#09090b] text-zinc-600' : 'bg-white text-zinc-400'}\`}>
                  Quick Demo Login
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className={\`py-2 rounded-lg text-[11px] font-semibold transition-all \${
                  isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-emerald-400' : 'bg-slate-100 hover:bg-slate-200 text-emerald-600'
                }\`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className={\`py-2 rounded-lg text-[11px] font-semibold transition-all \${
                  isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-indigo-400' : 'bg-slate-100 hover:bg-slate-200 text-indigo-600'
                }\`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className={\`py-2 rounded-lg text-[11px] font-semibold transition-all \${
                  isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-amber-600'
                }\`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );`;

// Find where `return (` is and replace everything after it.
const startIndex = code.indexOf('  return (');
if (startIndex !== -1) {
  code = code.substring(0, startIndex) + newReturn + '\n};\n';
  fs.writeFileSync('src/components/AuthScreen.tsx', code);
  console.log('Auth UI successfully upgraded!');
} else {
  console.error('Could not find return statement.');
}
