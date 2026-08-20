import React from 'react';

interface YuninaLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'dark' | 'light';
  iconOnly?: boolean;
}

export const YuninaLogo: React.FC<YuninaLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'dark',
  iconOnly = false,
}) => {
  // Height map for different size presets
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
    '2xl': 72,
  };

  const height = heightMap[size] || heightMap.md;
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Yunina Cloud + Y-Arrow + Circuit Pixels SVG Icon */}
      <svg
        viewBox="0 0 240 180"
        style={{ height: `${height}px`, width: 'auto' }}
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cloud & Arrow Gradients */}
          <linearGradient id="yn-cloud-gradient" x1="10" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00BAFF" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0040E0" />
          </linearGradient>

          <linearGradient id="yn-arrow-gradient" x1="40" y1="120" x2="150" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0040E0" />
            <stop offset="60%" stopColor="#0080FF" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>

          <linearGradient id="yn-line-gradient" x1="120" y1="70" x2="180" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* --- CLOUD OUTLINE & STYLIZED Y-ARROW --- */}
        {/* Main Cloud Outer Loop */}
        <path
          d="M 68 116 C 52 116 38 103 38 86 C 38 72 48 59 62 56 C 68 38 86 26 106 26 C 128 26 146 40 151 60 C 156 58 162 57 167 57 C 183 57 196 70 196 86 C 196 102 183 116 167 116 Z"
          stroke="url(#yn-cloud-gradient)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central Bold Y-Arrow (forming the Y and pointing up-right) */}
        {/* Left Y-arm */}
        <path
          d="M 62 82 L 88 108"
          stroke="url(#yn-arrow-gradient)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Main Y-stem and Arrow Shaft pointing up-right */}
        <path
          d="M 88 108 L 148 48"
          stroke="url(#yn-arrow-gradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Arrow Head */}
        <path
          d="M 122 46 L 150 46 L 150 74"
          stroke="url(#yn-arrow-gradient)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- FLOWING CIRCUIT DATA LINES --- */}
        <path d="M 142 66 C 158 66 166 52 178 52 H 188" stroke="url(#yn-line-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 136 78 C 154 78 162 70 174 70 H 186" stroke="url(#yn-line-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 130 90 C 152 90 160 88 172 88 H 184" stroke="url(#yn-line-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 124 102 C 148 102 158 110 170 110 H 182" stroke="url(#yn-line-gradient)" strokeWidth="3" strokeLinecap="round" />

        {/* --- COLORFUL PIXEL / DATA NODES (ROUNDED SQUARES) --- */}
        {/* Top Red/Pink Pixel */}
        <rect x="190" y="32" width="16" height="16" rx="5" fill="#FF2D55" />
        {/* Top Right Cyan Pixel */}
        <rect x="222" y="46" width="13" height="13" rx="4" fill="#00C7FF" />
        {/* Middle Orange Pixel */}
        <rect x="202" y="58" width="18" height="18" rx="5.5" fill="#FF9500" />
        {/* Green Pixel */}
        <rect x="194" y="94" width="17" height="17" rx="5" fill="#34C759" />
        {/* Mid-Right Blue Pixel */}
        <rect x="218" y="82" width="14" height="14" rx="4.5" fill="#007AFF" />
        {/* Bottom Purple Pixel */}
        <rect x="184" y="124" width="15" height="15" rx="4.5" fill="#AF52DE" />
      </svg>

      {/* Logotype Text: "yunina" */}
      {!iconOnly && showText && (
        <span
          className={`font-black tracking-tight italic select-none font-sans ${
            isLight ? 'text-white' : 'text-slate-900'
          }`}
          style={{
            fontSize: `${height * 0.76}px`,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          yun<span className="relative inline-block">i</span>na
        </span>
      )}
    </div>
  );
};
