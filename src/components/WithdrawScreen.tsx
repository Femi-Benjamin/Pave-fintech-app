import React, { useState } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';

interface WithdrawScreenProps {
  onNavigate: (screen: string) => void;
}

export default function WithdrawScreen({ onNavigate }: WithdrawScreenProps) {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => onNavigate('dashboard')} className="p-2 -ml-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-on-background">Withdraw Funds</h1>
      </header>

      <div className="bg-primary text-on-primary rounded-3xl p-6 shadow-sm mb-6 flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
         <div>
           <p className="text-on-primary/80 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
           <h2 className="text-3xl font-display font-bold">₦ 1,845,000.00</h2>
         </div>
      </div>

      <form className="space-y-6 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-on-surface">Select Bank</label>
          <select 
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full px-4 py-4 bg-background border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
          >
            <option value="" disabled>Select a Bank</option>
            <option value="gtb">GTBank</option>
            <option value="first">First Bank</option>
            <option value="access">Access Bank</option>
            <option value="zenith">Zenith Bank</option>
            <option value="kuda">Kuda Bank</option>
            <option value="opay">OPay</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-on-surface">Account Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 size={20} className="text-on-surface-variant/50" />
            </div>
            <input 
              type="text" 
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-11 pr-4 py-4 bg-background border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all tracking-widest font-mono font-bold"
              placeholder="0000000000"
            />
          </div>
          {accountNumber.length === 10 && bank && (
            <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
              ✓ Verified: John Doe
            </p>
          )}
        </div>

        <div className="space-y-1">
           <label className="text-sm font-medium text-on-surface">Amount format</label>
           <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 bg-background border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-xl font-bold"
              placeholder="Enter Amount"
           />
        </div>

        <div className="flex justify-between items-center text-xs text-on-surface-variant px-2">
          <span>Fee: ₦10.00</span>
          <span>Max: ₦1,000,000 daily</span>
        </div>

        <button 
          type="button"
          onClick={() => onNavigate('dashboard')}
          disabled={!amount || !accountNumber || !bank}
          className="w-full py-4 bg-primary text-on-primary rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          Withdraw Funds
        </button>
      </form>
    </div>
  );
}
