import React, { useState, useRef } from 'react';
import { Course } from '../types';
import { UserProfile } from './UserProfileModal';
import { TitanLogo } from './TitanLogo';

interface CertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  profile: UserProfile;
  theme?: 'dark' | 'light';
}

export const CertificatesModal: React.FC<CertificatesModalProps> = ({
  isOpen,
  onClose,
  courses,
  profile,
  theme = 'dark'
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || {
    id: 'course-ds101',
    title: 'Data Science 101',
    instructor: 'Dr. Muhammad Hayan',
    category: 'Data Science',
    progress: 100,
    completedLessons: 36,
    totalLessons: 36,
    image: '',
    description: ''
  });

  const [issueDate, setIssueDate] = useState<string>(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Handle Download Action (Triggers browser print / save window optimized for certificate)
  const handleDownloadCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print your official certificate.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${profile.name} - ${selectedCourse.title}</title>
          <style>
            @page { size: landscape; margin: 0; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              background-color: #f8fafc;
              font-family: 'Georgia', 'Times New Roman', serif;
              color: #1e293b;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .cert-container {
              width: 1000px;
              height: 700px;
              background-color: #ffffff;
              border: 1px solid #cbd5e1;
              position: relative;
              padding: 16px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            .outer-frame {
              width: 100%;
              height: 100%;
              border: 2px solid #94a3b8;
              position: relative;
              padding: 36px 44px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
            }
            .inner-frame-line {
              position: absolute;
              inset: 6px;
              border: 1px solid #e2e8f0;
              pointer-events: none;
            }
            /* Corner Bracket Accents */
            .corner-bracket {
              position: absolute;
              width: 16px;
              height: 16px;
              border-color: #0056D2;
              border-style: solid;
            }
            .corner-tl { top: 2px; left: 2px; border-width: 2px 0 0 2px; }
            .corner-tr { top: 2px; right: 2px; border-width: 2px 2px 0 0; }
            .corner-bl { bottom: 2px; left: 2px; border-width: 0 0 2px 2px; }
            .corner-br { bottom: 2px; right: 2px; border-width: 0 2px 2px 0; }

            /* Top Left Brand Header */
            .top-left-brand {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              z-index: 10;
            }
            .brand-header-flex {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 8px;
            }
            .brand-titles {
              display: flex;
              flex-direction: column;
            }
            .brand-logo-text {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 32px;
              font-weight: 900;
              color: #0056D2;
              letter-spacing: -1.2px;
              line-height: 1;
            }
            .institute-full-name {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 9px;
              font-weight: 800;
              color: #1e3a8a;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              margin-top: 3px;
            }
            .issue-date {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              color: #64748b;
              margin-top: 4px;
            }

            /* Vertical Ribbon Banner Right */
            .ribbon-banner {
              position: absolute;
              right: 60px;
              top: 0;
              width: 170px;
              height: 360px;
              background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
              border-left: 1px solid #bfdbfe;
              border-right: 1px solid #bfdbfe;
              border-bottom: 1px solid #93c5fd;
              clip-path: polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%);
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-top: 30px;
              z-index: 10;
              box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            }
            .ribbon-title {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 2.5px;
              color: #1e3a8a;
              text-align: center;
              line-height: 1.5;
              margin-bottom: 75px;
            }

            /* Circular Stamp Seal */
            .seal-circle {
              width: 110px;
              height: 110px;
              border-radius: 50%;
              border: 2px solid #2563eb;
              padding: 3px;
              background-color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
            }
            .seal-inner {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 1px dashed #3b82f6;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 4px;
            }
            .seal-top-text {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 6px;
              font-weight: 700;
              letter-spacing: 1.2px;
              color: #1d4ed8;
              text-transform: uppercase;
            }
            .seal-brand {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 13px;
              font-weight: 900;
              color: #0056D2;
              margin: 2px 0;
            }
            .seal-bottom-text {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 5px;
              font-weight: 800;
              letter-spacing: 0.8px;
              color: #2563eb;
              text-transform: uppercase;
            }

            /* Watermark Rosette SVG */
            .rosette-watermark {
              position: absolute;
              right: 90px;
              top: 130px;
              width: 440px;
              height: 440px;
              opacity: 0.08;
              pointer-events: none;
              z-index: 1;
            }

            /* Main Content Area */
            .cert-body {
              position: relative;
              z-index: 5;
              max-width: 580px;
              margin-top: 10px;
            }
            .recipient-name {
              font-family: 'Georgia', serif;
              font-size: 38px;
              font-weight: 400;
              color: #0f172a;
              margin: 0 0 16px 0;
            }
            .completion-text {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 13px;
              color: #475569;
              margin-bottom: 12px;
            }
            .course-name {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 20px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 12px;
              line-height: 1.3;
            }
            .authorization-notice {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              color: #64748b;
              line-height: 1.6;
              max-width: 500px;
            }

            /* Footer Section */
            .cert-footer {
              position: relative;
              z-index: 5;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              width: 100%;
              margin-top: 25px;
            }
            .signature-block {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              width: 240px;
            }
            .signature-svg {
              width: 140px;
              height: 38px;
              margin-bottom: 4px;
            }
            .signature-line {
              width: 100%;
              height: 1px;
              background-color: #cbd5e1;
              margin-bottom: 6px;
            }
            .signatory-name {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #1e293b;
            }
            .signatory-title {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 10px;
              color: #64748b;
            }
            .signatory-org {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 9.5px;
              font-weight: 600;
              color: #0056D2;
            }

            .verification-block {
              text-align: right;
              max-width: 300px;
            }
            .verify-url {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 10px;
              font-weight: 600;
              color: #334155;
              margin-bottom: 4px;
            }
            .verify-disclaimer {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 8.5px;
              color: #94a3b8;
              line-height: 1.4;
            }

            @media print {
              body { background-color: white; padding: 0; }
              .cert-container { box-shadow: none; border: none; }
            }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="outer-frame">
              <div class="inner-frame-line"></div>
              <div class="corner-bracket corner-tl"></div>
              <div class="corner-bracket corner-tr"></div>
              <div class="corner-bracket corner-bl"></div>
              <div class="corner-bracket corner-br"></div>

              <!-- Top Left Brand Header -->
              <div class="top-left-brand">
                <div class="brand-header-flex">
                  <svg width="42" height="44" viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#e0a328">
                      <path d="M 120 220 C 80 190, 75 140, 95 90 C 70 120, 65 170, 105 210 Z" />
                      <path d="M 100 200 C 60 170, 60 120, 85 70 C 55 100, 55 150, 85 190 Z" />
                      <path d="M 85 175 C 45 145, 50 95, 80 50 C 45 80, 45 130, 70 165 Z" />
                      <path d="M 102 240 C 70 230, 60 210, 80 200 C 95 210, 100 230, 102 240 Z" />
                      <path d="M 82 215 C 50 200, 45 180, 65 172 C 80 182, 82 205, 82 215 Z" />
                      <path d="M 68 185 C 38 168, 35 148, 55 140 C 70 152, 70 175, 68 185 Z" />
                      <path d="M 60 150 C 30 130, 30 110, 50 102 C 65 115, 62 140, 60 150 Z" />
                      <path d="M 62 115 C 35 92, 40 70, 58 68 C 70 82, 65 105, 62 115 Z" />
                      <path d="M 72 80 C 50 55, 60 38, 75 40 C 85 55, 78 72, 72 80 Z" />
                      <path d="M 90 52 C 72 28, 88 15, 100 22 C 105 38, 95 50, 90 52 Z" />
                      <path d="M 280 220 C 320 190, 325 140, 305 90 C 330 120, 335 170, 295 210 Z" />
                      <path d="M 300 200 C 340 170, 340 120, 315 70 C 345 100, 345 150, 315 190 Z" />
                      <path d="M 315 175 C 355 145, 350 95, 320 50 C 355 80, 355 130, 330 165 Z" />
                      <path d="M 298 240 C 330 230, 340 210, 320 200 C 305 210, 300 230, 298 240 Z" />
                      <path d="M 318 215 C 350 200, 355 180, 335 172 C 320 182, 318 205, 318 215 Z" />
                      <path d="M 332 185 C 362 168, 365 148, 345 140 C 330 152, 330 175, 332 185 Z" />
                      <path d="M 340 150 C 370 130, 370 110, 350 102 C 335 115, 338 140, 340 150 Z" />
                      <path d="M 338 115 C 365 92, 360 70, 342 68 C 330 82, 335 105, 338 115 Z" />
                      <path d="M 328 80 C 350 55, 340 38, 325 40 C 315 55, 322 72, 328 80 Z" />
                      <path d="M 310 52 C 328 28, 312 15, 300 22 C 295 38, 305 50, 310 52 Z" />
                    </g>
                    <path d="M 110 55 C 160 70, 240 70, 290 55 L 298 140 C 298 210, 200 250, 200 250 C 200 250, 102 210, 102 140 Z" fill="#f2b438" stroke="#df9b27" stroke-width="3" />
                    <path d="M 116 62 C 160 75, 240 75, 284 62 L 291 138 C 291 202, 200 239, 200 239 C 200 239, 109 202, 109 138 Z" fill="#ffffff" />
                    <path d="M 120 66 C 160 78, 240 78, 280 66 L 286 136 C 286 196, 200 232, 200 232 C 200 232, 114 196, 114 136 Z" fill="#0056D2" />
                    <text x="200" y="88" fill="#ffffff" font-size="13" font-weight="800" font-family="sans-serif" text-anchor="middle" letter-spacing="2.5">ESTD, 2025</text>
                    <rect x="114" y="102" width="172" height="36" fill="#ffffff" />
                    <text x="200" y="130" fill="#0056D2" font-size="32" font-weight="900" font-family="sans-serif" text-anchor="middle" letter-spacing="5">TITAN</text>
                    <g transform="translate(200, 172)">
                      <path d="M -36 -16 Q -18 -22, 0 -12 Q 18 -22, 36 -16 L 36 12 Q 18 6, 0 16 Q -18 6, -36 12 Z" fill="#ffffff" stroke="#0056D2" stroke-width="2" />
                      <path d="M 0 -12 L 0 16" stroke="#0056D2" stroke-width="2.5" />
                      <circle cx="0" cy="2" r="10" fill="#ffffff" stroke="#0056D2" stroke-width="2" />
                      <path d="M -10 2 L 10 2" stroke="#0056D2" stroke-width="1.5" />
                      <path d="M 0 -8 L 0 12" stroke="#0056D2" stroke-width="1.5" />
                      <ellipse cx="0" cy="2" rx="5" ry="9" fill="none" stroke="#0056D2" stroke-width="1.2" />
                    </g>
                    <path d="M 70 240 L 95 220 L 105 255 L 70 240 Z" fill="#0b2347" />
                    <path d="M 330 240 L 305 220 L 295 255 L 330 240 Z" fill="#0b2347" />
                    <path d="M 68 250 L 100 230 L 100 270 L 68 282 Z" fill="#0056D2" />
                    <path d="M 332 250 L 300 230 L 300 270 L 332 282 Z" fill="#0056D2" />
                    <path d="M 90 232 C 150 250, 250 250, 310 232 L 302 278 C 242 296, 158 296, 98 278 Z" fill="#0056D2" stroke="#023e9c" stroke-width="1.5" />
                    <text x="200" y="266" fill="#ffffff" font-size="20" font-weight="900" font-family="sans-serif" text-anchor="middle" letter-spacing="2">TITAN NETWORK</text>
                    <text x="200" y="320" fill="#0056D2" font-size="14" font-weight="800" font-family="sans-serif" text-anchor="middle" letter-spacing="1">TAJ INSTITUTE OF TECHNOLOGY</text>
                    <text x="200" y="340" fill="#0056D2" font-size="14" font-weight="800" font-family="sans-serif" text-anchor="middle" letter-spacing="1">&amp; APPLIED NETWORK</text>
                  </svg>

                  <div class="brand-titles">
                    <div class="brand-logo-text">titan</div>
                    <div class="institute-full-name">Taj Institute of Technology & Applied Network</div>
                  </div>
                </div>

                <div class="issue-date">Issued on ${issueDate}</div>
              </div>

              <!-- Top Right Vertical Ribbon -->
              <div class="ribbon-banner">
                <div class="ribbon-title">
                  COURSE<br />CERTIFICATE
                </div>
                <div class="seal-circle">
                  <div class="seal-inner">
                    <span class="seal-top-text">Education For All</span>
                    <span class="seal-brand">titan</span>
                    <span class="seal-bottom-text">Taj Institute</span>
                  </div>
                </div>
              </div>

              <!-- Watermark Guilloche Rosette -->
              <svg class="rosette-watermark" viewBox="0 0 400 400">
                <g stroke="#0056D2" stroke-width="0.8" fill="none">
                  ${Array.from({ length: 24 }).map((_, i) => `
                    <ellipse cx="200" cy="200" rx="140" ry="50" transform="rotate(${i * 7.5} 200 200)" />
                  `).join('')}
                  ${Array.from({ length: 24 }).map((_, i) => `
                    <ellipse cx="200" cy="200" rx="100" ry="30" transform="rotate(${i * 7.5 + 3.75} 200 200)" />
                  `).join('')}
                  <circle cx="200" cy="200" r="160" stroke-dasharray="3,3" />
                  <circle cx="200" cy="200" r="80" />
                </g>
              </svg>

              <!-- Body Content -->
              <div class="cert-body">
                <h1 class="recipient-name">${profile.name}</h1>
                <p class="completion-text">has successfully completed</p>
                <h2 class="course-name">${selectedCourse.title}</h2>
                <p class="authorization-notice">
                  an online non-credit course authorized by TITAN Academic Faculty and offered through Taj Institute of Technology & Applied Network Learning Platform.
                </p>
              </div>

              <!-- Footer -->
              <div class="cert-footer">
                <div class="signature-block">
                  <svg class="signature-svg" viewBox="0 0 200 60">
                    <path d="M 10 35 C 30 10, 45 45, 60 20 C 70 5, 80 40, 95 25 C 110 10, 120 35, 140 20 C 150 15, 160 30, 180 25" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round" />
                    <path d="M 30 42 C 60 38, 110 40, 150 38" stroke="#1e293b" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  </svg>
                  <div class="signature-line"></div>
                  <div class="signatory-name">${selectedCourse.instructor || 'Claire Smith'}</div>
                  <div class="signatory-title">Lead Faculty Instructor & Program Manager</div>
                  <div class="signatory-org">Taj Institute of Technology & Applied Network</div>
                </div>

                <div class="verification-block">
                  <div class="verify-url">Verify at titan.edu/verify/TITAN-${selectedCourse.id.toUpperCase()}</div>
                  <div class="verify-disclaimer">
                    TITAN has confirmed the identity of this individual and their participation in the course.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-body">
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 ${
          isDark ? 'bg-slate-950 border-blue-900/40 text-white' : 'bg-white border-blue-200 text-slate-900'
        }`}
      >
        {/* Header - Refined Bluish Scheme */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 border-b border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/60 rounded-xl border border-blue-500/30">
              <TitanLogo size="sm" variant="horizontal" theme="dark" />
            </div>
            <div>
              <h2 className="text-lg font-black font-headline tracking-tight text-white">Academic Certifications</h2>
              <p className="text-xs font-mono text-blue-400">Taj Institute of Technology & Applied Network Credentials</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-blue-900/50 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Course Selector Tabs - Clean Blue Palette */}
        <div className={`p-4 border-b flex items-center gap-2 overflow-x-auto custom-scrollbar ${
          isDark ? 'bg-slate-900/90 border-blue-950' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
            Select Course:
          </span>
          {courses.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-[#0056D2] text-white border-blue-400 shadow-md shadow-blue-600/30 scale-105'
                    : isDark
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-blue-500 hover:text-blue-400'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {course.title}
              </button>
            );
          })}
        </div>

        {/* Certificate Display Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center custom-scrollbar bg-slate-950/60">
          <div
            ref={certRef}
            className="w-full max-w-3xl aspect-[1.414/1] bg-white border border-slate-300 p-3 sm:p-4 shadow-2xl relative overflow-hidden text-slate-900 my-2 rounded-sm"
          >
            {/* Outer Frame with Corner Bracket Accents */}
            <div className="w-full h-full border-2 border-slate-400 p-6 sm:p-10 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-1 border border-slate-200 pointer-events-none"></div>
              
              {/* Corner Bracket Accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#0056D2]"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#0056D2]"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#0056D2]"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#0056D2]"></div>

              {/* Top Left Brand Header */}
              <div className="flex flex-col items-start z-10">
                <div className="flex items-center gap-3 mb-1">
                  {/* TITAN Emblem Logo */}
                  <svg width="40" height="42" viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <g fill="#e0a328">
                      <path d="M 120 220 C 80 190, 75 140, 95 90 C 70 120, 65 170, 105 210 Z" />
                      <path d="M 100 200 C 60 170, 60 120, 85 70 C 55 100, 55 150, 85 190 Z" />
                      <path d="M 85 175 C 45 145, 50 95, 80 50 C 45 80, 45 130, 70 165 Z" />
                      <path d="M 102 240 C 70 230, 60 210, 80 200 C 95 210, 100 230, 102 240 Z" />
                      <path d="M 82 215 C 50 200, 45 180, 65 172 C 80 182, 82 205, 82 215 Z" />
                      <path d="M 68 185 C 38 168, 35 148, 55 140 C 70 152, 70 175, 68 185 Z" />
                      <path d="M 60 150 C 30 130, 30 110, 50 102 C 65 115, 62 140, 60 150 Z" />
                      <path d="M 62 115 C 35 92, 40 70, 58 68 C 70 82, 65 105, 62 115 Z" />
                      <path d="M 72 80 C 50 55, 60 38, 75 40 C 85 55, 78 72, 72 80 Z" />
                      <path d="M 90 52 C 72 28, 88 15, 100 22 C 105 38, 95 50, 90 52 Z" />
                      <path d="M 280 220 C 320 190, 325 140, 305 90 C 330 120, 335 170, 295 210 Z" />
                      <path d="M 300 200 C 340 170, 340 120, 315 70 C 345 100, 345 150, 315 190 Z" />
                      <path d="M 315 175 C 355 145, 350 95, 320 50 C 355 80, 355 130, 330 165 Z" />
                      <path d="M 298 240 C 330 230, 340 210, 320 200 C 305 210, 300 230, 298 240 Z" />
                      <path d="M 318 215 C 350 200, 355 180, 335 172 C 320 182, 318 205, 318 215 Z" />
                      <path d="M 332 185 C 362 168, 365 148, 345 140 C 330 152, 330 175, 332 185 Z" />
                      <path d="M 340 150 C 370 130, 370 110, 350 102 C 335 115, 338 140, 340 150 Z" />
                      <path d="M 338 115 C 365 92, 360 70, 342 68 C 330 82, 335 105, 338 115 Z" />
                      <path d="M 328 80 C 350 55, 340 38, 325 40 C 315 55, 322 72, 328 80 Z" />
                      <path d="M 310 52 C 328 28, 312 15, 300 22 C 295 38, 305 50, 310 52 Z" />
                    </g>
                    <path d="M 110 55 C 160 70, 240 70, 290 55 L 298 140 C 298 210, 200 250, 200 250 C 200 250, 102 210, 102 140 Z" fill="#f2b438" stroke="#df9b27" strokeWidth="3" />
                    <path d="M 116 62 C 160 75, 240 75, 284 62 L 291 138 C 291 202, 200 239, 200 239 C 200 239, 109 202, 109 138 Z" fill="#ffffff" />
                    <path d="M 120 66 C 160 78, 240 78, 280 66 L 286 136 C 286 196, 200 232, 200 232 C 200 232, 114 196, 114 136 Z" fill="#0056D2" />
                    <text x="200" y="88" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2.5">ESTD, 2025</text>
                    <rect x="114" y="102" width="172" height="36" fill="#ffffff" />
                    <text x="200" y="130" fill="#0056D2" fontSize="32" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="5">TITAN</text>
                    <g transform="translate(200, 172)">
                      <path d="M -36 -16 Q -18 -22, 0 -12 Q 18 -22, 36 -16 L 36 12 Q 18 6, 0 16 Q -18 6, -36 12 Z" fill="#ffffff" stroke="#0056D2" strokeWidth="2" />
                      <path d="M 0 -12 L 0 16" stroke="#0056D2" strokeWidth="2.5" />
                      <circle cx="0" cy="2" r="10" fill="#ffffff" stroke="#0056D2" strokeWidth="2" />
                      <path d="M -10 2 L 10 2" stroke="#0056D2" strokeWidth="1.5" />
                      <path d="M 0 -8 L 0 12" stroke="#0056D2" strokeWidth="1.5" />
                      <ellipse cx="0" cy="2" rx="5" ry="9" fill="none" stroke="#0056D2" strokeWidth="1.2" />
                    </g>
                    <path d="M 70 240 L 95 220 L 105 255 L 70 240 Z" fill="#0b2347" />
                    <path d="M 330 240 L 305 220 L 295 255 L 330 240 Z" fill="#0b2347" />
                    <path d="M 68 250 L 100 230 L 100 270 L 68 282 Z" fill="#0056D2" />
                    <path d="M 332 250 L 300 230 L 300 270 L 332 282 Z" fill="#0056D2" />
                    <path d="M 90 232 C 150 250, 250 250, 310 232 L 302 278 C 242 296, 158 296, 98 278 Z" fill="#0056D2" stroke="#023e9c" strokeWidth="1.5" />
                    <text x="200" y="266" fill="#ffffff" fontSize="20" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">TITAN NETWORK</text>
                    <text x="200" y="320" fill="#0056D2" fontSize="14" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TAJ INSTITUTE OF TECHNOLOGY</text>
                    <text x="200" y="340" fill="#0056D2" fontSize="14" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">&amp; APPLIED NETWORK</text>
                  </svg>

                  <div>
                    <div className="font-sans font-extrabold text-2xl sm:text-3xl text-[#0056D2] tracking-tighter leading-none">
                      titan
                    </div>
                    <div className="font-sans text-[8px] sm:text-[9.5px] font-extrabold tracking-wider text-slate-700 uppercase mt-0.5">
                      Taj Institute of Technology & Applied Network
                    </div>
                  </div>
                </div>

                <div className="font-sans text-[10px] sm:text-xs text-slate-500 font-medium">
                  Issued on {issueDate}
                </div>
              </div>

              {/* Top Right Vertical Ribbon Banner */}
              <div 
                className="absolute right-8 sm:right-12 top-0 w-28 sm:w-36 h-64 sm:h-80 bg-gradient-to-b from-blue-50 via-slate-100 to-blue-100 border-x border-b border-blue-200 shadow-sm flex flex-col items-center pt-4 sm:pt-6 z-20"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)' }}
              >
                <div className="font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-blue-900 text-center leading-tight mb-8 sm:mb-12">
                  COURSE<br />CERTIFICATE
                </div>

                {/* Circular Verification Seal Stamp */}
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-blue-600 p-0.5 bg-white shadow-inner flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-dashed border-blue-400 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[4.5px] sm:text-[5.5px] font-mono font-bold tracking-widest text-blue-700 uppercase">
                      Education For All
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold font-sans text-[#0056D2] my-0.5">
                      titan
                    </span>
                    <span className="text-[4px] sm:text-[5px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                      Taj Institute
                    </span>
                  </div>
                </div>
              </div>

              {/* Watermark Guilloche Rosette SVG in Blue Accent */}
              <svg 
                className="absolute right-12 top-16 w-80 h-80 sm:w-96 sm:h-96 opacity-10 pointer-events-none z-0" 
                viewBox="0 0 400 400"
              >
                <g stroke="#0056D2" strokeWidth="0.8" fill="none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <ellipse key={i} cx="200" cy="200" rx="140" ry="50" transform={`rotate(${i * 7.5} 200 200)`} />
                  ))}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <ellipse key={`inner-${i}`} cx="200" cy="200" rx="100" ry="30" transform={`rotate(${i * 7.5 + 3.75} 200 200)`} />
                  ))}
                  <circle cx="200" cy="200" r="160" strokeDasharray="3,3" />
                  <circle cx="200" cy="200" r="80" />
                </g>
              </svg>

              {/* Main Body Certificate Text */}
              <div className="z-10 max-w-sm sm:max-w-md my-4 sm:my-6 text-left">
                <h1 className="font-serif text-2xl sm:text-4xl text-slate-900 font-normal tracking-tight mb-2 sm:mb-4">
                  {profile.name}
                </h1>
                
                <p className="font-sans text-[11px] sm:text-xs text-slate-600 mb-1.5">
                  has successfully completed
                </p>

                <h2 className="font-sans text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {selectedCourse.title}
                </h2>

                <p className="font-sans text-[10px] sm:text-[11px] text-slate-500 leading-relaxed max-w-xs sm:max-w-sm">
                  an online non-credit course authorized by TITAN Academic Faculty and offered through Taj Institute of Technology & Applied Network Learning Platform.
                </p>
              </div>

              {/* Certificate Footer: Signature & Verification */}
              <div className="z-10 flex items-end justify-between w-full pt-2">
                <div className="flex flex-col items-start w-36 sm:w-48">
                  <svg className="w-24 sm:w-32 h-8 mb-1" viewBox="0 0 200 60">
                    <path d="M 10 35 C 30 10, 45 45, 60 20 C 70 5, 80 40, 95 25 C 110 10, 120 35, 140 20 C 150 15, 160 30, 180 25" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 30 42 C 60 38, 110 40, 150 38" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                  <div className="w-full h-px bg-slate-300 mb-1"></div>
                  <span className="font-sans text-[10px] sm:text-xs font-bold text-slate-800">
                    {selectedCourse.instructor || 'Claire Smith'}
                  </span>
                  <span className="font-sans text-[8px] sm:text-[10px] text-slate-500">
                    Lead Faculty Instructor & Program Manager
                  </span>
                  <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-[#0056D2]">
                    Taj Institute of Technology & Applied Network
                  </span>
                </div>

                <div className="text-right max-w-[180px] sm:max-w-[240px]">
                  <p className="font-sans text-[8px] sm:text-[10px] font-semibold text-slate-600 mb-0.5">
                    Verify at titan.edu/verify/TITAN-{selectedCourse.id.toUpperCase()}
                  </p>
                  <p className="font-sans text-[7px] sm:text-[8px] text-slate-400 leading-tight">
                    TITAN has confirmed the identity of this individual and their participation in the course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs ${
          isDark ? 'bg-slate-950 border-blue-900/40' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-blue-400 text-base">workspace_premium</span>
            <span>Credential Status: <strong className="text-emerald-400">Authenticated & Valid</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadCertificate}
              className="px-6 py-2 bg-[#0056D2] hover:bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Download Certificate (PDF / Print)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
