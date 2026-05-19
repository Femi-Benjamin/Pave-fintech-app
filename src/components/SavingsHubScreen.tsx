import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  RefreshCw,
  Lock,
  Flame,
  Target,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { useLocalStore, SavingsGoal } from "../hooks/useLocalStore";

interface SavingsHubScreenProps {
  onNavigate: (screen: string) => void;
}

export default function SavingsHubScreen({
  onNavigate,
}: SavingsHubScreenProps) {
  const { savingsGoals, walletBalance, depositToGoal } = useLocalStore();
  const [tab, setTab] = useState<"all" | "flexible" | "fixed">("all");
  const [depositModal, setDepositModal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredGoals =
    tab === "all" ? savingsGoals : savingsGoals.filter((g) => g.type === tab);

  const totalFlexible = savingsGoals
    .filter((g) => g.type === "flexible")
    .reduce((a, g) => a + g.currentAmount, 0);
  const totalFixed = savingsGoals
    .filter((g) => g.type === "fixed")
    .reduce((a, g) => a + g.currentAmount, 0);
  const totalSavings = totalFlexible + totalFixed;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeposit = () => {
    if (!depositModal) return;
    const amt = parseInt(depositAmount.replace(/,/g, "")) || 0;
    if (amt <= 0) return;
    const result = depositToGoal(depositModal.id, amt);
    setDepositModal(null);
    setDepositAmount("");
    showToast(result.message);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  };

  const getProgress = (goal: SavingsGoal) =>
    Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  // Show max 3 on main page
  const displayGoals = filteredGoals.slice(0, 3);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-headline-md font-bold text-on-background tracking-tight">
          Savings Hub
        </h1>
        <p className="text-body-sm text-on-surface-variant font-medium mt-1">
          Grow your wealth, one goal at a time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Total Savings
          </p>
          <h2 className="text-xl font-bold text-on-background font-display">
            ₦
            {(totalSavings / 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
          <div className="flex items-center gap-1.5 text-green-500 text-[11px] font-bold mt-2">
            <TrendingUp size={12} />
            <span>+2.4% this month</span>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Active Goals
          </p>
          <h2 className="text-xl font-bold text-on-background font-display">
            {savingsGoals.length}
          </h2>
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold mt-2">
            <Target size={12} />
            <span>
              {savingsGoals.filter((g) => getProgress(g) >= 80).length} near
              completion
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-surface rounded-2xl p-1.5 flex border border-outline-variant/20 shadow-sm">
        {(["all", "flexible", "fixed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors capitalize ${tab === t ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Create New Plan */}
      <button
        onClick={() => onNavigate("create_savings")}
        className="w-full bg-transparent border-2 border-dashed border-outline-variant/30 rounded-2xl p-5 text-center text-on-surface-variant font-medium hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-3"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Plus size={20} className="text-primary" />
        </div>
        <span className="text-body-sm font-semibold">
          Create New Savings Plan
        </span>
      </button>

      {/* Active Goals */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-body-lg font-bold text-on-surface">
            Active Goals
          </h3>
          <button
            onClick={() => onNavigate("all_savings")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View All ({filteredGoals.length})
          </button>
        </div>

        <div className="space-y-4">
          {displayGoals.map((goal) => {
            const progress = getProgress(goal);
            return (
              <div
                key={goal.id}
                className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/10 hover:-translate-y-0.5 transition-transform"
              >
                {goal.type === "fixed" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary rounded-l-2xl"></div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        goal.type === "flexible"
                          ? "bg-background border-outline-variant/20 text-primary"
                          : "bg-background border-outline-variant/20 text-[#d97706]"
                      }`}
                    >
                      {goal.type}
                    </span>
                    {goal.streak >= 3 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#d97706] bg-[#d97706]/10 px-2 py-0.5 rounded-full border border-[#d97706]/20">
                        <Flame size={10} /> {goal.streak} streak
                      </span>
                    )}
                  </div>
                  {goal.type === "flexible" && goal.autoSave && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-[10px] font-bold">
                      <RefreshCw size={10} />
                      Auto-save
                    </div>
                  )}
                  {goal.type === "fixed" && goal.apy && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-tertiary/10 border border-tertiary/20 rounded-md text-tertiary text-[10px] font-bold">
                      <ArrowUpRight size={10} />
                      {goal.apy}% APY
                    </div>
                  )}
                </div>

                <h4 className="text-body-lg font-bold text-on-background mb-3">
                  {goal.name}
                </h4>

                <div className="flex justify-between items-end mb-2">
                  <div className="text-lg font-display font-bold text-on-background">
                    ₦
                    {(goal.currentAmount / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-on-surface font-medium pb-0.5">
                    of {formatAmount(goal.targetAmount)}
                  </div>
                </div>

                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-1.5 border border-outline-variant/10">
                  <div
                    className={`h-full rounded-full transition-all ${goal.type === "fixed" ? "bg-tertiary" : "bg-primary"}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-on-surface">
                    {progress}% complete
                  </div>
                  {goal.type === "fixed" && (
                    <div className="flex items-center gap-1 text-xs text-on-surface">
                      <Lock size={10} />
                      Locked until{" "}
                      {new Date(goal.maturityDate).toLocaleDateString("en-NG", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {goal.type === "flexible" && (
                  <button
                    onClick={() => {
                      setDepositModal(goal);
                      setDepositAmount("");
                    }}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Zap size={14} /> Quick Deposit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Deposit Modal */}
      {depositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-outline-variant/20 shadow-xl">
            <h3 className="font-bold text-on-background text-lg mb-1">
              Quick Deposit
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Deposit to <strong>{depositModal.name}</strong>
            </p>

            <div className="mb-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Amount
              </label>
              <div className="bg-background border border-outline-variant/30 rounded-xl p-4 flex items-center">
                <span className="text-xl font-bold text-on-surface mr-2">
                  ₦
                </span>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) =>
                    setDepositAmount(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full bg-transparent focus:outline-none text-2xl font-bold text-on-surface"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                Wallet balance: ₦{walletBalance.toLocaleString()}.00
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {[1000, 5000, 10000, 50000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(String(amt))}
                  className="py-2 px-4 rounded-full border border-outline-variant/50 text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDepositModal(null)}
                className="flex-1 py-3.5 bg-surface-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-variant/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant/30 text-on-surface px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm font-medium animate-pulse">
          <TrendingUp size={16} className="text-primary" />
          {toast}
        </div>
      )}
    </div>
  );
}
