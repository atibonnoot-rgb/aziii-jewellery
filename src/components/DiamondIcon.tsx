import React from 'react';

interface DiamondIconProps {
  className?: string;
  size?: number;
}

export const DiamondIcon: React.FC<DiamondIconProps> = ({ className = "w-4 h-4 text-white", size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12 2L2 9L12 22L22 9L12 2Z" />
    </svg>
  );
};
