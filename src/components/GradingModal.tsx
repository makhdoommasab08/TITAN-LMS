import React, { useState } from 'react';
import { GradingQueueItem } from '../types';

interface GradingModalProps {
  item: GradingQueueItem | null;
  onClose: () => void;
  onGradeSubmit: (itemId: string, grade: string, feedback: string) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  item,
  onClose,
  onGradeSubmit,
}) => {
  const [score, setScore] = useState('95');
  const [feedback, setFeedback] = useState('Excellent structural analysis! Clear regression graphs and well-formatted calculations.');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGradeSubmit(item.id, score, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] max-w-xl w-full p-6 shadow-2xl border border-zinc-800 space-y-6 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div>
            <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-1 inline-block">
              {item.type} Evaluation
            </span>
            <h2 className="text-xl font-bold font-headline text-white">{item.title}</h2>
            <p className="text-xs text-zinc-400">{item.course}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-zinc-400">Student Submission:</span>
              <span className="font-bold text-indigo-400">
                {item.studentName || 'Jordan Smith (24 Submissions total)'}
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed italic">
              "Attached PDF document: Structural_Analysis_v2.pdf with stress vector diagrams and load test formulas."
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
              Score (out of 100):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 text-white rounded-full font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
              Teacher Feedback:
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 text-white rounded-2xl text-xs font-body focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Provide constructive feedback for the student..."
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
              Submit Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
