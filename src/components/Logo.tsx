import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  className?: string;
  onClick?: () => void;
}

export default function Logo({ size = 'md', layout = 'horizontal', className = '', onClick }: LogoProps) {
  const isVertical = layout === 'vertical';
  
  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  const iconContainerSizes = {
    sm: 'w-8 h-8 rounded-[10px]',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-[20px]',
    xl: 'w-20 h-20 rounded-[28px]'
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 32,
    xl: 44
  };

  const content = (
    <div className={`flex ${isVertical ? 'flex-col items-center gap-4' : 'flex-row items-center gap-2.5'} font-display font-extrabold tracking-wide text-on-background ${className}`}>
      {/* Official PAVE Logo Mark */}
      <div className={`flex items-center justify-center ${iconContainerSizes[size]} relative shrink-0 overflow-hidden`} >
        <img 
          src="/pave-logo.png" 
          alt="PAVE" 
          className="w-full h-full object-contain select-none" 
        />
      </div>
      <span className={`${textClasses[size]} tracking-tight bg-clip-text text-transparent bg-linear-to-r from-on-background to-on-surface-variant`}>PAVE</span>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="hover:opacity-90 transition-all active:scale-[0.97] outline-none">
        {content}
      </button>
    );
  }

  return content;
}
