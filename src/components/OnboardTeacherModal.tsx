import React, { useState } from 'react';

interface OnboardTeacherModalProps {
  type: 'teacher' | 'lesson' | 'announcement' | 'settings' | null;
  onClose: () => void;
  onSubmitAction: (field1: string, field2: string, field3?: string) => void;
}

export const OnboardTeacherModal: React.FC<OnboardTeacherModalProps> = ({
  type,
  onClose,
  onSubmitAction,
}) => {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');

  if (!type) return null;

  const getTitle = () => {
    if (type === 'teacher') return 'Onboard New Teacher';
    if (type === 'lesson') return 'Create New Course';
    if (type === 'announcement') return 'Post Global Announcement';
    return 'Global App Settings';
  };

  const getLabel1 = () => {
    if (type === 'teacher') return 'Teacher Name';
    if (type === 'lesson') return 'Course Title';
    if (type === 'announcement') return 'Announcement Title';
    return 'System Name';
  };

  const getLabel2 = () => {
    if (type === 'teacher') return 'Department / Subject Specialization';
    if (type === 'lesson') return 'Course Description / Syllabus Details';
    if (type === 'announcement') return 'Announcement Message';
    return 'Configuration Parameter';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAction(field1, field2, field3);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] max-w-lg w-full p-6 shadow-2xl border border-zinc-800 space-y-6 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold font-headline text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
              {getLabel1()}:
            </label>
            <input
              type="text"
              value={field1}
              onChange={(e) => setField1(e.target.value)}
              placeholder={`Enter ${getLabel1().toLowerCase()}...`}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-zinc-500"
              required
            />
          </div>
          {type === 'lesson' && (
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                Video Link (Optional):
              </label>
              <input
                type="url"
                value={field3}
                onChange={(e) => setField3(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-zinc-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
              {getLabel2()}:
            </label>
            <textarea
              rows={3}
              value={field2}
              onChange={(e) => setField2(e.target.value)}
              placeholder={`Enter ${getLabel2().toLowerCase()}...`}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-zinc-500"
              required
            />
          </div>
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 shadow-xs"
            >
              Save & Execute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
