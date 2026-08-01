import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'alert' | 'message' | 'system';
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Grade Posted',
    message: 'Your final grade for Advanced AI has been posted.',
    time: '2 hours ago',
    isRead: false,
    type: 'alert'
  },
  {
    id: 'n2',
    title: 'Assignment Deadline',
    message: 'Reminder: Project phase 2 is due tomorrow.',
    time: '5 hours ago',
    isRead: false,
    type: 'alert'
  },
  {
    id: 'n3',
    title: 'System Update',
    message: 'TITAN portal will undergo maintenance this weekend.',
    time: '1 day ago',
    isRead: true,
    type: 'system'
  },
  {
    id: 'n4',
    title: 'Message from Admin',
    message: 'Campus will remian closed on account of Pakistan Independance Day.',
    time: '2 days ago',
    isRead: true,
    type: 'message'
  }
];

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, theme }) => {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`relative w-full max-w-md h-full flex flex-col shadow-2xl border-l ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <span className="material-symbols-outlined text-indigo-500">notifications</span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-headline">Notifications</h2>
                <p className="text-sm text-zinc-500">2 unread messages</p>
              </div>
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

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-body">
            {DUMMY_NOTIFICATIONS.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-2xl border transition-colors ${
                  !notification.isRead 
                    ? isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'
                    : isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notification.type === 'alert' ? 'bg-amber-500/10 text-amber-500' :
                    notification.type === 'message' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    <span className="material-symbols-outlined text-lg">
                      {notification.type === 'alert' ? 'campaign' :
                       notification.type === 'message' ? 'mail' : 'info'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold text-sm ${!notification.isRead ? (isDark ? 'text-indigo-300' : 'text-indigo-900') : ''}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{notification.time}</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className={`p-4 border-t text-center ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-slate-50'}`}>
            <button className={`text-sm font-bold transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
              Mark all as read
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
