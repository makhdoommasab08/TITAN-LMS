import React from 'react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] max-w-2xl w-full p-6 shadow-2xl border border-zinc-800 space-y-6 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold font-headline text-white">
              Learning Analytics & Mastery
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time velocity tracking and skill mastery breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 font-mono text-center">
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <p className="text-2xl font-black text-indigo-400">12%</p>
            <p className="text-[10px] text-zinc-400 uppercase mt-1">Skill Mastery Growth</p>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <p className="text-2xl font-black text-emerald-400">18.4 hrs</p>
            <p className="text-[10px] text-emerald-400 uppercase mt-1">Study Time This Week</p>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <p className="text-2xl font-black text-amber-400">94%</p>
            <p className="text-[10px] text-amber-400 uppercase mt-1">Quiz Accuracy</p>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-4">
          <h4 className="font-headline font-bold text-sm text-white">
            Subject Mastery Breakdown
          </h4>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">Supervised Machine Learning & Data Science</span>
              <span className="font-bold text-indigo-400">88%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[88%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">UI Design Tokens & Figma Systems</span>
              <span className="font-bold text-purple-400">72%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[72%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-zinc-300">React 19 Hooks & WebGL Fragment Shaders</span>
              <span className="font-bold text-emerald-400">95%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[95%]" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold font-mono rounded-full hover:bg-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
