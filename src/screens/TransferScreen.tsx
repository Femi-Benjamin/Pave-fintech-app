import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Landmark,
  Check,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Loader,
  AlertCircle,
  ArrowLeft,
  X,
} from "lucide-react";
import { PaveBtn, ScreenHeader } from "../components/UI";
import { Screen, fmt } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { getAuthenticatedUserId } from "../api/auth";
import { useGroupSavingsQuery } from "../hooks/useGroupSavingApi";
import { useWalletBalanceQuery } from "../hooks/usePaveApi";
import {
  useBankListQuery,
  useVerifyAccountNameMutation,
  useMakeTransferMutation,
} from "../hooks/useTransferApi";
import {
  isAjoAdmin,
  validateAccountNumber,
  validateTransferAmount,
  validateTransferReason,
  getTransferErrorMessage,
  clearVerifiedAccounts,
} from "../api/transfer";
import type { BankItem, AccountVerificationData, TransferTransaction } from "../api/transfer";

export function TransferScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { authUser } = useLocalStore();
  const currentUserId = getAuthenticatedUserId(authUser);

  // Detect whether current user is an AJO admin in any group
  // NOTE: This is UX only; the backend must enforce authorization on transfer endpoints.
  const groupSavingsQuery = useGroupSavingsQuery();
  const userIsAjoAdmin = useMemo(() => {
    if (!currentUserId) return false;
    const groups = groupSavingsQuery.data?.data;
    if (!Array.isArray(groups)) return false;
    return groups.some((g) => isAjoAdmin(g, currentUserId));
  }, [currentUserId, groupSavingsQuery.data]);

  const walletBalanceQuery = useWalletBalanceQuery();
  const walletBalance = Number(walletBalanceQuery.data?.balance ?? 0);

  // Multi-step flow: 1 = Form, 2 = Review, 3 = Initiated / Pending
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Bank selection state
  const { data: banks = [], isLoading: isBanksLoading, isError: isBanksError } = useBankListQuery();
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankItem | null>(null);

  // Account details state
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedAccount, setVerifiedAccount] = useState<AccountVerificationData | null>(null);
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Amount & reason state
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  // Review & execution state
  const [transferError, setTransferError] = useState("");
  const [initiatedTransaction, setInitiatedTransaction] = useState<TransferTransaction | null>(null);

  // API mutations
  const verifyMutation = useVerifyAccountNameMutation();
  const transferMutation = useMakeTransferMutation();

  // Filter banks by search query
  const filteredBanks = useMemo(() => {
    const q = bankSearch.toLowerCase().trim();
    if (!q) return banks;
    return banks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.includes(q) ||
        b.slug.toLowerCase().includes(q),
    );
  }, [banks, bankSearch]);

  // When bank or account number changes, clear previous verification
  const handleBankSelect = (bank: BankItem) => {
    if (selectedBank?.code !== bank.code) {
      setSelectedBank(bank);
      setVerifiedAccount(null);
      setIsNameConfirmed(false);
      setVerifyError("");
      clearVerifiedAccounts();
    }
    setShowBankModal(false);
    setBankSearch("");
  };

  const handleAccountNumberChange = (val: string) => {
    // Only accept numeric input
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    if (cleaned !== accountNumber) {
      setAccountNumber(cleaned);
      setVerifiedAccount(null);
      setIsNameConfirmed(false);
      setVerifyError("");
      clearVerifiedAccounts();
    }
  };

  // Trigger account name verification
  const handleVerifyAccount = async () => {
    setVerifyError("");
    if (!selectedBank) {
      setVerifyError("Please choose a recipient bank.");
      return;
    }
    const accValidation = validateAccountNumber(accountNumber);
    if (!accValidation.valid) {
      setVerifyError(accValidation.error || "Enter a valid 10-digit account number.");
      return;
    }

    try {
      const data = await verifyMutation.mutateAsync({
        accountNumber: accValidation.value!,
        bankCode: selectedBank.code,
      });
      setVerifiedAccount(data);
      setIsNameConfirmed(false);
    } catch (err) {
      setVerifiedAccount(null);
      setIsNameConfirmed(false);
      setVerifyError(
        getTransferErrorMessage(
          err,
          "Unable to verify account details. Please check the bank and account number.",
        ),
      );
    }
  };

  // Validation status for step 1
  const isAccNumberValid = accountNumber.length === 10 && /^\d{10}$/.test(accountNumber);
  const amountValidation = validateTransferAmount(amount, walletBalance);
  const reasonValidation = validateTransferReason(reason);

  const canContinueToReview =
    Boolean(selectedBank) &&
    isAccNumberValid &&
    Boolean(verifiedAccount) &&
    isNameConfirmed &&
    amountValidation.valid &&
    reasonValidation.valid &&
    !verifyMutation.isPending;

  // Submit transfer
  const handleConfirmTransfer = async () => {
    setTransferError("");
    if (!selectedBank || !verifiedAccount) return;

    try {
      const res = await transferMutation.mutateAsync({
        amount: amountValidation.value!,
        accountNumber,
        bankCode: selectedBank.code,
        reason: reasonValidation.value!,
        walletBalance,
      });

      // On success, show initiated state with pending status
      setInitiatedTransaction(res.transaction);
      setStep(3);

      // Explicitly refetch the wallet balance; do not subtract locally as the source of truth
      void walletBalanceQuery.refetch();
    } catch (err) {
      setTransferError(
        getTransferErrorMessage(
          err,
          "Unable to initiate bank transfer. Please try again.",
        ),
      );
    }
  };

  // Reset form to start a new transfer
  const handleReset = () => {
    setStep(1);
    setSelectedBank(null);
    setAccountNumber("");
    setVerifiedAccount(null);
    setIsNameConfirmed(false);
    setAmount("");
    setReason("");
    setVerifyError("");
    setTransferError("");
    setInitiatedTransaction(null);
    clearVerifiedAccounts();
  };

  // Non-admin UX Guard
  if (!groupSavingsQuery.isLoading && !userIsAjoAdmin) {
    return (
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        <ScreenHeader title="Transfer to Bank" onBack={() => onNav("wallet")} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#0D0F1C] mb-2">
            AJO Admin Access Required
          </h2>
          <p className="text-xs text-[#6B7280] max-w-xs mb-6 leading-relaxed">
            Transfer to Bank is exclusively available for AJO group administrators to withdraw money from their PAVEPADI wallet to their verified Nigerian bank accounts.
          </p>
          <PaveBtn onClick={() => onNav("wallet")}>Back to Wallet</PaveBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto">
      <ScreenHeader
        title={
          step === 3
            ? "Transfer Details"
            : step === 2
              ? "Review Transfer"
              : "Transfer to Bank"
        }
        onBack={() => {
          if (step === 2) {
            setStep(1);
          } else {
            onNav("wallet");
          }
        }}
      />

      {/* Step 3: Transfer Initiated (Pending) */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shadow-sm"
          >
            <Clock size={40} />
          </motion.div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
              Pending
            </span>
            <h2
              className="text-2xl font-bold text-[#0D0F1C]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Transfer initiated
            </h2>
            <p className="text-[#6B7280] text-xs mt-1.5 max-w-xs">
              Your bank transfer has been submitted to the bank network and is currently pending final confirmation.
            </p>
          </div>

          <div className="w-full bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs text-xs flex flex-col gap-3 text-left">
            {initiatedTransaction?.reference && (
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Reference</span>
                <span className="font-mono font-semibold text-[#0F172A]">
                  {initiatedTransaction.reference}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Status</span>
              <span className="font-semibold text-amber-700">Pending</span>
            </div>
            <div
              className={`flex justify-between items-center py-1 ${
                initiatedTransaction?.destination
                  ? "border-b border-[#F1F5F9]"
                  : ""
              }`}
            >
              <span className="text-[#64748B]">Amount</span>
              <span className="font-bold text-sm text-[#0F172A]">
                {fmt(Number(initiatedTransaction?.amount || amount))}
              </span>
            </div>
            {initiatedTransaction?.destination && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748B]">Destination</span>
                <span className="font-medium text-[#0F172A] text-right truncate max-w-[180px]">
                  {initiatedTransaction.destination}
                </span>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col gap-2.5 mt-auto">
            <PaveBtn onClick={() => onNav("wallet")}>Back to Wallet</PaveBtn>
            <PaveBtn variant="secondary" onClick={handleReset}>
              Make Another Transfer
            </PaveBtn>
          </div>
        </div>
      )}

      {/* Step 2: Review Screen */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 py-6 gap-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
            Please review the recipient and transfer details carefully. Funds will be deducted directly from your PAVEPADI wallet.
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col gap-3.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Recipient Bank</span>
              <span className="font-semibold text-[#0F172A]">
                {selectedBank?.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Account Name</span>
              <span className="font-bold text-sm text-[#059669]">
                {verifiedAccount?.account_name}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Account Number</span>
              <span className="font-mono font-semibold text-[#0F172A]">
                {accountNumber}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Transfer Amount</span>
              <span className="font-bold text-base text-[#0F172A]">
                {fmt(Number(amount))}
              </span>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Narration / Reason</span>
              <span className="font-medium text-[#0F172A] text-right max-w-[200px]">
                {reason}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px] text-[#64748B]">
              <span>Wallet Balance After</span>
              <span className="font-semibold text-[#0F172A]">
                {fmt(Math.max(0, walletBalance - Number(amount)))}
              </span>
            </div>
          </div>

          {transferError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Transfer failed</p>
                <p className="mt-0.5">{transferError}</p>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2.5 pt-4">
            <PaveBtn
              onClick={() => void handleConfirmTransfer()}
              disabled={transferMutation.isPending}
            >
              {transferMutation.isPending ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                `Confirm & Transfer ${fmt(Number(amount))}`
              )}
            </PaveBtn>
            <PaveBtn
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={transferMutation.isPending}
            >
              Edit Details
            </PaveBtn>
          </div>
        </div>
      )}

      {/* Step 1: Form (Bank, Account, Verify, Amount, Reason) */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 py-5 gap-5">
          {/* Wallet Balance Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#059669] to-[#047857] p-4 text-white shadow-xs">
            <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
              Available Wallet Balance
            </div>
            <div
              className="text-2xl font-bold mt-0.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {walletBalanceQuery.isLoading ? (
                <span className="text-sm font-normal">Loading balance...</span>
              ) : (
                fmt(walletBalance)
              )}
            </div>
          </div>

          {/* 1. Bank Selector */}
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5">
              1. Select Recipient Bank *
            </label>
            <button
              type="button"
              onClick={() => setShowBankModal(true)}
              className="w-full flex items-center justify-between rounded-xl bg-white border border-[#CBD5E1] p-3 text-left hover:border-[#3730A3] transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center shrink-0">
                  <Landmark size={16} />
                </div>
                <span className="text-xs font-medium text-[#0F172A] truncate">
                  {selectedBank ? selectedBank.name : "Choose a Nigerian bank..."}
                </span>
              </div>
              <ChevronDown size={16} className="text-[#64748B] shrink-0" />
            </button>
          </div>

          {/* 2. Account Number & Verify */}
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5">
              2. Account Number *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder="10-digit account number"
                className="flex-1 rounded-xl bg-white border border-[#CBD5E1] px-4 py-2.5 text-sm font-mono text-[#0F172A] outline-none focus:border-[#3730A3] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => void handleVerifyAccount()}
                disabled={
                  !selectedBank ||
                  accountNumber.length !== 10 ||
                  verifyMutation.isPending
                }
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5"
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Verify</span>
                )}
              </button>
            </div>

            {verifyError && (
              <p role="alert" className="text-xs text-red-600 mt-1.5 font-medium">
                {verifyError}
              </p>
            )}

            {/* Verified Account Details Card */}
            {verifiedAccount && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Account Verified</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold">
                    {selectedBank?.name}
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-950 font-mono">
                  {verifiedAccount.account_name}
                </div>

                <label className="flex items-center gap-2 pt-2 border-t border-emerald-200 text-xs text-emerald-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNameConfirmed}
                    onChange={(e) => setIsNameConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                  />
                  <span>I confirm this is the correct recipient name</span>
                </label>
              </motion.div>
            )}
          </div>

          {/* 3. Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#374151]">
                3. Transfer Amount (₦) *
              </label>
              {walletBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(walletBalance))}
                  className="text-[11px] font-semibold text-[#059669] hover:underline cursor-pointer"
                >
                  Use Full Balance ({fmt(walletBalance)})
                </button>
              )}
            </div>
            <input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl bg-white border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#3730A3] shadow-2xs"
            />
            {amount && !amountValidation.valid && (
              <p role="alert" className="text-xs text-red-600 mt-1 font-medium">
                {amountValidation.error}
              </p>
            )}
          </div>

          {/* 4. Reason */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#374151]">
                4. Reason / Narration *
              </label>
              <span className="text-[10px] text-[#64748B]">
                {reason.length}/100
              </span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. AJO group payout to personal account"
              className="w-full rounded-xl bg-white border border-[#CBD5E1] px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#3730A3] shadow-2xs"
            />
          </div>

          {/* Continue Button */}
          <div className="mt-auto pt-3">
            <PaveBtn
              onClick={() => setStep(2)}
              disabled={!canContinueToReview}
            >
              Continue to Review
            </PaveBtn>
          </div>
        </div>
      )}

      {/* Bank Selection Search Modal */}
      <AnimatePresence>
        {showBankModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-label="Select Bank"
          >
            <div className="w-full max-w-md h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#F1F3FB] overflow-hidden">
              <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0D0F1C]">
                    Select Destination Bank
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Choose from {banks.length} supported Nigerian banks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-[#CBD5E1] px-3 py-2 text-xs">
                  <Search size={14} className="text-[#64748B] shrink-0" />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search by bank name or code..."
                    className="flex-1 bg-transparent outline-none text-[#0F172A]"
                    autoFocus
                  />
                  {bankSearch && (
                    <button
                      type="button"
                      onClick={() => setBankSearch("")}
                      className="text-[#94A3B8] hover:text-[#0F172A]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9] p-2">
                {isBanksLoading ? (
                  <div className="flex items-center justify-center p-8 text-xs text-[#64748B] gap-2">
                    <Loader size={16} className="animate-spin text-[#3730A3]" />
                    <span>Loading Nigerian bank list...</span>
                  </div>
                ) : isBanksError ? (
                  <div className="p-6 text-center text-xs text-red-600">
                    Unable to load bank list. Please check your connection.
                  </div>
                ) : filteredBanks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    No banks match "{bankSearch}"
                  </div>
                ) : (
                  filteredBanks.map((b) => (
                    <button
                      key={`${b.code}-${b.id}`}
                      type="button"
                      onClick={() => handleBankSelect(b)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer ${
                        selectedBank?.code === b.code ? "bg-[#EEF2FF] text-[#3730A3]" : ""
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#0F172A]">
                        {b.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        {b.code}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
