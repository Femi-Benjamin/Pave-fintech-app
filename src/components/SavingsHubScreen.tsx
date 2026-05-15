import React, { useState } from 'react';
import { Plus, TrendingUp, RefreshCw, Lock } from 'lucide-react';

interface SavingsHubScreenProps {
  onNavigate: (screen: string) => void;
}

export default function SavingsHubScreen({ onNavigate }: SavingsHubScreenProps) {
  const [tab, setTab] = useState<'flexible' | 'fixed'>('flexible');

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold text-on-background tracking-tight">Savings Hub</h1>
      </div>
      
      <div className="bg-surface rounded-2xl p-1.5 flex mb-6 border border-outline-variant/20 shadow-sm">
        <button 
          onClick={() => setTab('flexible')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors ${tab === 'flexible' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Flexible
        </button>
        <button 
          onClick={() => setTab('fixed')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors ${tab === 'fixed' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Fixed
        </button>
      </div>

      <div className="bg-surface rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
        <p className="text-[13px] font-semibold text-on-surface-variant mb-1">Total {tab === 'flexible' ? 'Flexible' : 'Fixed'} Savings</p>
        <h2 className="text-[32px] font-bold text-on-background mb-2 tracking-tight">₦42,500,000.00</h2>
        <div className="flex items-center gap-1.5 text-[#22c55e] text-xs font-bold">
          <TrendingUp size={14} />
          <span>+2.4% vs last month</span>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('create_savings')}
        className="w-full bg-transparent border-2 border-dashed border-outline-variant/30 rounded-[24px] p-6 text-center text-on-surface-variant font-medium hover:border-outline-variant/60 hover:text-on-surface transition-colors flex flex-col items-center justify-center gap-3"
      >
        <div className="w-12 h-12 bg-surface-variant/30 rounded-full flex items-center justify-center border border-outline-variant/20">
          <Plus size={24} className="text-on-surface-variant" />
        </div>
        <span className="text-sm">Create New Plan</span>
      </button>

      <div>
        <div className="flex justify-between items-center mb-4 mt-8">
          <h3 className="text-lg font-semibold text-on-surface">Active Goals</h3>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-surface rounded-[24px] p-5 shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-background border border-outline-variant/20 rounded-md text-primary">
                FLEXIBLE
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#042f15] border border-[#22c55e]/20 rounded-md text-[#22c55e] text-[10px] font-bold">
                <RefreshCw size={12} />
                Auto-save Active
              </div>
            </div>
            
            <h4 className="text-[17px] font-bold text-on-background mb-4">Lagos Vacation Fund</h4>
            
            <div className="flex justify-between items-end mb-2">
              <div className="text-[22px] font-bold text-on-background">₦5,200,000.00</div>
              <div className="text-[13px] text-on-surface-variant font-medium pb-1.5">of ₦8.0M</div>
            </div>

            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-right text-[13px] text-on-surface-variant mb-5">65% complete</div>
            
            <button className="w-full py-3.5 bg-primary hover:bg-primary/90 text-on-background rounded-xl font-medium transition-colors text-[15px]">
              Quick Deposit
            </button>
          </div>

          <div className="bg-surface rounded-[24px] p-5 shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d946ef]"></div>
            <div className="pl-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-background border border-outline-variant/20 rounded-md text-[#fbcfe8]">
                  FIXED
                </span>
                <div className="px-3 py-1.5 bg-background border border-outline-variant/20 rounded-md text-on-surface-variant text-[12px] font-medium">
                  Matures in 180 Days
                </div>
              </div>
              
              <h4 className="text-[17px] font-bold text-on-background mb-4">Emergency Fund</h4>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[22px] font-bold text-on-background mb-1.5">₦15,000,000.00</div>
                  <div className="flex items-center gap-1.5 text-[13px] text-on-surface-variant font-medium">
                    <Lock size={14} />
                    Locked until Oct 2024
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border border-outline-variant/20 bg-background rounded-2xl min-w-[70px]">
                  <div className="text-primary text-[11px] font-bold mb-0.5">APY</div>
                  <div className="text-primary text-lg font-bold">4.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
