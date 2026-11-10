import { api } from "../lib/api-client";
import { getApiErrorMessage } from "./auth";
import { isAjoAdmin } from "../utils/admin";

export { isAjoAdmin };

export interface BankItem {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode?: string;
  active: boolean;
  supports_transfer: boolean;
  currency?: string;
}

export interface BankListResponse {
  success: boolean;
  data: BankItem[];
}

export interface AccountVerificationData {
  account_number: string;
  account_name: string;
  bank_id?: number | string;
}

export interface VerifyAccountResponse {
  success: boolean;
  message?: string;
  data: AccountVerificationData;
}

export interface TransferTransaction {
  id?: string;
  reference?: string;
  status?: string;
  amount?: number | string;
  transactionFees?: number | string;
  destination?: string;
  currency?: string;
}

export interface MakeTransferPayload {
  amount: number | string;
  accountNumber: string;
  bankCode: string;
  reason: string;
  walletBalance?: number;
}

export interface MakeTransferResponse {
  message: string;
  transaction: TransferTransaction;
}

// In-memory registry of verified bank + account pairs
const verifiedAccounts = new Set<string>();

export function markAccountVerified(bankCode: string, accountNumber: string) {
  verifiedAccounts.add(`${String(bankCode).trim()}:${String(accountNumber).trim()}`);
}

export function isAccountVerified(bankCode: string, accountNumber: string): boolean {
  return verifiedAccounts.has(`${String(bankCode).trim()}:${String(accountNumber).trim()}`);
}

export function clearVerifiedAccounts() {
  verifiedAccounts.clear();
}

/**
 * Validates an account number (digits only, exactly 10 digits)
 */
export function validateAccountNumber(accountNumber: string): {
  valid: boolean;
  error?: string;
  value?: string;
} {
  const val = String(accountNumber ?? "").trim();
  if (!val) {
    return { valid: false, error: "Account number is required." };
  }
  if (!/^\d+$/.test(val)) {
    return { valid: false, error: "Account number must contain digits only." };
  }
  if (val.length !== 10) {
    return { valid: false, error: "Account number must be exactly 10 digits." };
  }
  return { valid: true, value: val };
}

/**
 * Validates transfer amount: number > 0, at most 2 decimal places, <= walletBalance
 */
export function validateTransferAmount(
  amount: number | string,
  walletBalance?: number,
): {
  valid: boolean;
  error?: string;
  value?: string;
} {
  const str = String(amount ?? "").trim();
  if (!str) {
    return { valid: false, error: "Enter a valid amount." };
  }
  const num = Number(str);
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return { valid: false, error: "Enter a valid amount." };
  }
  if (num <= 0) {
    return { valid: false, error: "Amount must be greater than zero." };
  }

  // Check decimal places
  if (str.includes(".")) {
    const decimals = str.split(".")[1];
    if (decimals && decimals.length > 2) {
      return {
        valid: false,
        error: "Amount cannot have more than 2 decimal places.",
      };
    }
  } else if (!Number.isInteger(num)) {
    const dec = num.toString().split(".")[1];
    if (dec && dec.length > 2) {
      return {
        valid: false,
        error: "Amount cannot have more than 2 decimal places.",
      };
    }
  }

  if (
    walletBalance !== undefined &&
    walletBalance !== null &&
    !Number.isNaN(walletBalance)
  ) {
    if (num > walletBalance) {
      return {
        valid: false,
        error: "Amount cannot exceed your wallet balance.",
      };
    }
  }

  return { valid: true, value: str };
}

/**
 * Sanitizes and checks transfer reason
 */
export function validateTransferReason(reason: string): {
  valid: boolean;
  error?: string;
  value?: string;
} {
  const trimmed = String(reason ?? "").trim();
  if (!trimmed) {
    return { valid: false, error: "Reason for transfer is required." };
  }
  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Reason must not exceed 100 characters.",
    };
  }
  return { valid: true, value: trimmed };
}

/**
 * User-safe error extractor for transfer operations
 */
export function getTransferErrorMessage(
  error: unknown,
  fallback = "Unable to process bank transfer. Please try again.",
): string {
  const msg = getApiErrorMessage(error, fallback);
  if (
    msg.length > 200 ||
    /\n|\/var\/|node_modules|TypeError|ReferenceError|SyntaxError|SELECT|INSERT|UPDATE|DELETE|SQL|Sequelize/i.test(
      msg,
    )
  ) {
    return fallback;
  }
  return msg;
}

/**
 * 1. GET /api/v1/transfer/bankList
 * Returns banks where active === true and supports_transfer === true, sorted by name.
 */
export async function getBankList(): Promise<BankItem[]> {
  const { data } = await api.get<BankListResponse>("/api/v1/transfer/bankList");
  const rawList = Array.isArray(data?.data) ? data.data : [];
  return rawList
    .filter((b) => b.active === true && b.supports_transfer === true)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 2. POST /api/v1/transfer/verifyAccountName?accountNumber=<10 digits>&bankCode=<bank.code>
 * No request body; parameters are passed in the query string.
 */
export async function verifyAccountName(params: {
  accountNumber: string;
  bankCode: string;
}): Promise<AccountVerificationData> {
  const accValidation = validateAccountNumber(params.accountNumber);
  if (!accValidation.valid) {
    throw new Error(
      accValidation.error || "Enter a valid 10-digit account number.",
    );
  }
  const cleanBankCode = String(params.bankCode ?? "").trim();
  if (!cleanBankCode) {
    throw new Error("Please select a bank.");
  }

  const { data } = await api.post<VerifyAccountResponse>(
    "/api/v1/transfer/verifyAccountName",
    // Send an empty JSON object, never null: the client sends Content-Type
    // application/json, and the server rejects a literal "null" body
    // (Unexpected token 'n', "null" is not valid JSON).
    {},
    {
      params: {
        accountNumber: accValidation.value,
        bankCode: cleanBankCode,
      },
    },
  );

  if (!data?.success || !data?.data) {
    throw new Error(data?.message || "Unable to verify account details.");
  }

  markAccountVerified(cleanBankCode, accValidation.value!);
  return data.data;
}

/**
 * 3. POST /api/v1/transfer/make-transfer
 * Body: { amount: "<string>", accountNumber: "<10 digits>", bankCode: "<bank.code>", reason: "<text>" }
 * Guarded: requires prior successful verification of bankCode + accountNumber.
 */
export async function makeTransfer(
  payload: MakeTransferPayload,
): Promise<MakeTransferResponse> {
  const accValidation = validateAccountNumber(payload.accountNumber);
  if (!accValidation.valid) {
    throw new Error(
      accValidation.error || "Enter a valid 10-digit account number.",
    );
  }

  const cleanBankCode = String(payload.bankCode ?? "").trim();
  if (!cleanBankCode) {
    throw new Error("Please select a bank.");
  }

  // Verification guard: makeTransfer cannot be called before verification succeeded for this bank + account
  if (!isAccountVerified(cleanBankCode, accValidation.value!)) {
    throw new Error(
      "Account must be verified before initiating transfer.",
    );
  }

  const amtValidation = validateTransferAmount(
    payload.amount,
    payload.walletBalance,
  );
  if (!amtValidation.valid) {
    throw new Error(amtValidation.error || "Enter a valid amount.");
  }

  const reasonValidation = validateTransferReason(payload.reason);
  if (!reasonValidation.valid) {
    throw new Error(reasonValidation.error || "Reason is required.");
  }

  const requestBody = {
    amount: amtValidation.value!,
    accountNumber: accValidation.value!,
    bankCode: cleanBankCode,
    reason: reasonValidation.value!,
  };

  const { data } = await api.post<MakeTransferResponse>(
    "/api/v1/transfer/make-transfer",
    requestBody,
  );

  return {
    message: data?.message || "Transfer initiated successfully",
    transaction: {
      id: data?.transaction?.id,
      status: data?.transaction?.status || "pending",
      reference: data?.transaction?.reference,
      amount: data?.transaction?.amount,
      transactionFees: data?.transaction?.transactionFees,
      destination: data?.transaction?.destination,
      currency: data?.transaction?.currency,
    },
  };
}
