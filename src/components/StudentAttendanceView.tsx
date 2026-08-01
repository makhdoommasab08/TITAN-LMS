import React, { useState } from 'react';

interface StudentAttendanceViewProps {
  theme?: 'dark' | 'light';
  onShowToast: (title: string, message: string) => void;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  theme = 'dark',
  onShowToast
}) => {
  const isDark = theme === 'dark';
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');

  // Dynamic state for daily marking and live statistics
  const [attendedCount, setAttendedCount] = useState(118);
  const [totalCount, setTotalCount] = useState(122);
  const [hasMarkedToday, setHasMarkedToday] = useState(false);
  const [selectedCheckinCourse, setSelectedCheckinCourse] = useState('CS101 • Advanced AI');

  // Detailed attendance log state
  const [logs, setLogs] = useState([
    { id: '1', date: 'May 26, 2025', course: 'CS101 • Advanced AI', time: '09:00 AM', status: 'Present', location: 'Hall A1', instructor: 'Dr. Shahnawaz Qureshi' },
    { id: '2', date: 'May 25, 2025', course: 'CS202 • Full-Stack Arch', time: '11:30 AM', status: 'Present', location: 'Lab 3', instructor: 'Prof. Muhammad Hayan' },
    { id: '3', date: 'May 23, 2025', course: 'MATH301 • Linear Algebra', time: '02:00 PM', status: 'Late', location: 'Auditorium B', instructor: 'Dr. Khalid Hussain' },
    { id: '4', date: 'May 21, 2025', course: 'PHY201 • Quantum Info', time: '10:00 AM', status: 'Present', location: 'Quantum Physics Lab', instructor: 'Prof. Rashid Minhas' },
    { id: '5', date: 'May 19, 2025', course: 'CS101 • Advanced AI', time: '09:00 AM', status: 'Excused', location: 'Hall A1', instructor: 'Dr. Ranjeet Kumar' },
  ]);

  // Derived metrics
  const calculatedRate = ((attendedCount / totalCount) * 100).toFixed(1);

  // Sample monthly chart data
  const monthlyData = [
    { month: 'Jan', rate: 98, present: 20, absent: 0, late: 1 },
    { month: 'Feb', rate: 94, present: 18, absent: 1, late: 1 },
    { month: 'Mar', rate: 100, present: 22, absent: 0, late: 0 },
    { month: 'Apr', rate: 96, present: 19, absent: 1, late: 0 },
    { month: 'May', rate: 98, present: 21, absent: 0, late: 1 },
    { month: 'Jun', rate: 95, present: 18, absent: 1, late: 0 },
  ];

  // Course breakdown data
  const courseAttendance = [
    { code: 'CS101', name: 'Advanced Artificial Intelligence', rate: 98, present: 28, total: 28, instructor: 'Dr. Ranjeet Kumar' },
    { code: 'CS202', name: 'Full-Stack Software Architecture', rate: 95, present: 20, total: 21, instructor: 'Prof. Muhammad Hayn' },
    { code: 'MATH301', name: 'Linear Algebra & Matrices', rate: 92, present: 12, total: 13, instructor: 'Dr. Khalid Hussain' },
    { code: 'PHY201', name: 'Quantum Information Systems', rate: 100, present: 16, total: 16, instructor: 'Prof. Rashid Minhas' },
  ];

  const handleMarkDailyAttendance = () => {
    if (hasMarkedToday) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = `Today, ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const newLog = {
      id: Date.now().toString(),
      date: formattedDate,
      course: selectedCheckinCourse,
      time: formattedTime,
      status: 'Present',
      location: 'TITAN Main Campus • Geofenced Hall A1',
      instructor: selectedCheckinCourse.includes('CS101') ? 'Dr. Ranjeet Kumar' : 'Prof. Muhammad Hayan'
    };

    setLogs([newLog, ...logs]);
    setAttendedCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    setHasMarkedToday(true);

    onShowToast(
      'Daily Attendance Marked!',
      `Successfully logged present for ${selectedCheckinCourse} at ${formattedTime}. System updated.`
    );
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) return;
    onShowToast('Leave Request Submitted', `Your excused leave request for ${leaveDate} has been sent to faculty review.`);
    setShowLeaveModal(false);
    setLeaveReason('');
    setLeaveDate('');
  };

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-8 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Standing: Exemplary (96.8%)
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">Student Attendance Portal</h1>
          <p className={`font-body text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Track your class check-ins, monthly attendance charts, and absence records in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onShowToast('Attendance Transcript Exported', 'Downloaded official PDF attendance history.')}
            className={`px-4 py-2.5 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-300 hover:bg-slate-100 text-zinc-800 shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export PDF
          </button>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-5 py-2.5 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">event_note</span>
            Request Absence
          </button>
        </div>
      </div>

      {/* Daily Attendance Check-In Widget Banner */}
      <div className={`p-6 sm:p-8 rounded-[2rem] border relative overflow-hidden transition-all shadow-xl ${
        isDark
          ? 'bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border-indigo-500/30 text-white'
          : 'bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-indigo-200 text-zinc-900 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Check-in Window Open
              </span>
              <span className="text-xs font-mono text-zinc-400">Geofence: Hall A1 • WiFi Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline">Mark Today's Class Attendance</h2>
            <p className={`text-xs sm:text-sm max-w-xl ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Select your scheduled lecture and click check-in to log your live attendance directly into the university system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <label className="text-xs font-mono font-bold text-zinc-400">Class:</label>
              <select
                value={selectedCheckinCourse}
                onChange={(e) => setSelectedCheckinCourse(e.target.value)}
                disabled={hasMarkedToday}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                }`}
              >
                <option value="CS101 • Advanced AI">CS101 • Advanced Artificial Intelligence</option>
                <option value="CS202 • Full-Stack Arch">CS202 • Full-Stack Software Architecture</option>
                <option value="MATH301 • Linear Algebra">MATH301 • Linear Algebra & Matrices</option>
                <option value="PHY201 • Quantum Info">PHY201 • Quantum Information Systems</option>
              </select>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
            {hasMarkedToday ? (
              <div className="flex flex-col items-center md:items-end gap-1">
                <div className="px-6 py-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Attendance Marked Today!
                </div>
                <span className="text-[11px] font-mono text-zinc-400">Verified & Synchronized</span>
              </div>
            ) : (
              <button
                onClick={handleMarkDailyAttendance}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm font-bold shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">fingerprint</span>
                Mark Present Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-[2rem] border transition-all ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Overall Attendance</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl">fact_check</span>
          </div>
          <h2 className="text-3xl font-black font-headline mt-2 text-emerald-400">{calculatedRate}%</h2>
          <p className="text-[11px] font-mono text-emerald-500 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_upward</span> Above 90% benchmark
          </p>
        </div>

        <div className={`p-5 rounded-[2rem] border transition-all ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Total Classes Attended</span>
            <span className="material-symbols-outlined text-indigo-400 text-xl">event_available</span>
          </div>
          <h2 className="text-3xl font-black font-headline mt-2 text-indigo-400">{attendedCount} / {totalCount}</h2>
          <p className={`text-[11px] font-mono mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Spring Semester 2025</p>
        </div>

        <div className={`p-5 rounded-[2rem] border transition-all ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Punctuality Score</span>
            <span className="material-symbols-outlined text-amber-400 text-xl">schedule</span>
          </div>
          <h2 className="text-3xl font-black font-headline mt-2 text-amber-400">98.2%</h2>
          <p className={`text-[11px] font-mono mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>3 Late entries logged</p>
        </div>

        <div className={`p-5 rounded-[2rem] border transition-all ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Approved Leaves</span>
            <span className="material-symbols-outlined text-purple-400 text-xl">verified_user</span>
          </div>
          <h2 className="text-3xl font-black font-headline mt-2 text-purple-400">2 Days</h2>
          <p className="text-[11px] font-mono text-emerald-400 mt-1">Medical clearance on file</p>
        </div>
      </div>

      {/* Attendance Chart Section */}
      <div className={`p-6 sm:p-8 rounded-[2rem] border space-y-6 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">bar_chart</span>
              Monthly Attendance Performance Chart
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Percentage of lectures attended per calendar month vs. the required 90% threshold line.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500"></span> &ge; 95%
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-3 h-3 rounded-sm bg-amber-500"></span> 85-94%
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-3 h-3 rounded-sm bg-red-500"></span> &lt; 85%
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6 pb-2 relative">
          {/* Threshold dashed line */}
          <div className="absolute left-0 right-0 top-[28%] border-b-2 border-dashed border-red-500/40 z-10 pointer-events-none flex justify-end">
            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded -mt-3">
              90% Required Threshold
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-2 px-2 border-b border-zinc-200 dark:border-zinc-800">
            {monthlyData.map((item) => {
              const heightPercent = `${item.rate}%`;
              let barColor = 'bg-emerald-500 hover:bg-emerald-400';
              if (item.rate < 85) barColor = 'bg-red-500 hover:bg-red-400';
              else if (item.rate < 95) barColor = 'bg-amber-500 hover:bg-amber-400';

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-zinc-950 text-white text-[10px] font-mono p-2 rounded-xl shadow-xl z-30 border border-zinc-800 pointer-events-none whitespace-nowrap text-center">
                    <p className="font-bold text-indigo-400">{item.month} Attendance: {item.rate}%</p>
                    <p className="text-zinc-300">Present: {item.present} | Absent: {item.absent} | Late: {item.late}</p>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-zinc-400 group-hover:text-white transition-colors">
                    {item.rate}%
                  </span>

                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full ${barColor} transition-all duration-500 rounded-t-xl group-hover:scale-105 origin-bottom`}
                      style={{ height: heightPercent }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold uppercase mt-1">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course Breakdown & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Attendance List */}
        <div className={`lg:col-span-1 p-6 rounded-[2rem] border space-y-4 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <h3 className="font-headline font-bold text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500">school</span>
            Subject Attendance
          </h3>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Attendance breakdown by course in your current active schedule.
          </p>

          <div className="space-y-4 pt-2">
            {courseAttendance.map((course) => (
              <div key={course.code} className={`p-4 rounded-2xl border ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
              }`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400">{course.code}</span>
                    <h4 className="font-bold text-xs">{course.name}</h4>
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    course.rate >= 95 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {course.rate}%
                  </span>
                </div>

                <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-2">
                  <span>{course.instructor}</span>
                  <span>{course.present}/{course.total} Attended</span>
                </div>

                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${course.rate >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${course.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Attendance Logs */}
        <div className={`lg:col-span-2 p-6 rounded-[2rem] border space-y-4 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500">history</span>
              Recent Class Check-in Logs
            </h3>
            <span className="text-xs font-mono text-zinc-400">Last 5 Sessions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                  isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'
                }`}>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-500/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold">{log.date}</p>
                      <p className="text-[10px] font-mono text-zinc-400">{log.time}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-medium">{log.course}</p>
                      <p className="text-[10px] text-zinc-400">{log.instructor}</p>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-zinc-400">{log.location}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                        log.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Present' ? 'bg-emerald-400' : log.status === 'Late' ? 'bg-amber-400' : 'bg-purple-400'
                        }`}></span>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl space-y-4 ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">event_note</span>
                Apply for Excused Absence
              </h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                  Absence Date
                </label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Specify medical, academic, or personal reason..."
                  className={`w-full px-4 py-3 rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-mono font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
