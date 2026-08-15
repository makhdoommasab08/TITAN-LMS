const fs = require('fs');
let code = fs.readFileSync('src/components/StudentQuizzesView.tsx', 'utf8');

// We need to add the import for StudentIDCardModal
code = code.replace(
  "import { Course, Quiz, QuizAttempt, QuizQuestion } from '../types';",
  "import { Course, Quiz, QuizAttempt, QuizQuestion } from '../types';\nimport { StudentIDCardModal } from './StudentIDCardModal';"
);

// We need to add the state for showIdCard
code = code.replace(
  "const [answers, setAnswers] = useState<Record<string, number>>({});",
  "const [answers, setAnswers] = useState<Record<string, number>>({});\n  const [showIdCard, setShowIdCard] = useState(false);\n\n  const studentScores = new Map<string, {name: string, score: number}>();\n  attempts.forEach(a => {\n    if (a.status === 'graded' && a.score !== undefined) {\n      const existing = studentScores.get(a.studentId);\n      if (existing) {\n        existing.score += a.score;\n      } else {\n        studentScores.set(a.studentId, { name: a.studentName, score: a.score });\n      }\n    }\n  });\n  const globalLeaderboard = Array.from(studentScores.entries())\n    .map(([id, data]) => ({ id, name: data.name, score: data.score }))\n    .sort((a, b) => b.score - a.score)\n    .slice(0, 5);"
);

// Now we need to modify the default return.
// The default return starts with `return (\n    <div className={\`p-8 min-h-screen...`

const oldReturnStr = `  return (
    <div className={\`p-8 min-h-screen \${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}\`}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Assigned Quizzes</h1>
          <p className={\`mt-2 text-sm \${isDark ? 'text-zinc-400' : 'text-zinc-500'}\`}>Test your knowledge on course topics.</p>
        </div>`;

const newReturnStr = `  return (
    <div className={\`p-8 min-h-screen \${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}\`}>
      {showIdCard && (
        <StudentIDCardModal 
          studentName={studentName} 
          studentId={studentId} 
          theme={theme} 
          onClose={() => setShowIdCard(false)} 
        />
      )}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Assigned Quizzes</h1>
            <p className={\`mt-2 text-sm \${isDark ? 'text-zinc-400' : 'text-zinc-500'}\`}>Test your knowledge on course topics.</p>
          </div>
          <button
            onClick={() => setShowIdCard(true)}
            className={\`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-md \${isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}\`}
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            View ID Card
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">`;

code = code.replace(oldReturnStr, newReturnStr);

// Now we need to wrap the quizzes grid properly and add the sidebar
const oldGridEndStr = `          {quizzes.length === 0 && (
            <div className={\`col-span-full py-12 text-center \${isDark ? 'text-zinc-500' : 'text-zinc-400'}\`}>
              <span className="material-symbols-outlined text-4xl mb-4">quiz</span>
              <p>No quizzes available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`;

const newGridEndStr = `          {quizzes.length === 0 && (
            <div className={\`col-span-full py-12 text-center \${isDark ? 'text-zinc-500' : 'text-zinc-400'}\`}>
              <span className="material-symbols-outlined text-4xl mb-4">quiz</span>
              <p>No quizzes available at the moment.</p>
            </div>
          )}
        </div>
        </div>
        
        {/* Global Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <div className={\`p-6 rounded-[2rem] border \${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} sticky top-8\`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-500'}\`}>
                <span className="material-symbols-outlined text-xl">social_leaderboard</span>
              </div>
              <h2 className="text-xl font-bold font-headline">Global Top 5</h2>
            </div>
            
            <div className="space-y-4">
              {globalLeaderboard.length === 0 ? (
                <p className={\`text-sm text-center py-4 \${isDark ? 'text-zinc-500' : 'text-zinc-400'}\`}>
                  No quiz scores yet.
                </p>
              ) : (
                globalLeaderboard.map((student, idx) => (
                  <div key={student.id} className={\`flex items-center gap-3 p-3 rounded-2xl border transition-colors \${
                    student.id === studentId 
                      ? (isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200') 
                      : (isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-100')
                  }\`}>
                    <div className={\`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 text-xs \${
                        idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                        idx === 1 ? 'bg-zinc-300/20 text-zinc-400 border border-zinc-300/30' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        isDark ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-white text-zinc-400 border-zinc-200 shadow-sm'
                      }\`}>
                        #{idx + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-bold font-headline truncate">
                        {student.name}
                        {student.id === studentId && (
                           <span className="ml-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">You</span>
                        )}
                      </h4>
                      <p className={\`text-[10px] font-bold tracking-wider uppercase \${isDark ? 'text-indigo-400' : 'text-indigo-500'}\`}>
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
  );
};`;

code = code.replace(oldGridEndStr, newGridEndStr);

fs.writeFileSync('src/components/StudentQuizzesView.tsx', code);
console.log('patched');
