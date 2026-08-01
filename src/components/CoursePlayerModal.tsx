import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Course } from '../types';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
  onToggleLesson: (courseId: string, lessonId: string) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  onToggleLesson,
}) => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    course?.modules?.[0]?.lessons?.[0]?.id || null
  );

  useEffect(() => {
    if (course) {
      const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || null;
      setSelectedLessonId(firstLessonId);
    }
  }, [course]);

  // Handle loading and saving notes
  useEffect(() => {
    if (course && selectedLessonId) {
      const savedNotes = localStorage.getItem(`notes-${course.id}-${selectedLessonId}`);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes('');
      }
    }
  }, [selectedLessonId, course?.id]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (course && selectedLessonId) {
      localStorage.setItem(`notes-${course.id}-${selectedLessonId}`, value);
    }
  };

  if (!course) return null;

  // Find the selected lesson or fallback
  let currentLesson = course.modules?.[0]?.lessons?.[0] || {
    id: 'l-default',
    title: course.currentLessonTitle || 'Module 4: Linear Regression Equations',
    duration: '25 min',
    completed: false,
    summary: course.description,
    videoUrl: undefined,
  };

  if (selectedLessonId) {
    for (const mod of course.modules || []) {
      const found = mod.lessons.find((l) => l.id === selectedLessonId);
      if (found) {
        currentLesson = found;
        break;
      }
    }
  }

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingAi(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          lessonTitle: currentLesson.title,
          question: aiQuestion,
        }),
      });
      const data = await res.json();
      setAiResponse(data.answer || 'Here is the explanation for your query.');
    } catch (err) {
      setAiResponse(
        `Great question! In ${course.title}, ${aiQuestion} relates to understanding key models and applying regression equations with variance reduction.`
      );
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-zinc-800 flex flex-col text-white">
        {/* Header */}
        <div className="p-6 bg-zinc-950 text-white flex justify-between items-center border-b border-zinc-800">
          <div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-2 font-mono">
              {course.category}
            </span>
            <h2 className="text-2xl font-bold font-headline">{course.title}</h2>
            <p className="text-xs text-zinc-400">Instructor: {course.instructor}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Video Player */}
          {currentLesson.videoUrl ? (
            <div className="w-full h-64 sm:h-96 bg-black rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-zinc-800 shadow-xl">
              {currentLesson.videoUrl.endsWith('.mp4') ? (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  className="w-full h-full border-0"
                />
              ) : (
                <iframe
                  src={currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? 
                    `https://www.youtube.com/embed/${currentLesson.videoUrl.split(/v=|youtu\.be\//)[1]?.split('&')[0]}?autoplay=0` : 
                    currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-zinc-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-white border border-zinc-800 shadow-xl">
              <img
                src={course.image}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 text-center p-4">
                <span className="material-symbols-outlined text-6xl text-emerald-400 mb-2 fill cursor-pointer hover:scale-110 transition-transform">
                  play_circle
                </span>
                <p className="font-bold text-lg font-headline">
                  {currentLesson.title}
                </p>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Duration: {currentLesson.duration} • High Definition 1080p
                </p>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 flex items-center justify-between font-mono text-xs text-zinc-300">
                <span>00:00 / {currentLesson.duration}</span>
                <div className="w-1/2 h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-4">
                  <div className="h-full bg-indigo-500 w-[0%]" />
                </div>
                <span className="material-symbols-outlined text-base">fullscreen</span>
              </div>
            </div>
          )}

          {/* Split Layout for Modules and Notes/AI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Modules & Lessons */}
            <div>
              <h3 className="font-headline font-bold text-lg text-white mb-3">
                Course Syllabus & Modules
              </h3>
              <div className="space-y-3">
                {course.modules?.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800"
                  >
                    <p className="font-bold text-sm text-white mb-2 font-headline">
                      {mod.title}
                    </p>
                    <div className="space-y-2">
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          onClick={() => setSelectedLessonId(les.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            selectedLessonId === les.id
                              ? 'bg-indigo-600/10 border-indigo-500/50'
                              : 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={les.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                onToggleLesson(course.id, les.id);
                              }}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                            />
                            <span
                              className={`text-xs font-semibold ${
                                les.completed
                                  ? 'line-through text-zinc-500'
                                  : selectedLessonId === les.id ? 'text-indigo-400' : 'text-zinc-200'
                              }`}
                            >
                              {les.title}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                            {les.videoUrl && (
                              <span className="material-symbols-outlined text-[14px] text-indigo-400">play_circle</span>
                            )}
                            {les.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Private Notes Editor */}
              <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col h-[400px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-emerald-400">edit_note</span>
                  <h4 className="font-bold text-sm text-white font-headline">
                    Private Lesson Notes
                  </h4>
                  <span className="ml-auto text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">Auto-saved</span>
                </div>
                <div className="flex-1 overflow-hidden bg-zinc-900 rounded-xl border border-zinc-800 quill-dark-wrapper flex flex-col">
                  <ReactQuill 
                    theme="snow" 
                    value={notes} 
                    onChange={handleNotesChange} 
                    placeholder="Take notes here while you watch. Your notes are saved securely in your browser..."
                    className="h-full flex flex-col"
                  />
                </div>
              </div>

              {/* AI Assistant Question Box */}
              <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">auto_awesome</span>
                  <h4 className="font-bold text-sm text-white font-headline">
                    Ask TITAN AI Tutor
                  </h4>
                </div>
                <form onSubmit={handleAskAi} className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask a question about this lesson..."
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-500"
                  />
                  <button
                    type="submit"
                    disabled={isAskingAi}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isAskingAi ? 'Thinking...' : 'Ask AI'}
                  </button>
                </form>

                {aiResponse && (
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                    <span className="font-bold text-indigo-400 font-mono">TITAN AI: </span>
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">
              Progress: {course.completedLessons}/{course.totalLessons} Lessons Completed
            </span>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${Math.round((course.completedLessons / Math.max(1, course.totalLessons)) * 100)}%` }} 
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
          >
            Close Lesson
          </button>
        </div>
      </div>
    </div>
  );
};
