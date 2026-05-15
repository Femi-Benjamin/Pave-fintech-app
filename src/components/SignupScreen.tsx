import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
}

export default function SignupScreen({ onNavigate }: SignupScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('otp');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center pt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className="text-5xl font-display font-bold text-on-background tracking-wide">PAVE</h1>
          <p className="text-on-surface-variant font-normal text-lg mt-4">Secure your financial future today.</p>
        </div>

        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col">
          <h2 className="text-2xl font-bold text-on-background mb-6">Create Account</h2>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type="tel" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background tracking-widest placeholder:tracking-normal placeholder:text-on-surface-variant/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-6 mb-2">
              <div className="flex items-center h-5 mt-1 relative">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="peer w-5 h-5 bg-[#0b1120] border border-outline-variant/30 rounded focus:ring-2 focus:ring-primary/50 text-primary transition-colors cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                />
                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="text-on-surface-variant leading-relaxed">
                  I agree to the <a href="#" className="text-on-primary-container hover:underline">Terms of Service</a> and <a href="#" className="text-on-primary-container hover:underline">Privacy Policy</a>.
                </label>
                <p className="text-xs text-on-surface-variant/70 mt-1">
                  Data processing is governed by NDPR compliance standards.
                </p>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 mt-2 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-on-surface-variant">Already have an account? </span>
          <button onClick={() => onNavigate('login')} className="font-semibold text-[#bfdbfe] hover:underline">
            Log in here
          </button>
        </div>
      </motion.div>
    </div>
  );
}
