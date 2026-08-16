import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { Course, Quiz, QuizAttempt } from '../types';
import { GlobalLeaderboard } from './GlobalLeaderboard';

interface StudentQuizzesViewProps {
  courses: Course[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  theme: 'dark' | 'light';
  onSubmitAttempt: (attempt: QuizAttempt) => void;
  studentId: string;
  studentName: string;
}

export const StudentQuizzesView: React.FC<StudentQuizzesViewProps> = ({
  courses,
  quizzes,
  attempts,
  theme,
  onSubmitAttempt,
  studentId,
  studentName
}) => {
  const isDark = theme === 'dark';
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'quizzes' | 'leaderboard'>('quizzes');
  
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!activeQuiz) return;
    
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: activeQuiz.id,
      studentId,
      studentName,
      answers,
      status: 'submitted',
      submittedAt: new Date().toLocaleString()
    };
    
    onSubmitAttempt(newAttempt);
    setActiveQuiz(null);
    setAnswers({});
  };

  if (activeQuiz) {
    const isComplete = activeQuiz.questions.every(q => answers[q.id] !== undefined);
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}
      >
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => { setActiveQuiz(null); setAnswers({}); }}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Quizzes
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">{activeQuiz.title}</h1>
            <p className="text-zinc-400 text-sm">{activeQuiz.description}</p>
          </div>
          
          <div className="space-y-8">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h3 className="text-lg font-bold mb-4 font-headline">{idx + 1}. {q.text}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        answers[q.id] === optIdx
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : isDark ? 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50' : 'border-zinc-200 hover:border-zinc-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          answers[q.id] === optIdx ? 'border-indigo-500' : isDark ? 'border-zinc-600' : 'border-zinc-300'
                        }`}>
                          {answers[q.id] === optIdx && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <span className="text-sm">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-headline">Quizzes & Rankings</h1>
            <p className="text-zinc-400 mt-2 text-sm">Test your knowledge and see how you stack up.</p>
          </div>
          
          <div className={`flex p-1 rounded-2xl border w-max ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'quizzes' 
                  ? (isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-zinc-900') 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              My Quizzes
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'leaderboard' 
                  ? (isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-zinc-900') 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'quizzes' ? (
            <motion.div 
              key="quizzes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quizzes.map(q => {
                const attempt = attempts.find(a => a.quizId === q.id && a.studentId === studentId);
                
                return (
                  <div key={q.id} className={`p-6 rounded-[2rem] border flex flex-col ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className="flex-1 mb-6">
                      <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        {q.courseTitle}
                      </span>
                      <h3 className="text-xl font-bold font-headline mb-2">{q.title}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2">{q.description}</p>
                    </div>
                    
                    {attempt ? (
                      <div className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                        <span className="text-xs font-bold text-zinc-400">Status</span>
                        {attempt.status === 'graded' ? (
                          <span className="text-emerald-400 font-bold text-sm">{attempt.score}/{q.questions.length}</span>
                        ) : (
                          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveQuiz(q)}
                        className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl font-bold text-sm transition-all border border-indigo-500/20"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                );
              })}
              
              {quizzes.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  <span className="material-symbols-outlined text-4xl mb-4">quiz</span>
                  <p>No quizzes available at the moment.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <GlobalLeaderboard theme={theme} currentUserName={studentName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
