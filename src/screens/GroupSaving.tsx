import React, { useEffect, useState } from "react";
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
import {
  useContributeToGroupSavingMutation,
  useCreateGroupSavingMutation,
  useDeleteGroupSavingMutation,
  useGroupSavingQuery,
  useGroupSavingsQuery,
  useGroupWithdrawalQuery,
  useGroupWithdrawalsQuery,
  useInviteMemberToGroupMutation,
  useJoinGroupSavingMutation,
  useLeaveGroupSavingMutation,
  useMyGroupWithdrawalsQuery,
  useUpdateGroupSavingMutation,
  useWithdrawFromGroupSavingMutation,
} from "../hooks/useGroupSavingApi";
import { useWalletBalanceQuery } from "../hooks/usePaveApi";
import type {
  GroupSaving,
  GroupSavingFrequency,
  GroupSavingUpdatePayload,
} from "../api/groupSaving";
import { Skeleton } from "../components/Skeleton";

function amount(value: number | string) {
  return Number(value) || 0;
}

function isSavingFrequency(value: string): value is GroupSavingFrequency {
  return ["daily", "weekly", "monthly", "bi-weekly", "yearly"].includes(value);
}

function percentSaved(
  saving: Pick<GroupSaving, "targetAmount"> & {
    currentBalance?: number | string;
  },
) {
  const target = amount(saving.targetAmount);
  const saved = amount(saving.currentBalance ?? 0);
  return target > 0 ? pct(saved, target) : 0;
}

function remainingDays(endDate: string) {
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

function savingColor(index: number) {
  return ["#3730A3", "#059669", "#D97706", "#7C3AED"][index % 4];
}

export function GroupSavingsScreen({
  onNav,
  onSelectGroup,
  successNotice,
  onDismissSuccess,
}: {
  onNav: (s: Screen) => void;
  onSelectGroup: (groupId: string) => void;
  successNotice?: string;
  onDismissSuccess?: () => void;
}) {
  const savingsQuery = useGroupSavingsQuery();
  const joinGroupMutation = useJoinGroupSavingMutation();
  const savings = savingsQuery.data?.data ?? [];
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  useEffect(() => {
    if (!successNotice || !onDismissSuccess) return;
    const timeout = window.setTimeout(onDismissSuccess, 4000);
    return () => window.clearTimeout(timeout);
  }, [successNotice, onDismissSuccess]);
  const totalSaved = savings.reduce(
    (total, saving) => total + amount(saving.currentBalance),
    0,
  );

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
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="mb-4 text-[22px] font-bold text-white md:text-[28px]">
            My AJO
          </h2>
          <button
            type="button"
            onClick={() => setShowJoinForm((visible) => !visible)}
            aria-expanded={showJoinForm}
            className="rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25"
          >
            {showJoinForm ? "Close invite" : "Join with invite code"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-md mb-1">Total Saved</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              {savingsQuery.isLoading ? (
                <Skeleton dark className="h-7 w-24 rounded-md" />
              ) : (
                fmt(totalSaved)
              )}
            </div>
            <div className="text-white/60 text-xs mt-1">
              {savingsQuery.isLoading
                ? "Loading goals..."
                : `Across ${savings.length} Ajo groups`}
            </div>
          </div>
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-md mb-1">Active AJO</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              {savingsQuery.isLoading ? (
                <Skeleton dark className="h-7 w-12 rounded-md" />
              ) : (
                savings.filter((saving) => saving.status === "active").length
              )}
            </div>
            <div className="text-white/60 text-xs mt-1">From AJO Savings</div>
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
            {onDismissSuccess && (
              <button
                type="button"
                onClick={onDismissSuccess}
                className="cursor-pointer text-emerald-700"
                aria-label="Dismiss success message"
              >
                ×
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => onNav("create-group-saving")}
          className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-[#3730A3] font-medium text-sm">
            Create New AJO Group
          </span>
        </button>
        {showJoinForm && (
          <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Group invite code
              <input
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                className="mt-2 w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
                placeholder="Enter invite code"
              />
            </label>
            {joinGroupMutation.isError && (
              <p role="alert" className="mb-3 text-sm text-red-600">
                {getApiErrorMessage(
                  joinGroupMutation.error,
                  "Unable to join this AJO group.",
                )}
              </p>
            )}
            {joinGroupMutation.isSuccess && (
              <p role="status" className="mb-3 text-sm text-green-700">
                {joinGroupMutation.data.message}
              </p>
            )}
            <PaveBtn
              onClick={() => joinGroupMutation.mutate(inviteCode)}
              disabled={joinGroupMutation.isPending || !inviteCode.trim()}
            >
              {joinGroupMutation.isPending ? "Joining..." : "Join AJO Group"}
            </PaveBtn>
          </section>
        )}
        {savingsQuery.isError && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
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
        {!savingsQuery.isLoading &&
          !savingsQuery.isError &&
          savings.length === 0 && (
            <p className="rounded-2xl bg-white p-5 text-sm text-[#6B7280]">
              You don't have any AJO groups yet. Create one to get started.
            </p>
          )}
        {savingsQuery.isLoading &&
          [1, 2].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-5 border border-[#F1F3FB]"
            >
              <Skeleton className="h-5 w-36 rounded-md mb-4" />
              <Skeleton className="h-3 w-28 rounded-md mb-5" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        {savings.map((saving, index) => {
          const saved = amount(saving.currentBalance);
          const target = amount(saving.targetAmount);
          const days = remainingDays(saving.endDate);
          const progress = percentSaved(saving);
          return (
            <button
              key={saving.id}
              onClick={() => {
                onSelectGroup(saving.id);
                onNav("group-saving-detail");
              }}
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

export function CreateGroupSavingScreen({
  onNav,
  onCreated,
}: {
  onNav: (s: Screen) => void;
  onCreated: () => void;
}) {
  const createGroupSavingMutation = useCreateGroupSavingMutation();
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
      await createGroupSavingMutation.mutateAsync({
        name: form.name.trim(),
        description: form.purpose.trim(),
        targetAmount,
        contributionAmount,
        currency: "NGN",
        frequency,
        maxMembers: 10,
        startDate: form.startDate,
        endDate: form.endDate,
        visibility: "private",
        image: "",
      });
      onCreated();
      onNav("group-savings");
    } catch {
      // The mutation error is rendered in the form.
    }
  };
  const freqs = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Yearly"];
  const targetAmount = Number(form.goal.replace(/,/g, ""));
  const contributionAmount = Number(form.amount.replace(/,/g, ""));
  const validDates =
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    new Date(`${form.endDate}T00:00:00`) >
      new Date(`${form.startDate}T00:00:00`);
  const stepTitles = ["Group details", "Contribution plan", "Review"];
  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title="Create AJO Goal"
        onBack={() => (step > 1 ? setStep(step - 1) : onNav("group-savings"))}
      />
      <div className="flex-1 overflow-y-auto bg-[#F7F8FC] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <h1 className="text-xl font-bold text-[#0D0F1C] sm:text-2xl">
              Create a group savings goal
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">
              Set a shared target, contribution schedule, and timeline for your
              AJO group.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E9ECF5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#3730A3]">
                  Step {step} of 3
                </span>
                <span className="text-sm font-medium text-[#374151]">
                  {stepTitles[step - 1]}
                </span>
              </div>
              <div className="flex gap-2" aria-label={`Step ${step} of 3`}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{
                      background: i <= step ? "#3730A3" : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
            </div>
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  <span>
                    AJO group name <span className="text-red-600">*</span>
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    maxLength={100}
                    placeholder="e.g. Holiday fund"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition placeholder:text-[#9CA3AF] hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  <span>
                    Group target <span className="text-red-600">*</span>
                  </span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition hover:border-[#C7D2FE] focus-within:border-[#3730A3] focus-within:ring-4 focus-within:ring-[#3730A3]/10">
                    <span className="border-r border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
                      NGN
                    </span>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.goal}
                      onChange={(e) => set("goal")(e.target.value)}
                      placeholder="500000"
                      className="w-full px-4 py-3 text-sm text-[#0D0F1C] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <span className="text-xs font-normal text-[#6B7280]">
                    Total amount your group is aiming to save.
                  </span>
                </label>
                <div className="flex flex-col-reverse gap-3 border-t border-[#F1F3FB] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => onNav("group-savings")}
                    className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6]"
                  >
                    Cancel
                  </button>
                  <PaveBtn
                    type="button"
                    full={false}
                    onClick={() => setStep(2)}
                    disabled={!form.name.trim() || targetAmount <= 0}
                  >
                    Continue
                  </PaveBtn>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  <span>
                    Contribution amount per member{" "}
                    <span className="text-red-600">*</span>
                  </span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition hover:border-[#C7D2FE] focus-within:border-[#3730A3] focus-within:ring-4 focus-within:ring-[#3730A3]/10">
                    <span className="border-r border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
                      NGN
                    </span>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => set("amount")(e.target.value)}
                      placeholder="5000"
                      className="w-full px-4 py-3 text-sm text-[#0D0F1C] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </label>
                <div>
                  <div className="mb-2 text-sm font-medium text-[#374151]">
                    Contribution frequency{" "}
                    <span className="text-red-600">*</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {freqs.map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => set("freq")(f)}
                        aria-pressed={form.freq === f}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${form.freq === f ? "border-[#3730A3] bg-[#EEF2FF] text-[#3730A3]" : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#C7D2FE]"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  Start date <span className="text-red-600">*</span>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(event) => set("startDate")(event.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  Target date <span className="text-red-600">*</span>
                  <input
                    required
                    type="date"
                    min={form.startDate}
                    value={form.endDate}
                    onChange={(event) => set("endDate")(event.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                  />
                </label>
                {contributionAmount > 0 && form.freq && (
                  <div className="rounded-xl border border-[#C7D2FE] bg-[#F5F3FF] p-4 text-sm">
                    <div className="mb-1 font-semibold text-[#3730A3]">
                      Contribution plan
                    </div>
                    <p className="leading-6 text-[#4B5563]">
                      Each member contributes {fmt(contributionAmount)}{" "}
                      {form.freq.toLowerCase()}. The group balance grows as
                      members make their contributions.
                    </p>
                  </div>
                )}
                <div className="flex flex-col-reverse gap-3 border-t border-[#F1F3FB] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6]"
                  >
                    Back
                  </button>
                  <PaveBtn
                    type="button"
                    full={false}
                    onClick={() => setStep(3)}
                    disabled={
                      contributionAmount <= 0 || !form.freq || !validDates
                    }
                  >
                    Review goal
                  </PaveBtn>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
                  Purpose or motivation
                  <textarea
                    value={form.purpose}
                    onChange={(e) => set("purpose")(e.target.value)}
                    placeholder="Add an optional note about what the group is saving for."
                    rows={3}
                    maxLength={500}
                    className="w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0D0F1C] outline-none transition placeholder:text-[#9CA3AF] hover:border-[#C7D2FE] focus:border-[#3730A3] focus:ring-4 focus:ring-[#3730A3]/10"
                  />
                  <span className="text-xs font-normal text-[#9CA3AF]">
                    {form.purpose.length}/500 characters
                  </span>
                </label>
                <div className="rounded-xl border border-[#E9ECF5] bg-[#F9FAFB] p-4 sm:p-5">
                  <div className="mb-4">
                    <h2 className="font-semibold text-[#0D0F1C]">
                      Review your AJO
                    </h2>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Confirm these details before creating your group.
                    </p>
                  </div>
                  <dl className="divide-y divide-[#E9ECF5]">
                    {[
                      ["Group name", form.name || "—"],
                      ["Group target", fmt(targetAmount)],
                      ["Contribution per member", fmt(contributionAmount)],
                      ["Frequency", form.freq || "—"],
                      [
                        "Timeline",
                        `${new Date(`${form.startDate}T00:00:00`).toLocaleDateString()} – ${new Date(`${form.endDate}T00:00:00`).toLocaleDateString()}`,
                      ],
                      ["Group visibility", "Private"],
                      ["Maximum members", "10"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                      >
                        <dt className="text-[#6B7280]">{label}</dt>
                        <dd className="font-semibold text-[#0D0F1C]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {createGroupSavingMutation.isError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {getApiErrorMessage(
                      createGroupSavingMutation.error,
                      "Unable to create your AJO group.",
                    )}
                  </p>
                )}
                <div className="flex flex-col-reverse gap-3 border-t border-[#F1F3FB] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={createGroupSavingMutation.isPending}
                    className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>
                  <PaveBtn
                    type="button"
                    full={false}
                    onClick={() => void handleCreate()}
                    disabled={
                      createGroupSavingMutation.isPending ||
                      contributionAmount <= 0 ||
                      !form.freq ||
                      !validDates
                    }
                  >
                    {createGroupSavingMutation.isPending ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Creating AJO...
                      </>
                    ) : (
                      "Create AJO group"
                    )}
                  </PaveBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GroupSavingDetailScreen({
  onNav,
  groupId,
}: {
  onNav: (s: Screen) => void;
  groupId: string;
}) {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState("");
  const groupQuery = useGroupSavingQuery(groupId);
  const group = groupQuery.data?.data;
  const groupWithdrawalsQuery = useGroupWithdrawalsQuery(groupId);
  const myWithdrawalsQuery = useMyGroupWithdrawalsQuery();
  const withdrawalDetailQuery = useGroupWithdrawalQuery(
    selectedWithdrawalId,
    Boolean(selectedWithdrawalId),
  );
  const walletBalanceQuery = useWalletBalanceQuery();
  const contributeMutation = useContributeToGroupSavingMutation();
  const withdrawMutation = useWithdrawFromGroupSavingMutation();
  const updateMutation = useUpdateGroupSavingMutation();
  const deleteMutation = useDeleteGroupSavingMutation();
  const leaveMutation = useLeaveGroupSavingMutation();
  const inviteMutation = useInviteMemberToGroupMutation();
  const [activeAction, setActiveAction] = useState<
    "contribute" | "withdraw" | null
  >(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhoneNumber, setInvitePhoneNumber] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    targetAmount: "",
    contributionAmount: "",
    maxMembers: "",
    frequency: "monthly" as GroupSavingFrequency,
    startDate: "",
    endDate: "",
    visibility: "private" as "private" | "public",
    allowMemberWithdrawal: false,
    status: "active",
    image: "",
  });
  const owner = Boolean(
    group?.members?.some((member) => member.role === "owner"),
  );
  const busy =
    contributeMutation.isPending ||
    withdrawMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    leaveMutation.isPending ||
    inviteMutation.isPending;

  const openEditor = () => {
    if (!group) return;
    setEditForm({
      name: group.name,
      description: group.description ?? "",
      targetAmount: String(group.targetAmount),
      contributionAmount: String(group.contributionAmount),
      maxMembers: String(group.maxMembers),
      frequency: group.frequency,
      startDate: group.startDate.slice(0, 10),
      endDate: group.endDate.slice(0, 10),
      visibility: group.visibility,
      allowMemberWithdrawal: group.allowMemberWithdrawal ?? false,
      status: group.status,
      image: group.image ?? "",
    });
    setIsEditing(true);
    setActionMessage("");
  };

  const submitContribution = async () => {
    const amountValue = Number(contributionAmount);
    if (amountValue <= 0) return;
    setActionMessage("");
    try {
      const response = await contributeMutation.mutateAsync({
        groupId,
        payload: { paymentMethod: "wallet", amount: amountValue },
      });
      setActionMessage(response.message);
      setContributionAmount("");
      setActiveAction(null);
    } catch {
      // The mutation error is rendered in the action form.
    }
  };

  const submitWithdrawal = async () => {
    const amountValue = Number(withdrawalAmount);
    if (amountValue <= 0 || !narration.trim()) return;
    setActionMessage("");
    try {
      const response = await withdrawMutation.mutateAsync({
        groupId,
        payload: { amount: amountValue, narration: narration.trim() },
      });
      setActionMessage(response.message);
      setWithdrawalAmount("");
      setNarration("");
      setActiveAction(null);
    } catch {
      // The mutation error is rendered in the action form.
    }
  };

  const submitUpdate = async () => {
    const targetAmount = Number(editForm.targetAmount);
    const contributionAmount = Number(editForm.contributionAmount);
    const maxMembers = Number(editForm.maxMembers);
    if (
      !editForm.name.trim() ||
      targetAmount <= 0 ||
      contributionAmount <= 0 ||
      maxMembers < (group?.currentMembers ?? 1) ||
      new Date(editForm.endDate) <= new Date(editForm.startDate)
    ) {
      return;
    }
    const payload: GroupSavingUpdatePayload = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      targetAmount,
      contributionAmount,
      currency: group?.currency ?? "NGN",
      frequency: editForm.frequency,
      maxMembers,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      visibility: editForm.visibility,
      allowMemberWithdrawal: editForm.allowMemberWithdrawal,
      status: editForm.status,
      image: editForm.image,
    };
    setActionMessage("");
    try {
      const response = await updateMutation.mutateAsync({ groupId, payload });
      setActionMessage(response.message);
      setIsEditing(false);
    } catch {
      // The mutation error is rendered in the edit form.
    }
  };

  const submitInvite = async () => {
    setActionMessage("");
    try {
      const response = await inviteMutation.mutateAsync({
        groupId,
        payload: {
          email: inviteEmail,
          phoneNumber: invitePhoneNumber,
        },
      });
      setActionMessage(response.message);
      setInviteEmail("");
      setInvitePhoneNumber("");
    } catch {
      // The mutation error is rendered beside the invite form.
    }
  };

  const deleteGroup = () => {
    if (
      !window.confirm("Delete this AJO group? This action cannot be undone.")
    ) {
      return;
    }
    deleteMutation.mutate(groupId, {
      onSuccess: () => onNav("group-savings"),
    });
  };

  const leaveGroup = () => {
    if (!window.confirm("Leave this AJO group?")) return;
    leaveMutation.mutate(groupId, {
      onSuccess: () => onNav("group-savings"),
    });
  };

  if (!groupId) {
    return (
      <div className="flex-1 p-6">
        <p role="alert" className="mb-4 text-sm text-red-600">
          Select an AJO group to view its details.
        </p>
        <PaveBtn onClick={() => onNav("group-savings")}>Back to My AJO</PaveBtn>
      </div>
    );
  }

  if (groupQuery.isLoading) {
    return (
      <div role="status" className="flex-1 p-6 text-sm text-[#6B7280]">
        Loading AJO group...
      </div>
    );
  }

  if (groupQuery.isError || !group) {
    return (
      <div className="flex-1 p-6">
        <p role="alert" className="mb-4 text-sm text-red-600">
          {getApiErrorMessage(
            groupQuery.error,
            "Unable to load this AJO group.",
          )}
        </p>
        <div className="flex gap-2">
          <PaveBtn onClick={() => void groupQuery.refetch()}>Retry</PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("group-savings")}>
            Back to My AJO
          </PaveBtn>
        </div>
      </div>
    );
  }

  const saved = amount(group.currentBalance);
  const target = amount(group.targetAmount);
  const progress = target > 0 ? pct(saved, target) : 0;
  const myWithdrawals =
    myWithdrawalsQuery.data?.data.filter(
      (withdrawal) => withdrawal.groupSavingId === groupId,
    ) ?? [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #D97706 0%, #B45309 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <button
          onClick={() => onNav("group-savings")}
          className="mb-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15"
          aria-label="Back to My AJO"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h2 className="mb-1 text-xl font-bold text-white">{group.name}</h2>
        <p className="mb-5 text-xs text-white/70">
          {group.frequency} contributions · {group.status}
        </p>
        <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
          <div className="mb-1 text-xs text-white/70">Group balance</div>
          <div className="mb-3 text-3xl font-bold text-white">{fmt(saved)}</div>
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/70">
            <span>
              {progress}% of {fmt(target)}
            </span>
            <span>{fmt(Math.max(0, target - saved))} to go</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-8">
        <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
            Group details
          </h3>
          {[
            ["Contribution", fmt(amount(group.contributionAmount))],
            ["Members", `${group.currentMembers} / ${group.maxMembers}`],
            ["Starts", new Date(group.startDate).toLocaleDateString()],
            ["Ends", new Date(group.endDate).toLocaleDateString()],
            ["Visibility", group.visibility],
            ["Invite code", group.inviteCode || "Unavailable"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 py-1.5 text-sm"
            >
              <span className="text-[#9CA3AF]">{label}</span>
              <span className="text-right font-medium text-[#0D0F1C]">
                {value}
              </span>
            </div>
          ))}
          {group.description && (
            <p className="mt-2 border-t border-[#F1F3FB] pt-3 text-sm text-[#6B7280]">
              {group.description}
            </p>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <PaveBtn
            onClick={() => {
              setActiveAction("contribute");
              setActionMessage("");
            }}
            disabled={busy}
            full={false}
          >
            Contribute
          </PaveBtn>
          <PaveBtn
            variant="outline"
            onClick={() => {
              setActiveAction("withdraw");
              setActionMessage("");
            }}
            disabled={busy || !group.allowMemberWithdrawal}
            full={false}
          >
            Withdraw
          </PaveBtn>
        </div>
        {!group.allowMemberWithdrawal && (
          <p className="-mt-2 text-xs text-[#9CA3AF]">
            Withdrawals are disabled by the group owner.
          </p>
        )}
        {owner && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <PaveBtn
                variant="ghost"
                onClick={openEditor}
                disabled={busy}
                full={false}
              >
                <Pencil size={15} />
                Edit group
              </PaveBtn>
              <PaveBtn
                variant="danger"
                onClick={deleteGroup}
                disabled={busy}
                full={false}
              >
                <Trash2 size={15} />
                Delete group
              </PaveBtn>
            </div>
            <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
                Invite a member
              </h3>
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="Email address (optional)"
                aria-label="Member email address"
                className="mb-3 w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
              />
              <input
                type="tel"
                value={invitePhoneNumber}
                onChange={(event) => setInvitePhoneNumber(event.target.value)}
                placeholder="Phone number (optional)"
                aria-label="Member phone number"
                className="mb-3 w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
              />
              <p className="mb-3 text-xs text-[#6B7280]">
                Enter an email address, phone number, or both.
              </p>
              {inviteMutation.isError && (
                <p role="alert" className="mb-3 text-sm text-red-600">
                  {getApiErrorMessage(
                    inviteMutation.error,
                    "Unable to invite this member.",
                  )}
                </p>
              )}
              <PaveBtn
                onClick={() => void submitInvite()}
                disabled={
                  busy || (!inviteEmail.trim() && !invitePhoneNumber.trim())
                }
              >
                {inviteMutation.isPending ? "Sending..." : "Send invitation"}
              </PaveBtn>
            </section>
          </>
        )}
        {!owner && (
          <PaveBtn variant="danger" onClick={leaveGroup} disabled={busy}>
            {leaveMutation.isPending ? "Leaving..." : "Leave group"}
          </PaveBtn>
        )}

        {actionMessage && (
          <p role="status" className="text-sm text-green-700">
            {actionMessage}
          </p>
        )}

        {activeAction && (
          <section className="rounded-2xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
              {activeAction === "contribute"
                ? "Contribute from wallet"
                : "Request a withdrawal"}
            </h3>
            {activeAction === "contribute" && (
              <p className="mb-3 text-xs text-[#6B7280]">
                Wallet balance:{" "}
                {walletBalanceQuery.data
                  ? fmt(amount(walletBalanceQuery.data.balance))
                  : walletBalanceQuery.isFetching
                    ? "Loading..."
                    : "Unavailable"}
              </p>
            )}
            <input
              type="number"
              min="1"
              value={
                activeAction === "contribute"
                  ? contributionAmount
                  : withdrawalAmount
              }
              onChange={(event) =>
                activeAction === "contribute"
                  ? setContributionAmount(event.target.value)
                  : setWithdrawalAmount(event.target.value)
              }
              placeholder="Amount"
              aria-label="Amount"
              className="mb-3 w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
            />
            {activeAction === "withdraw" && (
              <input
                value={narration}
                onChange={(event) => setNarration(event.target.value)}
                placeholder="Reason for withdrawal"
                aria-label="Withdrawal narration"
                className="mb-3 w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
              />
            )}
            {(activeAction === "contribute"
              ? contributeMutation.isError
              : withdrawMutation.isError) && (
              <p role="alert" className="mb-3 text-sm text-red-600">
                {getApiErrorMessage(
                  activeAction === "contribute"
                    ? contributeMutation.error
                    : withdrawMutation.error,
                  "Unable to process this group transaction.",
                )}
              </p>
            )}
            <div className="flex gap-2">
              <PaveBtn
                onClick={() =>
                  void (activeAction === "contribute"
                    ? submitContribution()
                    : submitWithdrawal())
                }
                disabled={
                  busy ||
                  Number(
                    activeAction === "contribute"
                      ? contributionAmount
                      : withdrawalAmount,
                  ) <= 0 ||
                  (activeAction === "withdraw" && !narration.trim())
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
              Edit AJO group
            </h3>
            <div className="flex flex-col gap-3">
              <input
                value={editForm.name}
                onChange={(event) =>
                  setEditForm({ ...editForm, name: event.target.value })
                }
                aria-label="Group name"
                placeholder="Group name"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              />
              <textarea
                value={editForm.description}
                onChange={(event) =>
                  setEditForm({ ...editForm, description: event.target.value })
                }
                aria-label="Group description"
                placeholder="Description"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              />
              <input
                type="number"
                min="1"
                value={editForm.targetAmount}
                onChange={(event) =>
                  setEditForm({ ...editForm, targetAmount: event.target.value })
                }
                aria-label="Target amount"
                placeholder="Target amount"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              />
              <input
                type="number"
                min="1"
                value={editForm.contributionAmount}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    contributionAmount: event.target.value,
                  })
                }
                aria-label="Contribution amount"
                placeholder="Contribution amount"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              />
              <input
                type="number"
                min={group.currentMembers}
                value={editForm.maxMembers}
                onChange={(event) =>
                  setEditForm({ ...editForm, maxMembers: event.target.value })
                }
                aria-label="Maximum members"
                placeholder="Maximum members"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              />
              <select
                value={editForm.frequency}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    frequency: event.target.value as GroupSavingFrequency,
                  })
                }
                aria-label="Contribution frequency"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              >
                {["daily", "weekly", "bi-weekly", "monthly", "yearly"].map(
                  (frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ),
                )}
              </select>
              <label className="text-sm text-[#374151]">
                Start date
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(event) =>
                    setEditForm({ ...editForm, startDate: event.target.value })
                  }
                  className="mt-1 w-full rounded-xl bg-[#F1F3FB] px-4 py-3"
                />
              </label>
              <label className="text-sm text-[#374151]">
                End date
                <input
                  type="date"
                  min={editForm.startDate}
                  value={editForm.endDate}
                  onChange={(event) =>
                    setEditForm({ ...editForm, endDate: event.target.value })
                  }
                  className="mt-1 w-full rounded-xl bg-[#F1F3FB] px-4 py-3"
                />
              </label>
              <select
                value={editForm.visibility}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    visibility: event.target.value as "private" | "public",
                  })
                }
                aria-label="Group visibility"
                className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input
                  type="checkbox"
                  checked={editForm.allowMemberWithdrawal}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      allowMemberWithdrawal: event.target.checked,
                    })
                  }
                />
                Allow member withdrawals
              </label>
              {updateMutation.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getApiErrorMessage(
                    updateMutation.error,
                    "Unable to update this AJO group.",
                  )}
                </p>
              )}
              <div className="flex gap-2">
                <PaveBtn onClick={() => void submitUpdate()} disabled={busy}>
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </PaveBtn>
                <PaveBtn
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={busy}
                >
                  Cancel
                </PaveBtn>
              </div>
            </div>
          </section>
        )}

        {deleteMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {getApiErrorMessage(
              deleteMutation.error,
              "Unable to delete this AJO group.",
            )}
          </p>
        )}
        {leaveMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {getApiErrorMessage(
              leaveMutation.error,
              "Unable to leave this AJO group.",
            )}
          </p>
        )}

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
            Members ({group.members?.length ?? group.currentMembers})
          </h3>
          {(group.members ?? []).map((member) => (
            <div
              key={member.id}
              className="flex justify-between border-b border-[#F1F3FB] py-3 text-sm"
            >
              <span className="text-[#374151]">
                {member.User?.firstName || member.User?.email || member.userId}
                {member.role === "owner" ? " · Owner" : ""}
              </span>
              <span className="font-medium">
                {fmt(amount(member.totalContribution))}
              </span>
            </div>
          ))}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
            Group withdrawals
          </h3>
          {groupWithdrawalsQuery.isError && (
            <p role="alert" className="mb-2 text-sm text-red-600">
              {getApiErrorMessage(
                groupWithdrawalsQuery.error,
                "Unable to load group withdrawals.",
              )}
            </p>
          )}
          {(groupWithdrawalsQuery.data?.data ?? []).map((withdrawal) => (
            <button
              key={withdrawal.id}
              onClick={() =>
                setSelectedWithdrawalId(
                  selectedWithdrawalId === withdrawal.id ? "" : withdrawal.id,
                )
              }
              className="flex w-full items-center justify-between border-b border-[#F1F3FB] py-3 text-left"
            >
              <span>
                <span className="block text-sm font-medium text-[#374151]">
                  {withdrawal.User?.firstName ||
                    withdrawal.User?.email ||
                    "Member"}{" "}
                  · {withdrawal.status}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {new Date(withdrawal.createdAt).toLocaleDateString()}
                </span>
              </span>
              <span className="text-sm font-semibold">
                {fmt(amount(withdrawal.amount))}
              </span>
            </button>
          ))}
          {groupWithdrawalsQuery.isSuccess &&
            groupWithdrawalsQuery.data.data.length === 0 && (
              <p className="rounded-xl bg-white p-4 text-sm text-[#6B7280]">
                No group withdrawals yet.
              </p>
            )}
          {selectedWithdrawalId && withdrawalDetailQuery.data && (
            <div className="mt-3 rounded-xl bg-white p-4 text-sm">
              <div>Reference: {withdrawalDetailQuery.data.reference}</div>
              <div>Status: {withdrawalDetailQuery.data.status}</div>
              <div>
                Narration: {withdrawalDetailQuery.data.narration || "—"}
              </div>
            </div>
          )}
          {selectedWithdrawalId && withdrawalDetailQuery.isError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {getApiErrorMessage(
                withdrawalDetailQuery.error,
                "Unable to load withdrawal details.",
              )}
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
            My withdrawals
          </h3>
          {myWithdrawalsQuery.isError && (
            <p role="alert" className="mb-2 text-sm text-red-600">
              {getApiErrorMessage(
                myWithdrawalsQuery.error,
                "Unable to load your withdrawals.",
              )}
            </p>
          )}
          {myWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="flex justify-between border-b border-[#F1F3FB] py-3 text-sm"
            >
              <span className="text-[#6B7280]">
                {withdrawal.status} · {withdrawal.reference}
              </span>
              <span className="font-semibold">
                {fmt(amount(withdrawal.amount))}
              </span>
            </div>
          ))}
          {myWithdrawalsQuery.isSuccess && myWithdrawals.length === 0 && (
            <p className="rounded-xl bg-white p-4 text-sm text-[#6B7280]">
              You have no withdrawals from this group.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
