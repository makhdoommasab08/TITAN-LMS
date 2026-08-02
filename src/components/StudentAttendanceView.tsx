import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './UserProfileModal';
import { LeaveRequest } from '../types';

interface StudentAttendanceViewProps {
  theme?: 'dark' | 'light';
  onShowToast: (title: string, message: string) => void;
  userProfile?: UserProfile;
  leaveRequests?: LeaveRequest[];
  onApplyLeave?: (newReq: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
}

interface AttendanceLog {
  id: string;
  date: string; // e.g. "2026-08-02"
  displayDate: string; // e.g. "Aug 02, 2026"
  course: string;
  time: string;
  status: 'Present' | 'Late' | 'Excused' | 'Absent' | 'Approved Leave';
  location: string;
  instructor: string;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  theme = 'dark',
  onShowToast,
  userProfile,
  leaveRequests: propLeaveRequests,
  onApplyLeave: propOnApplyLeave
}) => {
  const isDark = theme === 'dark';
  const studentKey = userProfile?.studentId || 'demo_student';

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'calendar' | 'leaves'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');
  const [selectedDateDetails, setSelectedDateDetails] = useState<AttendanceLog | null>(null);

  // Checkin state
  const [hasMarkedToday, setHasMarkedToday] = useState(false);
  const [isCheckinAnimating, setIsCheckinAnimating] = useState(false);
  const [selectedCheckinCourse, setSelectedCheckinCourse] = useState('CS101 • Advanced AI');

  // Leave Form State
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveCourse, setLeaveCourse] = useState('CS101 • Advanced AI');
  const [leaveCategory, setLeaveCategory] = useState<'Medical' | 'Personal' | 'Academic' | 'Emergency'>('Medical');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveDetails, setLeaveDetails] = useState('');

  // Local state for leave requests (fallback to localStorage if props not fed)
  const [localLeaveRequests, setLocalLeaveRequests] = useState<LeaveRequest[]>(() => {
    if (propLeaveRequests && propLeaveRequests.length > 0) {
      return propLeaveRequests.filter(r => r.studentId === studentKey || !r.studentId);
    }
    const saved = localStorage.getItem('titan_leave_requests');
    if (saved) {
      try {
        const parsed: LeaveRequest[] = JSON.parse(saved);
        return parsed.filter(r => r.studentId === studentKey || !r.studentId || r.studentName === userProfile?.name);
      } catch (e) {
        console.error(e);
      }
    }
    if (userProfile?.isNewStudent) return [];
    return [
      {
        id: 'leave-101',
        studentId: studentKey,
        studentName: userProfile?.name || 'Alex Rivers',
        studentEmail: userProfile?.email || 'alex@titan.edu',
        course: 'CS101 • Advanced AI',
        startDate: '2026-08-10',
        endDate: '2026-08-12',
        reasonCategory: 'Medical',
        reasonDetails: 'Scheduled dental procedure requiring 2 days of home rest.',
        status: 'Approved',
        submittedAt: '2026-08-01 09:30 AM',
        reviewedBy: 'Academic Admin',
        reviewComment: 'Approved. Please submit doctor medical certificate upon return.',
        reviewedAt: '2026-08-01 11:15 AM'
      }
    ];
  });

  useEffect(() => {
    if (propLeaveRequests) {
      setLocalLeaveRequests(propLeaveRequests.filter(r => r.studentId === studentKey || r.studentName === userProfile?.name));
    }
  }, [propLeaveRequests, studentKey, userProfile?.name]);

  // Attendance Metrics & Logs
  const [attendedCount, setAttendedCount] = useState<number>(() => {
    const saved = localStorage.getItem(`titan_attendance_${studentKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.attendedCount === 'number') return parsed.attendedCount;
      } catch (e) {
        console.error(e);
      }
    }
    if (userProfile?.isNewStudent) return 0;
    return 24;
  });

  const [totalCount, setTotalCount] = useState<number>(() => {
    const saved = localStorage.getItem(`titan_attendance_${studentKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.totalCount === 'number') return parsed.totalCount;
      } catch (e) {
        console.error(e);
      }
    }
    if (userProfile?.isNewStudent) return 0;
    return 25;
  });

  const [logs, setLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem(`titan_attendance_${studentKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.logs)) return parsed.logs;
      } catch (e) {
        console.error(e);
      }
    }
    if (userProfile?.isNewStudent) return [];
    return [
      { id: '1', date: '2026-08-01', displayDate: 'Aug 01, 2026', course: 'CS101 • Advanced AI', time: '09:00 AM', status: 'Present', location: 'Hall A1', instructor: 'Dr. Shahnawaz Qureshi' },
      { id: '2', date: '2026-07-30', displayDate: 'Jul 30, 2026', course: 'CS202 • Full-Stack Arch', time: '11:30 AM', status: 'Present', location: 'Lab 3', instructor: 'Prof. Muhammad Hayan' },
      { id: '3', date: '2026-07-28', displayDate: 'Jul 28, 2026', course: 'MATH301 • Linear Algebra', time: '02:00 PM', status: 'Late', location: 'Auditorium B', instructor: 'Dr. Khalid Hussain' },
      { id: '4', date: '2026-07-25', displayDate: 'Jul 25, 2026', course: 'PHY201 • Quantum Info', time: '10:00 AM', status: 'Present', location: 'Quantum Lab', instructor: 'Prof. Rashid Minhas' },
      { id: '5', date: '2026-07-22', displayDate: 'Jul 22, 2026', course: 'CS101 • Advanced AI', time: '09:00 AM', status: 'Excused', location: 'Hall A1', instructor: 'Dr. Ranjeet Kumar' },
    ];
  });

  const attendanceRate = totalCount > 0 ? ((attendedCount / totalCount) * 100).toFixed(1) : '0.0';

  // Perform Live Checkin
  const handleMarkDailyAttendance = () => {
    if (hasMarkedToday) return;

    setIsCheckinAnimating(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      const newLog: AttendanceLog = {
        id: `att-${Date.now()}`,
        date: dateStr,
        displayDate: formattedDate,
        course: selectedCheckinCourse,
        time: formattedTime,
        status: 'Present',
        location: 'Hall A1 (Geo-Verified)',
        instructor: selectedCheckinCourse.includes('CS101') ? 'Dr. Ranjeet Kumar' : 'Prof. Muhammad Hayan'
      };

      const updatedLogs = [newLog, ...logs];
      const updatedAttended = attendedCount + 1;
      const updatedTotal = totalCount + 1;

      setLogs(updatedLogs);
      setAttendedCount(updatedAttended);
      setTotalCount(updatedTotal);
      setHasMarkedToday(true);
      setIsCheckinAnimating(false);

      localStorage.setItem(`titan_attendance_${studentKey}`, JSON.stringify({
        attendedCount: updatedAttended,
        totalCount: updatedTotal,
        logs: updatedLogs
      }));

      onShowToast(
        'Attendance Recorded!',
        `Successfully logged present for ${selectedCheckinCourse} at ${formattedTime}. Synced to TITAN portal.`
      );
    }, 600);
  };

  // Submit Leave Request
  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate || !leaveDetails.trim()) {
      alert('Please fill out all required leave details.');
      return;
    }

    const newLeave: LeaveRequest = {
      id: `req-${Date.now()}`,
      studentId: studentKey,
      studentName: userProfile?.name || 'Alex Rivers',
      studentEmail: userProfile?.email || 'student@titan.edu',
      studentAvatar: userProfile?.avatar,
      course: leaveCourse,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reasonCategory: leaveCategory,
      reasonDetails: leaveDetails.trim(),
      status: 'Pending',
      submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    if (propOnApplyLeave) {
      propOnApplyLeave({
        studentId: newLeave.studentId,
        studentName: newLeave.studentName,
        studentEmail: newLeave.studentEmail,
        studentAvatar: newLeave.studentAvatar,
        course: newLeave.course,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reasonCategory: newLeave.reasonCategory,
        reasonDetails: newLeave.reasonDetails,
      });
    }

    // Save locally as well
    const saved = localStorage.getItem('titan_leave_requests');
    let allRequests: LeaveRequest[] = saved ? JSON.parse(saved) : [];
    allRequests = [newLeave, ...allRequests];
    localStorage.setItem('titan_leave_requests', JSON.stringify(allRequests));

    setLocalLeaveRequests(prev => [newLeave, ...prev]);
    setShowLeaveForm(false);
    setLeaveDetails('');
    setLeaveStartDate('');
    setLeaveEndDate('');

    onShowToast('Leave Request Submitted!', 'Your application has been dispatched to the Admin Portal for official review.');
  };

  // Days Generator for Calendar (August 2026 - 31 Days)
  const renderCalendarDays = () => {
    const daysInMonth = 31;
    const days = [];
    
    // August 2026 starts on Saturday (5 empty slots before Day 1)
    const paddingSlots = 5;
    for (let i = 0; i < paddingSlots; i++) {
      days.push(<div key={`pad-${i}`} className="h-20 rounded-2xl bg-transparent opacity-20 border border-transparent" />);
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
      const dateKey = `2026-08-${dayStr}`;

      // Find if there is an attendance record for this date
      const matchLog = logs.find(l => l.date === dateKey);
      const matchLeave = localLeaveRequests.find(r => r.startDate <= dateKey && r.endDate >= dateKey && r.status === 'Approved');

      let statusType: 'Present' | 'Late' | 'Excused' | 'Approved Leave' | 'Absent' | 'None' = 'None';
      if (matchLeave) {
        statusType = 'Approved Leave';
      } else if (matchLog) {
        statusType = matchLog.status;
      }

      days.push(
        <motion.div
          key={`day-${dayNum}`}
          whileHover={{ scale: 1.03, y: -2 }}
          onClick={() => {
            if (matchLog) {
              setSelectedDateDetails(matchLog);
            } else if (matchLeave) {
              setSelectedDateDetails({
                id: matchLeave.id,
                date: dateKey,
                displayDate: `Aug ${dayStr}, 2026`,
                course: matchLeave.course,
                time: 'All Day',
                status: 'Approved Leave',
                location: 'Off-Campus (Approved)',
                instructor: 'Academic Admin'
              });
            }
          }}
          className={`h-20 rounded-2xl p-2.5 border flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
            isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-indigo-500/50' : 'bg-white border-zinc-200 hover:border-indigo-400 shadow-xs'
          } ${statusType !== 'None' ? 'ring-1 ring-inset' : ''} ${
            statusType === 'Present' ? 'ring-emerald-500/30 bg-emerald-950/10' :
            statusType === 'Late' ? 'ring-amber-500/30 bg-amber-950/10' :
            statusType === 'Excused' ? 'ring-purple-500/30 bg-purple-950/10' :
            statusType === 'Approved Leave' ? 'ring-indigo-500/40 bg-indigo-950/20' :
            statusType === 'Absent' ? 'ring-rose-500/30 bg-rose-950/10' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <span className={`font-mono text-xs font-bold ${dayNum === 2 ? 'text-indigo-400 font-extrabold' : isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {dayNum}
            </span>
            {dayNum === 2 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500 text-white uppercase tracking-wider">
                Today
              </span>
            )}
          </div>

          <div>
            {statusType === 'Present' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Present
              </span>
            )}
            {statusType === 'Late' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Late
              </span>
            )}
            {statusType === 'Excused' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Excused
              </span>
            )}
            {statusType === 'Approved Leave' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Leave
              </span>
            )}
            {statusType === 'Absent' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Absent
              </span>
            )}
            {statusType === 'None' && (
              <span className="text-[10px] font-mono text-zinc-500">Scheduled</span>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-8 py-8 space-y-8 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
    }`}>
      {/* Sleek Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              TITAN Attendance Portal
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Sync
            </span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Student Attendance Management
          </h2>
          <p className="text-xs font-body text-zinc-400 mt-0.5">
            Interactive check-ins, monthly attendance calendar, and official leave approval portal.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex p-1 rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Overview & Check-In</span>
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'leaves'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">assignment_turned_in</span>
            <span>Leave Requests</span>
            {localLeaveRequests.filter(r => r.status === 'Pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* Top Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric 1: Attendance Rate */}
        <div className={`p-6 rounded-[2rem] border relative overflow-hidden flex flex-col justify-between ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
              Overall Attendance Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-headline text-indigo-400">
                {attendanceRate}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Good Standing</span>
            </div>
          </div>
          <div className="mt-4 w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, parseFloat(attendanceRate))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Classes Attended */}
        <div className={`p-6 rounded-[2rem] border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
              Attended / Total Lectures
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-headline text-white">
                {attendedCount} / {totalCount}
              </span>
              <span className="text-xs font-mono text-zinc-400">Sessions</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-3">
            Recorded in TITAN database log.
          </p>
        </div>

        {/* Metric 3: Approved Leaves */}
        <div className={`p-6 rounded-[2rem] border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
              Official Approved Leaves
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-headline text-indigo-300">
                {localLeaveRequests.filter(r => r.status === 'Approved').length}
              </span>
              <span className="text-xs font-mono text-indigo-400 font-bold">Approved Days</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-3">
            Excused from course attendance penalties.
          </p>
        </div>

        {/* Metric 4: Pending Requests */}
        <div className={`p-6 rounded-[2rem] border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
              Pending Admin Approvals
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-headline text-amber-400">
                {localLeaveRequests.filter(r => r.status === 'Pending').length}
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">Under Review</span>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 font-bold mt-3 hover:underline text-left"
          >
            View Leave Status Tracker ↗
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW & INTERACTIVE CHECK-IN */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Animated Checkin Card */}
            <div className={`lg:col-span-1 p-6 rounded-[2rem] border relative overflow-hidden flex flex-col justify-between ${
              isDark ? 'bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border-indigo-500/30' : 'bg-indigo-50/60 border-indigo-200 shadow-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    Interactive Check-In
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Geo-Fence Validated
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl mb-1">
                  Mark Today's Attendance
                </h3>
                <p className="text-xs text-zinc-400 font-body mb-4">
                  Tap to record your present status for today's active academic lecture.
                </p>

                <div className="mb-4">
                  <label className="block text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                    Select Active Course Session
                  </label>
                  <select
                    value={selectedCheckinCourse}
                    onChange={(e) => setSelectedCheckinCourse(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-white border border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option>CS101 • Advanced AI</option>
                    <option>CS202 • Full-Stack Software Architecture</option>
                    <option>MATH301 • Linear Algebra & Matrices</option>
                    <option>PHY201 • Quantum Information Systems</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: hasMarkedToday ? 1 : 1.02 }}
                  whileTap={{ scale: hasMarkedToday ? 1 : 0.95 }}
                  onClick={handleMarkDailyAttendance}
                  disabled={hasMarkedToday || isCheckinAnimating}
                  className={`w-full py-4 rounded-2xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden ${
                    hasMarkedToday
                      ? 'bg-emerald-600/90 text-white cursor-not-allowed border border-emerald-400/40'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white border border-indigo-400/30'
                  }`}
                >
                  {isCheckinAnimating ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      Verifying Geo-Location & Logging...
                    </span>
                  ) : hasMarkedToday ? (
                    <span className="flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Attendance Recorded for Today!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 font-bold tracking-wider">
                      <span className="material-symbols-outlined text-lg">touch_app</span>
                      Mark Live Attendance Now
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className={`lg:col-span-2 p-6 rounded-[2rem] border ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-headline font-bold text-xl">Recent Attendance Logs</h3>
                  <p className="text-xs text-zinc-400 font-body">Verified check-in timestamps and course locations.</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('calendar')}
                  className="text-xs font-mono text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  View Full Calendar Grid ↗
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Course & Instructor</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-zinc-500 font-mono text-xs">
                          <span className="material-symbols-outlined text-3xl text-indigo-400 block mb-1">event_available</span>
                          No past attendance records found for this student.
                          <p className="text-[11px] text-zinc-400 mt-1">Use the interactive check-in widget on the left during lectures to log your attendance!</p>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-mono font-bold">{log.displayDate || log.date}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{log.time}</p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-white">{log.course}</p>
                            <p className="text-[10px] text-zinc-400">{log.instructor}</p>
                          </td>
                          <td className="py-3 px-3 font-mono text-zinc-400">{log.location}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                              log.status === 'Present'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : log.status === 'Late'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : log.status === 'Approved Leave'
                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                log.status === 'Present' ? 'bg-emerald-400' : log.status === 'Late' ? 'bg-amber-400' : 'bg-indigo-400'
                              }`}></span>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTERACTIVE CALENDAR GRID VIEW */}
      {activeSubTab === 'calendar' && (
        <div className={`p-6 rounded-[2rem] border space-y-6 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="font-headline font-bold text-2xl">Monthly Attendance Calendar</h3>
              <p className="text-xs text-zinc-400 font-body">Visual color-coded grid displaying lectures and attendance status.</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-100 border-zinc-300 text-zinc-900'
                }`}
              >
                <option>August 2026</option>
                <option>July 2026</option>
                <option>June 2026</option>
              </select>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pb-2">
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Legend:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Present
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Late
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Excused
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Approved Leave
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Absent
            </span>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-3 text-center font-mono text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div className="text-zinc-500">Sat</div>
            <div className="text-zinc-500">Sun</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3">
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LEAVE APPLICATION & ADMIN STATUS TRACKER */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
            <div>
              <h3 className="font-headline font-bold text-2xl">Official Leave Portal</h3>
              <p className="text-xs text-zinc-400 font-body">Submit absence requests directly to the TITAN Admin Portal for approval.</p>
            </div>
            <button
              onClick={() => setShowLeaveForm(!showLeaveForm)}
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add_task</span>
              <span>{showLeaveForm ? 'Close Application Form' : 'Apply for Leave'}</span>
            </button>
          </div>

          {/* Leave Application Form */}
          <AnimatePresence>
            {showLeaveForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-6 rounded-[2rem] border overflow-hidden ${
                  isDark ? 'bg-zinc-900 border-indigo-500/40' : 'bg-white border-indigo-300 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-indigo-400">edit_calendar</span>
                  <h4 className="font-headline font-bold text-lg">Submit Official Leave Application</h4>
                </div>

                <form onSubmit={handleSubmitLeave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                        Course Session
                      </label>
                      <select
                        value={leaveCourse}
                        onChange={(e) => setLeaveCourse(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                        }`}
                      >
                        <option>CS101 • Advanced AI</option>
                        <option>CS202 • Full-Stack Software Architecture</option>
                        <option>MATH301 • Linear Algebra & Matrices</option>
                        <option>PHY201 • Quantum Information Systems</option>
                        <option>All Enrolled Courses (General Absence)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                        Absence Reason Category
                      </label>
                      <select
                        value={leaveCategory}
                        onChange={(e: any) => setLeaveCategory(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                        }`}
                      >
                        <option value="Medical">Medical (Illness / Surgery / Doctor Appointment)</option>
                        <option value="Personal">Personal / Family Emergency</option>
                        <option value="Academic">Academic Competition / Conference Representation</option>
                        <option value="Emergency">Urgent Circumstances</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                      Detailed Justification / Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={leaveDetails}
                      onChange={(e) => setLeaveDetails(e.target.value)}
                      placeholder="Provide specific justification for administrator verification..."
                      className={`w-full px-4 py-3 rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLeaveForm(false)}
                      className="px-5 py-2.5 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Dispatch Application to Admin Portal</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leave Request Real-Time Status History */}
          <div className={`p-6 rounded-[2rem] border ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h4 className="font-headline font-bold text-xl mb-4">My Submitted Leave Applications</h4>

            {localLeaveRequests.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                <span className="material-symbols-outlined text-4xl text-indigo-400 block mb-2">assignment_late</span>
                No leave requests submitted yet.
                <p className="text-[11px] text-zinc-400 mt-1">Click "Apply for Leave" above if you require medical or official academic absence.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localLeaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700' : 'bg-slate-50 border-zinc-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {req.reasonCategory}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {req.startDate} → {req.endDate}
                        </span>
                      </div>
                      <h5 className="font-bold text-base text-white font-headline">
                        {req.course}
                      </h5>
                      <p className="text-xs text-zinc-300 font-body">
                        "{req.reasonDetails}"
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        Submitted: {req.submittedAt}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      {req.status === 'Pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          Pending Admin Review
                        </span>
                      )}
                      {req.status === 'Approved' && (
                        <div className="text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Approved by Admin
                          </span>
                          {req.reviewComment && (
                            <p className="text-[11px] font-mono text-emerald-300/80 mt-1 italic max-w-xs">
                              Note: "{req.reviewComment}"
                            </p>
                          )}
                        </div>
                      )}
                      {req.status === 'Rejected' && (
                        <div className="text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                            Application Rejected
                          </span>
                          {req.reviewComment && (
                            <p className="text-[11px] font-mono text-rose-300/80 mt-1 italic max-w-xs">
                              Reason: "{req.reviewComment}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Details Modal */}
      {selectedDateDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-[2rem] border shadow-2xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                Lecture Attendance Entry
              </span>
              <button
                onClick={() => setSelectedDateDetails(null)}
                className="text-zinc-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <h3 className="font-headline font-bold text-xl mb-1">{selectedDateDetails.course}</h3>
            <p className="text-xs font-mono text-indigo-400 mb-4">{selectedDateDetails.displayDate}</p>

            <div className="space-y-3 font-mono text-xs border-y border-zinc-800 py-4 my-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Scheduled Time:</span>
                <span className="font-bold">{selectedDateDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Classroom:</span>
                <span className="font-bold">{selectedDateDetails.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Faculty Instructor:</span>
                <span className="font-bold">{selectedDateDetails.instructor}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Verification Status:</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedDateDetails.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDateDetails(null)}
              className="w-full py-2.5 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold hover:bg-indigo-500 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
