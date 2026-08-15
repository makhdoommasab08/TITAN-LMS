import React, { useState, useEffect } from 'react';
import { TitanLogo } from './TitanLogo';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  studentId: string;
  department: string;
  joinedDate: string;
  gpa: string;
  isNewStudent?: boolean;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  theme?: 'dark' | 'light';
  onOpenCertificates?: () => void;
  onOpenIdCard?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  theme = 'dark',
  onOpenCertificates,
  onOpenIdCard
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [department, setDepartment] = useState(profile.department);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [previewError, setPreviewError] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Synchronize state when profile prop changes
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setBio(profile.bio);
    setStudentId(profile.studentId);
    setDepartment(profile.department);
    setAvatar(profile.avatar);
  }, [profile]);

  // Automatic background save every 30 seconds while editing bio/profile
  useEffect(() => {
    if (!isOpen || !isEditing) return;

    const intervalId = setInterval(() => {
      const updated: UserProfile = {
        ...profile,
        name,
        email,
        bio,
        studentId,
        department,
        avatar
      };
      onSaveProfile(updated);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(now);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [isOpen, isEditing, name, email, bio, studentId, department, avatar, profile, onSaveProfile]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name,
      email,
      bio,
      studentId,
      department,
      avatar
    };
    onSaveProfile(updated);
    setIsEditing(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Banner Header with Titan Network Branding */}
        <div className="relative h-28 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 px-6 py-4 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <TitanLogo size="sm" variant="horizontal" theme="dark" />
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close Profile"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Profile Header Row - Avatar and Actions */}
        <div className="px-6 relative -mt-10 pb-5 border-b border-zinc-800/60">
          <div className="flex items-end justify-between gap-4">
            <div className="relative group shrink-0">
              <img
                src={previewError ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' : avatar}
                onError={() => setPreviewError(true)}
                alt={name}
                className={`w-20 h-20 rounded-2xl object-cover ring-4 shadow-lg ${
                  isDark ? 'ring-zinc-900 bg-zinc-800' : 'ring-white bg-slate-100'
                }`}
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center text-white text-[10px] font-mono cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-2 pb-1">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                    isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-200 text-zinc-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* User Name & Department */}
          <div className="mt-3 space-y-0.5">
            <h2 className="text-xl font-bold font-headline tracking-tight flex items-center gap-2">
              <span>{name}</span>
              <span className="material-symbols-outlined text-emerald-400 text-lg" title="Verified Scholar">
                verified
              </span>
            </h2>
            <p className="text-xs font-mono text-indigo-400 font-semibold">
              {department} • ID: {studentId}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-5">
              {/* Bio Quote */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-zinc-200'}`}>
                <p className="text-xs font-mono font-semibold uppercase text-zinc-400 mb-1.5">
                  Academic Biography
                </p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  "{bio}"
                </p>
              </div>

              {/* Details 2-col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-zinc-200'}`}>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Email Address</p>
                  <p className="font-semibold text-xs mt-0.5 truncate">{email}</p>
                </div>
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-zinc-200'}`}>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Student ID</p>
                  <p className="font-bold font-mono text-xs mt-0.5 text-amber-400">{studentId}</p>
                </div>
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-zinc-200'}`}>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Institution</p>
                  <p className="font-semibold text-xs mt-0.5 truncate">Taj Institute of Technology</p>
                </div>
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-zinc-200'}`}>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Enrollment</p>
                  <p className="font-semibold text-xs mt-0.5 text-emerald-400">Active • {profile.joinedDate}</p>
                </div>
              </div>

              {/* Certificates Action */}
              {onOpenCertificates && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/80 border-indigo-200'
                }`}>
                  <div className="space-y-0.5">
                    <h4 className="font-headline font-bold text-xs flex items-center gap-1.5 text-indigo-400">
                      <span className="material-symbols-outlined text-sm">workspace_premium</span>
                      Academic Certificates
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      View authenticated degree & course credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCertificates();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full transition-all font-mono shrink-0 shadow-xs"
                  >
                    Certificates
                  </button>
                </div>
              )}
              
              {/* ID Card Action */}
              {onOpenIdCard && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
                }`}>
                  <div className="space-y-0.5">
                    <h4 className="font-headline font-bold text-xs flex items-center gap-1.5 text-amber-500">
                      <span className="material-symbols-outlined text-sm">badge</span>
                      Digital ID Card
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      View and download your official student ID.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenIdCard();
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-full transition-all font-mono shrink-0 shadow-xs"
                  >
                    View ID Card
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSave} className="space-y-4 font-body">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4 text-xs text-indigo-300">
                Update your personal info, avatar picture, and bio to customize your profile and certificates.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                    Department / Faculty
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 mb-1">
                  Profile Picture URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => {
                      setAvatar(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="Enter image URL or select file..."
                    className={`flex-1 px-4 py-2.5 rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-bold text-zinc-400">
                    Academic Bio & Summary
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>
                      {lastSavedTime ? `Last saved: ${lastSavedTime}` : 'Auto-save active (every 30s)'}
                    </span>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-slate-100 border border-zinc-300 text-zinc-900'
                  }`}
                  placeholder="Write a short summary about your background and interests..."
                  required
                />
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 shadow-md transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-between items-center text-xs font-mono ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-zinc-200 text-zinc-600'
        }`}>
          <span>Taj Institute of Technology & Applied Networks</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
