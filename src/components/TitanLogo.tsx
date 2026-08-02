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
    <svg
      width={iconSize}
      height={iconSize * 1.05}
      viewBox="0 0 400 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md transition-transform duration-300 hover:scale-105"
    >
      {/* Outer Golden Laurel Wreath Leaves */}
      <g fill="#e0a328">
        {/* Left Wreath Leaves */}
        <path d="M 120 220 C 80 190, 75 140, 95 90 C 70 120, 65 170, 105 210 Z" />
        <path d="M 100 200 C 60 170, 60 120, 85 70 C 55 100, 55 150, 85 190 Z" />
        <path d="M 85 175 C 45 145, 50 95, 80 50 C 45 80, 45 130, 70 165 Z" />

        {/* Left Leaf Clusters */}
        <path d="M 102 240 C 70 230, 60 210, 80 200 C 95 210, 100 230, 102 240 Z" />
        <path d="M 82 215 C 50 200, 45 180, 65 172 C 80 182, 82 205, 82 215 Z" />
        <path d="M 68 185 C 38 168, 35 148, 55 140 C 70 152, 70 175, 68 185 Z" />
        <path d="M 60 150 C 30 130, 30 110, 50 102 C 65 115, 62 140, 60 150 Z" />
        <path d="M 62 115 C 35 92, 40 70, 58 68 C 70 82, 65 105, 62 115 Z" />
        <path d="M 72 80 C 50 55, 60 38, 75 40 C 85 55, 78 72, 72 80 Z" />
        <path d="M 90 52 C 72 28, 88 15, 100 22 C 105 38, 95 50, 90 52 Z" />

        {/* Right Wreath Leaves */}
        <path d="M 280 220 C 320 190, 325 140, 305 90 C 330 120, 335 170, 295 210 Z" />
        <path d="M 300 200 C 340 170, 340 120, 315 70 C 345 100, 345 150, 315 190 Z" />
        <path d="M 315 175 C 355 145, 350 95, 320 50 C 355 80, 355 130, 330 165 Z" />

        {/* Right Leaf Clusters */}
        <path d="M 298 240 C 330 230, 340 210, 320 200 C 305 210, 300 230, 298 240 Z" />
        <path d="M 318 215 C 350 200, 355 180, 335 172 C 320 182, 318 205, 318 215 Z" />
        <path d="M 332 185 C 362 168, 365 148, 345 140 C 330 152, 330 175, 332 185 Z" />
        <path d="M 340 150 C 370 130, 370 110, 350 102 C 335 115, 338 140, 340 150 Z" />
        <path d="M 338 115 C 365 92, 360 70, 342 68 C 330 82, 335 105, 338 115 Z" />
        <path d="M 328 80 C 350 55, 340 38, 325 40 C 315 55, 322 72, 328 80 Z" />
        <path d="M 310 52 C 328 28, 312 15, 300 22 C 295 38, 305 50, 310 52 Z" />
      </g>

      {/* Outer Shield Gold Frame */}
      <path
        d="M 110 55 C 160 70, 240 70, 290 55 L 298 140 C 298 210, 200 250, 200 250 C 200 250, 102 210, 102 140 Z"
        fill="#f2b438"
        stroke="#df9b27"
        strokeWidth="3"
      />

      {/* Inner Shield Gold Border Gap */}
      <path
        d="M 116 62 C 160 75, 240 75, 284 62 L 291 138 C 291 202, 200 239, 200 239 C 200 239, 109 202, 109 138 Z"
        fill="#ffffff"
      />

      {/* Inner Navy Blue Shield */}
      <path
        d="M 120 66 C 160 78, 240 78, 280 66 L 286 136 C 286 196, 200 232, 200 232 C 200 232, 114 196, 114 136 Z"
        fill="#0a224a"
      />

      {/* ESTD, 2025 Text */}
      <text
        x="200"
        y="88"
        fill="#ffffff"
        fontSize="13"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        ESTD, 2025
      </text>

      {/* White TITAN Block Container */}
      <rect x="114" y="102" width="172" height="36" fill="#ffffff" />

      {/* TITAN Text in Gold */}
      <text
        x="200"
        y="130"
        fill="#e0a328"
        fontSize="32"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="5"
      >
        TITAN
      </text>

      {/* Book & Globe emblem in lower shield */}
      <g transform="translate(200, 172)">
        {/* Book Pages White */}
        <path
          d="M -36 -16 Q -18 -22, 0 -12 Q 18 -22, 36 -16 L 36 12 Q 18 6, 0 16 Q -18 6, -36 12 Z"
          fill="#ffffff"
          stroke="#0a224a"
          strokeWidth="2"
        />
        {/* Page spine */}
        <path d="M 0 -12 L 0 16" stroke="#0a224a" strokeWidth="2.5" />
        {/* Globe emblem centered on spine */}
        <circle cx="0" cy="2" r="10" fill="#ffffff" stroke="#0a224a" strokeWidth="2" />
        <path d="M -10 2 L 10 2" stroke="#0a224a" strokeWidth="1.5" />
        <path d="M 0 -8 L 0 12" stroke="#0a224a" strokeWidth="1.5" />
        <ellipse cx="0" cy="2" rx="5" ry="9" fill="none" stroke="#0a224a" strokeWidth="1.2" />
      </g>

      {/* Ribbon Banner End Fold Shadows */}
      <path d="M 70 240 L 95 220 L 105 255 L 70 240 Z" fill="#003d1e" />
      <path d="M 330 240 L 305 220 L 295 255 L 330 240 Z" fill="#003d1e" />

      {/* Ribbon Banner Ends Fold */}
      <path d="M 68 250 L 100 230 L 100 270 L 68 282 Z" fill="#005028" />
      <path d="M 332 250 L 300 230 L 300 270 L 332 282 Z" fill="#005028" />

      {/* Main Emerald Green Curved Ribbon Banner */}
      <path
        d="M 90 232 C 150 250, 250 250, 310 232 L 302 278 C 242 296, 158 296, 98 278 Z"
        fill="#005a2c"
        stroke="#003d1e"
        strokeWidth="1.5"
      />

      {/* Ribbon Text: TITAN */}
      <text
        x="200"
        y="266"
        fill="#ffffff"
        fontSize="22"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="4"
      >
        TITAN
      </text>

      {/* Bottom Subtext */}
      <text
        x="200"
        y="320"
        fill={theme === 'dark' ? '#ffffff' : '#0a224a'}
        fontSize="14"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1"
      >
        TAJ INSTITUTE OF TECHNOLOGY
      </text>
      <text
        x="200"
        y="340"
        fill={theme === 'dark' ? '#ffffff' : '#0a224a'}
        fontSize="14"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1"
      >
        & APPLIED NETWORK
      </text>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{logoSvg}</div>;
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex flex-col items-center justify-center text-center gap-1 ${className}`}>
        {logoSvg}
        <span className="font-headline font-black tracking-[0.22em] text-base uppercase text-amber-500">
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
          <p className="font-serif uppercase font-bold text-xs sm:text-sm tracking-wider text-amber-500">
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
        <span className="font-serif uppercase font-bold text-xs sm:text-sm tracking-wider text-amber-500 leading-tight">
          Taj Institute of Technology & Applied Network
        </span>
      </div>
    </div>
  );
};

