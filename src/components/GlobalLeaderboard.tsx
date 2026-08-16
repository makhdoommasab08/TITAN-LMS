import React from 'react';
import { Trophy, Medal, Crown, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeaderboard } from '../context/LeaderboardContext';

interface GlobalLeaderboardProps {
  theme: 'dark' | 'light';
  currentUserName: string;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({ theme, currentUserName }) => {
  const isDark = theme === 'dark';
  const { leaderboard, userStats } = useLeaderboard();

  return (
    <div className={`border p-6 rounded-[2rem] relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-base font-headline flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-500" />
          Global Leaderboard
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-red-500"
          />
          <span className="text-[9px] font-bold tracking-wider uppercase font-mono">Live</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((user) => {
            const isTop3 = user.rank <= 3;
            const isCurrent = user.name === currentUserName;
            
            let rankColor = isDark ? 'text-zinc-500' : 'text-zinc-400';
            let icon = null;
            if (user.rank === 1) { rankColor = 'text-yellow-500'; icon = <Crown className="w-4 h-4" />; }
            else if (user.rank === 2) { rankColor = 'text-zinc-300'; icon = <Medal className="w-4 h-4" />; }
            else if (user.rank === 3) { rankColor = 'text-amber-600'; icon = <Medal className="w-4 h-4" />; }

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isCurrent 
                    ? (isDark ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200')
                    : (isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-zinc-100')
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 text-center font-bold font-mono text-sm ${rankColor}`}>
                    #{user.rank}
                  </div>
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-zinc-700 object-cover" />
                    {icon && (
                      <div className={`absolute -top-2 -right-2 ${rankColor} drop-shadow-md`}>
                        {icon}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-400' : ''}`}>{user.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500">{user.score.toLocaleString()} pts</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quiz Progress Bar */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="text-xs font-bold font-headline flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quiz Mastery
            </h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Your overall progress</p>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-400">{userStats.percentage}%</span>
        </div>
        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${userStats.percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
          />
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 font-mono text-center">{userStats.completed} / {userStats.total} Quizzes Completed</p>
      </div>
    </div>
  );
};
