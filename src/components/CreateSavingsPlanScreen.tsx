import React, { useState } from 'react';
import { ArrowLeft, Flag, Lock, SlidersHorizontal, Calendar, ArrowRight, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { useLocalStore } from '../hooks/useLocalStore';

interface CreateSavingsPlanScreenProps {
  onNavigate: (screen: string) => void;
}

export default function CreateSavingsPlanScreen({ onNavigate }: CreateSavingsPlanScreenProps) {
  const { addSavingsGoal } = useLocalStore();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'flexible' | 'fixed'>('flexible');
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [autoSave, setAutoSave] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parsedTarget = parseInt(targetAmount.replace(/,/g, '')) || 0;

  // Calculate estimated contribution
  const getEstimatedContribution = () => {
    if (!parsedTarget || !maturityDate) return '—';
    const now = new Date();
    const target = new Date(maturityDate);
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    let periods = 1;
    if (frequency === 'Daily') periods = diffDays;
    else if (frequency === 'Weekly') periods = Math.ceil(diffDays / 7);
    else periods = Math.ceil(diffDays / 30);

    const perPeriod = Math.ceil(parsedTarget / periods);
    return `₦${perPeriod.toLocaleString()}`;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!goalName.trim()) newErrors.goalName = 'Goal name is required';
    if (!parsedTarget || parsedTarget < 1000) newErrors.targetAmount = 'Minimum ₦1,000';
    if (!maturityDate) newErrors.maturityDate = 'Please select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleCreate = () => {
    addSavingsGoal({
      name: goalName,
      type,
      targetAmount: parsedTarget,
      frequency,
      maturityDate,
      autoSave,
      apy: type === 'fixed' ? 5.0 : undefined,
    });
    setToast('Savings plan created successfully!');
    setTimeout(() => {
      onNavigate('savings_hub');
    }, 1500);
  };

  const stepLabels = ['Type', 'Details', 'Review'];

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onNavigate('savings_hub')}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">Create Savings Plan</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto pb-32 px-4 overflow-x-hidden scrollbar-hide">
        {/* Stepper */}
        <div className="flex items-center justify-between max-w-[300px] mx-auto py-8">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 relative transition-colors ${
                  step > i + 1 ? 'bg-primary text-on-primary' :
                  step === i + 1 ? 'bg-primary text-on-primary' :
                  'bg-surface-variant border border-outline-variant text-on-surface-variant'
                }`}>
                  {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${step >= i + 1 ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
              </div>
              {i < 2 && (
                <div className={`h-[2px] flex-1 -mt-6 mx-2 transition-colors ${step > i + 1 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-surface rounded-[24px] p-6 border border-outline-variant/10 shadow-sm max-w-xl mx-auto">
          {/* ─── Step 1: Type ─────────────────────────────────────── */}
          {step === 1 && (
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
              </div>

              {/* Type info cards */}
              <div className={`p-5 rounded-2xl border ${type === 'flexible' ? 'border-primary/20 bg-primary/5' : 'border-tertiary/20 bg-tertiary/5'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {type === 'flexible' ? <SlidersHorizontal size={20} className="text-primary" /> : <Lock size={20} className="text-tertiary" />}
                  <h3 className="font-bold text-on-background">{type === 'flexible' ? 'Flexible Savings' : 'Fixed Savings'}</h3>
                </div>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {type === 'flexible' ? (
                    <>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Withdraw anytime, no penalties</li>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Set auto-save schedules</li>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Perfect for short-term goals</li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-tertiary mt-0.5 shrink-0" /> Higher interest rates (up to 6% APY)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-tertiary mt-0.5 shrink-0" /> Funds locked until maturity date</li>
                      <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-tertiary mt-0.5 shrink-0" /> Best for long-term discipline</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* ─── Step 2: Details ──────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Goal Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                    <Flag size={20} />
                  </div>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => { setGoalName(e.target.value); setErrors(p => ({ ...p, goalName: '' })); }}
                    className={`w-full pl-11 pr-4 py-3.5 bg-background border ${errors.goalName ? 'border-error' : 'border-outline-variant/30'} rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors`}
                    placeholder="e.g. New Car Fund"
                  />
                </div>
                {errors.goalName && <p className="text-xs text-error font-medium">{errors.goalName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Target Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant text-lg font-medium">
                    ₦
                  </div>
                  <input
                    type="text"
                    value={targetAmount}
                    onChange={(e) => { setTargetAmount(e.target.value.replace(/[^0-9,]/g, '')); setErrors(p => ({ ...p, targetAmount: '' })); }}
                    className={`w-full pl-10 pr-4 py-3.5 bg-background border ${errors.targetAmount ? 'border-error' : 'border-outline-variant/30'} rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors`}
                    placeholder="0.00"
                  />
                </div>
                {errors.targetAmount && <p className="text-xs text-error font-medium">{errors.targetAmount}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {type === 'fixed' ? 'Maturity Date' : 'Target Date'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => { setMaturityDate(e.target.value); setErrors(p => ({ ...p, maturityDate: '' })); }}
                    className={`w-full pl-11 pr-4 py-3.5 bg-background border ${errors.maturityDate ? 'border-error' : 'border-outline-variant/30'} rounded-xl text-on-background focus:outline-none focus:border-primary transition-colors`}
                  />
                </div>
                {errors.maturityDate && <p className="text-xs text-error font-medium">{errors.maturityDate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Auto-Save Frequency</label>
                <div className="flex gap-2">
                  {(['Daily', 'Weekly', 'Monthly'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors border ${frequency === f ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-background border border-outline-variant/30 rounded-xl p-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">Auto-Save</p>
                  <p className="text-xs text-on-surface-variant">Automatically save on schedule</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${autoSave ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Estimated contribution */}
              <div className="bg-background border border-outline-variant/30 rounded-xl p-4">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Estimated {frequency} Contribution
                </div>
                <div className="text-xl font-bold text-on-background">{getEstimatedContribution()}</div>
              </div>
            </div>
          )}

          {/* ─── Step 3: Review ──────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${type === 'flexible' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                  {type === 'flexible' ? <SlidersHorizontal size={28} /> : <Lock size={28} />}
                </div>
                <h2 className="text-xl font-bold text-on-background">{goalName}</h2>
                <p className="text-sm text-on-surface-variant capitalize">{type} Savings Plan</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">Target Amount</span>
                  <span className="text-[15px] font-bold text-on-background">₦{parsedTarget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">{type === 'fixed' ? 'Maturity Date' : 'Target Date'}</span>
                  <span className="text-[15px] font-medium text-on-background">{new Date(maturityDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">Auto-Save</span>
                  <span className="text-[15px] font-medium text-on-background">{autoSave ? frequency : 'Off'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">Est. Contribution</span>
                  <span className="text-[15px] font-bold text-primary">{getEstimatedContribution()} / {frequency.toLowerCase()}</span>
                </div>
                {type === 'fixed' && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface-variant flex items-center gap-1.5"><TrendingUp size={14} /> Interest Rate</span>
                    <span className="text-[15px] font-bold text-tertiary">5.0% APY</span>
                  </div>
                )}
              </div>

              {type === 'fixed' && (
                <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4 flex items-start gap-3">
                  <Lock size={16} className="text-tertiary shrink-0 mt-0.5" />
                  <p className="text-xs text-on-surface leading-relaxed">
                    Your funds will be <strong>locked</strong> until the maturity date. Early withdrawal may attract a penalty.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-background border-t border-outline-variant/10 flex items-center justify-between z-20">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onNavigate('savings_hub')}
          className="px-6 py-3.5 text-on-background font-medium hover:text-on-surface-variant transition-colors"
        >
          {step > 1 ? 'Back' : 'Cancel'}
        </button>
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            Continue <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Create Plan
          </button>
        )}
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
