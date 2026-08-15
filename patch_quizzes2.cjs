const fs = require('fs');
let code = fs.readFileSync('src/components/StudentQuizzesView.tsx', 'utf8');

// 1. Remove the import for StudentIDCardModal
code = code.replace("import { StudentIDCardModal } from './StudentIDCardModal';\n", "");

// 2. Remove state
code = code.replace("  const [showIdCard, setShowIdCard] = useState(false);\n", "");

// 3. Remove the modal component
const modalStr = `{showIdCard && (
        <StudentIDCardModal 
          studentName={studentName} 
          studentId={studentId} 
          theme={theme} 
          onClose={() => setShowIdCard(false)} 
        />
      )}`;
code = code.replace(modalStr, "");

// 4. Remove the button
const btnStr = `<button
            onClick={() => setShowIdCard(true)}
            className={\`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-md \${isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}\`}
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            View ID Card
          </button>`;
code = code.replace(btnStr, "");

fs.writeFileSync('src/components/StudentQuizzesView.tsx', code);
console.log('Done cleaning quizzes');
