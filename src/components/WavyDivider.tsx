import React from 'react';

interface WavyDividerProps {
  fillColor?: string;
  bgColor?: string;
  flipped?: boolean;
  className?: string;
}

export const WavyDivider: React.FC<WavyDividerProps> = ({
  fillColor = '#EBDDC0',
  bgColor = '#F5ECD9',
  flipped = false,
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className={`w-full h-8 sm:h-12 block ${flipped ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,0 C150,32 350,44 500,24 C650,4 850,40 1000,20 C1100,6 1170,30 1200,32 L1200,48 L0,48 Z"
          fill={fillColor}
        />
        {/* Subtle decorative ruffle accent line */}
        <path
          d="M0,2 C150,34 350,46 500,26 C650,6 850,42 1000,22 C1100,8 1170,32 1200,34"
          fill="none"
          stroke="#C2512B"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.35"
        />
      </svg>
    </div>
  );
};
