
import React from 'react';

export const COLORS = {
  MERINO: '#F5F5F0',
  PALE_OLIVE: '#A2C579',
  DRAB_GREEN: '#4E6E41',
  LUNAR_GREEN: '#2D4636',
};

export const LOGO = (className?: string) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Light Green Background Circle/Square is usually handled by the container, but we'll draw the icon in Lunar Green */}
    <rect x="0" y="0" width="100" height="100" rx="20" fill="#A2C579" />
    <path 
      d="M16 50H56V65H16V50Z" 
      fill="#2D4636" 
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M34 50V34C34 24.0589 42.0589 16 52 16H84V30H52C49.7909 30 48 31.7909 48 34V84H34V50Z" 
      fill="#2D4636" 
    />
    <circle cx="78" cy="70" r="8" fill="#2D4636" />
  </svg>
);
