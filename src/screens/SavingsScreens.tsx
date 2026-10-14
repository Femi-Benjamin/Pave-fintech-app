import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Loader, Pencil, Plus, PlusCircle, Trash2 } from "lucide-react";
import { PaveBtn, ScreenHeader } from "../components/UI";
import { PaveLoadingState } from "../components/PaveLoadingState";
import { Screen, fmt, pct } from "../pave-data";
import { getApiErrorMessage } from "../api/auth";
import type {
  Saving,
  SavingFrequency,
  SavingContributionPayload,
} from "../api/savings";
import {
  useCreateSavingMutation,
  useCreateSavingContributionMutation,
  useDeleteSavingMutation,
  useSavingQuery,
  useSavingsQuery,
  useUpdateSavingMutation,
  useWalletBalanceQuery,
  useWithdrawContributionMutation,
} from "../hooks/usePaveApi";
import { Skeleton } from "../components/Skeleton";

function amount(value: number | string) {
  return Number(value) || 0;
}

function percentSaved(
  saving: Pick<Saving, "targetAmount"> & { totalSaved?: number | string },
) {
  const target = amount(saving.targetAmount);
  return target > 0 ? pct(amount(saving.totalSaved ?? 0), target) : 0;
}

function isSavingFrequency(value: string): value is SavingFrequency {
  return ["daily", "weekly", "monthly", "bi-weekly", "yearly"].includes(value);
}

function localDateString(date: Date) {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

function getDefaultSavingDates() {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);
  return {
    startDate: localDateString(startDate),
    endDate: localDateString(endDate),
  };
}

function savingColor(index: number) {
  return ["#3730A3", "#059669", "#D97706", "#7C3AED"][index % 4];
}

export function PersonalSavingsScreen({
  onNav,
  onSelectSaving,
  successNotice,
  onDismissSuccess,
}: {
  onNav: (screen: Screen) => void;
  onSelectSaving: (savingId: string) => void;
  successNotice: string;
  onDismissSuccess: () => void;
}) {
  const savingsQuery = useSavingsQuery();
  const savings = savingsQuery.data?.data.savings ?? [];
  const totalSaved = savings.reduce(
    (total, saving) => total + amount(saving.totalSaved),
    0,
  );
  const activeGoals = savings.filter(
    (saving) => saving.status?.toLowerCase() === "active",
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #3730A3 0%, #1E1B4B 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <h1 className="mb-6 text-[22px] font-bold text-white md:text-[28px]">
          My Savings
        </h1>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
            <div className="mb-1 text-xs text-white/70">Total Saved</div>
            <div
              className="text-[22px] font-bold text-white"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {savingsQuery.isLoading ? (
                <Skeleton dark className="h-7 w-24 rounded-md" />
              ) : (
                fmt(totalSaved)
              )}
            </div>
            <div className="mt-1 text-xs text-white/60">
              Across {savings.length} goals
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
            <div className="mb-1 text-xs text-white/70">Active Goals</div>
            <div
              className="text-[22px] font-bold text-white"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {savingsQuery.isLoading ? (
                <Skeleton dark className="h-7 w-12 rounded-md" />
              ) : (
                activeGoals
              )}
            </div>
            <div className="mt-1 text-xs text-white/60">Personal savings</div>
          </div>
        </div>
      </div>
      <div className="px-6 -mt-4 flex flex-col gap-5">
        {successNotice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm"
          >
            <span>{successNotice}</span>
            <button
              type="button"
              onClick={onDismissSuccess}
              className="cursor-pointer text-emerald-700"
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => onNav("create-saving")}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] p-4 transition-colors hover:bg-[#E0E7FF]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3730A3]">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-sm font-medium text-[#3730A3]">
            Create New Savings Goal
          </span>
        </button>
        {savingsQuery.isError && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {getApiErrorMessage(
              savingsQuery.error,
              "Unable to load your personal savings.",
            )}
            <button
              onClick={() => void savingsQuery.refetch()}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}
        {savingsQuery.isLoading &&
          [1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#F1F3FB] bg-white p-5"
            >
              <Skeleton className="mb-4 h-5 w-36 rounded-md" />
              <Skeleton className="mb-5 h-3 w-28 rounded-md" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        {savingsQuery.isSuccess && savings.length === 0 && (
          <div className="rounded-2xl border border-[#F1F3FB] bg-white p-5 text-sm text-[#6B7280]">
            You don't have any personal savings goals yet.
          </div>
        )}
        {savings.map((saving, index) => {
          const saved = amount(saving.totalSaved);
          const target = amount(saving.targetAmount);
          const progress = percentSaved(saving);
          return (
            <button
              key={saving.id}
              onClick={() => {
                onSelectSaving(saving.id);
                onNav("savings-detail");
              }}
              className="cursor-pointer rounded-2xl border border-[#F1F3FB] bg-white p-5 text-left shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-white"
                    style={{ background: savingColor(index) }}
                  >
                    {saving.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#0D0F1C]">
                      {saving.name}
                    </div>
                    <div className="text-xs capitalize text-[#9CA3AF]">
                      {saving.frequency}
                      {saving.status ? ` · ${saving.status}` : ""}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold text-[#0D0F1C]">
                    {fmt(saved)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {progress}% saved
                  </div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F1F3FB]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full"
                  style={{ background: savingColor(index) }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-[#9CA3AF]">
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

export function CreateSavingScreen({
  onNav,
  onCreated,
}: {
  onNav: (screen: Screen) => void;
  onCreated: (message: string) => void;
}) {
  const createMutation = useCreateSavingMutation();
  const [dates] = useState(getDefaultSavingDates);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: dates.startDate,
    endDate: dates.endDate,
    targetAmount: "",
    frequency: "weekly" as SavingFrequency,
    autoDebit: false,
  });
  const targetAmount = Number(form.targetAmount.replace(/,/g, ""));
  const validDates =
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    new Date(`${form.endDate}T00:00:00`) >
      new Date(`${form.startDate}T00:00:00`);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || targetAmount <= 0 || !validDates) return;
    try {
      const response = await createMutation.mutateAsync({
        name: form.name.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        targetAmount,
        frequency: form.frequency,
        autoDebit: form.autoDebit,
      });
      onCreated(response.message || "Savings goal created successfully.");
      onNav("savings");
    } catch {
      // Mutation errors are rendered below.
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title="Create Savings Goal"
        onBack={() => onNav("savings")}
      />
      <div className="flex-1 overflow-y-auto bg-[#F7F8FC] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#0D0F1C] sm:text-2xl">
              Give your savings a clear plan
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">
              Set a target and schedule that works for you. You can update your
              goal later.
            </p>
          </div>
          <form
            onSubmit={(event) => void submit(event)}
            className="rounded-2xl border border-[#E9ECF5] bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="mb-6 border-b border-[#F1F3FB] pb-4">
              <h2 className="text-base font-semibold text-[#0D0F1C]">
                Goal details
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Fields marked <span className="text-red-600">*</span> are
                required.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                <span>
                  Goal name <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  maxLength={100}
                  placeholder="e.g. House rent"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition placeholder:text-[#9CA3AF] hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Add a note about what you’re saving for (optional)"
                  className="w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition placeholder:text-[#9CA3AF] hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                />
                <span className="text-xs font-normal text-[#9CA3AF]">
                  {form.description.length}/500 characters
                </span>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  <span>
                    Target amount <span className="text-red-600">*</span>
                  </span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition focus-within:border-[#3730A3] focus-within:ring-4 focus-within:ring-[#3730A3]/10 hover:border-[#C7D2FE]">
                    <span className="border-r border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
                      NGN
                    </span>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.targetAmount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          targetAmount: event.target.value,
                        }))
                      }
                      placeholder="120000"
                      className="w-full px-4 py-3 text-sm text-[#0D0F1C] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  <span>
                    Contribution frequency{" "}
                    <span className="text-red-600">*</span>
                  </span>
                  <select
                    value={form.frequency}
                    onChange={(event) => {
                      const frequency = event.target.value;
                      if (isSavingFrequency(frequency)) {
                        setForm((current) => ({
                          ...current,
                          frequency,
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm capitalize text-[#0D0F1C] outline-none transition hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                  >
                    {["daily", "weekly", "bi-weekly", "monthly", "yearly"].map(
                      (frequency) => (
                        <option key={frequency} value={frequency}>
                          {frequency}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-[#374151]">
                  Savings timeline
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                    <span>
                      Start date <span className="text-red-600">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          startDate: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                    <span>
                      Target date <span className="text-red-600">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      min={form.startDate}
                      value={form.endDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          endDate: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                    />
                  </label>
                </div>
              </div>
              {!validDates && form.startDate && form.endDate && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  The target date must be after the start date.
                </p>
              )}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E9ECF5] bg-[#F9FAFB] p-4">
                <input
                  type="checkbox"
                  checked={form.autoDebit}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      autoDebit: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 rounded accent-[#3730A3]"
                />
                <span>
                  <span className="block text-sm font-medium text-[#374151]">
                    Enable automatic debit
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6B7280]">
                    Allow scheduled contributions from your wallet based on your
                    selected frequency.
                  </span>
                </span>
              </label>
              {createMutation.isError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {getApiErrorMessage(
                    createMutation.error,
                    "Unable to create your savings goal.",
                  )}
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 border-t border-[#F1F3FB] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => onNav("savings")}
                  disabled={createMutation.isPending}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <PaveBtn
                  type="submit"
                  full={false}
                  disabled={
                    createMutation.isPending ||
                    !form.name.trim() ||
                    targetAmount <= 0 ||
                    !validDates
                  }
                >
                  {createMutation.isPending
                    ? "Creating goal..."
                    : "Create goal"}
                </PaveBtn>
              </div>
            </div>
          </form>
        </div>
      </div>
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
      <PaveLoadingState
        title="Loading Savings Goal..."
        subtitle="Retrieving your target balance and contribution progress"
      />
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
          {saving.frequency} contributions ·{" "}
          {saving.status ?? "Status unavailable"}
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
            <span>
              {progress}% of {fmt(target)}
            </span>
            <span>{fmt(Math.max(0, target - saved))} to go</span>
          </div>
        </div>
      </div>
      <div className="px-6 -mt-4 pb-8 flex flex-col gap-4">
        {/* Primary Action Buttons: Add Funds & Withdraw */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveAction("contribute");
              setActionMessage("");
            }}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-5 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#312E81] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle size={17} />
            <span>Add Funds</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveAction("withdraw");
              setActionMessage("");
            }}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#3730A3]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[#3730A3] shadow-xs transition-all hover:bg-[#EEF2FF] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ArrowUpRight size={17} />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Management Buttons: Edit Goal & Delete Goal */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={openEditor}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#334155] shadow-xs transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Pencil size={15} className="text-[#64748B]" />
            <span>Edit Goal</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700 shadow-xs transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={15} />
            <span>Delete Goal</span>
          </button>
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
                  busy || Number(contributionAmount) <= 0 || !remarks.trim()
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
                      : (contribution.status ?? "")}
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
