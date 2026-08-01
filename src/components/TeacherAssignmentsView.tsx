import React, { useState } from 'react';
import { Course, Assignment, AssignmentSubmission } from '../types';

interface TeacherAssignmentsViewProps {
  courses: Course[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  theme: 'dark' | 'light';
}

export const TeacherAssignmentsView: React.FC<TeacherAssignmentsViewProps> = ({
  courses,
  assignments,
  submissions,
  onCreateAssignment,
  onGradeSubmission,
  theme
}) => {
  const isDark = theme === 'dark';
  
  // Create Assignment State
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Grading State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number | ''>('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === newCourseId);
    if (!course || !newTitle || !newDueDate) return;

    onCreateAssignment({
      title: newTitle,
      courseTitle: course.title,
      description: newDescription,
      dueDate: newDueDate
    });

    setIsCreating(false);
    setNewTitle('');
    setNewCourseId('');
    setNewDescription('');
    setNewDueDate('');
  };

  const handleGradeSubmit = (submissionId: string) => {
    if (gradeScore === '') return;
    onGradeSubmission(submissionId, Number(gradeScore), gradeFeedback);
    setGradingSubmissionId(null);
    setGradeScore('');
    setGradeFeedback('');
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-8 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Assignments & Grading</h1>
          <p className={`font-body text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Manage course assignments and evaluate student submissions.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20"
        >
          <span className="material-symbols-outlined text-base">{isCreating ? 'close' : 'add'}</span>
          {isCreating ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {isCreating && (
        <div className={`p-6 rounded-[2rem] border shadow-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <h2 className="font-headline font-bold text-xl mb-4">Create New Assignment</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Course</label>
                <select
                  required
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    isDark ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                  }`}
                >
                  <option value="">Select a course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    isDark ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Assignment Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Final Project Report"
                className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600' : 'bg-slate-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Description / Instructions</label>
              <textarea
                required
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe what needs to be submitted..."
                className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600' : 'bg-slate-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-md"
              >
                Post Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grading Queue Section */}
      <section className="space-y-4">
        <h2 className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">rule</span>
          Grading Queue
          {pendingSubmissions.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">{pendingSubmissions.length} pending</span>
          )}
        </h2>

        {pendingSubmissions.length === 0 ? (
          <div className={`p-8 text-center rounded-[2rem] border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
            <p className="text-zinc-500 font-mono text-sm">No pending submissions to grade.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingSubmissions.map((submission) => {
              const assignment = assignments.find(a => a.id === submission.assignmentId);
              if (!assignment) return null;

              return (
                <div key={submission.id} className={`p-6 border rounded-[2rem] transition-all ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 shadow-sm text-zinc-900'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-500">
                          {assignment.courseTitle}
                        </span>
                        <span className="text-xs text-zinc-500">Submitted by <strong>{submission.studentName}</strong></span>
                      </div>
                      <h3 className="font-bold text-lg">{assignment.title}</h3>
                    </div>
                    {gradingSubmissionId !== submission.id && (
                      <button
                        onClick={() => setGradingSubmissionId(submission.id)}
                        className="px-5 py-2.5 rounded-full bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white font-mono text-xs font-bold transition-all shrink-0"
                      >
                        Evaluate
                      </button>
                    )}
                  </div>

                  {gradingSubmissionId === submission.id && (
                    <div className={`mt-6 p-5 border rounded-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                      <h4 className="font-mono text-xs font-bold uppercase text-zinc-500 mb-2">Student Submission Content</h4>
                      <div className={`p-4 rounded-xl text-sm mb-6 ${isDark ? 'bg-zinc-900' : 'bg-white'} border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap`}>
                        {submission.content}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-mono font-bold uppercase text-zinc-500 mb-1.5">Score (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradeScore}
                            onChange={(e) => setGradeScore(e.target.value ? Number(e.target.value) : '')}
                            placeholder="e.g. 95"
                            className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-bold uppercase text-zinc-500 mb-1.5">Feedback</label>
                          <input
                            type="text"
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            placeholder="Optional feedback..."
                            className={`w-full p-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setGradingSubmissionId(null)}
                          className={`px-4 py-2 rounded-full font-bold text-xs transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'}`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleGradeSubmit(submission.id)}
                          disabled={gradeScore === ''}
                          className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md"
                        >
                          Submit Grade
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Graded History Section */}
      {gradedSubmissions.length > 0 && (
        <section className="space-y-4 pt-8">
          <h2 className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">verified</span>
            Recent Evaluations
          </h2>
          <div className="grid gap-3">
            {gradedSubmissions.map((submission) => {
              const assignment = assignments.find(a => a.id === submission.assignmentId);
              return (
                <div key={submission.id} className={`p-4 border rounded-2xl flex items-center justify-between ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-white border-zinc-200 shadow-sm'
                }`}>
                  <div>
                    <h4 className="font-bold text-sm">{assignment?.title || 'Unknown Assignment'}</h4>
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Student: {submission.studentName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{submission.score}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  );
};
