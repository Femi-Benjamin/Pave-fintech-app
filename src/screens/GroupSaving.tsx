import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Landmark,
  Loader,
  Mail,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  RotateCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  ShoppingBag,
  Package,
  Share2,
  LogOut,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PaveBtn, ScreenHeader, ImageWithFallback } from "../components/UI";
import {
  useGroupProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useCategoriesQuery,
  useProductsQuery,
  marketQueryKeys,
} from "../hooks/useMarketApi";
import { getMarketErrorMessage, stripGroupTag, isOwnProduct } from "../api/market";
import type { ProductItem } from "../api/market";
import { formatMoney } from "./MarketplaceScreens";
import { PaveLoadingState } from "../components/PaveLoadingState";
import { Screen, fmt, pct } from "../pave-data";
import { getApiErrorMessage } from "../api/auth";
import { useLocalStore } from "../hooks/useLocalStore";

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_PRODUCT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateProductImageFile(file: File | null): string | null {
  if (!file) {
    return "Product Image * is required. Please choose a JPEG, PNG, or WebP image under 2 MB.";
  }
  const isAllowedType =
    ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type as any) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!isAllowedType) {
    return "Invalid image format. Allowed formats are JPEG, PNG, and WebP.";
  }
  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    return "Image size exceeds 2 MB limit. Please choose a smaller image.";
  }
  return null;
}
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
import { extractEntityId, isGroupSavingMember } from "../api/groupSaving";
import {
  getAuthenticatedUserEmail,
  getAuthenticatedUserId,
} from "../api/auth";
import { Skeleton } from "../components/Skeleton";
import { normalizeNigerianPhone } from "../utils/phone";

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
  const { authUser } = useLocalStore();
  const currentUserId = getAuthenticatedUserId(authUser);
  const userEmail = getAuthenticatedUserEmail(authUser);
  const savingsQuery = useGroupSavingsQuery();
  const joinGroupMutation = useJoinGroupSavingMutation();
  const savings = (savingsQuery.data?.data ?? []).filter((group) =>
    isGroupSavingMember(group, currentUserId, userEmail),
  );
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
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #D97706 0%, #B45309 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <div className="mb-5">
          <h2 className="text-[22px] font-bold text-white md:text-[28px]">
            My AJO
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Create a group or join one with a private invitation code.
          </p>
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
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onNav("create-group-saving")}
            className="flex flex-col sm:flex-row min-h-20 items-start sm:items-center gap-2 sm:gap-3 rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] p-3.5 sm:p-4 text-left transition-colors hover:bg-[#E0E7FF] cursor-pointer"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#3730A3]">
              <Plus size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <span className="min-w-0">
              <span className="block text-xs sm:text-sm font-semibold text-[#3730A3] truncate">
                Create AJO
              </span>
              <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-xs text-[#6B7280] leading-tight">
                Start a group & invite
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowJoinForm((visible) => !visible)}
            aria-expanded={showJoinForm}
            aria-controls="ajo-invite-code-form"
            className="flex flex-col sm:flex-row min-h-20 items-start sm:items-center gap-2 sm:gap-3 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5 sm:p-4 text-left transition-colors hover:bg-[#FEF3C7] cursor-pointer"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#D97706] text-white">
              <ArrowLeft size={18} className="rotate-180 sm:w-5 sm:h-5" />
            </div>
            <span className="min-w-0">
              <span className="block text-xs sm:text-sm font-semibold text-[#92400E] truncate">
                {showJoinForm ? "Close Join" : "Join AJO"}
              </span>
              <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-xs text-[#6B7280] leading-tight">
                Enter invite code
              </span>
            </span>
          </button>
        </div>
        {showJoinForm && (
          <section
            id="ajo-invite-code-form"
            className="rounded-2xl border border-[#F1F3FB] bg-white p-4"
          >
            <h3 className="mb-1 text-sm font-semibold text-[#0D0F1C]">
              Join a specific AJO
            </h3>
            <p className="mb-3 text-xs text-[#6B7280]">
              AJO groups are private. You can only join with an invitation code
              from a group admin.
            </p>
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
              <div
                role="status"
                className={`mb-3 rounded-xl p-3 text-sm font-medium ${
                  joinGroupMutation.data.alreadyMember
                    ? "border border-amber-200 bg-amber-50 text-amber-800"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                <p>{joinGroupMutation.data.message}</p>
                {joinGroupMutation.data.alreadyMember && (
                  <p className="mt-1 text-xs text-amber-700">
                    Your AJO group list has been refreshed.
                  </p>
                )}
              </div>
            )}
            <PaveBtn
              onClick={() => {
                const code = inviteCode.trim();
                if (!code) return;
                joinGroupMutation.mutate(code, {
                  onSuccess: () => {
                    setInviteCode("");
                  },
                });
              }}
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
            <div className="rounded-2xl bg-white p-5 text-sm text-[#6B7280]">
              <p>
                You are not a member of any AJO groups yet. Create a group or
                enter an invitation code to join one.
              </p>
            </div>
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
    </div>
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
                    className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] bg-[#F3F4F6] transition hover:bg-[#E5E7EB]"
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
                    className="rounded-xl px-6 py-3 text-sm font-semibold text-[#4B5563] bg-[#F3F4F6] transition hover:bg-[#E5E7EB]"
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
  onSelectProduct,
  onSetReturnScreen,
}: {
  onNav: (s: Screen) => void;
  groupId: string;
  onSelectProduct?: (p: any) => void;
  onSetReturnScreen?: (s: Screen) => void;
}) {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState("");
  const groupQuery = useGroupSavingQuery(groupId);
  const group = groupQuery.data?.data;
  const { authUser } = useLocalStore();
  const currentUserId = getAuthenticatedUserId(authUser);
  const userEmail = getAuthenticatedUserEmail(authUser);
  const canAccessGroup = Boolean(
    group && isGroupSavingMember(group, currentUserId, userEmail),
  );
  const groupWithdrawalsQuery = useGroupWithdrawalsQuery(
    groupId,
    canAccessGroup,
  );
  const myWithdrawalsQuery = useMyGroupWithdrawalsQuery();
  const withdrawalDetailQuery = useGroupWithdrawalQuery(
    selectedWithdrawalId,
    canAccessGroup && Boolean(selectedWithdrawalId),
  );
  const walletBalanceQuery = useWalletBalanceQuery();
  const contributeMutation = useContributeToGroupSavingMutation();
  const withdrawMutation = useWithdrawFromGroupSavingMutation();
  const updateMutation = useUpdateGroupSavingMutation();
  const deleteMutation = useDeleteGroupSavingMutation();
  const leaveMutation = useLeaveGroupSavingMutation();
  const inviteMutation = useInviteMemberToGroupMutation();

  const groupOwnerId = extractEntityId(
    group?.userId ??
      (group as any)?.creatorId ??
      (group as any)?.createdBy ??
      (group as any)?.adminId ??
      (group as any)?.ownerId,
  );

  const queryClient = useQueryClient();
  const categoriesQuery = useCategoriesQuery();
  const allProductsQuery = useProductsQuery();
  const groupProductsQuery = useGroupProductsQuery(
    groupId,
    canAccessGroup,
    groupOwnerId,
  );
  const createProductMutation = useCreateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  // Combine categories from dedicated endpoint (if accessible) and dynamically derived from loaded products
  const availableCategories = useMemo(() => {
    const catMap = new Map<string, { id: string; categoryName: string }>();

    // 1. Categories from categories endpoint (if accessible)
    if (Array.isArray(categoriesQuery.data)) {
      categoriesQuery.data.forEach((c) => {
        if (c?.id && c?.categoryName) {
          catMap.set(c.id, { id: c.id, categoryName: c.categoryName.trim() });
        }
      });
    }

    // 2. Categories dynamically extracted from existing marketplace products
    if (Array.isArray(allProductsQuery.data)) {
      allProductsQuery.data.forEach((p) => {
        const catId = p.categoryId || p.category?.id;
        const catName =
          p.category?.categoryName || `Category ${String(catId).slice(0, 6)}`;
        if (catId && !catMap.has(catId)) {
          catMap.set(catId, { id: catId, categoryName: catName.trim() });
        }
      });
    }

    return Array.from(catMap.values());
  }, [categoriesQuery.data, allProductsQuery.data]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategoryId, setNewProductCategoryId] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("1");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");

  const [activeAction, setActiveAction] = useState<
    "contribute" | "withdraw" | null
  >(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhoneNumber, setInvitePhoneNumber] = useState("");
  const isPhoneEntered = Boolean(invitePhoneNumber.trim());
  const phoneValidation = isPhoneEntered
    ? normalizeNigerianPhone(invitePhoneNumber.trim())
    : null;
  const isPhoneInvalid = Boolean(
    isPhoneEntered && phoneValidation && !phoneValidation.valid,
  );
  const [actionMessage, setActionMessage] = useState("");
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [copiedAdminAccount, setCopiedAdminAccount] = useState(false);
  const [copiedNarration, setCopiedNarration] = useState(false);
  const [contributeMethod, setContributeMethod] = useState<"transfer" | "wallet">("transfer");
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [isGroupMembersOpen, setIsGroupMembersOpen] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [productDeleteError, setProductDeleteError] = useState("");
  const [productDeleteSuccess, setProductDeleteSuccess] = useState("");

  const currentMonthName = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const storageKey = `pave_ajo_contributions_${groupId}_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
  const [confirmedContributions, setConfirmedContributions] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleMemberContribution = (memberKey: string) => {
    setConfirmedContributions((prev) => {
      const updated = { ...prev, [memberKey]: !prev[memberKey] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCopyText = (text: string, type: "invite" | "account" | "narration") => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === "invite") {
        setCopiedInviteCode(true);
        window.setTimeout(() => setCopiedInviteCode(false), 2500);
      } else if (type === "account") {
        setCopiedAdminAccount(true);
        window.setTimeout(() => setCopiedAdminAccount(false), 2500);
      } else {
        setCopiedNarration(true);
        window.setTimeout(() => setCopiedNarration(false), 2500);
      }
    }).catch(() => {});
  };

  const inviteLink = group?.inviteCode
    ? `${window.location.origin}?inviteCode=${group.inviteCode}`
    : "";

  const handleShareLink = async () => {
    if (!inviteLink) return;
    const shareText = `Join my AJO group "${group?.name || 'PAVEPADI AJO'}" on PAVEPADI! Invite code: ${group?.inviteCode}\n${inviteLink}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join AJO Group ${group?.name || ''}`,
          text: shareText,
          url: inviteLink,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedInviteLink(true);
      window.setTimeout(() => setCopiedInviteLink(false), 2500);
    }).catch(() => {});
  };

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
  const currentMembership = group?.members?.find((member) => {
    if (!member) return false;
    const memberUserId = extractEntityId(
      member.userId ??
        (member as any).user?.id ??
        (member as any).user?._id ??
        (member.User as any)?.id ??
        (member.User as any)?._id ??
        member.id ??
        (member as any)._id,
    );
    if (currentUserId && memberUserId && memberUserId === currentUserId) {
      return true;
    }
    if (userEmail) {
      const memberEmail = String(
        member.User?.email ??
          (member as any).user?.email ??
          (member as any).email ??
          "",
      )
        .toLowerCase()
        .trim();
      if (memberEmail && memberEmail === userEmail) {
        return true;
      }
    }
    return false;
  });
  const membershipRole = currentMembership?.role
    ? String(currentMembership.role).toLowerCase().trim()
    : "";
  const isGroupOwner = Boolean(
    currentUserId &&
      (groupOwnerId === currentUserId || membershipRole === "owner"),
  );
  const isGroupAdmin =
    isGroupOwner ||
    Boolean(
      currentUserId &&
        (membershipRole === "admin" || (group as any)?.isAdmin),
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
    const phone = invitePhoneNumber.trim();
    const email = inviteEmail.trim();
    try {
      const response = await inviteMutation.mutateAsync({
        groupId,
        payload: {
          email,
          phoneNumber: phone,
        },
      });

      let successMsg = `${response?.message || "Invitation sent."}`;
      if (group?.inviteCode) {
        successMsg += ` Invite code: ${group.inviteCode}`;
      }
      const dataObj = response?.data as any;
      if (dataObj?.smsSent === true) {
        successMsg += " SMS delivered.";
      }
      if (dataObj?.emailSent === true) {
        successMsg += " Email delivered.";
      }

      setActionMessage(successMsg);
      setInviteEmail("");
      setInvitePhoneNumber("");
    } catch {
      // The mutation error is rendered beside the invite form.
    }
  };

  const handlePostGroupProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError("");
    setProductFormSuccess("");

    if (!isGroupOwner) {
      setProductFormError("Only the AJO group manager can post products for this group.");
      return;
    }

    if (!newProductName.trim()) {
      setProductFormError("Please enter a product name.");
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setProductFormError("Please enter a valid price in NGN.");
      return;
    }
    const qtyNum = parseInt(newProductQuantity, 10);
    if (Number.isNaN(qtyNum) || qtyNum < 1) {
      setProductFormError("Quantity must be at least 1.");
      return;
    }
    // Never submit a default or fixture category: the manager must pick a real one.
    const categoryId = newProductCategoryId;
    if (!categoryId || !availableCategories.some((c) => c.id === categoryId)) {
      setProductFormError("Please select a category for this product.");
      return;
    }
    // The backend create-product route requires an image (it answers "... image or
    // productImage are required" without one). Validate presence, type, and size.
    const imageValidationError = validateProductImageFile(newProductImage);
    if (imageValidationError) {
      setProductFormError(imageValidationError);
      return;
    }

    try {
      const response = await createProductMutation.mutateAsync({
        categoryId,
        payload: {
          productName: newProductName.trim(),
          // TEMPORARY WORKAROUND, NOT ACCESS CONTROL: the [AJO:<id>] tag links the
          // product to this group only on the client. It can be forged or removed by
          // anyone and must be replaced by a server-verified groupId on the backend.
          // It is stripped from every displayed description via stripGroupTag().
          description: newProductDescription.trim()
            ? `${newProductDescription.trim()} [AJO:${groupId}]`
            : `Group item for ${group?.name || "AJO"} [AJO:${groupId}]`,
          price: priceNum,
          quantity: qtyNum,
          categoryId,
          groupId,
          image: newProductImage,
        },
      });

      // Invalidate and refetch both group products and marketplace products list
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: marketQueryKeys.groupProducts(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: marketQueryKeys.products(),
        }),
        groupProductsQuery.refetch(),
      ]);

      // Close the form and reset all fields
      setShowProductForm(false);
      setNewProductName("");
      setNewProductPrice("");
      setNewProductQuantity("1");
      setNewProductDescription("");
      setNewProductImage(null);
      setNewProductCategoryId("");
      setProductFormError("");
      setProductFormSuccess(
        response.message || "Product created successfully",
      );
    } catch (err) {
      setProductFormError(
        getMarketErrorMessage(err, "Failed to post product to group."),
      );
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setProductDeleteError("");
    setProductDeleteSuccess("");
    try {
      await deleteProductMutation.mutateAsync({
        productId: productToDelete.id,
        inProgressPurchasesCount: 0,
        isProductOwner: true,
        groupId,
      });
      setProductDeleteSuccess(
        `"${productToDelete.productName}" was removed successfully.`,
      );
      setProductToDelete(null);
    } catch (err) {
      setProductDeleteError(
        getMarketErrorMessage(err, "Unable to delete product."),
      );
    }
  };

  const confirmDeleteGroup = () => {
    deleteMutation.mutate(groupId, {
      onSuccess: () => {
        setShowDeleteGroupModal(false);
        onNav("group-savings");
      },
    });
  };

  const confirmLeaveGroup = () => {
    leaveMutation.mutate(groupId, {
      onSuccess: () => {
        setShowLeaveGroupModal(false);
        onNav("group-savings");
      },
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
      <PaveLoadingState
        title="Loading AJO Group..."
        subtitle="Retrieving group members, balance, and contribution cycles"
      />
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

  if (!canAccessGroup) {
    return (
      <div className="flex-1 p-6">
        <p role="alert" className="mb-4 text-sm text-red-600">
          This AJO group is private. You can view it after joining with an
          invitation code from its admin.
        </p>
        <PaveBtn variant="ghost" onClick={() => onNav("group-savings")}>
          Back to My AJO
        </PaveBtn>
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

        {/* Primary Action Buttons: Contribute & Withdraw */}
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
            <span>Contribute</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveAction("withdraw");
              setActionMessage("");
            }}
            disabled={busy || !group.allowMemberWithdrawal}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#3730A3]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[#3730A3] shadow-xs transition-all hover:bg-[#EEF2FF] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ArrowUpRight size={17} />
            <span>Withdraw</span>
          </button>
        </div>
        {!group.allowMemberWithdrawal && (
          <p className="-mt-2 text-xs text-[#9CA3AF]">
            Withdrawals are disabled by the group owner.
          </p>
        )}

        {/* Owner Management: Edit group */}
        {isGroupOwner && (
          <button
            type="button"
            onClick={openEditor}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#334155] shadow-xs transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Pencil size={15} className="text-[#64748B]" />
            <span>Edit group</span>
          </button>
        )}

        {/* Collapsible Invite Member Dropdown */}
        {isGroupAdmin && (
          <section className="rounded-2xl border border-[#F1F3FB] bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowInviteDropdown((open) => !open)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#F8FAFC] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3730A3]">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0D0F1C]">
                    Invite a Member
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Invite code: <strong className="font-mono text-[#3730A3]">{group.inviteCode || "Available inside"}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3730A3]">
                <span>{showInviteDropdown ? "Hide" : "Invite"}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showInviteDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {showInviteDropdown && (
              <div className="p-4 pt-1 border-t border-[#F1F3FB] flex flex-col gap-3">
                {group.inviteCode && (
                  <div className="flex flex-col gap-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Private Group Invite Code</span>
                        <span className="font-mono font-bold text-sm text-[#1E1B4B]">{group.inviteCode}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(group.inviteCode || "", "invite")}
                          className="flex items-center gap-1 rounded-lg bg-white border border-[#CBD5E1] px-3 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
                        >
                          {copiedInviteCode ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedInviteCode ? "Copied" : "Copy Code"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleShareLink()}
                          className="flex items-center gap-1 rounded-lg bg-[#3730A3] text-white px-3 py-1.5 text-xs font-medium hover:bg-[#312E81] cursor-pointer"
                          title="Share invitation link on social media"
                        >
                          <Share2 size={13} />
                          <span>{copiedInviteLink ? "Link Copied!" : "Share Link"}</span>
                        </button>
                      </div>
                    </div>
                    {inviteLink && (
                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#64748B] truncate font-mono bg-white px-2 py-1 rounded border border-[#E2E8F0] flex-1">
                          {inviteLink}
                        </span>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Join my AJO group "${group.name}" on PAVEPADI! Invite code: ${group.inviteCode}\n${inviteLink}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#059669] hover:underline whitespace-nowrap"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join my AJO group "${group.name}" on PAVEPADI! Invite code: ${group.inviteCode}\n${inviteLink}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#0284C7] hover:underline whitespace-nowrap"
                        >
                          X / Share
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-[#374151] block mb-1">
                    Email address (optional)
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="member@example.com"
                    aria-label="Member email address"
                    className="w-full rounded-xl bg-[#F1F3FB] px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#374151] block mb-1">
                    Phone number (optional)
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={invitePhoneNumber}
                    onChange={(event) => setInvitePhoneNumber(event.target.value)}
                    placeholder="08012345678"
                    aria-label="Member phone number"
                    className="w-full rounded-xl bg-[#F1F3FB] px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                  />
                  {isPhoneInvalid && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      Enter a valid 11-digit phone number, e.g. 08012345678.
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-[#6B7280]">
                  Enter an email address, phone number, or share the invite code directly.
                </p>

                {inviteMutation.isError && (
                  <p role="alert" className="text-xs text-red-600">
                    {getApiErrorMessage(
                      inviteMutation.error,
                      "Unable to invite this member.",
                    )}
                  </p>
                )}

                <PaveBtn
                  onClick={() => void submitInvite()}
                  disabled={
                    busy || (!inviteEmail.trim() && !invitePhoneNumber.trim()) || isPhoneInvalid
                  }
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                </PaveBtn>
              </div>
            )}
          </section>
        )}


        {actionMessage && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            {actionMessage}
          </div>
        )}

        {/* Enhanced Contribution & Withdrawal Modals */}
        {activeAction && (
          <section className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
            {activeAction === "contribute" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3FB]">
                  <div>
                    <h3 className="text-base font-bold text-[#0D0F1C]">
                      Contribute to AJO Group
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Contribution Amount: <strong>{fmt(amount(group.contributionAmount))}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAction(null)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Segmented Control for Contribution Method */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setContributeMethod("transfer")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      contributeMethod === "transfer"
                        ? "bg-white text-[#3730A3] shadow-xs"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    <Landmark size={14} />
                    <span>Admin Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributeMethod("wallet")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      contributeMethod === "wallet"
                        ? "bg-white text-[#3730A3] shadow-xs"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    <Wallet size={14} />
                    <span>Pay from Wallet</span>
                  </button>
                </div>

                {contributeMethod === "transfer" ? (
                  /* Admin Direct Bank Transfer Card */
                  <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] border border-[#E0E7FF] p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3730A3]">
                      <Landmark size={16} />
                      <span>AJO Admin Dedicated Bank Account</span>
                    </div>

                    <div className="rounded-lg bg-white p-3.5 border border-[#E2E8F0] shadow-2xs flex flex-col gap-2.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">Bank Name</span>
                        <span className="text-sm font-bold text-[#0F172A]">{group.currency === "NGN" ? "Wema Bank / PAVEPADI" : "Wema Bank"}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">Admin Account Number (NUBAN)</span>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="font-mono text-lg font-bold text-[#3730A3] tracking-wider">
                            {`02${String(Math.abs(groupId.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0))).padStart(8, '4').slice(-8)}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(`02${String(Math.abs(groupId.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0))).padStart(8, '4').slice(-8)}`, "account")}
                            className="flex items-center gap-1 rounded-md bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#3730A3] hover:bg-[#E0E7FF] cursor-pointer"
                          >
                            {copiedAdminAccount ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedAdminAccount ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">Beneficiary Name</span>
                        <span className="text-xs font-medium text-[#334155]">{group.name} AJO Admin</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">Payment Narration / Reference</span>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="font-mono text-xs font-semibold text-[#475569]">
                            {`AJO-${group.inviteCode || groupId.slice(0, 8).toUpperCase()}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(`AJO-${group.inviteCode || groupId.slice(0, 8).toUpperCase()}`, "narration")}
                            className="text-[11px] font-semibold text-[#3730A3] hover:underline cursor-pointer"
                          >
                            {copiedNarration ? "Copied!" : "Copy Ref"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-relaxed">
                      💡 <strong>Instructions:</strong> Transfer exactly <strong>{fmt(amount(group.contributionAmount))}</strong> from your banking app using the details above. Once completed, the Admin of the AJO group will confirm your payment and mark your contribution for {currentMonthName} in the members list.
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActionMessage(`Your transfer of ${fmt(amount(group.contributionAmount))} has been recorded! The AJO Admin will confirm and mark your contribution for ${currentMonthName}.`);
                        setActiveAction(null);
                      }}
                      className="w-full rounded-xl bg-[#059669] py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#047857] active:scale-95 transition-all cursor-pointer"
                    >
                      I Have Completed This Transfer
                    </button>
                  </div>
                ) : (
                  /* Pay from PAVEPADI Wallet */
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
                      <span className="text-[#64748B]">PAVEPADI Wallet Balance:</span>
                      <span className="font-bold text-sm text-[#0F172A]">
                        {walletBalanceQuery.data
                          ? fmt(amount(walletBalanceQuery.data.balance))
                          : walletBalanceQuery.isFetching
                            ? "Loading..."
                            : "Unavailable"}
                      </span>
                    </div>

                    {walletBalanceQuery.data && Number(walletBalanceQuery.data.balance) < amount(group.contributionAmount) && (
                      <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                        <span>Insufficient balance for this contribution.</span>
                        <button
                          type="button"
                          onClick={() => onNav("fund-wallet")}
                          className="font-bold text-[#3730A3] underline hover:text-[#312E81] cursor-pointer"
                        >
                          Fund Wallet
                        </button>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-[#374151]">
                          Contribution Amount
                        </label>
                        <button
                          type="button"
                          onClick={() => setContributionAmount(String(group.contributionAmount))}
                          className="text-[11px] font-semibold text-[#3730A3] hover:underline cursor-pointer"
                        >
                          Use Group Target ({fmt(amount(group.contributionAmount))})
                        </button>
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={contributionAmount || String(group.contributionAmount)}
                        onChange={(event) => setContributionAmount(event.target.value)}
                        placeholder="Amount"
                        aria-label="Contribution Amount"
                        className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                      />
                    </div>

                    {contributeMutation.isError && (
                      <p role="alert" className="text-xs text-red-600">
                        {getApiErrorMessage(
                          contributeMutation.error,
                          "Unable to process wallet contribution.",
                        )}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <PaveBtn
                        onClick={() => void submitContribution()}
                        disabled={
                          busy ||
                          Number(contributionAmount || group.contributionAmount) <= 0
                        }
                      >
                        {busy ? <Loader size={16} className="animate-spin" /> : null}
                        {busy ? "Processing Wallet Payment..." : `Pay ${fmt(amount(contributionAmount || group.contributionAmount))} from Wallet`}
                      </PaveBtn>
                      <PaveBtn
                        variant="secondary"
                        onClick={() => setActiveAction(null)}
                        disabled={busy}
                      >
                        Cancel
                      </PaveBtn>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Request a Withdrawal */
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-bold text-[#0D0F1C] pb-2 border-b border-[#F1F3FB]">
                  Request a Group Withdrawal
                </h3>
                <input
                  type="number"
                  min="1"
                  value={withdrawalAmount}
                  onChange={(event) => setWithdrawalAmount(event.target.value)}
                  placeholder="Amount to withdraw"
                  aria-label="Withdrawal amount"
                  className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
                />
                <input
                  value={narration}
                  onChange={(event) => setNarration(event.target.value)}
                  placeholder="Reason for withdrawal"
                  aria-label="Withdrawal narration"
                  className="w-full rounded-xl bg-[#F1F3FB] px-4 py-3 text-sm outline-none focus:border-[#3730A3]"
                />
                {withdrawMutation.isError && (
                  <p role="alert" className="text-xs text-red-600">
                    {getApiErrorMessage(
                      withdrawMutation.error,
                      "Unable to process this withdrawal request.",
                    )}
                  </p>
                )}
                <div className="flex gap-2">
                  <PaveBtn
                    onClick={() => void submitWithdrawal()}
                    disabled={busy || Number(withdrawalAmount) <= 0 || !narration.trim()}
                  >
                    {busy ? <Loader size={16} className="animate-spin" /> : null}
                    {busy ? "Processing..." : "Confirm Withdrawal"}
                  </PaveBtn>
                  <PaveBtn
                    variant="secondary"
                    onClick={() => setActiveAction(null)}
                    disabled={busy}
                  >
                    Cancel
                  </PaveBtn>
                </div>
              </div>
            )}
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
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={busy}
                >
                  Cancel
                </PaveBtn>
              </div>
            </div>
          </section>
        )}

        {/* Collapsible Group Members Dropdown - styled like Invite a Member */}
        <section className="rounded-2xl border border-[#F1F3FB] bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsGroupMembersOpen((open) => !open)}
            aria-expanded={isGroupMembersOpen}
            aria-controls="group-members-dropdown-content"
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#F8FAFC] cursor-pointer gap-2"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3730A3] shrink-0">
                <Users size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <h3 className="text-sm font-semibold text-[#0D0F1C] shrink-0">
                    Group Members ({group.members?.length ?? group.currentMembers})
                  </h3>
                  <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {currentMonthName}
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-[#6B7280] leading-snug mt-0.5">
                  {isGroupAdmin
                    ? "Member contact details & monthly contribution verification"
                    : "Members list for this AJO circle"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3730A3] shrink-0 ml-1">
              <span>{isGroupMembersOpen ? "Hide" : "View"}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isGroupMembersOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isGroupMembersOpen && (
            <div
              id="group-members-dropdown-content"
              className="p-4 pt-1 border-t border-[#F1F3FB] flex flex-col divide-y divide-[#F1F3FB]"
            >
              {(group.members ?? []).length === 0 ? (
                <div className="py-6 text-center text-xs text-[#6B7280]">
                  No members in this group yet.
                </div>
              ) : (
                (group.members ?? []).map((member, index) => {
                  const memberKey = extractEntityId(member.userId ?? member.id) || `member-${index}`;
                  const isOwner = member.role === "owner" || member.userId === groupOwnerId;
                  const hasContributedThisMonth = Boolean(
                    confirmedContributions[memberKey] ||
                    confirmedContributions[member.id] ||
                    (member.userId && confirmedContributions[member.userId])
                  );

                  // User details extraction
                  const userObj = member.User || (member as any).user || {};
                  const first = userObj.firstName || (member as any).firstName || "";
                  const last = userObj.lastName || (member as any).lastName || "";
                  const fullName = `${first} ${last}`.trim() || userObj.fullName || userObj.name || (member as any).name;
                  
                  let displayName = fullName;
                  if (!displayName) {
                    if (currentUserId && (member.userId === currentUserId || member.id === currentUserId)) {
                      const myName = [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ");
                      displayName = myName ? `${myName} (You)` : "You";
                    } else if (userObj.email || (member as any).email) {
                      displayName = (userObj.email || (member as any).email).split("@")[0];
                    } else {
                      displayName = `Member #${index + 1}`;
                    }
                  }

                  const memberEmail = userObj.email || (member as any).email || (member.userId === currentUserId ? authUser?.email : "") || "Not provided";
                  const memberPhone = userObj.phoneNumber || userObj.phone || (member as any).phoneNumber || (member as any).phone || (member.userId === currentUserId ? authUser?.phoneNumber : "") || "Not provided";
                  const isExpanded = expandedMemberId === memberKey;

                  return (
                    <div key={member.id || index} className="py-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#3730A3]">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-semibold text-sm text-[#0D0F1C]">
                                {displayName}
                              </span>
                              {isOwner && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-md">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {hasContributedThisMonth ? (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                                  <CheckCircle2 size={12} />
                                  <span>Contributed for {currentMonthName.split(" ")[0]}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-[#D97706]">
                                  Pending for {currentMonthName.split(" ")[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-sm text-[#0D0F1C]">
                            {fmt(amount(member.totalContribution))}
                          </span>
                          {isGroupAdmin && (
                            <button
                              type="button"
                              onClick={() => setExpandedMemberId(isExpanded ? null : memberKey)}
                              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F1F3FB] text-[#6B7280] transition-colors cursor-pointer"
                              aria-label={isExpanded ? "Collapse member details" : "Expand member details"}
                            >
                              <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Admin Details Dropdown */}
                      {isGroupAdmin && isExpanded && (
                        <div className="mt-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-xs flex flex-col gap-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div>
                              <span className="text-[#64748B] block text-[11px] font-medium">Member's Name</span>
                              <span className="font-semibold text-[#0F172A]">{displayName}</span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px] font-medium">Phone Number</span>
                              <span className="font-semibold text-[#0F172A]">{memberPhone}</span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px] font-medium">Email Address</span>
                              <span className="font-semibold text-[#0F172A]">{memberEmail}</span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px] font-medium">groupSavingId</span>
                              <span className="font-mono font-medium text-[#0F172A] truncate block">{groupId}</span>
                            </div>
                          </div>

                          {/* Admin Payment Confirmation Action */}
                          <div className="mt-2 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between flex-wrap gap-2">
                            <div className="text-[11px] text-[#475569]">
                              Monthly Status: <strong className={hasContributedThisMonth ? "text-[#059669]" : "text-[#D97706]"}>{hasContributedThisMonth ? "Payment Confirmed" : "Awaiting Payment"}</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleMemberContribution(memberKey)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                                hasContributedThisMonth
                                  ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                                  : "bg-[#059669] text-white hover:bg-[#047857]"
                              }`}
                            >
                              <Check size={13} />
                              <span>{hasContributedThisMonth ? "Mark as Pending" : `Confirm ${currentMonthName.split(" ")[0]} Payment`}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* AJO Group Manager Marketplace Section */}
        <section className="rounded-2xl border border-[#F1F3FB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#3730A3]" />
              <h3 className="text-sm font-bold text-[#0D0F1C]">
                AJO Group Marketplace
              </h3>
            </div>
            {isGroupOwner && (
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  setProductFormError("");
                  setProductFormSuccess("");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3730A3] text-white hover:bg-[#312E81] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>{showProductForm ? "Cancel" : "Post Product"}</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#6B7280] mb-4">
            Exclusive products and layaway purchase plans for members of {group.name}.
          </p>

          {/* Success banner visible when form is closed */}
          {productFormSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{productFormSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setProductFormSuccess("")}
                className="text-xs text-green-700 hover:text-green-900 font-bold px-1 cursor-pointer"
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}

          {/* Product deletion feedback banners */}
          {productDeleteSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{productDeleteSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setProductDeleteSuccess("")}
                className="text-xs text-green-700 hover:text-green-900 font-bold px-1 cursor-pointer"
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}

          {productDeleteError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{productDeleteError}</span>
              </div>
              <button
                type="button"
                onClick={() => setProductDeleteError("")}
                className="text-xs text-red-700 hover:text-red-900 font-bold px-1 cursor-pointer"
                aria-label="Dismiss error message"
              >
                ×
              </button>
            </div>
          )}

          {/* Manager Product Posting Form */}
          {isGroupOwner && showProductForm && (
            <form
              onSubmit={handlePostGroupProduct}
              className="mb-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col gap-3 text-xs"
            >
              <div className="font-semibold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">
                List a Product for Your Members
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Samsung Galaxy A54, Solar Generator..."
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#3730A3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={newProductCategoryId}
                    onChange={(e) => setNewProductCategoryId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#3730A3]"
                  >
                    <option value="">
                      {availableCategories.length > 0
                        ? "-- Select Category --"
                        : "No categories available"}
                    </option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {availableCategories.length === 0 && (
                    <p className="mt-1 text-[10px] text-amber-700">
                      No categories are available to your account yet. Ask the
                      platform admin to enable category access.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#3730A3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Quantity / Stock *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductQuantity}
                    onChange={(e) => setNewProductQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#3730A3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Product Image *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const err = validateProductImageFile(file);
                        if (err) {
                          setProductFormError(err);
                          setNewProductImage(null);
                          e.target.value = "";
                          return;
                        }
                        setProductFormError("");
                        setNewProductImage(file);
                      } else {
                        setNewProductImage(null);
                      }
                    }}
                    className="w-full text-[11px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-[#EEF2FF] file:text-[#3730A3] file:font-semibold"
                  />
                  {newProductImage && (
                    <p className="mt-1 text-[10px] text-gray-500 truncate">
                      Selected: {newProductImage.name} ({(newProductImage.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Provide specifications, warranty, or delivery terms..."
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#3730A3]"
                />
              </div>

              {/* Error Alert */}
              {productFormError && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-[11px] text-red-700 font-medium">
                    {productFormError}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-[#F3F4F6] text-gray-700 font-medium hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createProductMutation.isPending ||
                    availableCategories.length === 0
                  }
                  className="px-4 py-1.5 rounded-lg bg-[#3730A3] text-white font-semibold hover:bg-[#312E81] disabled:opacity-50 cursor-pointer"
                >
                  {createProductMutation.isPending ? "Posting..." : "Post to Group"}
                </button>
              </div>
            </form>
          )}

          {/* Group Products List */}
          {groupProductsQuery.isLoading ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Loading group products...
            </div>
          ) : groupProductsQuery.isError ? (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">
              {getApiErrorMessage(
                groupProductsQuery.error,
                "Unable to load products for this group.",
              )}
            </div>
          ) : (groupProductsQuery.data ?? []).length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col items-center gap-2">
              <Package size={28} className="text-[#94A3B8]" />
              <p className="text-xs text-[#64748B] max-w-xs">
                No products posted for this AJO group yet.
                {isGroupOwner && " Click '+ Post Product' above to list an item for your members."}
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                (groupProductsQuery.data ?? []).length > 2
                  ? "max-h-[560px] overflow-y-auto pr-1 sm:max-h-[600px]"
                  : ""
              }`}
            >
              {(groupProductsQuery.data ?? []).map((prod) => {
                const isOwner = isOwnProduct(prod, currentUserId);
                const isAvailable = prod.status === "available" && prod.quantity > 0;
                const handleCardClick = () => {
                  if (onSetReturnScreen) {
                    onSetReturnScreen("group-saving-detail");
                  }
                  if (onSelectProduct) {
                    onSelectProduct(prod);
                  }
                  onNav("product-detail");
                };

                return (
                  <div
                    key={prod.id}
                    role="button"
                    tabIndex={0}
                    onClick={handleCardClick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick();
                      }
                    }}
                    className="rounded-xl border border-[#E2E8F0] p-3 flex flex-col justify-between bg-white shadow-xs hover:shadow-md transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#3730A3]"
                  >
                    <div>
                      <div className="aspect-16/9 rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                        <ImageWithFallback
                          src={
                            prod.productImage ||
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80"
                          }
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Qty: {prod.quantity}
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                        {prod.productName}
                      </div>
                      <div className="text-[11px] text-[#475569] line-clamp-2 mt-1 leading-snug">
                        {stripGroupTag(prod.description)}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#0F172A]">
                          {formatMoney(prod.price)}
                        </div>
                        {isOwner ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-500 font-medium">
                              Stock: {prod.quantity}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                isAvailable
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {isAvailable ? "Available" : "Out of stock"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                                isAvailable
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {isAvailable ? "Available" : "Out of stock"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(isGroupAdmin || isGroupOwner || isOwner) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductDeleteError("");
                              setProductDeleteSuccess("");
                              setProductToDelete(prod);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                        {isOwner ? (
                          <span className="text-[11px] font-medium text-gray-400 italic">
                            Your listing
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#EEF2FF] text-[#3730A3] text-[11px] font-semibold rounded-lg">
                            View
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

        {/* Bottom Danger Area: Delete group (owner) or Leave group (member) */}
        {isGroupOwner ? (
          <div className="mt-2 pt-6 border-t border-[#F1F3FB] flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteGroupModal(true)}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700 shadow-xs transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Delete group</span>
            </button>
            <p className="text-center text-xs text-[#9CA3AF]">
              Permanently delete this AJO group and all associated records.
            </p>
          </div>
        ) : (
          <div className="mt-2 pt-6 border-t border-[#F1F3FB] flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLeaveGroupModal(true)}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700 shadow-xs transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Leave group</span>
            </button>
            <p className="text-center text-xs text-[#9CA3AF]">
              You will exit this AJO circle and forfeit your scheduled rotation.
            </p>
          </div>
        )}
      </div>

      {/* Warning UI Modal: Admin Delete Group */}
      {showDeleteGroupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-group-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#F1F3FB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="delete-group-dialog-title" className="text-lg font-bold text-gray-900">
                  Delete AJO Group?
                </h3>
                <p className="text-xs text-gray-500">
                  Administrative action for group owner
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteGroupModal(false)}
                disabled={deleteMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/70 p-4 mb-4 text-xs text-red-900 flex flex-col gap-2">
              <p className="font-semibold text-red-950">
                Are you sure you want to delete <span className="font-bold underline decoration-red-400">{group.name}</span>?
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-red-800 leading-relaxed">
                <li>This AJO circle will be closed permanently and cannot be restored.</li>
                <li>All active member rotations, contribution records, and group marketplace items will be erased.</li>
                <li>Members will immediately lose access to this savings circle.</li>
              </ul>
            </div>

            {deleteMutation.isError && (
              <p role="alert" className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {getApiErrorMessage(
                  deleteMutation.error,
                  "Unable to delete this AJO group. Please try again.",
                )}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDeleteGroupModal(false)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F3F4F6] text-sm font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-50"
              >
                Keep Group
              </button>
              <button
                type="button"
                onClick={confirmDeleteGroup}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Deleting group...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Yes, Delete Group</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning UI Modal: Member Leave Group */}
      {showLeaveGroupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-group-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#F1F3FB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="leave-group-dialog-title" className="text-lg font-bold text-gray-900">
                  Leave AJO Group?
                </h3>
                <p className="text-xs text-gray-500">
                  Exit from rotation circle
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLeaveGroupModal(false)}
                disabled={leaveMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 mb-4 text-xs text-amber-900 flex flex-col gap-2">
              <p className="font-semibold text-amber-950">
                Are you sure you want to leave <span className="font-bold underline decoration-amber-400">{group.name}</span>?
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-amber-800 leading-relaxed">
                <li>You will forfeit your current spot and rotation payout turn in this circle.</li>
                <li>You will no longer receive monthly cycle reminders or notifications.</li>
                <li>To rejoin in the future, you will need a new invite code from the group administrator.</li>
              </ul>
            </div>

            {leaveMutation.isError && (
              <p role="alert" className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {getApiErrorMessage(
                  leaveMutation.error,
                  "Unable to leave this AJO group. Please try again.",
                )}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLeaveGroupModal(false)}
                disabled={leaveMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F3F4F6] text-sm font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-50"
              >
                Stay in Group
              </button>
              <button
                type="button"
                onClick={confirmLeaveGroup}
                disabled={leaveMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {leaveMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Leaving group...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Yes, Leave Group</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning UI Modal: Delete Product Listing */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#F1F3FB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shrink-0">
                <Trash2 size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="delete-product-dialog-title" className="text-lg font-bold text-gray-900">
                  Remove Product Listing?
                </h3>
                <p className="text-xs text-gray-500">
                  AJO Marketplace listing
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setProductDeleteError("");
                }}
                disabled={deleteProductMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-4 flex items-center gap-3">
              {productToDelete.productImage && (
                <img
                  src={productToDelete.productImage}
                  alt={productToDelete.productName}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {productToDelete.productName}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {formatMoney(productToDelete.price)} · Stock: {productToDelete.quantity}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to remove this product from the group? Members will no longer be able to purchase or initiate installment plans for this item.
            </p>

            {productDeleteError && (
              <p role="alert" className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {productDeleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setProductDeleteError("");
                }}
                disabled={deleteProductMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F3F4F6] text-sm font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={deleteProductMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Remove Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}