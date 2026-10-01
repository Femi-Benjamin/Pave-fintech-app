import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Loader,
  Pencil,
  Plus,
  RotateCw,
  Trash2,
} from "lucide-react";
import { PaveBtn, ScreenHeader } from "../components/UI";
import { Screen, fmt, pct } from "../pave-data";
import { getApiErrorMessage } from "../api/auth";
import type {
  Saving,
  SavingFrequency,
  SavingContributionPayload,
} from "../api/savings";
import {
  useCreateSavingContributionMutation,
  useCreateSavingMutation,
  useDeleteSavingMutation,
  useSavingQuery,
  useSavingsQuery,
  useUpdateSavingMutation,
  useWalletBalanceQuery,
  useWithdrawContributionMutation,
} from "../hooks/usePaveApi";
import { SavingsScreenSkeleton } from "../components/Skeleton";

function amount(value: number | string) {
  return Number(value) || 0;
}

function isSavingFrequency(value: string): value is SavingFrequency {
  return ["daily", "weekly", "monthly", "bi-weekly", "yearly"].includes(value);
}

function percentSaved(saving: Saving) {
  const target = amount(saving.targetAmount);
  return target > 0 ? pct(amount(saving.totalSaved), target) : 0;
}

function remainingDays(endDate: string) {
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

function savingColor(index: number) {
  return ["#3730A3", "#059669", "#D97706", "#7C3AED"][index % 4];
}

export function SavingsScreen({
  onNav,
  onSelectSaving,
}: {
  onNav: (s: Screen) => void;
  onSelectSaving: (savingId: string) => void;
}) {
  const savingsQuery = useSavingsQuery();
  const savings = savingsQuery.data?.data.savings ?? [];
  const totalSaved = savings.reduce(
    (total, saving) => total + amount(saving.totalSaved),
    0,
  );

  if (savingsQuery.isLoading) {
    return <SavingsScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #D97706 0%, #B45309 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <h2
          className="text-white mb-4"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          My Savings
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-xs mb-1">Total Saved</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              {fmt(totalSaved)}
            </div>
            <div className="text-white/60 text-xs mt-1">
              Across {savings.length} goals
            </div>
          </div>
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-xs mb-1">Active Goals</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              {savings.filter((saving) => saving.status === "active").length}
            </div>
            <div className="text-white/60 text-xs mt-1">From your savings</div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-5">
        <button
          onClick={() => onNav("create-savings")}
          className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-[#3730A3] font-medium text-sm">
            Create New Savings Goal
          </span>
        </button>
        {savingsQuery.isError && (
          <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {getApiErrorMessage(
              savingsQuery.error,
              "Unable to load your savings.",
            )}
            <button
              onClick={() => void savingsQuery.refetch()}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}
        {!savingsQuery.isError && savings.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#6B7280]">
            You don't have any savings goals yet. Create one to get started.
          </p>
        )}
        {savings.map((saving, index) => {
          const saved = amount(saving.totalSaved);
          const target = amount(saving.targetAmount);
          const days = remainingDays(saving.endDate);
          const progress = percentSaved(saving);
          return (
            <button
              key={saving.id}
              onClick={() => onSelectSaving(saving.id)}
              className="bg-white rounded-2xl p-5 border border-[#F1F3FB] shadow-sm text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ background: savingColor(index) }}
                  >
                    {saving.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0D0F1C]">
                      {saving.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {saving.frequency}
                      {days === null ? "" : ` · ${days} days left`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#0D0F1C]">
                    {fmt(saved)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">{progress}%</div>
                </div>
              </div>
              <div className="h-2 bg-[#F1F3FB] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full"
                  style={{ background: savingColor(index) }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                <span>Goal: {fmt(target)}</span>
                <span>{fmt(Math.max(0, target - saved))} remaining</span>
              </div>
            </button>
          );
        })}
        <div className="h-6" />
      </div>
    </motion.div>
  );
}

export function CreateSavingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const createSavingMutation = useCreateSavingMutation();
  const [step, setStep] = useState(1);
  const defaultStartDate = new Date().toISOString().slice(0, 10);
  const defaultEndDate = new Date(Date.now() + 90 * 86400000)
    .toISOString()
    .slice(0, 10);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    amount: "",
    freq: "",
    purpose: "",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((previous) => ({ ...previous, [k]: v }));
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    const targetAmount = Number(form.goal.replace(/,/g, ""));
    const contributionAmount = Number(form.amount.replace(/,/g, ""));
    const frequency = form.freq.toLowerCase();
    if (
      !form.name.trim() ||
      targetAmount <= 0 ||
      contributionAmount <= 0 ||
      !isSavingFrequency(frequency) ||
      new Date(form.endDate) <= new Date(form.startDate)
    ) {
      return;
    }

    try {
      await createSavingMutation.mutateAsync({
        name: form.name.trim(),
        description: form.purpose.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        targetAmount,
        amount: contributionAmount,
        frequency,
        autoDebit: false,
      });
      setSuccess(true);
    } catch {
      // The mutation error is rendered in the form.
    }
  };
  const freqs = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Yearly"];
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader
        title="Create Savings Goal"
        onBack={() => (step > 1 ? setStep(step - 1) : onNav("savings"))}
      />
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-6xl"
          >
            🎯
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Goal Created! 🎉
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              {createSavingMutation.data?.message}
            </p>
          </div>
          <PaveBtn onClick={() => onNav("savings")}>View My Goals</PaveBtn>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: i <= step ? "#3730A3" : "#E5E7EB" }}
              />
            ))}
          </div>
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Goal Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="e.g. New iPhone, Holiday Trip..."
                  className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Target Amount (₦)
                </label>
                <input
                  value={form.goal}
                  onChange={(e) => set("goal")(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 24,
                  }}
                />
              </div>
              <PaveBtn
                onClick={() => setStep(2)}
                disabled={
                  !form.name.trim() ||
                  !form.goal ||
                  Number(form.goal.replace(/,/g, "")) <= 0
                }
              >
                Continue
              </PaveBtn>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Deposit Amount per {form.freq || "Period"} (₦)
                </label>
                <input
                  value={form.amount}
                  onChange={(e) => set("amount")(e.target.value)}
                  placeholder="e.g. 5,000"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-2">
                  Save Every
                </label>
                <div className="flex flex-wrap gap-2">
                  {freqs.map((f) => (
                    <button
                      key={f}
                      onClick={() => set("freq")(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${form.freq === f ? "bg-[#3730A3] border-[#3730A3] text-white" : "border-[#E5E7EB] text-[#374151]"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <label className="text-sm font-medium text-[#374151] block">
                Start Date
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => set("startDate")(event.target.value)}
                  className="mt-1.5 w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                />
              </label>
              <label className="text-sm font-medium text-[#374151] block">
                Target Date
                <input
                  type="date"
                  min={form.startDate}
                  value={form.endDate}
                  onChange={(event) => set("endDate")(event.target.value)}
                  className="mt-1.5 w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                />
              </label>
              {form.goal && form.amount && form.freq && (
                <div className="bg-[#EEF2FF] rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#3730A3] mb-2">
                    📊 Projection
                  </div>
                  <div className="text-[#374151]">
                    Saving ₦{form.amount} {form.freq.toLowerCase()} will reach
                    your goal of ₦{form.goal} in approximately{" "}
                    <strong>
                      {Math.ceil(
                        Number(form.goal.replace(/,/g, "")) /
                          Number(form.amount.replace(/,/g, "")),
                      )}{" "}
                      {form.freq.toLowerCase()} periods
                    </strong>
                    .
                  </div>
                </div>
              )}
              <PaveBtn
                onClick={() => setStep(3)}
                disabled={
                  !form.amount ||
                  Number(form.amount.replace(/,/g, "")) <= 0 ||
                  !form.freq ||
                  new Date(form.endDate) <= new Date(form.startDate)
                }
              >
                Continue
              </PaveBtn>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Purpose / Motivation
                </label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => set("purpose")(e.target.value)}
                  placeholder="Why are you saving for this? Remind yourself..."
                  rows={4}
                  className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors resize-none"
                />
              </div>
              <div className="bg-white rounded-2xl border border-[#F1F3FB] p-5 flex flex-col gap-3">
                <div className="font-semibold text-[#0D0F1C] mb-1">
                  Goal Summary
                </div>
                {[
                  ["Goal Name", form.name || "—"],
                  ["Target Amount", form.goal ? `₦${form.goal}` : "—"],
                  ["Frequency", form.freq || "—"],
                  ["Deposit Amount", form.amount ? `₦${form.amount}` : "—"],
                  ["Start Date", form.startDate],
                  ["Target Date", form.endDate],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">{k}</span>
                    <span className="font-medium text-[#0D0F1C]">{v}</span>
                  </div>
                ))}
              </div>
              {createSavingMutation.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getApiErrorMessage(
                    createSavingMutation.error,
                    "Unable to create your savings goal.",
                  )}
                </p>
              )}
              <PaveBtn
                onClick={() => void handleCreate()}
                variant="green"
                disabled={
                  createSavingMutation.isPending ||
                  !form.amount ||
                  Number(form.amount.replace(/,/g, "")) <= 0 ||
                  !form.freq ||
                  new Date(form.endDate) <= new Date(form.startDate)
                }
              >
                {createSavingMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Creating goal...
                  </>
                ) : (
                  "🎯 Create Goal"
                )}
              </PaveBtn>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function SavingsDetailScreen({
  onNav,
  savingId,
}: {
  onNav: (s: Screen) => void;
  savingId: string;
}) {
  const savingQuery = useSavingQuery(savingId);
  const walletBalanceQuery = useWalletBalanceQuery();
  const createContributionMutation = useCreateSavingContributionMutation();
  const withdrawMutation = useWithdrawContributionMutation();
  const updateMutation = useUpdateSavingMutation();
  const deleteMutation = useDeleteSavingMutation();
  const saving = savingQuery.data?.data;
  const [activeAction, setActiveAction] = useState<
    "contribute" | "withdraw" | null
  >(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    frequency: "weekly" as SavingFrequency,
  });

  const openEditor = () => {
    if (!saving) return;
    setEditForm({
      name: saving.name,
      description: saving.description ?? "",
      targetAmount: String(saving.targetAmount),
      startDate: saving.startDate.slice(0, 10),
      endDate: saving.endDate.slice(0, 10),
      frequency: saving.frequency,
    });
    setIsEditing(true);
    setActionMessage("");
  };

  const submitContribution = async () => {
    const payload: SavingContributionPayload = {
      amount: Number(contributionAmount.replace(/,/g, "")),
      remarks: remarks.trim(),
    };
    if (!payload.amount || payload.amount <= 0 || !payload.remarks) return;
    setActionMessage("");
    try {
      const response =
        activeAction === "withdraw"
          ? await withdrawMutation.mutateAsync({ savingId, payload })
          : await createContributionMutation.mutateAsync({
              savingId,
              payload,
            });
      setActionMessage(response.message);
      setContributionAmount("");
      setRemarks("");
      setActiveAction(null);
    } catch {
      // Mutation errors are rendered in the action form.
    }
  };

  const submitUpdate = async () => {
    const targetAmount = Number(editForm.targetAmount.replace(/,/g, ""));
    if (
      !editForm.name.trim() ||
      targetAmount <= 0 ||
      new Date(editForm.endDate) <= new Date(editForm.startDate)
    ) {
      return;
    }
    setActionMessage("");
    try {
      await updateMutation.mutateAsync({
        savingId,
        payload: {
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          targetAmount,
          startDate: editForm.startDate,
          endDate: editForm.endDate,
          frequency: editForm.frequency,
        },
      });
      setIsEditing(false);
      setActionMessage("Savings goal updated successfully.");
    } catch {
      // Mutation errors are rendered in the edit form.
    }
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this savings goal?")) return;
    deleteMutation.mutate(savingId, {
      onSuccess: () => onNav("savings"),
    });
  };

  if (!savingId) {
    return (
      <div className="flex-1 p-6">
        <p role="alert" className="mb-4 text-sm text-red-600">
          Select a savings goal to view its details.
        </p>
        <PaveBtn onClick={() => onNav("savings")}>Back to Savings</PaveBtn>
      </div>
    );
  }
  if (savingQuery.isLoading) {
    return (
      <div role="status" className="flex-1 p-6 text-sm text-[#6B7280]">
        Loading savings details...
      </div>
    );
  }
  if (savingQuery.isError || !saving) {
    return (
      <div className="flex-1 p-6">
        <p role="alert" className="mb-4 text-sm text-red-600">
          {getApiErrorMessage(
            savingQuery.error,
            "Unable to load this savings goal.",
          )}
        </p>
        <div className="flex gap-2">
          <PaveBtn onClick={() => void savingQuery.refetch()}>Retry</PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("savings")}>
            Back to Savings
          </PaveBtn>
        </div>
      </div>
    );
  }

  const saved = amount(saving.totalSaved);
  const target = amount(saving.targetAmount);
  const progress = percentSaved(saving);
  const busy =
    createContributionMutation.isPending ||
    withdrawMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #3730A3 0%, #1E1B4B 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <button
          onClick={() => onNav("savings")}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4 cursor-pointer"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h2
          className="text-white font-bold text-xl mb-1"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {saving.name}
        </h2>
        <div className="text-white/70 text-xs mb-6">
          {saving.frequency} contributions · {saving.status ?? "Status unavailable"}
        </div>
        <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <div className="text-white/70 text-xs mb-1">Saved so far</div>
          <div className="text-white mb-3 text-3xl font-bold">{fmt(saved)}</div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <div className="flex justify-between mt-2 text-white/70 text-xs">
            <span>{progress}% of {fmt(target)}</span>
            <span>{fmt(Math.max(0, target - saved))} to go</span>
          </div>
        </div>
      </div>
      <div className="px-6 -mt-4 pb-8 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <PaveBtn
            onClick={() => {
              setActiveAction("contribute");
              setActionMessage("");
            }}
            disabled={busy}
            full={false}
          >
            Add Funds
          </PaveBtn>
          <PaveBtn
            variant="outline"
            onClick={() => {
              setActiveAction("withdraw");
              setActionMessage("");
            }}
            disabled={busy}
            full={false}
          >
            Withdraw
          </PaveBtn>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PaveBtn
            variant="ghost"
            onClick={openEditor}
            disabled={busy}
            full={false}
          >
            <Pencil size={15} />
            Edit Goal
          </PaveBtn>
          <PaveBtn
            variant="danger"
            onClick={handleDelete}
            disabled={busy}
            full={false}
          >
            <Trash2 size={15} />
            Delete Goal
          </PaveBtn>
        </div>
        {actionMessage && (
          <p role="status" className="text-sm text-green-700">
            {actionMessage}
          </p>
        )}
        {activeAction && (
          <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-1 text-sm font-semibold text-[#0D0F1C]">
              {activeAction === "withdraw"
                ? "Withdraw contribution"
                : "Add contribution"}
            </h3>
            {activeAction === "contribute" && (
              <>
                <p className="mb-3 text-xs text-[#6B7280]">
                  Wallet balance:{" "}
                  {walletBalanceQuery.data
                    ? fmt(amount(walletBalanceQuery.data.balance))
                    : walletBalanceQuery.isFetching
                      ? "Loading..."
                      : "Unavailable"}
                </p>
                {walletBalanceQuery.isError && (
                  <p role="alert" className="mb-3 text-xs text-red-600">
                    {getApiErrorMessage(
                      walletBalanceQuery.error,
                      "Unable to load your wallet balance.",
                    )}
                  </p>
                )}
              </>
            )}
            <div className="flex flex-col gap-3">
              <input
                type="number"
                min="1"
                value={contributionAmount}
                onChange={(event) => setContributionAmount(event.target.value)}
                placeholder="Amount"
                aria-label="Contribution amount"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3]"
              />
              <input
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Remarks"
                aria-label="Contribution remarks"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3]"
              />
            </div>
            {(activeAction === "contribute"
              ? createContributionMutation.isError
              : withdrawMutation.isError) && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {getApiErrorMessage(
                  activeAction === "contribute"
                    ? createContributionMutation.error
                    : withdrawMutation.error,
                  "Unable to process this savings contribution.",
                )}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <PaveBtn
                onClick={() => void submitContribution()}
                disabled={
                  busy ||
                  Number(contributionAmount) <= 0 ||
                  !remarks.trim()
                }
              >
                {busy ? <Loader size={16} className="animate-spin" /> : null}
                {busy ? "Processing..." : "Confirm"}
              </PaveBtn>
              <PaveBtn
                variant="ghost"
                onClick={() => setActiveAction(null)}
                disabled={busy}
              >
                Cancel
              </PaveBtn>
            </div>
          </section>
        )}
        {isEditing && (
          <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
              Edit savings goal
            </h3>
            <div className="flex flex-col gap-3">
              <input
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((form) => ({ ...form, name: event.target.value }))
                }
                aria-label="Goal name"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
              />
              <textarea
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((form) => ({
                    ...form,
                    description: event.target.value,
                  }))
                }
                aria-label="Goal description"
                placeholder="Description"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
              />
              <input
                type="number"
                min="1"
                value={editForm.targetAmount}
                onChange={(event) =>
                  setEditForm((form) => ({
                    ...form,
                    targetAmount: event.target.value,
                  }))
                }
                aria-label="Target amount"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
              />
              <select
                value={editForm.frequency}
                onChange={(event) => {
                  const frequency = event.target.value;
                  if (isSavingFrequency(frequency)) {
                    setEditForm((form) => ({ ...form, frequency }));
                  }
                }}
                aria-label="Contribution frequency"
                className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
              >
                {["daily", "weekly", "bi-weekly", "monthly", "yearly"].map(
                  (frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ),
                )}
              </select>
              <label className="text-xs text-[#6B7280]">
                Start date
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(event) =>
                    setEditForm((form) => ({
                      ...form,
                      startDate: event.target.value,
                    }))
                  }
                  className="mt-1 w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
                />
              </label>
              <label className="text-xs text-[#6B7280]">
                Target date
                <input
                  type="date"
                  min={editForm.startDate}
                  value={editForm.endDate}
                  onChange={(event) =>
                    setEditForm((form) => ({
                      ...form,
                      endDate: event.target.value,
                    }))
                  }
                  className="mt-1 w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm"
                />
              </label>
            </div>
            {updateMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {getApiErrorMessage(
                  updateMutation.error,
                  "Unable to update this savings goal.",
                )}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <PaveBtn
                onClick={() => void submitUpdate()}
                disabled={
                  updateMutation.isPending ||
                  !editForm.name.trim() ||
                  Number(editForm.targetAmount) <= 0 ||
                  new Date(editForm.endDate) <= new Date(editForm.startDate)
                }
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </PaveBtn>
              <PaveBtn
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </PaveBtn>
            </div>
          </section>
        )}
        {deleteMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {getApiErrorMessage(
              deleteMutation.error,
              "Unable to delete this savings goal.",
            )}
          </p>
        )}
        <div className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Target", fmt(target)],
              ["Saved", fmt(saved)],
              ["Remaining", fmt(Math.max(0, target - saved))],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-[#9CA3AF]">{label}</div>
                <div className="text-sm font-semibold text-[#0D0F1C]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
            Contribution History
          </h3>
          {(saving.contributions ?? []).length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-sm text-[#6B7280]">
              No contributions recorded for this goal yet.
            </p>
          ) : (
            saving.contributions?.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between gap-3 border-b border-[#F1F3FB] py-3"
              >
                <div>
                  <div className="text-sm font-medium text-[#0D0F1C]">
                    {contribution.remarks || "Contribution"}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {contribution.paidAt
                      ? new Date(contribution.paidAt).toLocaleDateString()
                      : contribution.status ?? ""}
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#059669]">
                  {fmt(amount(contribution.amount))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export function JoinProgramScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Join a Program" onBack={() => onNav("savings")} />
      <p className="p-6 text-sm text-[#6B7280]">
        Group savings programs are not available through the currently
        documented API.
      </p>
    </div>
  );
}
