import React, { useState } from 'react';
import { ArrowLeft, User, Flag, Calculator, Lock, SlidersHorizontal, Calendar, ArrowRight } from 'lucide-react';

interface CreateSavingsPlanScreenProps {
  onNavigate: (screen: string) => void;
}

export default function CreateSavingsPlanScreen({ onNavigate }: CreateSavingsPlanScreenProps) {
  const [type, setType] = useState<'flexible' | 'fixed'>('flexible');

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background">
        <button onClick={() => onNavigate('savings_hub')} className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">Create Savings Plan</h1>
        <button className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-on-background transition-colors">
          <User size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24 px-4 overflow-x-hidden scrollbar-hide">
        {/* Stepper */}
        <div className="flex items-center justify-between max-w-[300px] mx-auto py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-background font-bold text-sm z-10 relative">
              1
            </div>
            <span className="text-xs font-semibold text-primary">Type</span>
          </div>
          <div className="h-[2px] bg-outline-variant flex-1 -mt-6 mx-2"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-on-surface-variant font-bold text-sm z-10 relative">
              2
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">Details</span>
          </div>
          <div className="h-[2px] bg-outline-variant flex-1 -mt-6 mx-2"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-on-surface-variant font-bold text-sm z-10 relative">
              3
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">Review</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-surface rounded-[24px] p-6 border border-outline-variant/10 shadow-sm max-w-xl mx-auto">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Plan Type</label>
              <div className="flex p-1.5 bg-background border border-outline-variant/20 rounded-xl">
                <button 
                  onClick={() => setType('flexible')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${type === 'flexible' ? 'bg-surface text-on-background border border-outline-variant/20 shadow-sm' : 'text-on-surface-variant'}`}
                >
                  <SlidersHorizontal size={16} /> Flexible
                </button>
                <button 
                  onClick={() => setType('fixed')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${type === 'fixed' ? 'bg-surface text-on-background border border-outline-variant/20 shadow-sm' : 'text-on-surface-variant'}`}
                >
                  <Lock size={16} /> Fixed
                </button>
              </div>
              <p className="text-[13px] text-on-surface-variant mt-3 leading-relaxed">
                Flexible plans allow withdrawals at any time. Fixed plans lock funds until maturity for higher yields.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Goal Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <Flag size={20} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-11 pr-4 py-3.5 bg-background border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. New Car Fund"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Target Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant text-lg font-medium">
                  $
                </div>
                <input 
                  type="number" 
                  className="w-full pl-10 pr-4 py-3.5 bg-background border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Maturity Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <Calendar size={20} />
                </div>
                <input 
                  type="text" 
                  className="w-full px-11 py-3.5 bg-background border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="mm/dd/yyyy"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-on-surface-variant">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Auto-Debit Frequency</label>
              <div className="relative bg-background border border-outline-variant/30 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                </div>
                <select className="w-full pl-11 pr-10 py-3.5 bg-transparent text-on-background focus:outline-none appearance-none font-medium">
                  <option className="bg-surface">Monthly</option>
                  <option className="bg-surface">Weekly</option>
                  <option className="bg-surface">Daily</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-on-surface-variant">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-background border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Estimated Monthly Contribution</div>
                  <div className="text-xl font-bold text-on-background">—</div>
                </div>
                <Calculator size={24} className="text-on-surface-variant" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-outline-variant/10 flex items-center justify-between z-20 md:max-w-xl md:left-1/2 md:-translate-x-1/2 md:w-full">
        <button 
          onClick={() => onNavigate('savings_hub')}
          className="px-6 py-3.5 text-on-background font-medium hover:text-[#fca5a5] transition-colors"
        >
          Cancel
        </button>
        <button className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-on-background rounded-xl font-semibold transition-colors flex items-center gap-2">
          Continue to Review <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
