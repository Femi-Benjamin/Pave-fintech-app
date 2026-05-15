import React, { useState } from 'react';
import { ArrowLeft, Clock, AlertCircle, Phone, Contact, ChevronRight, Check } from 'lucide-react';

interface AirtimeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AirtimeScreen({ onNavigate }: AirtimeScreenProps) {
  const [phone, setPhone] = useState('0803 123 4567');
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);
  
  const networks = [
    { id: '1', name: 'MTN', bg: 'bg-[#ffcc00]', textPrimary: 'MTN', textColor: 'text-[#004f71]' },
    { id: '2', name: 'Airtel', bg: 'bg-[#ff0000]', textPrimary: 'airtel', textColor: 'text-on-background' },
    { id: '3', name: 'Glo', bg: 'bg-[#00985f]', textPrimary: 'glo', textColor: 'text-on-background' },
    { id: '4', name: '9mobile', bg: 'bg-[#006600]', textPrimary: '9', textColor: 'text-on-background' }
  ];

  const amounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-variant/80 rounded-full text-on-surface-variant transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold text-on-background">Buy Airtime</h1>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-2">
          <Clock size={22} />
        </button>
      </header>

      <div className="bg-surface rounded-2xl p-1.5 flex mb-6">
        <button className="flex-1 py-2.5 bg-surface-variant text-on-surface rounded-xl text-xs font-bold tracking-wide transition-colors">
          Airtime
        </button>
        <button className="flex-1 py-2.5 text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-bold tracking-wide transition-colors">
          Data Bundle
        </button>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-4">Select Network</label>
          <div className="flex gap-4">
            {networks.map(net => (
              <button key={net.id} className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 ${net.id === '1' ? 'border-primary' : 'border-transparent'} relative overflow-hidden`}>
                 <div className={`w-full h-full ${net.bg} flex items-center justify-center ${net.textColor}`}>
                   <span className={net.id === '4' ? 'font-black text-2xl' : 'text-[11px] font-black'}>{net.textPrimary}</span>
                 </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
             <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
             <button className="text-xs font-medium text-primary hover:underline">Use My Number</button>
          </div>
          
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone size={18} className="text-on-surface-variant" />
            </div>
            <input 
              type="tel" 
              maxLength={13}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-background border border-primary/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base text-on-surface tracking-wide"
            />
            <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors">
              <Contact size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-on-surface pb-6 border-b border-outline-variant/30">
            <Contact size={14} className="text-on-surface-variant" />
            John Doe
          </div>

          <div className="flex justify-between items-center pt-5">
            <div>
              <p className="text-sm font-medium text-on-surface">Save Beneficiary</p>
              <p className="text-xs text-on-surface-variant">Add to quick access</p>
            </div>
            <button 
              onClick={() => setSaveBeneficiary(!saveBeneficiary)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${saveBeneficiary ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${saveBeneficiary ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Amount</label>
          <div className="bg-background border border-outline-variant/30 rounded-xl p-4 flex items-center mb-4">
             <span className="text-xl font-bold text-on-surface mr-2">₦</span>
             <input 
               type="text" 
               defaultValue="1000"
               className="w-full bg-transparent focus:outline-none text-2xl font-bold text-on-surface"
             />
          </div>

          <div className="flex flex-wrap gap-2">
            {amounts.map(amt => (
              <button 
                 key={amt} 
                 className={`py-2 px-4 rounded-full border ${amt === 1000 ? 'border-primary text-primary' : 'border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-outline-variant'} text-sm font-semibold transition-colors`}
              >
                ₦{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-outline-variant/20 shadow-sm flex justify-between items-center hover:bg-surface-variant/30 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-background border border-outline-variant/30 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Main Wallet</h4>
            <p className="text-xs text-on-surface-variant">Balance: ₦45,250.00</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-on-surface-variant" />
      </div>

      <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 text-[15px]">
        Buy Airtime — ₦1,000
      </button>

      {/* Recent Recipients */}
      <div className="pt-4">
        <h3 className="text-sm font-medium text-on-surface mb-4">Recent Recipients</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
             <button className="w-14 h-14 rounded-full border border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-variant transition-colors">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
             </button>
             <span className="text-xs font-medium text-on-surface">New</span>
          </div>
          {[
            { initials: 'JD', name: 'Mom', color: 'bg-surface-variant text-on-surface' },
            { initials: 'SA', name: 'Sarah', color: 'bg-[#d97706] text-on-background' },
            { initials: 'MK', name: 'Mike', color: 'bg-surface-variant text-on-surface' },
            { initials: 'EL', name: 'Emma', color: 'bg-surface-variant text-on-surface' },
          ].map((rec, i) => (
             <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
               <button className={`w-14 h-14 rounded-full ${rec.color} flex items-center justify-center font-bold text-lg`}>
                 {rec.initials}
               </button>
               <span className="text-xs font-medium text-on-surface">{rec.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <div className="pt-2 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-on-surface">Recent History</h3>
          <button className="text-xs font-medium text-primary hover:underline">View All</button>
        </div>
        
        <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-outline-variant/20">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#3f1d24] flex items-center justify-center text-[#fca5a5]">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </div>
               <div>
                 <h4 className="text-sm font-bold text-on-surface">0803 123 4567</h4>
                 <p className="text-xs text-on-surface-variant">Failed • Today, 2:30 PM</p>
               </div>
            </div>
            <span className="text-sm font-bold text-on-surface">-₦1,000.00</span>
          </div>

          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                 <Check size={18} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-on-surface">Mom</h4>
                 <p className="text-xs text-on-surface-variant">Success • Yesterday</p>
               </div>
            </div>
            <span className="text-sm font-bold text-on-surface">-₦500.00</span>
          </div>
        </div>
      </div>

    </div>
  );
}
