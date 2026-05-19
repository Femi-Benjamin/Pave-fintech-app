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
      {/* Premium Abstract Logo Mark */}
      <div className={`bg-linear-to-tr from-primary to-[#8b5cf6] flex items-center justify-center ${iconContainerSizes[size]} shadow-lg shadow-primary/20 relative overflow-hidden`} >
        <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-full translate-y-[-50%] translate-x-[-50%] w-[150%] h-[150%] opacity-50 mix-blend-overlay"></div>
        <svg 
          width={svgSizes[size]} 
          height={svgSizes[size]} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fillOpacity="0.2"/>
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
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
