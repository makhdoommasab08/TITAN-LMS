import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userRole: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  userRole
}) => {
  const isDark = theme === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-xl rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div>
              <h2 className="text-xl font-bold font-headline">Account Settings</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage your TITAN portal preferences</p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 font-body">
            
            {/* Appearance */}
            <section className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Appearance</h3>
              
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-zinc-900' : 'bg-white'
                  }`}>
                    <span className="material-symbols-outlined text-indigo-500">
                      {isDark ? 'dark_mode' : 'light_mode'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Theme Mode</p>
                    <p className="text-xs text-zinc-500">Toggle light or dark interface</p>
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isDark ? 'bg-indigo-600' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Notifications */}
            <section className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Notifications</h3>
              
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
              }`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-zinc-900' : 'bg-white'
                    }`}>
                      <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Push Notifications</p>
                      <p className="text-xs text-zinc-500">Receive alerts in browser</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      notificationsEnabled ? 'bg-indigo-600' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-zinc-900' : 'bg-white'
                    }`}>
                      <span className="material-symbols-outlined text-emerald-500">mail</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Email Alerts</p>
                      <p className="text-xs text-zinc-500">Weekly summaries and updates</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      emailAlerts ? 'bg-indigo-600' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Privacy & Security</h3>
              
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
              }`}>
                 <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-zinc-900' : 'bg-white'
                    }`}>
                      <span className="material-symbols-outlined text-red-500">visibility_off</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Private Profile</p>
                      <p className="text-xs text-zinc-500">Hide profile from directory</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      privacyMode ? 'bg-indigo-600' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacyMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-zinc-900' : 'bg-white'
                    }`}>
                      <span className="material-symbols-outlined text-blue-500">password</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Change Password</p>
                      <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-zinc-900'
                  }`}>
                    Update
                  </button>
                </div>
              </div>
            </section>
          </div>
          
          {/* Footer */}
          <div className={`p-6 border-t ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-slate-50'}`}>
            <button
              onClick={onClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
