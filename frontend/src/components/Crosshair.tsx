import React from 'react';

export const Crosshair: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="w-4 h-4 relative">
        {/* Center dot */}
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-foreground rounded-full"></div>
        {/* Horizontal lines */}
        <div className="absolute top-1/2 left-0 w-2 h-0.5 bg-foreground -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-2 h-0.5 bg-foreground -translate-y-1/2"></div>
        {/* Vertical lines */}
        <div className="absolute left-1/2 top-0 h-2 w-0.5 bg-foreground -translate-x-1/2"></div>
        <div className="absolute left-1/2 bottom-0 h-2 w-0.5 bg-foreground -translate-x-1/2"></div>
      </div>
    </div>
  );
};
