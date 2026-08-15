import React from 'react';

interface TitanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'horizontal' | 'sidebar';
  theme?: 'dark' | 'light';
  className?: string;
}

export const TitanLogo: React.FC<TitanLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  className = ''
}) => {
  const getDimension = () => {
    switch (size) {
      case 'sm':
        return { iconSize: 32, textClass: 'text-xs', titleClass: 'text-sm' };
      case 'lg':
        return { iconSize: 64, textClass: 'text-sm', titleClass: 'text-2xl' };
      case 'xl':
        return { iconSize: 96, textClass: 'text-base', titleClass: 'text-3xl' };
      case 'md':
      default:
        return { iconSize: 44, textClass: 'text-xs', titleClass: 'text-lg' };
    }
  };

  const { iconSize, titleClass } = getDimension();
  const textColor = theme === 'dark' ? 'text-white' : 'text-zinc-900';
  const subTextColor = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600';

  const logoSvg = (
    <img
      src="/Titan-transparent-proper.png"
      alt="TITAN Logo"
      style={{ width: iconSize, height: 'auto', objectFit: 'contain' }}
      className="shrink-0 drop-shadow-md transition-transform duration-300 hover:scale-105"
    />
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{logoSvg}</div>;
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex flex-col items-center justify-center text-center gap-1 ${className}`}>
        {logoSvg}
        <span className="font-headline font-black tracking-[0.22em] text-base uppercase text-[#e0a328]">
          TITAN
        </span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        {logoSvg}
        <div className="space-y-1">
          <h1 className={`font-headline font-black tracking-widest text-xl sm:text-2xl uppercase ${textColor}`}>
            TITAN
          </h1>
          <p className="font-serif uppercase font-bold text-xs sm:text-sm tracking-wider text-[#e0a328]">
            TAJ INSTITUTE OF TECHNOLOGY & APPLIED NETWORK
          </p>
          <p className={`text-[10px] font-mono ${subTextColor}`}>
            Established 2025 • Excellence in Technology & AI
          </p>
        </div>
      </div>
    );
  }

  // Horizontal variant (default for Navbar / Top bar header - aligned with logo)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoSvg}
      <div className="flex flex-col justify-center">
        <span className="font-serif uppercase font-bold text-xs sm:text-sm tracking-wider text-[#e0a328] leading-tight">
          Taj Institute of Technology & Applied Network
        </span>
      </div>
    </div>
  );
};

