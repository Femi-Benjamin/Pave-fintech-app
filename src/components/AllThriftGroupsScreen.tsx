import React from "react";
import { ArrowLeft, Users, Crown, Search } from "lucide-react";

interface AllThriftGroupsScreenProps {
  onNavigate: (screen: string) => void;
}

export const THRIFT_GROUPS = [
  {
    id: "q3_tech",
    name: "Q3 Tech Savings",
    isAdmin: true,
    amount: "₦5,000",
    frequency: "Week",
    members: 10,
    contributionStr: "₦20,000",
    status: "ACTION REQ",
    statusType: "error",
  },
  {
    id: "family_target",
    name: "Family Target 2024",
    isAdmin: false,
    amount: "₦20,000",
    frequency: "Month",
    members: 5,
    contributionStr: "₦60,000",
    status: "ON TRACK",
    statusType: "success",
  },
  {
    id: "lagos_traders",
    name: "Lagos Traders Ajo",
    isAdmin: false,
    amount: "₦10,000",
    frequency: "Week",
    members: 12,
    contributionStr: "₦40,000",
    status: "PENDING",
    statusType: "warning",
  },
  {
    id: "december_detty",
    name: "December Detty Fund",
    isAdmin: true,
    amount: "₦50,000",
    frequency: "Month",
    members: 8,
    contributionStr: "₦150,000",
    status: "ACTIVE",
    statusType: "primary",
  },
  {
    id: "car_purchase",
    name: "Car Purchase Thrift",
    isAdmin: false,
    amount: "₦100,000",
    frequency: "Month",
    members: 6,
    contributionStr: "₦200,000",
    status: "ON TRACK",
    statusType: "success",
  },
];

export default function AllThriftGroupsScreen({
  onNavigate,
}: AllThriftGroupsScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background sticky top-0 z-10 border-b border-outline-variant/10">
        <button
          onClick={() => onNavigate("thrift")}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">Active Groups</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-background transition-colors">
          <Search size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-hide">
        {THRIFT_GROUPS.map((group) => (
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
                    <Crown size={12} className="text-primary shrink-0" />
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
  );
}
