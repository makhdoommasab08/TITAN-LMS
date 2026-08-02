import React, { useState, useEffect } from 'react';
import { UserItem, SystemMetrics, LeaveRequest } from '../types';

interface AdminPortalViewProps {
  users: UserItem[];
  metrics: SystemMetrics;
  onOnboardTeacher: () => void;
  onGlobalSettings: () => void;
  onDatabaseBackup: () => void;
  onBroadcastAnnouncement: () => void;
  onUserAction: (userId: string, action: string) => void;
  theme?: 'dark' | 'light';
  leaveRequests?: LeaveRequest[];
  onApproveLeave?: (id: string, comment?: string) => void;
  onRejectLeave?: (id: string, comment?: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  users,
  metrics,
  onOnboardTeacher,
  onGlobalSettings,
  onDatabaseBackup,
  onBroadcastAnnouncement,
  onUserAction,
  theme = 'dark',
  leaveRequests: propLeaveRequests,
  onApproveLeave: propOnApproveLeave,
  onRejectLeave: propOnRejectLeave
}) => {
  const [roleFilter, setRoleFilter] = useState('All Users');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedLeaveAction, setSelectedLeaveAction] = useState<{ req: LeaveRequest; type: 'Approve' | 'Reject' } | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const isDark = theme === 'dark';

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    if (propLeaveRequests && propLeaveRequests.length > 0) return propLeaveRequests;
    const saved = localStorage.getItem('titan_leave_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'leave-101',
        studentId: 'TITAN-2026-889123',
        studentName: 'Alex Rivers',
        studentEmail: 'alex@titan.edu',
        course: 'CS101 • Advanced AI',
        startDate: '2026-08-10',
        endDate: '2026-08-12',
        reasonCategory: 'Medical',
        reasonDetails: 'Scheduled dental procedure requiring 2 days of home rest.',
        status: 'Pending',
        submittedAt: '2026-08-01 09:30 AM'
      }
    ];
  });

  useEffect(() => {
    if (propLeaveRequests) setLeaveRequests(propLeaveRequests);
  }, [propLeaveRequests]);

  const handleConfirmLeaveAction = () => {
    if (!selectedLeaveAction) return;

    const { req, type } = selectedLeaveAction;
    const newStatus = type === 'Approve' ? 'Approved' : 'Rejected';

    if (propOnApproveLeave && type === 'Approve') {
      propOnApproveLeave(req.id, reviewNote);
    } else if (propOnRejectLeave && type === 'Reject') {
      propOnRejectLeave(req.id, reviewNote);
    }

    const updated = leaveRequests.map(r => {
      if (r.id === req.id) {
        return {
          ...r,
          status: newStatus as 'Approved' | 'Rejected',
          reviewComment: reviewNote || (type === 'Approve' ? 'Approved by Academic Admin Board' : 'Rejected by Academic Admin Board'),
          reviewedBy: 'Academic Admin',
          reviewedAt: new Date().toLocaleString()
        };
      }
      return r;
    });

    setLeaveRequests(updated);
    localStorage.setItem('titan_leave_requests', JSON.stringify(updated));

    setSelectedLeaveAction(null);
    setReviewNote('');
  };

  const handleExportCSV = () => {
    // Filter users if 'Students' selected, otherwise default to all users or students
    const dataToExport = roleFilter === 'Students' ? filteredUsers : users.filter(u => u.role === 'STUDENT').length > 0 ? users.filter(u => u.role === 'STUDENT') : users;

    const headers = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Joined Date', 'Performance Metric', 'Performance Value'];
    
    const rows = dataToExport.map((u) => [
      `"${(u.id || '').replace(/"/g, '""')}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.role || '').replace(/"/g, '""')}"`,
      `"${(u.status || '').replace(/"/g, '""')}"`,
      `"${(u.joinedDate || '').replace(/"/g, '""')}"`,
      `"${(u.performanceLabel || '').replace(/"/g, '""')}"`,
      `"${u.performancePercent ?? ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `titan_students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'All Users') return true;
    if (roleFilter === 'Students') return u.role === 'STUDENT';
    if (roleFilter === 'Teachers') return u.role === 'TEACHER';
    if (roleFilter === 'Admins') return u.role === 'ADMIN';
    return true;
  });

  return (
    <div className={`max-w-[1126px] mx-auto px-4 sm:px-8 py-8 space-y-8 border-x min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 border-zinc-800/80 text-white' : 'bg-slate-50 border-zinc-200 text-zinc-900'
    }`}>
      {/* System Overview Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <div>
          <h2 className={`font-headline text-3xl md:text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            System Overview
          </h2>
          <p className={`font-body text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Real-time performance metrics across the TITAN LMS ecosystem.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Student Data</span>
          </button>
          <button
            onClick={() => alert('Opening live telemetry stream...')}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold shadow-xs hover:bg-indigo-500 transition-all"
          >
            Live View
          </button>
        </div>
      </div>

      {/* Hero Stats Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Card (5 cols) */}
        <div className={`col-span-12 lg:col-span-5 border rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between shadow-2xs transition-all ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white'
            : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div className="absolute -right-8 -top-8 opacity-5 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[10rem]">trending_up</span>
          </div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                +12.5%
              </span>
            </div>
            <p className={`font-mono uppercase tracking-widest text-xs font-semibold ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Total Monthly Revenue
            </p>
            <h3 className={`text-3xl sm:text-4xl font-black leading-tight mt-1 font-headline ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              ${metrics.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className={`mt-6 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex justify-between text-xs font-mono">
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Target: ${metrics.revenueTarget / 1000}k</span>
              <span className="font-bold text-indigo-500">
                {metrics.revenueAchievement}% Achievement
              </span>
            </div>
            <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${metrics.revenueAchievement}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Students Card (3 cols) */}
        <div className={`col-span-12 sm:col-span-6 lg:col-span-3 border rounded-[2rem] p-6 flex flex-col justify-between shadow-2xs transition-all ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white'
            : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl inline-block mb-4">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <p className={`font-mono text-xs uppercase tracking-wider font-semibold ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Total Students
            </p>
            <h4 className={`text-3xl font-bold mt-1 font-headline ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              {metrics.totalStudents.toLocaleString()}
            </h4>
          </div>
          <div className="mt-4 text-emerald-500 text-xs flex items-center gap-1 font-mono font-bold">
            <span className="material-symbols-outlined text-base">arrow_upward</span>
            1,200 this week
          </div>
        </div>

        {/* Active Courses Card (4 cols) */}
        <div className={`col-span-12 sm:col-span-6 lg:col-span-4 border rounded-[2rem] p-6 flex flex-col justify-between shadow-2xs transition-all ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white'
            : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl inline-block mb-4">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <p className={`font-mono text-xs uppercase tracking-wider font-semibold ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Active Courses
            </p>
            <h4 className={`text-3xl font-bold mt-1 font-headline ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              {metrics.activeCourses}
            </h4>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                className={`w-8 h-8 rounded-full border-2 object-cover ${isDark ? 'border-zinc-900' : 'border-white'}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChAZ_-v-AKQ2f6z5RgLPCsdAE99F9KMxQty8KoHGFKK01352Bmycssd0-YYC-iR8_7axZ2kEVZO-TMG96c7IAjDPGWMlgUoFBGFebvF-xogevStVH4YBUCQM9BFMyjuqNO7fECdIF7P_mglIArD8AL6WyWUPaJpMBBsJl5RBCpmMu9bFtyiLsVkyTg6j_sCaOdOhPynFC-GU8HOtaUOzQTjrF-0PSVGvYtx73UxdTqE-mKRMHkQUF1_H887dXgmT5JzPmLoHxcsz4"
                alt="Instructor"
              />
              <img
                className={`w-8 h-8 rounded-full border-2 object-cover ${isDark ? 'border-zinc-900' : 'border-white'}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEtnCE_6AhMnTqplRLqVpiBEng5tffcX9MB2OQU31ExCQLB4Sk2EKuw1yh1JltkNu81ItzufPewEk8pOqdJ2iQ1UUB-IwSx8d_k2Mc6ZriNfsfo7bBAeulBkoykaIaYX2MwXyDNJuWqJ-Nx9TNT5408frHK9DloE1llG6Ln3_bJH1IsPkTo-P_JufbrT3MF3tOYVpvs9ScRzjL-F59ACCZYKKbrFc8ta2ftr-nsUfJaVmLZGLqBlUDXjglgUVJHL9dLPtNkF3qlxw"
                alt="Instructor"
              />
              <img
                className={`w-8 h-8 rounded-full border-2 object-cover ${isDark ? 'border-zinc-900' : 'border-white'}`}
                src="https://media.licdn.com/dms/image/v2/D4D22AQEzbJzahRPz8A/feedshare-shrink_800/B4DZUbJYsZHAAo-/0/1739917201215?e=2147483647&v=beta&t=nSiXg3jfIgPm2EI5BjT09z-N7IUJxXxdiZng3vv5wuo"
                alt="Instructor"
              />
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold font-mono ${
                isDark ? 'bg-zinc-800 border-zinc-900 text-zinc-300' : 'bg-zinc-200 border-white text-zinc-700'
              }`}>
                +42
              </div>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Faculty Leads</span>
          </div>
        </div>
      </div>

      <div className="section-tick"></div>

      {/* System Health & Quick Actions Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* System Health Monitoring (8 cols) */}
        <div className={`col-span-12 lg:col-span-8 border rounded-[2rem] overflow-hidden shadow-2xs ${
          isDark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <div className={`p-5 border-b flex justify-between items-center ${
            isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-slate-100/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <h3 className={`font-bold font-headline ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                System Health Monitor
              </h3>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Uptime: {metrics.uptime}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Server CPU</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{metrics.cpu}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${metrics.cpu}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Memory Usage</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{metrics.memory}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${metrics.memory}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Disk Latency</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{metrics.diskLatency}ms</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: '15%' }}
                />
              </div>
            </div>
          </div>

          {/* Network Traffic Bar Graph */}
          <div className="px-6 pb-6">
            <div className={`h-28 w-full rounded-2xl border flex items-end gap-1.5 p-3 relative overflow-hidden ${
              isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-100 border-zinc-200'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-6xl text-indigo-400">query_stats</span>
              </div>
              {[35, 50, 65, 40, 55, 45, 80, 70, 60, 95].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-indigo-600/40 hover:bg-indigo-500 rounded-t-xs transition-all cursor-pointer"
                  style={{ height: `${val}%` }}
                  title={`Hour ${i + 1}: ${val * 12} req/sec`}
                />
              ))}
            </div>
            <p className={`text-center text-[10px] font-mono mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Network traffic (last 24 hours)
            </p>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className={`col-span-12 lg:col-span-4 border rounded-[2rem] p-6 shadow-2xs ${
          isDark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm shadow-zinc-200/50'
        }`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 font-headline text-lg ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <span className="material-symbols-outlined text-indigo-500">bolt</span> Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={onOnboardTeacher}
              className={`w-full flex items-center justify-between p-3.5 rounded-full border group transition-all text-left shadow-2xs ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white'
                  : 'border-zinc-200 bg-slate-100 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500 group-hover:text-indigo-600">
                  person_add
                </span>
                <span className="font-mono text-xs font-bold">Onboard New Teacher</span>
              </span>
              <span className="material-symbols-outlined text-lg text-zinc-400">chevron_right</span>
            </button>

            <button
              onClick={onGlobalSettings}
              className={`w-full flex items-center justify-between p-3.5 rounded-full border group transition-all text-left shadow-2xs ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white'
                  : 'border-zinc-200 bg-slate-100 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500 group-hover:text-indigo-600">
                  settings_applications
                </span>
                <span className="font-mono text-xs font-bold">Global App Settings</span>
              </span>
              <span className="material-symbols-outlined text-lg text-zinc-400">chevron_right</span>
            </button>

            <button
              onClick={onDatabaseBackup}
              className={`w-full flex items-center justify-between p-3.5 rounded-full border group transition-all text-left shadow-2xs ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white'
                  : 'border-zinc-200 bg-slate-100 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500 group-hover:text-indigo-600">
                  database
                </span>
                <span className="font-mono text-xs font-bold">Database Backup</span>
              </span>
              <span className="material-symbols-outlined text-lg text-zinc-400">chevron_right</span>
            </button>

            <button
              onClick={onBroadcastAnnouncement}
              className={`w-full flex items-center justify-between p-3.5 rounded-full border group transition-all text-left shadow-2xs ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white'
                  : 'border-zinc-200 bg-slate-100 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500 group-hover:text-indigo-600">
                  mail
                </span>
                <span className="font-mono text-xs font-bold">Broadcast Announcement</span>
              </span>
              <span className="material-symbols-outlined text-lg text-zinc-400">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Leave Applications & Attendance Approvals Section */}
      <div className={`border rounded-[2rem] overflow-hidden shadow-2xs ${
        isDark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm shadow-zinc-200/50'
      }`}>
        <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-slate-100/80'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Attendance Governance
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {leaveRequests.filter(r => r.status === 'Pending').length} Pending Requests
              </span>
            </div>
            <h3 className={`font-bold text-xl font-headline ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Student Leave Applications & Approvals
            </h3>
            <p className={`text-xs font-body ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Review and approve absence requests submitted by students. Approved leaves update student attendance records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(st => (
              <button
                key={st}
                onClick={() => setLeaveStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  leaveStatusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-200 text-zinc-700 hover:bg-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead>
              <tr className={`border-b font-mono text-[10px] uppercase tracking-wider ${
                isDark ? 'border-zinc-800 text-zinc-400 bg-zinc-950/30' : 'border-zinc-200 text-zinc-500 bg-slate-50'
              }`}>
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Leave Duration</th>
                <th className="py-3 px-4">Reason Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-800/60' : 'divide-zinc-200'}`}>
              {leaveRequests
                .filter(r => leaveStatusFilter === 'All' || r.status === leaveStatusFilter)
                .length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center font-mono text-xs text-zinc-500">
                    No leave applications matching selected filter "{leaveStatusFilter}".
                  </td>
                </tr>
              ) : (
                leaveRequests
                  .filter(r => leaveStatusFilter === 'All' || r.status === leaveStatusFilter)
                  .map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.studentAvatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2OfwmS2bIeSMUT_DnrlEfRIDAARXIsxGtcwuXbmeWA&s=10'}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
                          />
                          <div>
                            <p className="font-bold text-white font-headline">{req.studentName}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{req.studentEmail}</p>
                            <span className="text-[9px] font-mono text-indigo-400">ID: {req.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold">{req.course}</p>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {req.reasonCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <p className="font-bold text-white">{req.startDate}</p>
                        <p className="text-[10px] text-zinc-400">to {req.endDate}</p>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-zinc-300 line-clamp-2 font-body">
                          "{req.reasonDetails}"
                        </p>
                        <p className="text-[9px] font-mono text-zinc-500 mt-0.5">Submitted: {req.submittedAt}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {req.status === 'Pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            Pending Review
                          </span>
                        )}
                        {req.status === 'Approved' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Approved
                          </span>
                        )}
                        {req.status === 'Rejected' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedLeaveAction({ req, type: 'Approve' });
                                setReviewNote('Approved - Supporting details verified.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeaveAction({ req, type: 'Reject' });
                                setReviewNote('Rejected - Insufficient documentation.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-mono text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500 italic">
                            Reviewed by {req.reviewedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Review Action Modal */}
      {selectedLeaveAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-[2rem] border shadow-2xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <h4 className="font-headline font-bold text-xl mb-1">
              {selectedLeaveAction.type === 'Approve' ? 'Approve Leave Request' : 'Reject Leave Application'}
            </h4>
            <p className="text-xs font-mono text-zinc-400 mb-4">
              Student: <strong className="text-white">{selectedLeaveAction.req.studentName}</strong> ({selectedLeaveAction.req.course})
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                  Official Admin Review Note / Justification
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Enter review notes for student record..."
                  className={`w-full px-4 py-3 rounded-xl text-xs font-body focus:outline-none focus:ring-2 ${
                    selectedLeaveAction.type === 'Approve' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'
                  } ${
                    isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedLeaveAction(null)}
                className="px-4 py-2.5 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveAction}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold text-white shadow-md flex items-center gap-1.5 ${
                  selectedLeaveAction.type === 'Approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                <span>Confirm {selectedLeaveAction.type}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management Table Section */}
      <div className={`border rounded-[2rem] overflow-hidden shadow-2xs ${
        isDark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm shadow-zinc-200/50'
      }`}>
        <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-slate-100/80'
        }`}>
          <div>
            <h3 className={`font-bold text-lg font-headline ${isDark ? 'text-white' : 'text-zinc-900'}`}>User Management</h3>
            <p className={`text-xs font-body ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Manage student and instructor credentials.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Export user & student data to CSV file"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`border rounded-full px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
            >
              <option>All Users</option>
              <option>Students</option>
              <option>Teachers</option>
              <option>Admins</option>
            </select>

            <div className={`flex border rounded-full overflow-hidden ${
              isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-300 bg-white'
            }`}>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-lg">list</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className={`border-b ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-zinc-200'}`}>
              <tr>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  User Info
                </th>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Role
                </th>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Status
                </th>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Joined
                </th>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Performance
                </th>
                <th className={`px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider text-right ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y font-body ${isDark ? 'divide-zinc-800/60 text-zinc-200' : 'divide-zinc-200 text-zinc-800'}`}>
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`transition-colors ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-100/60'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className={`w-10 h-10 rounded-full object-cover border ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono font-bold flex items-center justify-center text-sm">
                          {u.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                      <div>
                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{u.name}</p>
                        <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                        u.role === 'TEACHER'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          : u.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                        u.status === 'Active'
                          ? 'text-emerald-500'
                          : u.status === 'Suspended'
                          ? 'text-red-500'
                          : 'text-amber-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Active'
                            ? 'bg-emerald-500'
                            : u.status === 'Suspended'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {u.joinedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`w-28 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                      <div
                        className={`h-full ${
                          u.status === 'Suspended'
                            ? 'bg-red-500'
                            : u.role === 'TEACHER'
                            ? 'bg-emerald-500'
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${u.performancePercent}%` }}
                      />
                    </div>
                    <p className={`text-[10px] mt-1 font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {u.performancePercent}% {u.performanceLabel}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        onUserAction(
                          u.id,
                          u.status === 'Active' ? 'Suspend' : 'Activate'
                        )
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                      }`}
                      title="User Actions"
                    >
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-zinc-200'
        }`}>
          <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Showing 1-{filteredUsers.length} of {metrics.totalStudents.toLocaleString()} users
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className={`p-1.5 rounded-full border cursor-not-allowed ${
                isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-300 text-zinc-400'
              }`}
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              onClick={() => alert('Loading next page...')}
              className={`p-1.5 rounded-full border ${
                isDark ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Hash */}
      <div className="mt-8 flex flex-col items-center">
        <div className="section-tick" />
        <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-[0.2em] mt-2">
          TITAN NETWORK INTERNAL DASHBOARD V4.2.0
        </p>
      </div>
    </div>
  );
};
