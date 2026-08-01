import React from 'react';

interface ToastAlertProps {
  message: string;
  subtitle?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({
  message,
  subtitle,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-[#342e3d] text-[#f7edff] p-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-[100] border border-[#c7c4d8]/20 animate-bounce-once">
      <div className="p-2 bg-[#006c49]/20 rounded-lg">
        <span className="material-symbols-outlined text-[#4edea3]">verified_user</span>
      </div>
      <div>
        <p className="font-bold text-sm font-headline">{message}</p>
        {subtitle && <p className="text-xs opacity-80 font-body">{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-70 p-1 transition-opacity text-white"
        title="Dismiss Alert"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};
