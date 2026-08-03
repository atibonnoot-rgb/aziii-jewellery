import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface AziiJewelsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AziiJewelsLogo: React.FC<AziiJewelsLogoProps> = ({ className = '', size = 'md' }) => {
  const { get } = useSiteSettings();
  // Height sizing
  const hClasses = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-11';

  return (
    <div className={`flex items-center space-x-3 select-none ${hClasses} ${className}`}>
      {/* Oval Monogram SVG Badge */}
      <svg
        viewBox="0 0 100 150"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aziiGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9E29B" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#FDE6A6" />
          </linearGradient>
        </defs>

        {/* Outer Oval Border with rounded caps */}
        <rect
          x="10"
          y="15"
          width="80"
          height="120"
          rx="40"
          ry="40"
          stroke="url(#aziiGoldGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Top Star Diamond Sparkle */}
        <path
          d="M50 8 L52 15 L50 22 L48 15 Z"
          fill="url(#aziiGoldGradient)"
        />

        {/* Bottom Star Diamond Sparkle */}
        <path
          d="M50 128 L52 135 L50 142 L48 135 Z"
          fill="url(#aziiGoldGradient)"
        />

        {/* Inner Stylized Monogram */}
        <text
          x="50"
          y="83"
          textAnchor="middle"
          fill="url(#aziiGoldGradient)"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="36"
          fontWeight="700"
          letterSpacing="-1"
        >
          {get('logo_monogram') || 'azii'}
        </text>
      </svg>

      {/* Text Slogans Stack */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span
          className="font-serif-luxury font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F9E29B] via-[#D4AF37] to-[#FDE6A6]"
          style={{
            fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.25rem' : '1.75rem',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: '0.9'
          }}
        >
          {get('logo_text_top') || 'Azii'}
        </span>
        <span
          className="font-serif-luxury font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F9E29B] via-[#D4AF37] to-[#FDE6A6] mt-0.5"
          style={{
            fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.25rem' : '1.75rem',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: '0.9'
          }}
        >
          {get('logo_text_bottom') || 'Jewels'}
        </span>
      </div>
    </div>
  );
};
