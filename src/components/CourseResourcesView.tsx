import React, { useState } from 'react';
import { CourseResource, Course } from '../types';
import { TitanLogo } from './TitanLogo';

interface CourseResourcesViewProps {
  resources: CourseResource[];
  courses: Course[];
  onToggleBookmark: (resourceId: string) => void;
  onAddResource: (newResource: Omit<CourseResource, 'id' | 'downloadsCount'>) => void;
  theme?: 'dark' | 'light';
  onShowToast?: (message: string, subtitle?: string) => void;
}

export const CourseResourcesView: React.FC<CourseResourcesViewProps> = ({
  resources,
  courses,
  onToggleBookmark,
  onAddResource,
  theme = 'dark',
  onShowToast
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [activePreviewResource, setActivePreviewResource] = useState<CourseResource | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Resource Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'course-ds101');
  const [newType, setNewType] = useState<'pdf' | 'slides' | 'link' | 'code' | 'worksheet'>('pdf');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Study Guide');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Filter logic
  const filteredResources = resources.filter((res) => {
    const matchesCourse = selectedCourseId === 'all' || res.courseId === selectedCourseId;
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesBookmark = !onlyBookmarked || res.bookmarked;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCourse && matchesType && matchesBookmark && matchesSearch;
  });

  const bookmarkedCount = resources.filter((r) => r.bookmarked).length;
  const pdfCount = resources.filter((r) => r.type === 'pdf').length;
  const slidesCount = resources.filter((r) => r.type === 'slides').length;
  const linksCount = resources.filter((r) => r.type === 'link').length;

  const handleDownload = (res: CourseResource) => {
    setDownloadingId(res.id);
    if (onShowToast) {
      onShowToast(`Downloading "${res.title}"`, `${res.fileSize || 'External resource'} • Taj Institute Library`);
    }

    setTimeout(() => {
      setDownloadingId(null);
      if (res.type === 'link' && res.externalUrl) {
        window.open(res.externalUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Create a simulated blob download for PDFs/files
        const content = `TITAN ACADEMIC RESOURCE\n------------------------\nTitle: ${res.title}\nCourse: ${res.courseTitle}\nAuthor: ${res.author}\nDate: ${res.dateAdded}\n\nDescription:\n${res.description}\n\nProvided by Taj Institute of Technology & Applied Networks (ESTD. 2025).`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${res.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 800);
  };

  const handleCreateResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const courseObj = courses.find((c) => c.id === newCourseId);
    const newRes: Omit<CourseResource, 'id' | 'downloadsCount'> = {
      courseId: newCourseId,
      courseTitle: courseObj?.title || 'General Academic Course',
      title: newTitle,
      description: newDescription || 'Academic material uploaded to TITAN resource library.',
      type: newType,
      fileSize: newType === 'link' ? undefined : '2.5 MB',
      externalUrl: newType === 'link' ? newUrl || 'https://titan.edu.pk' : undefined,
      downloadUrl: '#',
      author: 'Masab Bin Abdul Rehman (Student)',
      dateAdded: 'Just now',
      category: newCategory,
      bookmarked: false
    };

    onAddResource(newRes);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    if (onShowToast) {
      onShowToast('Resource Added!', `"${newTitle}" is now available in the course library.`);
    }
  };

  const getTypeBadge = (type: CourseResource['type']) => {
    switch (type) {
      case 'pdf':
        return {
          label: 'PDF Document',
          icon: 'picture_as_pdf',
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };
      case 'slides':
        return {
          label: 'Slide Deck',
          icon: 'slideshow',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
      case 'link':
        return {
          label: 'External Link',
          icon: 'open_in_new',
          color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        };
      case 'code':
        return {
          label: 'Code Asset',
          icon: 'terminal',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'worksheet':
      default:
        return {
          label: 'Worksheet',
          icon: 'assignment',
          color: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        };
    }
  };

  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-8 py-8 space-y-8 min-h-screen font-body transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
    }`}>
      {/* Hero Header Section */}
      <section className="reveal-card">
        <div className={`p-8 rounded-[2.5rem] border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <TitanLogo size="sm" variant="horizontal" theme={theme} />
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Academic Library
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl font-black tracking-tight">
              Course Resources & Study Materials
            </h1>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Access verified lecture handbooks, slide decks, technical papers, Figma design kits, and interactive Google Colab notebooks curated by Taj Institute faculty.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Share New Material
            </button>
          </div>
        </div>
      </section>

      {/* Stats Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="material-symbols-outlined text-xl">folder</span>
          </div>
          <div>
            <p className="font-headline font-black text-lg">{resources.length}</p>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Total Materials</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="material-symbols-outlined text-xl">bookmark</span>
          </div>
          <div>
            <p className="font-headline font-black text-lg text-amber-400">{bookmarkedCount}</p>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Bookmarked</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
          </div>
          <div>
            <p className="font-headline font-black text-lg text-rose-400">{pdfCount}</p>
            <p className="text-[10px] font-mono uppercase text-zinc-400">PDF Handbooks</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="material-symbols-outlined text-xl">slideshow</span>
          </div>
          <div>
            <p className="font-headline font-black text-lg text-emerald-400">{slidesCount + linksCount}</p>
            <p className="text-[10px] font-mono uppercase text-zinc-400">Decks & Links</p>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic, author, or keyword..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-body transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? 'bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-slate-100 border border-zinc-300 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          {/* Course Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider shrink-0 hidden sm:inline">
              Course:
            </span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
              }`}
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Bookmark Toggle Filter */}
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 border ${
              onlyBookmarked
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md'
                : isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-500'
                : 'bg-slate-100 border-zinc-300 text-zinc-700 hover:border-amber-500'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {onlyBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
            <span>{onlyBookmarked ? 'Showing Bookmarks' : 'Filter Bookmarked'}</span>
          </button>
        </div>

        {/* Resource Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-2 border-t border-zinc-800/60">
          {[
            { id: 'all', label: 'All Format Types', icon: 'apps' },
            { id: 'pdf', label: 'PDF Handbooks', icon: 'picture_as_pdf' },
            { id: 'slides', label: 'Slide Decks', icon: 'slideshow' },
            { id: 'link', label: 'External Links', icon: 'open_in_new' },
            { id: 'code', label: 'Code & Repos', icon: 'terminal' },
            { id: 'worksheet', label: 'Worksheets', icon: 'assignment' }
          ].map((typeTab) => {
            const isActive = selectedType === typeTab.id;
            return (
              <button
                key={typeTab.id}
                onClick={() => setSelectedType(typeTab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    : 'bg-slate-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{typeTab.icon}</span>
                <span>{typeTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className={`p-12 text-center border rounded-[2.5rem] ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
        }`}>
          <span className="material-symbols-outlined text-5xl mb-3 text-indigo-400">folder_off</span>
          <h3 className="font-headline font-bold text-lg text-white mb-1">No course materials match your criteria</h3>
          <p className="text-xs font-body max-w-md mx-auto text-zinc-400">
            Try adjusting your search query, switching format tabs, or clearing bookmarked filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCourseId('all');
              setSelectedType('all');
              setOnlyBookmarked(false);
            }}
            className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-mono font-bold text-xs shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const badge = getTypeBadge(res.type);
            const isDownloading = downloadingId === res.id;

            return (
              <div
                key={res.id}
                className={`group border rounded-[2rem] p-6 transition-all duration-300 hover:border-indigo-500/80 flex flex-col justify-between relative ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Header: Category Tag & Bookmark Button */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border flex items-center gap-1 ${badge.color}`}>
                        <span className="material-symbols-outlined text-xs">{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        {res.courseTitle}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(res.id)}
                      className={`p-2 rounded-full transition-all active:scale-90 ${
                        res.bookmarked
                          ? 'text-amber-400 hover:text-amber-300'
                          : isDark
                          ? 'text-zinc-500 hover:text-white'
                          : 'text-zinc-400 hover:text-zinc-900'
                      }`}
                      title={res.bookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {res.bookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Resource Title */}
                  <h3 className="font-headline font-bold text-lg mb-2 leading-snug group-hover:text-indigo-400 transition-colors">
                    {res.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed mb-4 font-body line-clamp-2 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {res.description}
                  </p>
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-zinc-400 space-y-0.5">
                    <p className="font-semibold text-zinc-300">Faculty: {res.author}</p>
                    <p>{res.dateAdded} • {res.fileSize || 'Web Link'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActivePreviewResource(res)}
                      className={`px-3 py-2 rounded-full text-xs font-mono font-bold transition-colors border ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-slate-100 border-zinc-300 text-zinc-700 hover:bg-slate-200'
                      }`}
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleDownload(res)}
                      disabled={isDownloading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                          <span>Opening...</span>
                        </>
                      ) : res.type === 'link' ? (
                        <>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          <span>Open Link</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">download</span>
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resource Details Preview Modal */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-body">
          <div className={`w-full max-w-xl rounded-[2rem] border p-6 shadow-2xl space-y-5 ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  {activePreviewResource.courseTitle} • {activePreviewResource.category}
                </span>
                <h3 className="font-headline font-bold text-xl">{activePreviewResource.title}</h3>
              </div>
              <button
                onClick={() => setActivePreviewResource(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-zinc-200 text-zinc-700'
            }`}>
              {activePreviewResource.description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                <p className="text-[10px] text-zinc-400 uppercase">Author / Faculty</p>
                <p className="font-bold text-zinc-200 mt-0.5">{activePreviewResource.author}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-zinc-200'}`}>
                <p className="text-[10px] text-zinc-400 uppercase">File Format / Size</p>
                <p className="font-bold text-zinc-200 mt-0.5 uppercase">{activePreviewResource.type} • {activePreviewResource.fileSize || 'URL'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => {
                  onToggleBookmark(activePreviewResource.id);
                  setActivePreviewResource({
                    ...activePreviewResource,
                    bookmarked: !activePreviewResource.bookmarked
                  });
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-full font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">
                  {activePreviewResource.bookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
                <span>{activePreviewResource.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={() => {
                  handleDownload(activePreviewResource);
                  setActivePreviewResource(null);
                }}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Access Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share / Add New Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-body">
          <div className={`w-full max-w-lg rounded-[2rem] border p-6 shadow-2xl ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400">post_add</span>
                Share Course Resource
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateResourceSubmit} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-mono font-bold text-zinc-400 mb-1">
                  Target Course
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-full font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold text-zinc-400 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Module 3 Neural Networks Formulas & Derivations"
                  className={`w-full px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-zinc-400 mb-1">
                    Format Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className={`w-full px-4 py-2.5 rounded-full font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="pdf">PDF Handbook</option>
                    <option value="slides">Slide Deck</option>
                    <option value="link">External Link</option>
                    <option value="code">Code Repository</option>
                    <option value="worksheet">Worksheet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-400 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              {newType === 'link' && (
                <div>
                  <label className="block font-mono font-bold text-zinc-400 mb-1">
                    External URL Link
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://colab.research.google.com/..."
                    className={`w-full px-4 py-2.5 rounded-full font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block font-mono font-bold text-zinc-400 mb-1">
                  Description / Abstract
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide a brief explanation of what students will learn from this material..."
                  className={`w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 shadow-md"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
