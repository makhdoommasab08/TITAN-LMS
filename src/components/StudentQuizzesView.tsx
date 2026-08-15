import React, { useState } from 'react';
import { Course, Quiz, QuizAttempt, QuizQuestion } from '../types';

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
  const [leaderboardQuizId, setLeaderboardQuizId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
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

  if (leaderboardQuizId) {
    const quiz = quizzes.find(q => q.id === leaderboardQuizId);
    if (!quiz) return null;

    // Filter graded attempts and group by student, keeping their highest score
    const quizAttempts = attempts.filter(a => a.quizId === leaderboardQuizId && a.status === 'graded' && a.score !== undefined);
    const studentBestAttempts = new Map<string, QuizAttempt>();
    
    quizAttempts.forEach(a => {
      const existing = studentBestAttempts.get(a.studentId);
      if (!existing || a.score! > existing.score!) {
        studentBestAttempts.set(a.studentId, a);
      }
    });

    const leaderboard = Array.from(studentBestAttempts.values())
      .sort((a, b) => b.score! - a.score!)
      .slice(0, 10); // Top 10

    return (
      <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setLeaderboardQuizId(null)}
            className={`flex items-center gap-2 text-sm mb-6 transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Quizzes
          </button>
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline mb-2">{quiz.title}</h1>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Top performers leaderboard</p>
            </div>
            <div className={`p-4 rounded-2xl border flex items-center justify-center ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-500'}`}>
               <span className="material-symbols-outlined text-4xl">trophy</span>
            </div>
          </div>

          <div className={`rounded-[2rem] border overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800 shadow-xl' : 'bg-white border-zinc-200 shadow-sm'}`}>
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center">
                <span className={`material-symbols-outlined text-4xl mb-4 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>leaderboard</span>
                <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>No graded attempts yet. Be the first to conquer this quiz!</p>
              </div>
            ) : (
              <div className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                {leaderboard.map((a, idx) => (
                  <div key={a.id} className={`p-6 flex items-center justify-between transition-colors ${
                    a.studentId === studentId 
                      ? (isDark ? 'bg-indigo-900/20' : 'bg-indigo-50/50') 
                      : (isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-slate-50')
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 ${
                        idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                        idx === 1 ? 'bg-zinc-300/20 text-zinc-400 border border-zinc-300/30' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-zinc-500'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold font-headline flex items-center gap-2">
                          {a.studentName} 
                          {a.studentId === studentId && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">You</span>
                          )}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Submitted: {a.submittedAt}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-2xl text-indigo-500">{a.score}</div>
                      <div className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const isComplete = activeQuiz.questions.every(q => answers[q.id] !== undefined);
    return (
      <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => { setActiveQuiz(null); setAnswers({}); }}
            className={`flex items-center gap-2 text-sm mb-6 transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Quizzes
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">{activeQuiz.title}</h1>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{activeQuiz.description}</p>
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
      </div>
    );
  }

  // Calculate global leaderboard
  const studentScores = new Map<string, {name: string, score: number}>();
  attempts.forEach(a => {
    if (a.status === 'graded' && a.score !== undefined) {
      const existing = studentScores.get(a.studentId);
      if (existing) {
        existing.score += a.score;
      } else {
        studentScores.set(a.studentId, { name: a.studentName, score: a.score });
      }
    }
  });
  const globalLeaderboard = Array.from(studentScores.entries())
    .map(([id, data]) => ({ id, name: data.name, score: data.score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Assigned Quizzes</h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Test your knowledge on course topics.</p>
          </div>
          
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(q => {
                const attempt = attempts.find(a => a.quizId === q.id && a.studentId === studentId);
                
                return (
                  <div key={q.id} className={`p-6 rounded-[2rem] border flex flex-col ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className="flex-1 mb-6">
                      <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        {q.courseTitle}
                      </span>
                      <h3 className="text-xl font-bold font-headline mb-2">{q.title}</h3>
                      <p className={`text-sm line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{q.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {attempt ? (
                        <div className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                          <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Status</span>
                          {attempt.status === 'graded' ? (
                            <span className="text-emerald-500 font-bold text-sm">{attempt.score}/{q.questions.length}</span>
                          ) : (
                            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveQuiz(q)}
                          className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-500 rounded-xl font-bold text-sm transition-all border border-indigo-500/20"
                        >
                          Start Quiz
                        </button>
                      )}
                      
                      <button
                        onClick={() => setLeaderboardQuizId(q.id)}
                        className={`w-full py-2 flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition-all border ${
                          isDark ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm text-amber-500">leaderboard</span>
                        View Leaderboard
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {quizzes.length === 0 && (
                <div className={`col-span-full py-12 text-center ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <span className="material-symbols-outlined text-4xl mb-4">quiz</span>
                  <p>No quizzes available at the moment.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Global Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} sticky top-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
                  <span className="material-symbols-outlined text-xl">social_leaderboard</span>
                </div>
                <h2 className="text-xl font-bold font-headline">Global Top 5</h2>
              </div>
              
              <div className="space-y-4">
                {globalLeaderboard.length === 0 ? (
                  <p className={`text-sm text-center py-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    No quiz scores yet.
                  </p>
                ) : (
                  globalLeaderboard.map((student, idx) => (
                    <div key={student.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      student.id === studentId 
                        ? (isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200') 
                        : (isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-100')
                    }`}>
                      <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 text-xs ${
                          idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                          idx === 1 ? 'bg-zinc-300/20 text-zinc-400 border border-zinc-300/30' :
                          idx === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          isDark ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-white text-zinc-400 border-zinc-200 shadow-sm'
                        }`}>
                          #{idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold font-headline truncate">
                          {student.name}
                          {student.id === studentId && (
                             <span className="ml-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">You</span>
                          )}
                        </h4>
                        <p className={`text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>
                          {student.score} pts
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
