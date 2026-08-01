import React, { useState } from 'react';
import { Course, Assignment, AssignmentSubmission } from '../types';

interface StudentAssignmentsViewProps {
  courses: Course[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  onSubmitAssignment: (assignmentId: string, content: string) => void;
  studentId: string;
  theme: 'dark' | 'light';
}

export const StudentAssignmentsView: React.FC<StudentAssignmentsViewProps> = ({
  courses,
  assignments,
  submissions,
  onSubmitAssignment,
  studentId,
  theme
}) => {
  const isDark = theme === 'dark';
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  const handleOpenSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionContent('');
  };

  const handleSubmit = () => {
    if (selectedAssignment && submissionContent.trim()) {
      onSubmitAssignment(selectedAssignment.id, submissionContent);
      setSelectedAssignment(null);
      setSubmissionContent('');
    }
  };

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-6 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Assignments & Submissions</h1>
          <p className={`font-body text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            View upcoming tasks, submit your work, and review teacher feedback.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className={`p-8 text-center rounded-[2rem] border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
            <p className="text-zinc-500 font-mono text-sm">No assignments posted yet.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const submission = submissions.find(
              (s) => s.assignmentId === assignment.id && s.studentId === studentId
            );

            return (
              <div
                key={assignment.id}
                className={`p-6 border rounded-[2rem] flex flex-col gap-4 transition-all ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-white'
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0 mt-1">
                      <span className="material-symbols-outlined text-2xl">assignment</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-500">
                          {assignment.courseTitle}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-500">
                          Due: {assignment.dueDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{assignment.title}</h3>
                      <p className={`text-sm mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {assignment.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {!submission ? (
                       <button
                         onClick={() => handleOpenSubmit(assignment)}
                         className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                       >
                         <span className="material-symbols-outlined text-base">upload_file</span>
                         Submit Work
                       </button>
                    ) : (
                      <div className={`px-4 py-3 rounded-xl border flex flex-col items-end text-sm ${
                        submission.status === 'graded' 
                          ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                         <div className="flex items-center gap-1.5 font-bold mb-1">
                           <span className="material-symbols-outlined text-base">
                             {submission.status === 'graded' ? 'verified' : 'pending'}
                           </span>
                           {submission.status === 'graded' ? 'Graded' : 'Submitted (Pending Review)'}
                         </div>
                         {submission.status === 'graded' && (
                           <>
                             <div className="text-xl font-black mb-1">{submission.score}%</div>
                             {submission.feedback && (
                               <p className="text-xs max-w-[200px] text-right italic opacity-80">"{submission.feedback}"</p>
                             )}
                           </>
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Form Inline */}
                {selectedAssignment?.id === assignment.id && !submission && (
                  <div className={`mt-4 p-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                     <label className="block text-xs font-mono font-bold mb-2 uppercase tracking-wider text-zinc-500">
                       Your Submission (Text or Links)
                     </label>
                     <textarea
                       value={submissionContent}
                       onChange={(e) => setSubmissionContent(e.target.value)}
                       placeholder="Paste your assignment content, GitHub link, or Google Doc link here..."
                       rows={4}
                       className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm transition-colors ${
                         isDark 
                           ? 'bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600' 
                           : 'bg-slate-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                       }`}
                     />
                     <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                          onClick={() => setSelectedAssignment(null)}
                          className={`px-4 py-2 rounded-full font-bold text-xs transition-colors ${
                            isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!submissionContent.trim()}
                          className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md"
                        >
                          Confirm Submit
                        </button>
                     </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
