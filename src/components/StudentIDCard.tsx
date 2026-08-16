import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Printer, X } from 'lucide-react';
import { UserProfile } from './UserProfileModal';

interface StudentIDCardProps {
  profile: UserProfile;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const StudentIDCard: React.FC<StudentIDCardProps> = ({ profile, onClose, theme }) => {
  const isDark = theme === 'dark';
  const qrData = encodeURIComponent(`TITAN-ID:${profile.studentId}|Name:${profile.name}|Course:${profile.department}`);

  const handlePrint = async () => {
    const element = document.getElementById('id-card-container');
    if (!element) return;
    
    // Instead of relying on the iframe's window.print() which gets blocked,
    // we open a new window with just the card content to print.
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Student ID Card - ${profile.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: white; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
              @page { size: portrait; margin: 0; }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-zinc-950/80 backdrop-blur-sm print:bg-white print:p-0">
      
      {/* Print styles to hide UI controls during print */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #id-card-container, #id-card-container * {
              visibility: visible;
            }
            #id-card-container {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm"
      >
        {/* Controls - Hidden during print */}
        <div className="flex justify-between items-center mb-4 no-print">
          <h2 className="text-white font-bold font-headline text-xl">Student ID Card</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors tooltip-trigger"
              title="Print / Save PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The ID Card */}
        <div 
          id="id-card-container"
          className="relative w-full aspect-[2.125/3.375] bg-white rounded-2xl overflow-hidden shadow-2xl isolate print:shadow-none print:rounded-none mx-auto max-w-[340px]"
          style={{ width: '340px', height: '540px' }}
        >
          {/* Header - Dark Navy Blue */}
          <div className="absolute top-0 left-0 right-0 h-[220px] bg-[#0A192F]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 100%)' }}>
            <div className="p-6 text-center">
              <h1 className="text-white font-black tracking-widest text-lg font-headline">TITAN</h1>
              <p className="text-zinc-400 text-[8px] font-mono tracking-widest mt-1" style={{ fontFamily: "'Source Serif 4', 'Source Serif 4 Variable', 'Source Serif Pro', serif" }}>Taj Institute of Technology</p>
            </div>
          </div>

          {/* Diagonal Accent Line (Orange/Yellow) */}
          <div className="absolute top-[80px] left-[-20%] right-[-20%] h-[150px] border-b-[6px] border-[#F5A623] transform -rotate-[22deg] -z-10" />

          {/* Profile Picture */}
          <div className="absolute top-[120px] left-1/2 -translate-x-1/2">
            <div className="w-[130px] h-[130px] rounded-full bg-white p-1.5 shadow-lg border-2 border-white">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover rounded-full border-[3px] border-[#F5A623]"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="absolute top-[260px] left-0 right-0 text-center px-6">
            <h2 className="text-[#0A192F] font-black text-2xl font-headline tracking-tight leading-tight uppercase">
              {profile.name}
            </h2>
            <p className="text-[#F5A623] font-bold text-xs tracking-widest mt-1">
              {profile.department}
            </p>
            
            <div className="w-16 h-0.5 bg-[#0A192F] opacity-20 mx-auto my-4" />

            <div className="space-y-1.5 text-left max-w-[200px] mx-auto">
              <div className="flex text-[10px] font-mono">
                <span className="w-16 font-bold text-[#0A192F]">ID NO</span>
                <span className="text-zinc-500">: {profile.studentId}</span>
              </div>
              <div className="flex text-[10px] font-mono">
                <span className="w-16 font-bold text-[#0A192F]">EMAIL</span>
                <span className="text-zinc-500 truncate">: {profile.email}</span>
              </div>
              <div className="flex text-[10px] font-mono">
                <span className="w-16 font-bold text-[#0A192F]">JOINED</span>
                <span className="text-zinc-500">: {new Date(profile.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex text-[10px] font-mono">
                <span className="w-16 font-bold text-[#0A192F]">ROLE</span>
                <span className="text-zinc-500">: {"STUDENT"}</span>
              </div>
            </div>
          </div>

          {/* Footer - Dark Navy Blue with Yellow Accents */}
          <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-[#0A192F] overflow-hidden">
            {/* Geometric accents */}
            <div className="absolute bottom-0 left-[10%] w-[100px] h-[40px] bg-[#F5A623] transform rotate-45 translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-[20%] w-[60px] h-[60px] bg-[#F5A623] transform rotate-45 translate-y-1/2" />
            
            <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
              <div className="text-white">
                 <p className="text-[8px] opacity-60 font-mono">Official Campus Identity</p>
                 <p className="text-[10px] font-bold font-mono tracking-widest">VALID 2025-2026</p>
              </div>
              {/* QR Code */}
              <div className="w-12 h-12 bg-white rounded p-1 shadow-md shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrData}`} 
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
