import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  ...props 
}) => {
  // Base classes extracted from the CSS logic
  const baseClasses = "bg-[#131B2C]/70 backdrop-blur-md border border-white/10 transition-all duration-300";
  const hoverClasses = hoverEffect ? "hover:border-primary/30 hover:bg-[#131B2C]/90" : "";

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};