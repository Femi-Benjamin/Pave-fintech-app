import React, { useState, useRef } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

interface OTPScreenProps {
  onNavigate: (screen: string) => void;
}

export default function OTPScreen({ onNavigate }: OTPScreenProps) {
  const [otp, setOtp] = useState(['4', '8', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // Ensure single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = () => {
    onNavigate('kyc');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 flex justify-start">
        <button onClick={() => onNavigate('signup')} className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-variant rounded-full text-on-background transition-colors border border-outline-variant/10">
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-start items-center px-4 pt-16">
        <div className="w-full max-w-sm bg-surface rounded-[24px] p-8 flex flex-col items-center border border-outline-variant/10 shadow-sm relative">
          
          <div className="w-16 h-16 bg-background border border-outline-variant/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
             {/* Grip icon simulation via dots */}
             <div className="grid grid-cols-3 gap-1.5 align-middle">
               {[...Array(9)].map((_, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"></div>
               ))}
             </div>
          </div>
          
          <h1 className="text-[32px] font-medium text-on-background tracking-tight mb-2">Security Check</h1>
          <p className="text-on-surface-variant text-[15px] text-center leading-relaxed mb-8 max-w-[240px]">
            Enter the 6-digit code sent to <span className="font-semibold text-on-background">+1 (555) 019-2834</span>
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, idx) => {
              const isActive = idx === 2; // Simulating focus on 3rd box based on screenshot
              return (
                <input
                  key={idx}
                  // @ts-ignore
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-[42px] h-[52px] text-center text-[22px] font-semibold rounded-[10px] focus:outline-none transition-all caret-transparent ${
                    isActive 
                      ? 'bg-background border-2 border-primary text-on-background' 
                      : digit 
                        ? 'bg-background border border-outline-variant/50 text-on-background' 
                        : 'bg-background border border-outline-variant/30 text-on-background'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3 mb-8 w-full">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
              <Clock size={16} />
              <span>Resend Code in <span className="font-semibold text-on-background">00:45</span></span>
            </div>
            <button className="text-[11px] font-bold text-primary tracking-widest uppercase hover:text-primary transition-colors py-2">
              RESEND NOW
            </button>
          </div>

          <button 
            onClick={verifyOTP}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-semibold tracking-wide shadow-md transition-all active:scale-95 text-[15px]"
          >
            VERIFY
          </button>
          
        </div>
      </div>
    </div>
  );
}
