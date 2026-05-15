import React from 'react';
import { Landmark } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export default function Logo({ size = 'md', layout = 'horizontal', className = '' }: LogoProps) {
  const isVertical = layout === 'vertical';
  
  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  const iconContainerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl' // larger for splash
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32,
    xl: 40
  };

  return (
    <div className={`flex ${isVertical ? 'flex-col items-center gap-4' : 'flex-row items-center gap-3'} font-display font-semibold tracking-wide text-on-background ${className}`}>
      <div className={`bg-primary flex items-center justify-center ${iconContainerSizes[size]} shadow-[0_0_20px_rgba(59,130,246,0.3)]`}>
        <Landmark size={iconSizes[size]} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${textClasses[size]}`}>PAVE</span>
    </div>
  );
}
