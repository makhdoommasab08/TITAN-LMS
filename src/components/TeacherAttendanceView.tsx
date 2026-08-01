import React, { useState } from 'react';

interface StudentRosterItem {
  id: string;
  name: string;
  studentId: string;
  avatar?: string;
  status: 'Present' | 'Late' | 'Absent' | 'Excused';
  overallRate: number;
}

interface TeacherAttendanceViewProps {
  theme?: 'dark' | 'light';
  onShowToast: (title: string, message: string) => void;
}

export const TeacherAttendanceView: React.FC<TeacherAttendanceViewProps> = ({
  theme = 'dark',
  onShowToast
}) => {
  const isDark = theme === 'dark';
  const [selectedClass, setSelectedClass] = useState('CS101');
  const [selectedDate, setSelectedDate] = useState('2025-05-27');
  const [sessionNote, setSessionNote] = useState('');

  // Initial roster state
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: 'u1', name: 'Masab Bin Abdul Rehman', studentId: 'CS-2025-001', status: 'Present', overallRate: 98, avatar: 'https://i.pinimg.com/736x/0e/1b/49/0e1b4984c22ff810051677b8c7a29e7d.jpg' },
    { id: 'u2', name: 'Sarah Ali', studentId: 'CS-2025-002', status: 'Present', overallRate: 95, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPLDs3UjQYBQ5Q6E1tU4PnTO2OCOiWC1vxalp2lvbRdw&s=10' },
    { id: 'u3', name: 'Aliza Shah', studentId: 'CS-2025-003', status: 'Late', overallRate: 88, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5VQ5Lb-0Dyf3f-3NMMubx8zxZ-xEgU8p553kdhxzx8Q&s=10' },
    { id: 'u4', name: 'Muhammad Umar', studentId: 'CS-2025-004', status: 'Present', overallRate: 100, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5M999In7xAng7oCdfQiiIPWsjtSnkawXmtSpMyqCdCQ&s=10' },
    { id: 'u5', name: 'Sarim Ali', studentId: 'CS-2025-005', status: 'Absent', overallRate: 84, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyPrSrA3DCED2ZjMu64uvrFZw-bR7wYAzDCPsPKN5qhA&s=10' },
    { id: 'u6', name: 'Ammar Mughal', studentId: 'CS-2025-006', status: 'Present', overallRate: 96, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkT8XnIuVJUBGV1Q4n1Iy12TOPMxxZOnQqd8Dm4bR9UQ&s=10' },
    { id: 'u7', name: 'Azad Ali', studentId: 'CS-2025-007', status: 'Excused', overallRate: 91, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsWHrSphR0_o1Q3Ykh-l3WMSOfNR5GbX_4achRpzJ9qA&s=10' },
  ]);

  // Derived roster metrics
  const presentCount = roster.filter(s => s.status === 'Present').length;
  const lateCount = roster.filter(s => s.status === 'Late').length;
  const absentCount = roster.filter(s => s.status === 'Absent').length;
  const excusedCount = roster.filter(s => s.status === 'Excused').length;
  const totalStudents = roster.length;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.8) / totalStudents) * 100);

  const handleStatusChange = (id: string, newStatus: 'Present' | 'Late' | 'Absent' | 'Excused') => {
    setRoster(prev => prev.map(student => student.id === id ? { ...student, status: newStatus } : student));
  };

  const handleMarkAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'Present' })));
    onShowToast('Roster Updated', 'All students marked as Present for this lecture session.');
  };

  const handleSaveAttendance = () => {
    onShowToast(
      'Attendance Saved & Published',
      `Class roll call for ${selectedClass} on ${selectedDate} finalized (${presentCount}/${totalStudents} Present). Broadcasted to student portals.`
    );
  };

  // Class historical attendance trend
  const historicalSessions = [
    { date: 'May 26, 2025', topic: 'Neural Networks & Deep Learning', rate: 96, present: 27, absent: 1 },
    { date: 'May 23, 2025', topic: 'Transformer Models & Attention Mechanisms', rate: 92, present: 25, absent: 2 },
    { date: 'May 21, 2025', topic: 'Reinforcement Learning Algorithms', rate: 100, present: 28, absent: 0 },
    { date: 'May 19, 2025', topic: 'Computer Vision & CNN Architectures', rate: 89, present: 24, absent: 3 },
  ];

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-8 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Faculty Attendance Portal
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">Classroom Roll Call & Analytics</h1>
          <p className={`font-body text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Take live attendance, manage student absence records, and monitor classroom engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleMarkAllPresent}
            className={`px-4 py-2.5 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-300 hover:bg-slate-100 text-zinc-800 shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-base text-emerald-400">done_all</span>
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-6 py-2.5 rounded-full font-mono text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            Publish Attendance
          </button>
        </div>
      </div>

      {/* Class & Date Selector Bar */}
      <div className={`p-5 rounded-[2rem] border grid grid-cols-1 md:grid-cols-3 gap-4 items-center ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div>
          <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">Select Course Section</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
            }`}
          >
            <option value="CS101">CS101 • Advanced AI (Grade 11-A)</option>
            <option value="CS202">CS202 • Full-Stack Software Arch (Grade 11-B)</option>
            <option value="MATH301">MATH301 • Linear Algebra & Matrices</option>
            <option value="PHY201">PHY201 • Quantum Information Systems</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">Lecture Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">Session Note / Topic</label>
          <input
            type="text"
            value={sessionNote}
            onChange={(e) => setSessionNote(e.target.value)}
            placeholder="e.g. Midterm Quiz Review & Lab"
            className={`w-full px-4 py-2 rounded-xl font-body text-xs focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
            }`}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-[2rem] border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Today's Rate</span>
            <span className="material-symbols-outlined text-indigo-400 text-xl">insights</span>
          </div>
          <h2 className="text-3xl font-bold font-headline mt-2 text-indigo-400">{attendanceRate}%</h2>
          <p className="text-[11px] font-mono text-emerald-400 mt-1">Calculated for {selectedClass}</p>
        </div>

        <div className={`p-5 rounded-[2rem] border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Present</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold font-headline mt-2 text-emerald-400">{presentCount} / {totalStudents}</h2>
          <p className="text-[11px] font-mono text-zinc-400 mt-1">Students in room</p>
        </div>

        <div className={`p-5 rounded-[2rem] border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Late / Arrived</span>
            <span className="material-symbols-outlined text-amber-400 text-xl">schedule</span>
          </div>
          <h2 className="text-3xl font-bold font-headline mt-2 text-amber-400">{lateCount}</h2>
          <p className="text-[11px] font-mono text-zinc-400 mt-1">Logged after start time</p>
        </div>

        <div className={`p-5 rounded-[2rem] border ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Absent / Excused</span>
            <span className="material-symbols-outlined text-red-400 text-xl">cancel</span>
          </div>
          <h2 className="text-3xl font-bold font-headline mt-2 text-red-400">{absentCount} <span className="text-sm text-purple-400 font-mono">({excusedCount} Excused)</span></h2>
          <p className="text-[11px] font-mono text-zinc-400 mt-1">Requires follow-up</p>
        </div>
      </div>

      {/* Main Grid: Interactive Roster & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Roll Call Table */}
        <div className={`lg:col-span-2 p-6 rounded-[2rem] border space-y-4 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">groups</span>
                Live Student Roll Call
              </h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Toggle status for each enrolled student. Changes sync automatically in real time.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {totalStudents} Enrolled
            </span>
          </div>

          <div className="space-y-3">
            {roster.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isDark ? 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700' : 'bg-slate-50 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{student.name}</h4>
                    <p className="text-[10px] font-mono text-zinc-400">
                      {student.studentId} • Overall: <span className="text-emerald-400 font-bold">{student.overallRate}%</span>
                    </p>
                  </div>
                </div>

                {/* Status Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Present')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      student.status === 'Present'
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                        : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Late')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      student.status === 'Late'
                        ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                        : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                    Late
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Absent')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      student.status === 'Absent'
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                        : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
                    Absent
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Excused')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                      student.status === 'Excused'
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                        : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300"></span>
                    Excused
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics & History Sidebar */}
        <div className="space-y-6">
          {/* Visual Distribution Chart */}
          <div className={`p-6 rounded-[2rem] border space-y-4 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h3 className="font-headline font-bold text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">pie_chart</span>
              Session Breakdown
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">Present ({presentCount})</span>
                  <span>{Math.round((presentCount / totalStudents) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(presentCount / totalStudents) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 font-bold">Late ({lateCount})</span>
                  <span>{Math.round((lateCount / totalStudents) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(lateCount / totalStudents) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-red-400 font-bold">Absent ({absentCount})</span>
                  <span>{Math.round((absentCount / totalStudents) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${(absentCount / totalStudents) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Past Lecture History */}
          <div className={`p-6 rounded-[2rem] border space-y-4 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h3 className="font-headline font-bold text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">history</span>
              Previous Class Sessions
            </h3>

            <div className="space-y-3">
              {historicalSessions.map((session, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-zinc-200'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-zinc-400">{session.date}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{session.rate}% Attendance</span>
                  </div>
                  <h4 className="font-bold text-xs line-clamp-1">{session.topic}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    {session.present} Present • {session.absent} Absent
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
