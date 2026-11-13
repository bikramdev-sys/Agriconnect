import React from 'react';
import { Link } from 'react-router-dom';

export function LogoIcon({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="navLogoBg" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B3D23" />
            <stop offset="100%" stopColor="#041F12" />
          </linearGradient>
          <linearGradient id="navLogoLeaf" x1="14" y1="40" x2="28" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
          <linearGradient id="navLogoGold" x1="38" y1="40" x2="24" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          <linearGradient id="navLogoSprout" x1="26" y1="32" x2="26" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#86EFAC" />
          </linearGradient>
        </defs>

        {/* Squircle Background Base */}
        <rect width="52" height="52" rx="16" fill="url(#navLogoBg)" />
        <rect x="0.75" y="0.75" width="50.5" height="50.5" rx="15.25" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.35" />

        {/* Left Green Farmer Leaf Arc */}
        <path d="M14 40C14 27 20 15 26 10C25 20 20 31 16.5 40H14Z" fill="url(#navLogoLeaf)" />

        {/* Right Golden Grain Sheaf Arc */}
        <path d="M38 40C38 27 32 15 26 10C27 20 32 31 35.5 40H38Z" fill="url(#navLogoGold)" />

        {/* Central Sprout Connecting Farmer & Buyer */}
        <path d="M26 11C23 18 22 24 26 31C30 24 29 18 26 11Z" fill="url(#navLogoSprout)" />

        {/* Golden Direct Connection Node */}
        <circle cx="26" cy="37" r="2.8" fill="#FDE047" />
        <path d="M26 31V37" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Logo({
  to = '/',
  showText = true,
  variant = 'light', // 'light' (dark text for light navbar) | 'dark' (white text for dark footer)
  className = ''
}) {
  const isDark = variant === 'dark';

  const content = (
    <div className={`flex items-center space-x-2.5 shrink-0 group focus:outline-none ${className}`}>
      <LogoIcon className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-200" />
      {showText && (
        <div className="leading-tight">
          <span className={`font-display font-black text-xl sm:text-2xl tracking-tight block ${
            isDark ? 'text-white' : 'text-forest-950'
          }`}>
            Agri<span className="text-fresh">Connect</span>
          </span>
          <span className={`hidden sm:block text-[9px] tracking-widest uppercase font-extrabold mt-0.5 ${
            isDark ? 'text-forest-300' : 'text-agriText-muted'
          }`}>
            Direct Farm Trade
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
