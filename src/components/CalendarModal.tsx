import React, { useState } from 'react';
import { Deadline } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  deadlines: Deadline[];
  onClose: () => void;
  onAddDeadline: (title: string, course: string, dueDate: string) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  deadlines,
  onClose,
  onAddDeadline,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('UI/UX Design Fundamentals');
  const [newDate, setNewDate] = useState('Friday, Oct 20');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddDeadline(newTitle, newCourse, newDate);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] max-w-2xl w-full p-6 shadow-2xl border border-zinc-800 space-y-6 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">event</span>
            <h2 className="text-xl font-bold font-headline text-white">
              Course Calendar & Submissions Schedule
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Existing Deadlines */}
        <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-2">
          {deadlines.map((dl) => (
            <div
              key={dl.id}
              className="flex justify-between items-center p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800"
            >
              <div>
                <p className="font-bold text-sm text-white">{dl.title}</p>
                <p className="text-xs text-zinc-400">{dl.course}</p>
              </div>
              <span className="font-mono text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                {dl.dueDate}
              </span>
            </div>
          ))}
        </div>

        {/* Add New Deadline Form */}
        <form onSubmit={handleAdd} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 font-body">
          <h4 className="font-bold text-xs font-mono text-indigo-400 uppercase tracking-wider">
            Schedule New Deadline or Event
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Event Title..."
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-zinc-500"
              required
            />
            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>UI/UX Design Fundamentals</option>
              <option>Data Science 101</option>
              <option>Advanced Web Development</option>
              <option>Mobile App Dev (React Native)</option>
            </select>
            <input
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Due date (e.g. Oct 20)"
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-zinc-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-full text-xs font-mono font-bold hover:bg-indigo-500 transition-colors"
          >
            + Add Event To Calendar
          </button>
        </form>

        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 text-white text-xs font-mono font-bold rounded-full hover:bg-zinc-700"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
