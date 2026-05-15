import React from 'react';
import { ArrowLeft, Phone } from 'lucide-react';

interface AirtimeHistoryScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AirtimeHistoryScreen({ onNavigate }: AirtimeHistoryScreenProps) {
  const history = [
    { number: '08012345678', network: 'MTN', amount: '₦2,000', date: 'Today, 14:30 PM', status: 'Successful' },
    { number: '07098765432', network: 'Airtel', amount: '₦500', date: '12 May, 09:15 AM', status: 'Successful' },
    { number: '08012345678', network: 'MTN', amount: '₦5,000', date: '01 May, 18:45 PM', status: 'Successful' }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
       <header className="flex items-center gap-4 mb-8">
        <button onClick={() => onNavigate('airtime')} className="p-2 -ml-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-on-background">Airtime History</h1>
      </header>

      <div className="bg-surface rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
        {history.map((tx, idx) => (
           <div key={idx} className="flex items-center justify-between p-4 border-b border-outline-variant/30 last:border-0">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                 <Phone size={18} />
               </div>
               <div>
                 <h4 className="font-bold text-sm text-on-surface">{tx.number}</h4>
                 <p className="text-xs text-on-surface-variant">{tx.network} • {tx.date}</p>
               </div>
             </div>
             <div className="text-right">
               <div className="font-bold text-on-surface mb-1">{tx.amount}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block">
                 {tx.status}
               </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
