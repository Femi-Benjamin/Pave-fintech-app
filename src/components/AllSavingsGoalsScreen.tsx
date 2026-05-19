import React, { useState } from 'react';
import { ArrowLeft, Lock, RefreshCw, Flame, ArrowUpRight, Search, TrendingUp } from 'lucide-react';
import { useLocalStore, SavingsGoal } from '../hooks/useLocalStore';

interface AllSavingsGoalsScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AllSavingsGoalsScreen({ onNavigate }: AllSavingsGoalsScreenProps) {
  const { savingsGoals } = useLocalStore();
  const [filter, setFilter] = useState<'all' | 'flexible' | 'fixed'>('all');

  const filteredGoals = filter === 'all'
    ? savingsGoals
    : savingsGoals.filter(g => g.type === filter);

  const getProgress = (goal: SavingsGoal) => Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background sticky top-0 z-10 border-b border-outline-variant/10">
        <button onClick={() => onNavigate('savings_hub')} className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">All Savings Goals</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-background transition-colors">
          <Search size={22} />
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-surface rounded-2xl p-1.5 flex border border-outline-variant/20">
          {(['all', 'flexible', 'fixed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors capitalize ${filter === t ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {t === 'all' ? `All (${savingsGoals.length})` : `${t} (${savingsGoals.filter(g => g.type === t).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-on-surface-variant" />
            </div>
            <p className="text-on-surface-variant font-medium">No savings goals found</p>
            <button onClick={() => onNavigate('create_savings')} className="text-primary font-semibold text-sm mt-2 hover:underline">
              Create one now
            </button>
          </div>
        ) : (
          filteredGoals.map(goal => {
            const progress = getProgress(goal);
            return (
              <div key={goal.id} className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/10 relative overflow-hidden">
                {goal.type === 'fixed' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary"></div>}
                <div className={goal.type === 'fixed' ? 'pl-2' : ''}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        goal.type === 'flexible'
                          ? 'bg-background border-outline-variant/20 text-primary'
                          : 'bg-background border-outline-variant/20 text-tertiary'
                      }`}>
                        {goal.type}
                      </span>
                      {goal.streak >= 3 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#d97706] bg-[#d97706]/10 px-2 py-0.5 rounded-full border border-[#d97706]/20">
                          <Flame size={10} /> {goal.streak}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.autoSave && goal.type === 'flexible' && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-[10px] font-bold">
                          <RefreshCw size={10} /> Auto
                        </div>
                      )}
                      {goal.apy && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-tertiary/10 border border-tertiary/20 rounded-md text-tertiary text-[10px] font-bold">
                          <ArrowUpRight size={10} /> {goal.apy}%
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-body-lg font-bold text-on-background mb-3">{goal.name}</h4>

                  <div className="flex justify-between items-end mb-2">
                    <div className="text-lg font-display font-bold text-on-background">
                      ₦{(goal.currentAmount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium pb-0.5">
                      of {formatAmount(goal.targetAmount)}
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-1.5 border border-outline-variant/10">
                    <div
                      className={`h-full rounded-full transition-all ${goal.type === 'fixed' ? 'bg-tertiary' : 'bg-primary'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-on-surface-variant">{progress}% complete</div>
                    {goal.type === 'fixed' && (
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <Lock size={10} />
                        Until {new Date(goal.maturityDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
