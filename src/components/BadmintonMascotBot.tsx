import React from 'react';

interface BadmintonMascotBotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'waving' | 'thinking' | 'wink';
  isAnimated?: boolean;
  className?: string;
}

export const BadmintonMascotBot: React.FC<BadmintonMascotBotProps> = ({
  size = 'md',
  expression = 'happy',
  isAnimated = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { width: 28, height: 28 },
    sm: { width: 38, height: 38 },
    md: { width: 52, height: 52 },
    lg: { width: 72, height: 72 },
    xl: { width: 110, height: 110 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        isAnimated ? 'transition-transform duration-300 hover:scale-110' : ''
      } ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="botBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="racketGripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="racketFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Floating Shadow */}
        {isAnimated && (
          <ellipse
            cx="50"
            cy="95"
            rx="24"
            ry="4"
            fill="#0f172a"
            opacity="0.15"
            className="animate-pulse"
          />
        )}

        {/* Shuttlecock Feather Antenna on Top */}
        <g className={isAnimated ? 'origin-bottom animate-[bounce_2.5s_infinite]' : ''}>
          {/* Feather stem */}
          <line x1="50" y1="20" x2="50" y2="7" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Feather leaves */}
          <path
            d="M50 7 C44 11 43 16 50 16 C57 16 56 11 50 7 Z"
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth="1.2"
          />
          {/* Feather tip glowing orb */}
          <circle cx="50" cy="6" r="3" fill="#10b981" filter="url(#eyeGlow)" />
        </g>

        {/* Racket (held in hand on right side) */}
        <g transform="translate(68, 42) rotate(22)">
          {/* Racket Handle */}
          <line x1="6" y1="18" x2="6" y2="34" stroke="url(#racketGripGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Racket Shaft */}
          <line x1="6" y1="6" x2="6" y2="18" stroke="#94a3b8" strokeWidth="2" />
          {/* Racket Head (Oval) */}
          <ellipse cx="6" cy="-4" rx="10" ry="12" fill="none" stroke="url(#racketFrameGrad)" strokeWidth="2.5" />
          {/* Racket Strings Mesh */}
          <line x1="2" y1="-14" x2="2" y2="6" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
          <line x1="6" y1="-16" x2="6" y2="8" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
          <line x1="10" y1="-14" x2="10" y2="6" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
          <line x1="-3" y1="-7" x2="15" y2="-7" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
          <line x1="-4" y1="-4" x2="16" y2="-4" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
          <line x1="-3" y1="-1" x2="15" y2="-1" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* Robot Body */}
        <ellipse cx="50" cy="74" rx="26" ry="19" fill="url(#botBodyGrad)" stroke="#94a3b8" strokeWidth="1.5" />
        
        {/* Chest Plate with Mini Shuttlecock Emblem */}
        <rect x="40" y="67" width="20" height="13" rx="4" fill="#0f172a" />
        {/* Glowing Shuttlecock Icon on Chest */}
        <path
          d="M50 70 L46 76 L54 76 Z"
          fill="#34d399"
          filter="url(#eyeGlow)"
        />
        <circle cx="50" cy="70" r="1.5" fill="#fef08a" />

        {/* Left Hand / Waving Hand */}
        <g className={isAnimated && expression === 'waving' ? 'origin-right animate-[wiggle_1s_infinite]' : ''}>
          <circle cx="21" cy="65" r="5.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="18" cy="63" r="2" fill="#cbd5e1" />
        </g>

        {/* Right Hand holding racket */}
        <circle cx="73" cy="67" r="5.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Feet / Legs */}
        <ellipse cx="38" cy="90" rx="6" ry="4" fill="#10b981" />
        <ellipse cx="62" cy="90" rx="6" ry="4" fill="#10b981" />

        {/* Robot Head Outer (Egg / Rounded TV) */}
        <rect
          x="19"
          y="20"
          width="62"
          height="48"
          rx="22"
          fill="url(#botBodyGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Cute Ear Muff / Earphones on Head */}
        <rect x="14" y="34" width="6" height="18" rx="3" fill="#10b981" />
        <circle cx="17" cy="43" r="2" fill="#34d399" />
        <rect x="80" y="34" width="6" height="18" rx="3" fill="#10b981" />
        <circle cx="83" cy="43" r="2" fill="#34d399" />

        {/* Sporty Badminton Headband */}
        <rect x="19" y="27" width="62" height="9" fill="url(#headbandGrad)" />
        <line x1="19" y1="31.5" x2="81" y2="31.5" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />

        {/* Digital Glass Visor Screen */}
        <rect
          x="26"
          y="37"
          width="48"
          height="25"
          rx="11"
          fill="url(#visorGrad)"
        />

        {/* Visor Glare / Reflection */}
        <path
          d="M29 42 Q 40 39 51 40"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Expressive Glowing Eyes */}
        {expression === 'wink' ? (
          <>
            {/* Left Eye: Happy Arc ( ^ ) */}
            <path
              d="M34 50 Q 39 44 44 50"
              stroke="#34d399"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
            {/* Right Eye: Wink Line ( - ) */}
            <path
              d="M56 50 L64 50"
              stroke="#34d399"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
          </>
        ) : (
          <>
            {/* Left Eye: Big cute anime smiling curve ( ^ ) */}
            <path
              d="M34 51 Q 39 44 44 51"
              stroke="#34d399"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
            {/* Right Eye: Big cute anime smiling curve ( ^ ) */}
            <path
              d="M56 51 Q 61 44 66 51"
              stroke="#34d399"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
          </>
        )}

        {/* Cute Pink Blushes */}
        <ellipse cx="32" cy="56" rx="3.5" ry="1.8" fill="#fb7185" opacity="0.65" />
        <ellipse cx="68" cy="56" rx="3.5" ry="1.8" fill="#fb7185" opacity="0.65" />

        {/* Cute Digital Smile Mouth */}
        <path
          d="M48 55 Q 50 58 52 55"
          stroke="#34d399"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          filter="url(#eyeGlow)"
        />
      </svg>
    </div>
  );
};
