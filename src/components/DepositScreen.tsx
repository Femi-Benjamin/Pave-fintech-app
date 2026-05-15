import React, { useState } from 'react';
import { Building2, Copy, Info } from 'lucide-react';

interface DepositScreenProps {
  onNavigate: (screen: string) => void;
}

export default function DepositScreen({ onNavigate }: DepositScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 scrollbar-hide">
        <div className="max-w-xl mx-auto">
          
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-on-background tracking-tight mb-2">Deposit Funds</h1>
            <p className="text-[15px] text-on-surface-variant leading-relaxed">
              Transfer money to your dedicated virtual account via any local bank to instantly fund your PAVE wallet.
            </p>
          </div>

          <div className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant/10 mb-6">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center text-primary">
                  <Building2 size={16} />
                </div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase">VIRTUAL ACCOUNT</span>
              </div>
              <div className="px-2.5 py-1 bg-surface-variant rounded-full text-xs text-on-surface-variant font-medium">
                Instant Credit
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1.5">ACCOUNT NUMBER</div>
              <div className="bg-background rounded-xl p-4 flex justify-between items-center border border-outline-variant/10">
                <div className="font-mono text-[32px] tracking-[0.1em] text-on-background font-bold leading-none">
                  9482<br/>031 445
                </div>
                <button 
                  onClick={handleCopy} 
                  className="flex items-center gap-1.5 text-[13px] font-bold text-primary hover:text-on-background transition-colors h-fit px-3 py-1.5 rounded-lg border border-outline-variant/20"
                >
                  <Copy size={14} />
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2">
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">BANK NAME</div>
                <div className="text-[17px] font-medium text-on-background">Providus Bank</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">ACCOUNT NAME</div>
                <div className="text-[17px] font-medium text-on-background line-clamp-1">PAVE / John D...</div>
              </div>
            </div>

          </div>

          <div className="flex items-center mb-4">
            <div className="h-[1px] flex-1 bg-outline-variant/10"></div>
            <span className="px-3 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">SUPPORTED RECEIVING BANKS</span>
            <div className="h-[1px] flex-1 bg-outline-variant/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Simulated Providus Logo */}
                <div className="w-6 h-6 border-2 border-[#f59e0b] rounded-sm flex items-center justify-center">
                  <div className="w-0.5 h-3 bg-[#f59e0b]"></div>
                </div>
              </div>
              <div>
                <div className="text-[15px] font-medium text-on-background leading-tight mb-0.5">Providus<br/>Bank</div>
                <div className="text-[11px] text-on-surface-variant">Primary Partner</div>
              </div>
            </div>
            
            <div className="bg-surface border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Simulated Wema Logo */}
                <div className="w-6 h-6 bg-[#8b5cf6] rounded-sm relative overflow-hidden transform -skew-x-12">
                   <div className="absolute inset-0 bg-primary opacity-50 transform translate-y-1/2"></div>
                </div>
              </div>
              <div>
                <div className="text-[15px] font-medium text-on-background leading-tight mb-0.5">Wema<br/>Bank</div>
                <div className="text-[11px] text-on-surface-variant">Alternative Option</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant/10 rounded-[16px] p-4 flex items-start gap-3">
            <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Transfers made to this virtual account from any local bank app or USSD code will be credited to your PAVE wallet almost instantly. No hidden charges applied.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
