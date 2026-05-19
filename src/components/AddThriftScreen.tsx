import React, { useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
  Users,
  ArrowRight,
  AlertTriangle,
  Copy,
  Share2,
  Shuffle,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { useLocalStore } from '../hooks/useLocalStore';

interface AddThriftScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AddThriftScreen({ onNavigate }: AddThriftScreenProps) {
  const { addThriftGroup } = useLocalStore();
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Weekly");
  const [cycles, setCycles] = useState("12");
  const [autoDeduct, setAutoDeduct] = useState(true);
  const [payoutMethod, setPayoutMethod] = useState("roundrobin");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inviteCode = `PAVE-${planName.slice(0, 4).toUpperCase().replace(/\s/g, '') || 'XXXX'}-${new Date().getFullYear()}`;

  const parsedAmount = parseInt(amount.replace(/,/g, '')) || 0;
  const parsedCycles = parseInt(cycles) || 0;
  const totalPool = parsedAmount * parsedCycles;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!planName.trim()) newErrors.planName = 'Plan name is required';
    if (!parsedAmount || parsedAmount < 1000) newErrors.amount = 'Minimum ₦1,000';
    if (!parsedCycles || parsedCycles < 2) newErrors.cycles = 'Minimum 2 cycles';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    addThriftGroup({
      name: planName,
      isAdmin: true,
      amount: `₦${parsedAmount.toLocaleString()}`,
      frequency,
      members: parsedCycles,
      contributionStr: `₦${totalPool.toLocaleString()}`,
      status: 'ACTIVE',
      statusType: 'primary',
    });

    setToast('Thrift group created successfully!');
    setTimeout(() => {
      onNavigate("thrift");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background">
        <button
          onClick={() => onNavigate("thrift")}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors"
        >
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
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Plan Name
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => { setPlanName(e.target.value); setErrors(p => ({ ...p, planName: '' })); }}
              className={`w-full px-4 py-3.5 bg-background border ${errors.planName ? 'border-error' : 'border-outline-variant/30'} rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors`}
              placeholder="e.g. Lagos Traders Ajo"
            />
            {errors.planName && <p className="text-xs text-error font-medium">{errors.planName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Contribution Amount (NGN)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant text-lg font-medium">
                ₦
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/[^0-9,]/g, '')); setErrors(p => ({ ...p, amount: '' })); }}
                className={`w-full pl-9 pr-4 py-3.5 bg-background border ${errors.amount ? 'border-error' : 'border-outline-variant/30'} rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors text-lg`}
                placeholder="50,000"
              />
            </div>
            {errors.amount && <p className="text-xs text-error font-medium">{errors.amount}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2 bg-surface border border-outline-variant/10 p-4 rounded-2xl">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Frequency
              </label>
              <div className="relative border-b border-outline-variant/30 pb-1">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-transparent text-on-background focus:outline-none appearance-none font-medium text-[15px] p-0 border-none"
                >
                  <option className="bg-surface">Weekly</option>
                  <option className="bg-surface">Monthly</option>
                  <option className="bg-surface">Daily</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-on-surface-variant">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 bg-surface border border-outline-variant/10 p-4 rounded-2xl">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-tight block">
                Cycles<br />(Members)
              </label>
              <div className="flex items-end gap-2 border-b border-outline-variant/30 pb-1">
                <input
                  type="number"
                  value={cycles}
                  onChange={(e) => { setCycles(e.target.value); setErrors(p => ({ ...p, cycles: '' })); }}
                  className="w-full bg-transparent text-on-background focus:outline-none font-medium text-[15px] p-0 border-none"
                />
                <Users size={16} className="text-on-surface-variant mb-1" />
              </div>
              {errors.cycles && <p className="text-xs text-error font-medium">{errors.cycles}</p>}
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
              className={`w-[44px] h-[24px] rounded-full transition-colors relative shrink-0 ${autoDeduct ? "bg-primary/30" : "bg-surface-variant"}`}
            >
              <div className={`w-[20px] h-[20px] rounded-full bg-primary absolute top-[2px] transition-all shadow-sm ${autoDeduct ? "left-[22px]" : "left-[2px] bg-on-surface-variant"}`}></div>
            </button>
          </div>

          <div className="bg-error-container border border-error/30 text-on-error-container rounded-[16px] p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[13px] leading-relaxed">
              A 5% penalty fee applies for missed or late contributions. Please ensure your wallet is funded.
            </p>
          </div>

          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 mb-8">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Plan Summary</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Total Pool (NGN)</span>
                <span className="text-[15px] font-bold text-on-background">
                  {totalPool > 0 ? `₦${totalPool.toLocaleString()}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Duration</span>
                <span className="text-[15px] font-medium text-on-background">
                  {parsedCycles > 0 ? `${parsedCycles} ${frequency === 'Weekly' ? 'Weeks' : frequency === 'Monthly' ? 'Months' : 'Days'}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Per Member</span>
                <span className="text-[15px] font-medium text-on-background">
                  {parsedAmount > 0 ? `₦${parsedAmount.toLocaleString()} / ${frequency.toLowerCase().replace('ly', '')}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Payout Order */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Payout Order</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPayoutMethod("roundrobin")}
                className={`p-4 rounded-xl border text-left transition-colors ${payoutMethod === "roundrobin" ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface"}`}
              >
                <ArrowDown size={20} className={payoutMethod === "roundrobin" ? "text-primary mb-2" : "text-on-surface-variant mb-2"} />
                <p className="text-sm font-semibold text-on-surface">Round Robin</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Sequential order</p>
              </button>
              <button
                onClick={() => setPayoutMethod("random")}
                className={`p-4 rounded-xl border text-left transition-colors ${payoutMethod === "random" ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface"}`}
              >
                <Shuffle size={20} className={payoutMethod === "random" ? "text-primary mb-2" : "text-on-surface-variant mb-2"} />
                <p className="text-sm font-semibold text-on-surface">Random</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Randomized each cycle</p>
              </button>
            </div>
          </div>

          {/* Invite Members */}
          <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">
              Invite Members
            </label>
            <p className="text-xs text-on-surface-variant mb-4">
              Share this code with people you want to invite to this thrift group.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-mono font-bold text-on-background tracking-widest">
                {inviteCode}
              </div>
              <button
                onClick={handleCopy}
                className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
              >
                <Copy size={18} />
              </button>
              <button className="w-11 h-11 bg-surface-variant text-on-surface rounded-xl flex items-center justify-center hover:bg-surface-variant/80 transition-colors shrink-0">
                <Share2 size={18} />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-primary font-medium mt-2">Copied to clipboard!</p>
            )}
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-[15px] mt-6"
          >
            Start Thrift <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant/30 text-on-surface px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={16} className="text-primary" />
          {toast}
        </div>
      )}
    </div>
  );
}
