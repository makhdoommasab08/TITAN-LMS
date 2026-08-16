import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuizAttempt } from '../types';

export interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar: string;
}

interface LeaderboardContextType {
  leaderboard: LeaderboardUser[];
  userStats: { completed: number; total: number; percentage: number };
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

interface LeaderboardProviderProps {
  children: React.ReactNode;
  quizAttempts: QuizAttempt[];
  currentUserName: string;
}

export const LeaderboardProvider: React.FC<LeaderboardProviderProps> = ({ children, quizAttempts, currentUserName }) => {
  const [baseLeaderboard, setBaseLeaderboard] = useState<LeaderboardUser[]>([
    { id: 'u4', name: 'Muhammad Umar', score: 2450, rank: 1, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5M999In7xAng7oCdfQiiIPWsjtSnkawXmtSpMyqCdCQ&s=10' },
    { id: 'u2', name: 'Sarah Ali', score: 2320, rank: 2, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPLDs3UjQYBQ5Q6E1tU4PnTO2OCOiWC1vxalp2lvbRdw&s=10' },
    { id: 'u1', name: 'Masab Bin Abdul Rehman', score: 2150, rank: 3, avatar: 'https://i.pinimg.com/736x/0e/1b/49/0e1b4984c22ff810051677b8c7a29e7d.jpg' },
    { id: 'u6', name: 'Ammar Mughal', score: 1980, rank: 4, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkT8XnIuVJUBGV1Q4n1Iy12TOPMxxZOnQqd8Dm4bR9UQ&s=10' },
    { id: 'u3', name: 'Aliza Shah', score: 1850, rank: 5, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5VQ5Lb-0Dyf3f-3NMMubx8zxZ-xEgU8p553kdhxzx8Q&s=10' },
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBaseLeaderboard(prev => {
        const newLb = [...prev];
        const others = newLb.filter(u => u.name !== currentUserName);
        if (others.length > 0) {
          const rIdx = Math.floor(Math.random() * others.length);
          const userToBump = others[rIdx];
          const idxInBase = newLb.findIndex(u => u.id === userToBump.id);
          if (idxInBase !== -1) {
            newLb[idxInBase].score += Math.floor(Math.random() * 5) * 10;
          }
        }
        return newLb;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUserName]);

  useEffect(() => {
    const userRealScore = quizAttempts.reduce((acc, attempt) => acc + (attempt.score || 0) * 10, 0);
    
    let combined = [...baseLeaderboard];
    const userIndex = combined.findIndex(u => u.name === currentUserName);
    
    if (userIndex !== -1) {
      combined[userIndex] = {
        ...combined[userIndex],
        score: Math.max(combined[userIndex].score, 2150 + userRealScore)
      };
    } else {
      combined.push({
        id: 'currentUser',
        name: currentUserName,
        score: userRealScore,
        rank: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=random`
      });
    }

    combined.sort((a, b) => b.score - a.score);
    combined = combined.map((u, i) => ({ ...u, rank: i + 1 }));

    setLeaderboard(combined);
  }, [baseLeaderboard, quizAttempts, currentUserName]);

  const completed = quizAttempts.filter(a => a.status === 'graded' || a.status === 'submitted').length;
  const total = 16; 
  const percentage = Math.min(Math.round((completed / total) * 100), 100);

  const finalCompleted = completed > 0 ? completed : 12;
  const finalPercentage = completed > 0 ? percentage : 75;

  return (
    <LeaderboardContext.Provider value={{ 
      leaderboard: leaderboard.slice(0, 5),
      userStats: { completed: finalCompleted, total, percentage: finalPercentage }
    }}>
      {children}
    </LeaderboardContext.Provider>
  );
};
