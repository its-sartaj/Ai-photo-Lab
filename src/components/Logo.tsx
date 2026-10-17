import React from 'react';

interface LogoProps {
  variant?: 'icon' | 'full' | 'hero';
  className?: string;
  size?: number; // base size in pixels
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 40,
}) => {
  // SVG Icon Component matching user's AI Photo Lab mockup exactly
  const IconSvg = ({ iconSize }: { iconSize: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 280 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
    >
      <defs>
        {/* Main Camera Body Gradient (Blue to Purple) */}
        <linearGradient id="cameraGradient" x1="20" y1="50" x2="220" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0072ff" />
          <stop offset="30%" stopColor="#0099ff" />
          <stop offset="70%" stopColor="#7928ca" />
          <stop offset="100%" stopColor="#9b2cfa" />
        </linearGradient>

        {/* Lens Inner Sky Gradient */}
        <linearGradient id="lensSkyGrad" x1="75" y1="80" x2="165" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00b4d8" />
          <stop offset="50%" stopColor="#0077b6" />
          <stop offset="100%" stopColor="#6930c3" />
        </linearGradient>

        {/* Mountains Gradients */}
        <linearGradient id="mountGrad1" x1="90" y1="140" x2="140" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#90e0ef" />
          <stop offset="100%" stopColor="#0077b6" />
        </linearGradient>
        <linearGradient id="mountGrad2" x1="120" y1="130" x2="175" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#caf0f8" />
          <stop offset="100%" stopColor="#48cae4" />
        </linearGradient>

        {/* Floating Digital Pixel Blocks Gradients */}
        <linearGradient id="pixelGrad1" x1="190" y1="20" x2="220" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
        <linearGradient id="pixelGrad2" x1="225" y1="65" x2="255" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7928ca" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="pixelGrad3" x1="175" y1="80" x2="205" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Clip path for lens circular content */}
        <clipPath id="lensClip">
          <circle cx="120" cy="140" r="54" />
        </clipPath>
      </defs>

      {/* Floating Pixel Blocks representing AI & Image Processing */}
      <rect x="200" y="24" width="22" height="22" rx="5" fill="url(#pixelGrad1)" />
      <rect x="175" y="52" width="24" height="24" rx="5" fill="url(#pixelGrad3)" />
      <rect x="228" y="58" width="20" height="20" rx="4" fill="url(#pixelGrad1)" />
      <rect x="204" y="82" width="24" height="24" rx="5" fill="url(#pixelGrad2)" />
      <rect x="236" y="94" width="18" height="18" rx="4" fill="url(#pixelGrad2)" />

      {/* Camera Main Body with Top Viewfinder & Flash Bumps */}
      <path
        d="M62 48 C62 40, 68 34, 76 34 L114 34 C120 34, 126 40, 130 46 L138 58 L190 58 C206 58, 218 70, 218 86 L218 196 C218 212, 206 224, 190 224 L50 224 C34 224, 22 212, 22 196 L22 86 C22 70, 34 58, 50 58 L54 58 L62 48 Z"
        fill="url(#cameraGradient)"
      />

      {/* Camera Top Grip Indicator */}
      <rect x="36" y="70" width="16" height="5" rx="2.5" fill="white" opacity="0.3" />

      {/* Outer Lens Thick White Ring */}
      <circle cx="120" cy="140" r="66" fill="white" />

      {/* Lens Inner Viewport with Mountains and Sun */}
      <g clipPath="url(#lensClip)">
        {/* Sky Background */}
        <rect x="60" y="80" width="120" height="120" fill="url(#lensSkyGrad)" />

        {/* Circular Sun */}
        <circle cx="138" cy="116" r="11" fill="white" />

        {/* Left Mountain */}
        <path
          d="M62 205 L106 142 L146 205 Z"
          fill="url(#mountGrad1)"
        />

        {/* Right / Main Snowy Mountain */}
        <path
          d="M102 205 L135 130 L188 205 Z"
          fill="url(#mountGrad2)"
        />

        {/* Mountain Shadow / Ridge line */}
        <path
          d="M135 130 L148 160 L188 205 L150 205 Z"
          fill="#1e40af"
          opacity="0.35"
        />
      </g>
    </svg>
  );

  // Icon Only variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <IconSvg iconSize={size} />
      </div>
    );
  }

  // Large Hero Logo Mockup variant (matches user's uploaded mockup 1:1)
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Camera with Floating Pixel Blocks */}
        <div className="relative mb-2 transition-transform duration-300 hover:scale-105">
          <IconSvg iconSize={size || 160} />
        </div>

        {/* Brand Name Typography with Gradient */}
        <div className="flex items-center justify-center tracking-tight font-extrabold text-3xl sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI
          </span>
          <span className="ml-2.5 sm:ml-3 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-600 bg-clip-text text-transparent">
            Photo
          </span>
          <span className="ml-2.5 sm:ml-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lab
          </span>
        </div>

        {/* Tagline: Edit • Resize • Compress • Create */}
        <div className="mt-3 flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-slate-600 text-xs sm:text-sm md:text-base font-semibold tracking-wide">
          <span>Edit</span>
          <span className="text-purple-400 font-bold">•</span>
          <span>Resize</span>
          <span className="text-purple-400 font-bold">•</span>
          <span>Compress</span>
          <span className="text-purple-400 font-bold">•</span>
          <span>Create</span>
        </div>

        {/* Pill Badge: Free AI Photo Tools & Tutorials */}
        <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 text-purple-800 text-xs sm:text-sm font-bold shadow-xs">
          Free AI Photo Tools & Tutorials
        </div>
      </div>
    );
  }

  // Full Header/Navbar Logo variant
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <IconSvg iconSize={size} />
      <div className="leading-tight">
        <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI
          </span>
          <span className="bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
            Photo
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lab
          </span>
        </div>
        <span className="block text-[10px] text-slate-500 font-medium">
          Edit • Resize • Compress
        </span>
      </div>
    </div>
  );
};
