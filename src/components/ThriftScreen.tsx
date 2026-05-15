import React from 'react';
import { Users, Plus, AlertTriangle, RefreshCw, Hourglass, Calendar, Info } from 'lucide-react';

interface ThriftScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ThriftScreen({ onNavigate }: ThriftScreenProps) {
  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-on-background tracking-tight mb-1.5">Thrift Management</h1>
        <p className="text-[15px] text-on-surface-variant font-medium mb-4">Track and manage your Ajo contribution plans.</p>
        
        <button 
          onClick={() => onNavigate('add_thrift')}
          className="bg-[#c7d2fe] text-[#3730a3] px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-sm transition-colors hover:bg-[#a5b4fc]"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {/* Current Cycle Card */}
      <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-on-surface-variant font-medium">
            <RefreshCw size={18} />
            <span className="text-[15px]">Current Cycle</span>
          </div>
          <div className="px-3 py-1 bg-surface-variant text-on-background text-[10px] font-bold tracking-widest rounded-md uppercase">
            Active
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[13px] text-on-surface-variant font-medium mb-1">Total Contribution</div>
          <div className="text-[32px] font-bold text-on-background flex items-baseline gap-1">
            ₦45,000<span className="text-xl">.00</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-on-surface-variant mb-1.5">Frequency</div>
            <div className="flex items-center gap-1.5 text-on-background font-medium text-[15px]">
              <Calendar size={16} className="text-primary" /> Weekly
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-on-surface-variant mb-1.5">Next Payout</div>
            <div className="flex items-center gap-1.5 text-on-background font-medium text-[15px]">
              <Calendar size={16} className="text-primary" /> Oct 24, 2023
            </div>
          </div>
        </div>
      </div>

      {/* Payout Maturity Card */}
      <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-2 text-on-surface-variant font-medium mb-4">
          <Hourglass size={18} />
          <span className="text-[15px]">Payout Maturity</span>
        </div>

        <div className="flex justify-between items-end mb-2">
          <div className="text-[32px] font-bold text-on-background leading-none">65%</div>
          <div className="text-[13px] text-on-surface-variant font-medium mb-1">Position: 4 of 10</div>
        </div>

        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-5">
          <div className="h-full bg-[#bfdbfe] rounded-full" style={{ width: '65%' }}></div>
        </div>

        <div className="flex justify-between items-center p-3.5 bg-background border border-outline-variant/20 rounded-xl">
          <div className="text-[13px] font-medium text-on-surface-variant">Est. Payout Amount</div>
          <div className="text-[17px] font-bold text-primary">₦250,000</div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-on-background">Active Groups</h3>
          <button className="text-[13px] font-semibold text-primary hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {/* Active Group 1 */}
          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-on-background text-[15px] mb-0.5">Q3 Tech Savings</h4>
                <p className="text-[13px] text-on-surface-variant font-medium">
                  ₦5,000 / Week • 10 Members
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-semibold text-on-background mb-1.5">₦20,000</div>
              <div className="bg-[#3f1619] text-[#fca5a5] border border-[#fca5a5]/20 text-[9px] font-bold px-2 py-1 rounded tracking-wider text-center">
                ACTION<br/>REQ
              </div>
            </div>
          </div>

          {/* Active Group 2 */}
          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-on-background text-[15px] mb-0.5">Family Target 2024</h4>
                <p className="text-[13px] text-on-surface-variant font-medium">
                  ₦20,000 / Month • 5 Members
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-semibold text-on-background mb-1.5">₦60,000</div>
              <div className="bg-surface-variant text-primary border border-outline-variant/20 text-[9px] font-bold px-2 py-1 rounded tracking-wider text-center">
                ON<br/>TRACK
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 bg-[#e0e7ff] text-[#3730a3] rounded-[10px] flex items-center justify-center flex-shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-bold text-on-background text-[15px] mb-1">How it works</h3>
          <p className="text-sm text-on-surface-variant mb-3 leading-relaxed">Join a group, contribute a fixed amount regularly. One member takes the total lump sum each round.</p>
          <button className="text-sm font-bold text-primary hover:underline">Learn more</button>
        </div>
      </div>

    </div>
  );
}
