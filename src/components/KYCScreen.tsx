import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Landmark, CreditCard as IdCard, Smile } from 'lucide-react';

interface KYCScreenProps {
  onNavigate: (screen: string) => void;
}

export default function KYCScreen({ onNavigate }: KYCScreenProps) {
  const [bvn, setBvn] = useState('22233344455');
  const [nin, setNin] = useState('');

  const submitKYC = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center pt-8">
      <header className="mb-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-[#bfdbfe] tracking-wide mb-8">PAVE</h1>
        
        <div className="w-full flex items-end justify-between font-medium text-sm mb-2 text-on-surface">
          <span>Step 2 of 3</span>
          <span className="text-[#bfdbfe]">Identity Verification</span>
        </div>
        <div className="flex gap-1.5 w-full h-1">
          <div className="flex-1 bg-white rounded-full"></div>
          <div className="flex-1 bg-white rounded-full"></div>
          <div className="flex-[0.4] bg-surface-variant rounded-full"></div>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col flex-1"
      >
        <div className="mb-6">
          <h1 className="text-4xl font-display font-bold text-on-background mb-3 tracking-tight">Secure Your Account</h1>
          <p className="text-on-surface-variant font-normal text-lg">Provide your official identification details to unlock full access to PAVE.</p>
        </div>

        <div className="bg-surface rounded-2xl p-5 mb-6 shadow-sm border border-outline-variant/30 flex items-start gap-4">
          <div className="w-12 h-12 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-on-surface">Status</span>
              <span className="bg-outline-variant/50 text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">Pending</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">Complete the fields below to verify your identity.</p>
          </div>
        </div>

        <form onSubmit={submitKYC} className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface tracking-widest uppercase">Bank Verification Number (BVN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Landmark size={18} className="text-on-surface-variant" />
              </div>
              <input 
                type="text" 
                required
                maxLength={11}
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-11 pr-4 py-3.5 bg-surface-variant/50 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background"
                placeholder="00000000000"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-white mt-1.5">
              <CheckCircle2 size={14} className="text-white" />
              Verified
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface tracking-widest uppercase">National Identity Number (NIN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IdCard size={18} className="text-on-surface-variant" />
              </div>
              <input 
                type="text" 
                maxLength={11}
                value={nin}
                onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                placeholder="e.g. 11122233344"
              />
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0f141e] border border-outline-variant/30 text-[#bfdbfe] rounded-full flex items-center justify-center shrink-0">
                <Smile size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface">Liveness Check</h3>
                <p className="text-sm text-on-surface-variant">Tap to start a quick facial scan.</p>
              </div>
            </div>
            <button type="button" className="bg-surface-variant text-on-surface hover:bg-surface-variant/80 px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
              Start Scan
            </button>
          </div>

          <div className="flex-1"></div>

          <div className="bg-[#0b1120] border border-outline-variant/30 rounded-xl p-3 flex items-start gap-3 mt-6">
            <Lock size={16} className="text-on-surface-variant shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Your data is encrypted and securely stored. We never share your personal information with third parties.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            Continue Verification <ArrowRight size={18} />
          </button>
          
          <button 
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors mt-4 pb-4"
          >
            Skip for now
          </button>
        </form>
      </motion.div>
    </div>
  );
}
