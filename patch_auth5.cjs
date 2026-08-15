const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// 1. ADD CREDENTIALS TO SIGN IN
// The first form onSubmit={handleSubmit} is for sign-in.
const signInFormStart = '<form onSubmit={handleSubmit} className="space-y-4">';
const signInFormReplacement = signInFormStart + `
                <div>
                  <label className={\`block text-xs font-mono font-bold mb-1.5 \${isDark ? 'text-zinc-400' : 'text-zinc-600'}\`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={\`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all \${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }\`}
                    required
                  />
                </div>
                <div>
                  <label className={\`block text-xs font-mono font-bold mb-1.5 \${isDark ? 'text-zinc-400' : 'text-zinc-600'}\`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={\`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all \${
                      isDark ? 'bg-zinc-900/40 border border-white/10 text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-indigo-500' : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-indigo-500'
                    }\`}
                    required
                  />
                </div>`;

// We use indexOf to replace only the first occurrence for sign-in
const firstFormIndex = code.indexOf(signInFormStart);
if(firstFormIndex !== -1) {
  code = code.substring(0, firstFormIndex) + signInFormReplacement + code.substring(firstFormIndex + signInFormStart.length);
}

// 2. ADD PICTURE UPLOAD TO SIGN UP
const signUpFormStart = '<div className="grid grid-cols-2 gap-4">';
const signUpFormReplacement = `
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
                    <div className={\`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all \${
                      isDark ? 'border-zinc-700 bg-zinc-900/50 group-hover:border-indigo-500 group-hover:bg-zinc-800' : 'border-zinc-300 bg-slate-50 group-hover:border-indigo-500 group-hover:bg-slate-100'
                    }\`}>
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
                  <p className={\`text-[10px] font-mono mt-2 \${isDark ? 'text-zinc-500' : 'text-zinc-400'}\`}>Max size: 5MB (JPEG/PNG)</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">`;

const secondFormIndex = code.indexOf(signUpFormStart);
if (secondFormIndex !== -1) {
  code = code.substring(0, secondFormIndex) + signUpFormReplacement + code.substring(secondFormIndex + signUpFormStart.length);
}

fs.writeFileSync('src/components/AuthScreen.tsx', code);
console.log('UI Patched.');
