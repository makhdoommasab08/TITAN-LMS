import React, { useState } from 'react';
import { Course, Quiz, QuizAttempt } from '../types';

interface TeacherQuizzesViewProps {
  courses: Course[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  theme: 'dark' | 'light';
  onCreateQuiz: (quiz: Quiz) => void;
  onGradeAttempt: (attemptId: string, score: number) => void;
}

export const TeacherQuizzesView: React.FC<TeacherQuizzesViewProps> = ({
  courses,
  quizzes,
  attempts,
  theme,
  onCreateQuiz,
  onGradeAttempt
}) => {
  const isDark = theme === 'dark';
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !selectedCourse) return;
    
    setIsGenerating(true);
    try {
      const courseTitle = courses.find(c => c.id === selectedCourse)?.title || '';
      
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, courseTitle })
      });
      
      const data = await response.json();
      
      const newQuiz: Quiz = {
        id: `q-${Date.now()}`,
        courseId: selectedCourse,
        courseTitle,
        title: data.title || `${topic} Quiz`,
        description: data.description || 'AI Generated Quiz',
        questions: data.questions || [],
        createdAt: new Date().toLocaleDateString()
      };
      
      onCreateQuiz(newQuiz);
      setTopic('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Quiz Generator</h1>
          <p className="text-zinc-400 mt-2 text-sm">Create AI-powered quizzes for your students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <h2 className="text-lg font-bold mb-4 font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400">smart_toy</span>
                Generate Quiz
              </h2>
              <form onSubmit={handleGenerateQuiz} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Course</label>
                  <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Linear Regression"
                    className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGenerating || !topic}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">auto_awesome</span>}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </form>
            </div>
            
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
               <h2 className="text-lg font-bold mb-4 font-headline">Existing Quizzes</h2>
               <div className="space-y-3">
                 {quizzes.map(q => (
                   <div 
                     key={q.id} 
                     onClick={() => setSelectedQuiz(q)}
                     className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                       selectedQuiz?.id === q.id 
                         ? 'border-indigo-500 bg-indigo-500/10' 
                         : isDark ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-200 hover:bg-slate-100'
                     }`}
                   >
                     <h4 className="font-bold text-sm truncate">{q.title}</h4>
                     <p className="text-xs text-zinc-400 truncate">{q.courseTitle}</p>
                   </div>
                 ))}
                 {quizzes.length === 0 && (
                   <p className="text-sm text-zinc-500 text-center py-4">No quizzes generated yet.</p>
                 )}
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedQuiz ? (
              <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <h2 className="text-xl font-bold font-headline mb-2">{selectedQuiz.title}</h2>
                <p className="text-sm text-zinc-400 mb-6">{selectedQuiz.description}</p>
                
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Student Attempts</h3>
                <div className="space-y-4">
                  {attempts.filter(a => a.quizId === selectedQuiz.id).map(attempt => (
                    <div key={attempt.id} className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold">{attempt.studentName}</h4>
                          <p className="text-xs text-zinc-400">Submitted: {attempt.submittedAt}</p>
                        </div>
                        <div className="text-right">
                          {attempt.status === 'graded' ? (
                            <span className="text-emerald-400 font-bold text-lg">{attempt.score}/{selectedQuiz.questions.length}</span>
                          ) : (
                            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider px-2 py-1 bg-amber-400/10 rounded-md">Pending Review</span>
                          )}
                        </div>
                      </div>
                      
                      {attempt.status !== 'graded' && (
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-end gap-3">
                           {/* Auto-calculate based on answers */}
                           <button
                             onClick={() => {
                               let score = 0;
                               selectedQuiz.questions.forEach(q => {
                                 if (attempt.answers[q.id] === q.correctAnswerIndex) score++;
                               });
                               onGradeAttempt(attempt.id, score);
                             }}
                             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full transition-colors"
                           >
                             Auto-Grade Attempt
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {attempts.filter(a => a.quizId === selectedQuiz.id).length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-8">No student attempts yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className={`h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-[2rem] border border-dashed ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-zinc-300'}`}>
                <span className="material-symbols-outlined text-4xl text-zinc-500 mb-4">quiz</span>
                <p className="text-zinc-500 font-medium">Select a quiz to view attempts or generate a new one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
