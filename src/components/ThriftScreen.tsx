import React from "react";
import {
  Users,
  Plus,
  AlertTriangle,
  RefreshCw,
  Hourglass,
  Calendar,
  Info,
  Crown,
  UserPlus,
} from "lucide-react";
import { THRIFT_GROUPS } from "./AllThriftGroupsScreen";
import { useLocalStore } from '../hooks/useLocalStore';

interface ThriftScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ThriftScreen({ onNavigate }: ThriftScreenProps) {
  const { customThriftGroups } = useLocalStore();
  const allGroups = [...THRIFT_GROUPS, ...customThriftGroups];

  const totalContribution = allGroups.reduce((acc, group) => {
    const amount = parseInt(
      group.contributionStr.replace("₦", "").replace(/,/g, ""),
    );
    return acc + amount;
  }, 0);

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">
      <div className="mb-6">
        <h1 className="text-headline-md font-bold text-on-background tracking-tight mb-1.5">
          Thrift Management
        </h1>
        <p className="text-body-sm text-on-surface-variant font-medium mb-4">
          Track and manage your Ajo contribution plans.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("add_thrift")}
            className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-sm transition-colors hover:opacity-90"
          >
            <Plus size={18} /> New Thrift Group
          </button>
          <button
            onClick={() => onNavigate("join_thrift")}
            className="bg-surface border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-sm transition-colors hover:bg-surface-variant/50"
          >
            <UserPlus size={18} /> Join Group
          </button>
        </div>
      </div>

      {/* Current Cycle Card */}
      <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-on-surface-variant font-medium">
            <RefreshCw size={18} />
            <span className="text-body-sm">Current Cycle</span>
          </div>
          <div className="px-3 py-1 bg-surface-variant text-on-background text-[10px] font-bold tracking-widest rounded-md uppercase">
            Active
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[13px] text-on-surface-variant font-medium mb-1">
            Total Contribution
          </div>
          <div className="text-display-naira text-on-background flex items-baseline gap-1">
            ₦{totalContribution.toLocaleString()}
            <span className="text-xl font-normal text-on-surface-variant/70">
              .00
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-on-surface-variant mb-1.5">
              Frequency
            </div>
            <div className="flex items-center gap-1.5 text-on-background font-medium text-body-sm">
              <Calendar size={16} className="text-primary" /> Weekly
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-on-surface-variant mb-1.5">
              Next Payout
            </div>
            <div className="flex items-center gap-1.5 text-on-background font-medium text-body-sm">
              <Calendar size={16} className="text-primary" /> Oct 24, 2023
            </div>
          </div>
        </div>
      </div>

      {/* Payout Maturity Card */}
      <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card">
        <div className="flex items-center gap-2 text-on-surface-variant font-medium mb-4">
          <Hourglass size={18} />
          <span className="text-body-sm">Payout Maturity</span>
        </div>

        <div className="flex justify-between items-end mb-2">
          <div className="text-display-naira text-on-background leading-none">
            65%
          </div>
          <div className="text-[13px] text-on-surface-variant font-medium mb-1">
            Position: 4 of 10
          </div>
        </div>

        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: "65%" }}
          ></div>
        </div>

        <div className="flex justify-between items-center p-3.5 bg-background border border-outline-variant/20 rounded-xl">
          <div className="text-[13px] font-medium text-on-surface-variant">
            Est. Payout Amount
          </div>
          <div className="text-headline-md font-bold text-primary font-display">
            ₦250,000
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-body-lg font-bold text-on-background">
            Active Groups
          </h3>
          <button
            onClick={() => onNavigate("all_thrifts")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {THRIFT_GROUPS.slice(0, 3).map((group) => (
            <button
              key={group.id}
              onClick={() => onNavigate(`thrift_detail:${group.id}`)}
              className="w-full bg-surface border border-outline-variant/10 rounded-2xl p-4 flex items-center justify-between hover:-translate-y-0.5 transition-transform shadow-sm text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-on-background text-body-sm mb-0.5">
                      {group.name}
                    </h4>
                    {group.isAdmin && (
                      <Crown size={12} className="text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {group.amount} / {group.frequency} • {group.members} Members
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-body-sm font-bold text-on-background font-display mb-1.5">
                  {group.contributionStr}
                </div>
                <div
                  className={`
                  text-[9px] font-bold px-2 py-1 rounded tracking-wider text-center border
                  ${group.statusType === "error" ? "bg-error-container text-on-error-container border-error/20" : ""}
                  ${group.statusType === "success" ? "bg-surface-variant text-primary border-outline-variant/20" : ""}
                  ${group.statusType === "warning" ? "bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20" : ""}
                  ${group.statusType === "primary" ? "bg-primary/10 text-primary border-primary/20" : ""}
                `}
                >
                  {group.status.split(" ").map((word, i) => (
                    <React.Fragment key={i}>
                      {word}
                      {i === 0 && group.status.includes(" ") && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card flex items-start gap-4">
        <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-[10px] flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-bold text-on-background text-body-sm mb-1">
            How it works
          </h3>
          <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
            Join a group, contribute a fixed amount regularly. One member takes
            the total lump sum each round.
          </p>
          <button className="text-sm font-bold text-primary hover:underline">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
