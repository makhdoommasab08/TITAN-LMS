import React, { useState, useEffect } from 'react';
import { Course, Deadline, StudyPlan, StudyBlock } from '../types';

interface StudentGradeInfo {
  courseId: string;
  courseTitle: string;
  gradeLetter: string;
  gradePercent: number;
  focusWeight: 'high' | 'normal' | 'maintenance';
}

interface StudyPlannerViewProps {
  courses: Course[];
  deadlines: Deadline[];
  theme?: 'dark' | 'light';
  userName?: string;
  onNavigateToCourse?: (courseId: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  courses,
  deadlines: initialDeadlines,
  theme = 'dark',
  userName = 'Masab',
  onNavigateToCourse
}) => {
  const isDark = theme === 'dark';

  // Default mock grade performance mapped from registered courses
  const [grades, setGrades] = useState<StudentGradeInfo[]>(() => [
    {
      courseId: 'course-ds101',
      courseTitle: 'Data Science & Machine Learning 101',
      gradeLetter: 'C+',
      gradePercent: 74,
      focusWeight: 'high'
    },
    {
      courseId: 'course-ux202',
      courseTitle: 'UI/UX Design Systems & Prototyping',
      gradeLetter: 'A-',
      gradePercent: 89,
      focusWeight: 'normal'
    },
    {
      courseId: 'course-ai303',
      courseTitle: 'Deep Learning & Neural Networks',
      gradeLetter: 'B',
      gradePercent: 82,
      focusWeight: 'high'
    }
  ]);

  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines || [
    {
      id: 'd1',
      title: 'Module 4: Linear Regression Lab',
      course: 'Data Science & Machine Learning 101',
      dueDate: 'Tomorrow, 11:59 PM',
      dueLabel: 'Due in 1 day',
      priority: 'high'
    },
    {
      id: 'd2',
      title: 'Figma Design System Component Review',
      course: 'UI/UX Design Systems & Prototyping',
      dueDate: 'In 3 days',
      dueLabel: 'Due in 3 days',
      priority: 'medium'
    },
    {
      id: 'd3',
      title: 'Neural Network Optimization Quiz',
      course: 'Deep Learning & Neural Networks',
      dueDate: 'In 5 days',
      dueLabel: 'Due in 5 days',
      priority: 'medium'
    }
  ]);

  // Planner inputs
  const [availableHours, setAvailableHours] = useState<number>(3.5);
  const [preferredSlots, setPreferredSlots] = useState<string[]>(['Morning', 'Evening']);
  const [studyStrategy, setStudyStrategy] = useState<string>('Remedial Focus (Weakest Grades First)');
  const [customNote, setCustomNote] = useState<string>('Need extra practice on Linear Regression equations before tomorrow’s lab deadline.');

  // New deadline modal / form
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState<boolean>(false);
  const [newDeadlineTitle, setNewDeadlineTitle] = useState<string>('');
  const [newDeadlineCourse, setNewDeadlineCourse] = useState<string>(courses[0]?.title || 'Data Science 101');
  const [newDeadlineDate, setNewDeadlineDate] = useState<string>('In 2 days');
  const [newDeadlinePriority, setNewDeadlinePriority] = useState<'high' | 'medium' | 'low'>('high');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);

  // Refine input
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Load saved plan or auto-generate initial
  useEffect(() => {
    const saved = localStorage.getItem('titan_study_plan');
    if (saved) {
      try {
        setCurrentPlan(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse stored study plan', e);
      }
    } else {
      generatePlan();
    }
  }, []);

  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineTitle.trim()) return;

    const newItem: Deadline = {
      id: `custom-d-${Date.now()}`,
      title: newDeadlineTitle.trim(),
      course: newDeadlineCourse,
      dueDate: newDeadlineDate,
      dueLabel: newDeadlineDate,
      priority: newDeadlinePriority
    };

    setDeadlines((prev) => [newItem, ...prev]);
    setNewDeadlineTitle('');
    setShowAddDeadlineModal(false);
  };

  const handleGradeChange = (courseId: string, field: keyof StudentGradeInfo, value: any) => {
    setGrades((prev) =>
      prev.map((g) => (g.courseId === courseId ? { ...g, [field]: value } : g))
    );
  };

  const togglePreferredSlot = (slot: string) => {
    if (preferredSlots.includes(slot)) {
      if (preferredSlots.length > 1) {
        setPreferredSlots(preferredSlots.filter((s) => s !== slot));
      }
    } else {
      setPreferredSlots([...preferredSlots, slot]);
    }
  };

  const generatePlan = async (overrideNote?: string) => {
    setIsGenerating(true);
    setGenStep('Evaluating course performance & grade vulnerabilities...');

    setTimeout(() => {
      setGenStep('Cross-referencing upcoming assignment deadlines...');
    }, 600);

    setTimeout(() => {
      setGenStep('Synthesizing optimal focus time blocks with TITAN AI...');
    }, 1200);

    try {
      const response = await fetch('/api/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses: grades.map((g) => ({
            id: g.courseId,
            title: g.courseTitle,
            gradePercent: g.gradePercent,
            gradeLetter: g.gradeLetter,
            focusWeight: g.focusWeight
          })),
          deadlines: deadlines.map((d) => ({
            id: d.id,
            title: d.title,
            course: d.course,
            dueDate: d.dueDate,
            priority: d.priority
          })),
          availableHours,
          preferredSlots,
          studyStrategy,
          customNote: overrideNote || customNote,
          studentName: userName
        })
      });

      const data = await response.json();
      if (data && Array.isArray(data.scheduleBlocks)) {
        data.createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCurrentPlan(data);
        localStorage.setItem('titan_study_plan', JSON.stringify(data));
      } else {
        console.warn('Study planner returned unexpected format:', data);
      }
    } catch (err) {
      console.error('Error generating study plan:', err);
    } finally {
      setIsGenerating(false);
      setGenStep('');
    }
  };

  const toggleBlockCompletion = (blockId: string) => {
    if (!currentPlan || !Array.isArray(currentPlan.scheduleBlocks)) return;

    const updatedBlocks = currentPlan.scheduleBlocks.map((b) =>
      b.id === blockId ? { ...b, completed: !b.completed } : b
    );

    const updatedPlan = { ...currentPlan, scheduleBlocks: updatedBlocks };
    setCurrentPlan(updatedPlan);
    localStorage.setItem('titan_study_plan', JSON.stringify(updatedPlan));
  };

  const handleRefineSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim() || isRefining) return;

    setIsRefining(true);
    const combinedNote = `Adjustment request: "${refinePrompt}". Original note: "${customNote}"`;
    await generatePlan(combinedNote);
    setRefinePrompt('');
    setIsRefining(false);
  };

  const blocks = currentPlan?.scheduleBlocks || [];
  const completedBlocksCount = blocks.filter((b) => b.completed).length;
  const totalBlocksCount = blocks.length;
  const completionPercentage = totalBlocksCount > 0 ? Math.round((completedBlocksCount / totalBlocksCount) * 100) : 0;

  const downloadPlan = () => {
    if (!currentPlan) return;
    const textContent = `TITAN AI ACADEMIC STUDY PLAN
Student: ${userName}
Generated: ${currentPlan.createdAt || 'Today'}
Headline: ${currentPlan.headline}
Strategy: ${currentPlan.summaryStrategy}

SCHEDULE BLOCKS:
${(currentPlan.scheduleBlocks || [])
  .map(
    (b, idx) =>
      `${idx + 1}. [${b.completed ? '✓ DONE' : 'PENDING'}] ${b.timeSlot} | ${b.courseTitle}\n   Task: ${b.activityTitle} (${b.durationMinutes} mins)\n   Tip: ${b.studyTip || 'Focus on active recall'}\n`
  )
  .join('\n')}

AI RECOMMENDATIONS:
${(currentPlan.aiRecommendations || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

WEEKLY GOAL:
${currentPlan.weeklyGoalSummary}
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TITAN_Study_Plan_${userName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-8 py-8 space-y-8 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
    }`}>
      {/* Header Banner */}
      <div className={`border p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl transition-all ${
        isDark ? 'bg-gradient-to-r from-zinc-900 via-indigo-950/60 to-zinc-900 border-indigo-500/30' : 'bg-gradient-to-r from-white via-indigo-50 to-slate-50 border-indigo-200'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                TITAN AI Advisor
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.6 Connected
              </span>
            </div>

            <h1 className="font-headline text-2xl sm:text-4xl font-bold tracking-tight">
              AI-Powered <span className="text-indigo-400 italic">Smart Study Planner</span>
            </h1>

            <p className={`text-xs sm:text-sm font-body ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Automatically aligns your daily study blocks with registered courses, upcoming exam deadlines, and current grade performance gaps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => generatePlan()}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-full font-bold text-xs active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 font-mono disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-lg ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'sync' : 'bolt'}
              </span>
              <span>{isGenerating ? 'Generating...' : 'Re-Generate AI Plan'}</span>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Inputs Column & Plan Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Academic Context & Input Parameters */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Registered Courses & Current Grade Performance */}
          <div className={`p-6 rounded-[2rem] border transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline font-bold text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400 text-xl">grade</span>
                  Registered Courses & Grades
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">Current academic standings at TITAN</p>
              </div>
            </div>

            <div className="space-y-3">
              {grades.map((g) => (
                <div
                  key={g.courseId}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    g.gradePercent < 75
                      ? 'bg-red-500/10 border-red-500/30'
                      : g.gradePercent < 85
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : isDark
                      ? 'bg-zinc-950 border-zinc-800'
                      : 'bg-slate-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-xs truncate font-headline">{g.courseTitle}</span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                      g.gradePercent < 75
                        ? 'bg-red-500 text-white'
                        : g.gradePercent < 85
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-emerald-500 text-zinc-950'
                    }`}>
                      {g.gradeLetter} ({g.gradePercent}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Focus Priority:</span>
                    <select
                      value={g.focusWeight}
                      onChange={(e) => handleGradeChange(g.courseId, 'focusWeight', e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                      }`}
                    >
                      <option value="high">High Focus (Vulnerable Grade)</option>
                      <option value="normal">Normal Focus</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Deadlines & Assignments */}
          <div className={`p-6 rounded-[2rem] border transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline font-bold text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-xl">event_upcoming</span>
                  Upcoming Deadlines
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">Exams, assignments & lab submissions</p>
              </div>
              <button
                onClick={() => setShowAddDeadlineModal(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    dl.priority === 'high'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                      : 'bg-slate-50 border-zinc-200 text-zinc-800'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">{dl.title}</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">{dl.course}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    dl.priority === 'high' ? 'bg-rose-500/30 text-rose-300' : 'bg-zinc-700/40 text-zinc-300'
                  }`}>
                    {dl.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Schedule Preferences (Hours, Slots, Strategy) */}
          <div className={`p-6 rounded-[2rem] border space-y-5 transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h3 className="font-headline font-bold text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-xl">tune</span>
              Study Settings & Strategy
            </h3>

            {/* Daily Available Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
                <span className="text-zinc-400 font-bold">Daily Study Budget:</span>
                <span className="text-indigo-400 font-black text-sm">{availableHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-1">
                <span>1h (Light)</span>
                <span>3.5h (Standard)</span>
                <span>8h (Marathon)</span>
              </div>
            </div>

            {/* Preferred Time Slots */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 font-bold mb-2">
                Preferred Study Windows:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map((slot) => {
                  const active = preferredSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => togglePreferredSlot(slot)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-between ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : isDark
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                          : 'bg-slate-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <span>{slot}</span>
                      {active && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strategy Mode */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 font-bold mb-1.5">
                Target AI Strategy Mode:
              </label>
              <select
                value={studyStrategy}
                onChange={(e) => setStudyStrategy(e.target.value)}
                className={`w-full p-2.5 rounded-xl font-mono text-xs font-bold border focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                }`}
              >
                <option value="Remedial Focus (Weakest Grades First)">Remedial Focus (Weakest Grades First)</option>
                <option value="Exam Sprint Mode">Exam Sprint Mode (Near Deadlines First)</option>
                <option value="Balanced Distribution">Balanced Distribution Across All Courses</option>
                <option value="Deep Work Pomodoro (75-min Blocks)">Deep Work Pomodoro (75-min Blocks)</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 font-bold mb-1.5">
                Special Directives for Gemini:
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Focus on Linear Regression problem set, or save evening for lab assignment..."
                rows={2}
                className={`w-full p-3 rounded-xl font-body text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500' : 'bg-slate-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): AI Generated Schedule & Interactive Checklist */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loading state skeleton/overlay */}
          {isGenerating && (
            <div className={`p-10 rounded-[2.5rem] border text-center space-y-4 animate-pulse ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-indigo-400' : 'bg-white border-zinc-200 text-indigo-600'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl animate-spin text-indigo-400">auto_awesome</span>
              </div>
              <h3 className="font-headline font-bold text-lg">Synthesizing Your Schedule</h3>
              <p className="font-mono text-xs text-zinc-400">{genStep}</p>
            </div>
          )}

          {!isGenerating && currentPlan && (
            <div className="space-y-6">
              
              {/* Daily Progress Gauge Bar */}
              <div className={`p-6 rounded-[2.5rem] border transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">
                      DAILY STUDY EXECUTION
                    </span>
                    <h2 className="font-headline font-bold text-xl sm:text-2xl mt-0.5">{currentPlan.headline}</h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-emerald-400">{completionPercentage}%</span>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">Progress</p>
                    </div>
                    <button
                      onClick={downloadPlan}
                      className={`p-2.5 rounded-full border transition-colors ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-slate-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
                      }`}
                      title="Download Schedule (.txt)"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`h-3 w-full rounded-full overflow-hidden mb-4 ${isDark ? 'bg-zinc-950' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {/* AI Rationale Summary */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-body ${
                  isDark ? 'bg-zinc-950/80 border-indigo-500/20 text-zinc-300' : 'bg-indigo-50/60 border-indigo-200 text-zinc-800'
                }`}>
                  <span className="font-bold text-indigo-400 font-mono uppercase text-[10px] block mb-1">
                    ✦ Gemini Strategy Rationale
                  </span>
                  {currentPlan.summaryStrategy}
                </div>
              </div>

              {/* Schedule Blocks Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs px-2">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Recommended Blocks ({completedBlocksCount}/{totalBlocksCount} Completed)
                  </span>
                  <span className="text-indigo-400">Target Budget: {currentPlan.dailyTargetHours}h</span>
                </div>

                {(currentPlan?.scheduleBlocks || []).map((block) => {
                  const isHigh = block.focusLevel === 'High';
                  const isMed = block.focusLevel === 'Medium';

                  return (
                    <div
                      key={block.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                        block.completed
                          ? isDark
                            ? 'bg-zinc-950/50 border-zinc-800/60 opacity-60'
                            : 'bg-slate-100/60 border-zinc-200 opacity-60'
                          : isHigh
                          ? isDark
                            ? 'bg-zinc-900 border-rose-500/40 shadow-sm'
                            : 'bg-white border-rose-300 shadow-sm'
                          : isMed
                          ? isDark
                            ? 'bg-zinc-900 border-amber-500/30 shadow-sm'
                            : 'bg-white border-amber-200 shadow-sm'
                          : isDark
                          ? 'bg-zinc-900 border-zinc-800'
                          : 'bg-white border-zinc-200'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleBlockCompletion(block.id)}
                          className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                            block.completed
                              ? 'bg-emerald-500 border-emerald-400 text-zinc-950 font-bold scale-105'
                              : isDark
                              ? 'border-zinc-700 bg-zinc-950 text-transparent hover:border-indigo-400'
                              : 'border-zinc-300 bg-slate-50 text-transparent hover:border-indigo-500'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">check</span>
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`font-mono text-xs font-bold ${
                              block.completed ? 'line-through text-zinc-500' : 'text-indigo-400'
                            }`}>
                              {block.timeSlot} ({block.durationMinutes}m)
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                isHigh
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : isMed
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}>
                                {block.focusLevel} Focus
                              </span>
                            </div>
                          </div>

                          <h4 className={`font-headline font-bold text-sm sm:text-base ${
                            block.completed ? 'line-through text-zinc-500' : ''
                          }`}>
                            {block.activityTitle}
                          </h4>

                          <p className="text-xs font-mono font-semibold text-zinc-400">
                            Course: {block.courseTitle}
                          </p>

                          {block.studyTip && (
                            <div className={`mt-2 p-2.5 rounded-xl text-[11px] font-body flex items-start gap-2 border ${
                              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-zinc-200 text-zinc-700'
                            }`}>
                              <span className="material-symbols-outlined text-base text-amber-400 shrink-0">lightbulb</span>
                              <span>{block.studyTip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Recommendations Card */}
              <div className={`p-6 rounded-[2.5rem] border transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <h3 className="font-headline font-bold text-base mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">psychology</span>
                  Personalized AI Study Tips
                </h3>
                <ul className="space-y-2.5">
                  {(currentPlan?.aiRecommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-body text-zinc-300">
                      <span className="material-symbols-outlined text-indigo-400 text-base shrink-0 mt-0.5">check_circle</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Refine Plan Chat Input */}
              <form onSubmit={handleRefineSchedule} className="flex gap-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Need tweaks? e.g. 'Shorten afternoon block by 20 minutes'..."
                  className={`flex-1 px-4 py-3 rounded-full text-xs font-body border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!refinePrompt.trim() || isRefining}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  <span className="material-symbols-outlined text-base">auto_fix_high</span>
                  Refine
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Deadline Modal */}
      {showAddDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl space-y-4 ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-zinc-800">
              <h3 className="font-headline font-bold text-base">Add Deadline or Exam</h3>
              <button onClick={() => setShowAddDeadlineModal(false)} className="text-zinc-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddDeadline} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Assessment / Task Title:</label>
                <input
                  type="text"
                  required
                  value={newDeadlineTitle}
                  onChange={(e) => setNewDeadlineTitle(e.target.value)}
                  placeholder="e.g. Midterm Quiz, Lab 3 Submission"
                  className={`w-full p-2.5 rounded-xl text-xs font-body border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Associated Course:</label>
                <select
                  value={newDeadlineCourse}
                  onChange={(e) => setNewDeadlineCourse(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-body border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                  }`}
                >
                  {grades.map((g) => (
                    <option key={g.courseId} value={g.courseTitle}>
                      {g.courseTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Due Date / Timeframe:</label>
                <input
                  type="text"
                  value={newDeadlineDate}
                  onChange={(e) => setNewDeadlineDate(e.target.value)}
                  placeholder="e.g. In 2 days, Friday 5 PM"
                  className={`w-full p-2.5 rounded-xl text-xs font-body border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Priority Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewDeadlinePriority(p)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all ${
                        newDeadlinePriority === p
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : isDark
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          : 'bg-slate-50 border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeadlineModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-mono font-bold shadow-md"
                >
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
