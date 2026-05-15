import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Users, ArrowRight, AlertTriangle } from 'lucide-react';

interface AddThriftScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AddThriftScreen({ onNavigate }: AddThriftScreenProps) {
  const [autoDeduct, setAutoDeduct] = useState(true);

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background">
        <button onClick={() => onNavigate('thrift')} className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">Create Thrift</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-background transition-colors">
          <HelpCircle size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24 px-4 overflow-x-hidden scrollbar-hide pt-4">
        <div className="max-w-xl mx-auto space-y-6">
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Plan Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3.5 bg-background border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Lagos Traders Ajo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Contribution Amount (NGN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant text-lg font-medium">
                ₦
              </div>
              <input 
                type="number" 
                className="w-full pl-9 pr-4 py-3.5 bg-background border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="50,000"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2 bg-surface border border-outline-variant/10 p-4 rounded-2xl">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Frequency</label>
              <div className="relative border-b border-outline-variant/30 pb-1">
                <select className="w-full bg-transparent text-on-background focus:outline-none appearance-none font-medium text-[15px] p-0 border-none">
                  <option className="bg-surface">Weekly</option>
                  <option className="bg-surface">Monthly</option>
                  <option className="bg-surface">Daily</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-on-surface-variant">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 bg-surface border border-outline-variant/10 p-4 rounded-2xl">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-tight block">Cycles<br/>(Members)</label>
              <div className="flex items-end gap-2 border-b border-outline-variant/30 pb-1">
                <input 
                  type="number" 
                  className="w-full bg-transparent text-on-background focus:outline-none font-medium text-[15px] p-0 border-none"
                  defaultValue="12"
                />
                <Users size={16} className="text-on-surface-variant mb-1" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex flex-row items-center justify-between">
            <div>
              <div className="text-[15px] font-medium text-on-background mb-0.5">Auto-deduct</div>
              <div className="text-xs text-on-surface-variant font-medium">Automatically debit wallet on due date</div>
            </div>
            
            <button 
              type="button"
              onClick={() => setAutoDeduct(!autoDeduct)} 
              className={`w-[44px] h-[24px] rounded-full transition-colors relative flex-shrink-0 ${autoDeduct ? 'bg-[#c7d2fe]' : 'bg-[#374151]'}`}
            >
              <div className={`w-[20px] h-[20px] rounded-full bg-[#1e3a8a] absolute top-[2px] transition-all shadow-sm ${autoDeduct ? 'left-[22px]' : 'left-[2px] bg-on-surface-variant'}`}></div>
            </button>
          </div>

          <div className="bg-[#2a1618] border border-[#ef4444]/30 rounded-[16px] p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#fca5a5] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#fca5a5] leading-relaxed">
              A 5% penalty fee applies for missed or late contributions. Please ensure your wallet is funded.
            </p>
          </div>

          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 mb-8">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Plan Summary</div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Total Pool (NGN)</span>
                <span className="text-[15px] font-bold text-on-background">₦600,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Duration</span>
                <span className="text-[15px] font-medium text-on-background">12 Weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">First Deduction</span>
                <span className="text-[15px] font-medium text-on-background">Oct 24, 2023</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-outline-variant/10 flex items-center justify-between z-20 md:max-w-xl md:left-1/2 md:-translate-x-1/2 md:w-full">
        <button 
          onClick={() => onNavigate('thrift')}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-on-background rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-[15px]"
        >
          Start Thrift <ArrowRight size={18} />
        </button>
      </div>
      
    </div>
  );
}
