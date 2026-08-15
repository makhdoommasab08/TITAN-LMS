import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { TitanLogo } from './TitanLogo';

interface StudentIDCardModalProps {
  studentName: string;
  studentId: string;
  studentEmail: string;
  studentAvatar: string;
  theme: 'light' | 'dark';
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({ 
  studentName, 
  studentId, 
  studentEmail, 
  studentAvatar,
  theme, 
  onClose 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        useCORS: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      link.download = `titan-id-${studentId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating ID card image:', err);
    }
  };

  const nameParts = studentName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // A dark navy/black color for the ID card theme
  const brandDark = '#0f172a'; // slate-900
  const brandYellow = '#f59e0b'; // amber-500
  const brandLight = '#ffffff';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Actions */}
        <div className="w-full flex justify-between mb-4 max-w-[320px]">
           <button 
             onClick={handleDownload}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm shadow-md transition-colors flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-sm">download</span>
             Download PNG
           </button>
           <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-zinc-900 hover:bg-slate-100 flex items-center justify-center shadow-md transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* ID Card Wrapper (The element to be screenshotted) */}
        <div 
          ref={cardRef}
          className="relative w-[320px] h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col items-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Top Navy Angle */}
          {/* 
            We can use clip-path for the navy shape. 
            The reference has a deep v-shape but skewed. Let's make a cool angled polygon.
          */}
          <div 
            className="absolute top-0 left-0 w-full h-[220px]"
            style={{ backgroundColor: brandDark, clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}
          ></div>
          
          {/* Yellow trim underneath the navy angle */}
          <div 
            className="absolute top-0 left-0 w-full h-[230px] -z-10"
            style={{ backgroundColor: brandYellow, clipPath: 'polygon(0 0, 100% 0, 100% 83%, 50% 100%, 0 83%)' }}
          ></div>

          {/* Logo Area */}
          <div className="relative w-full px-6 pt-5 flex flex-col items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 flex items-center justify-center bg-amber-500 rounded-sm">
                <span className="material-symbols-outlined text-white text-xs font-bold">school</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black tracking-widest uppercase">TITAN</div>
                <div className="text-[6px] tracking-[0.2em] uppercase opacity-80">Technology & Networks</div>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="relative mt-4 z-10">
            <div className="w-32 h-32 rounded-lg bg-white p-1.5 shadow-lg">
              {studentAvatar ? (
                <img 
                  src={studentAvatar} 
                  alt={studentName} 
                  className="w-full h-full object-cover rounded shadow-inner bg-slate-100"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center rounded shadow-inner">
                  <span className="material-symbols-outlined text-6xl text-slate-400">person</span>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mt-8 text-center px-4 w-full relative z-10 flex flex-col items-center flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none flex gap-1.5 flex-wrap justify-center">
              <span className="text-amber-500">{firstName}</span>
              <span className="text-slate-900">{lastName}</span>
            </h2>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1 mb-4">Student</p>
            
            <div className="flex items-center justify-center gap-2 mb-4 bg-slate-100 w-full rounded-sm overflow-hidden">
               <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                 Id No
               </div>
               <div className="text-sm font-black text-slate-800 tracking-widest px-2">
                 {studentId}
               </div>
            </div>

            <div className="text-[10px] font-semibold text-slate-600 mb-4 text-center w-full">
              <p>E-mail: <span className="font-bold text-slate-900">{studentEmail}</span></p>
            </div>
            
            {/* QR Code */}
            <div className="mt-auto mb-6 flex justify-center border-t border-slate-200 pt-4 w-full">
               <QRCodeSVG 
                 value={`{"id":"${studentId}","name":"${studentName}","type":"student"}`}
                 size={60}
                 level="M"
                 includeMargin={false}
               />
            </div>
          </div>
          
          {/* Bottom decorative corners */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-slate-900" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500 -z-10" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>

        </div>
      </div>
    </div>
  );
};
