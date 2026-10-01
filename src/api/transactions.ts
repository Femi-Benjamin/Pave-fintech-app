import { api } from "../lib/api-client";

const transactionBasePath = "/api/v1/transaction";

export interface TransactionRecord {
  id?: string;
  _id?: string;
  userId?: string;
  amount: number | string;
  reference?: string;
  status?: string;
  type?: string;
  transactionType?: string;
  description?: string;
  destination?: string;
  transactionFees?: number | string;
  vat?: number | string;
  currency?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FundingWalletPayload {
  amount: string;
}

export interface FundingWalletResponse {
  status: string;
  message: string;
  paystackLink: string;
  initializedPay: TransactionRecord;
}

export interface WalletBalanceResponse {
  status: boolean;
  message: string;
  balance: number | string;
}

export interface TransferWebhookPayload {
  event: string;
  data: {
    reference: string;
    [key: string]: unknown;
  };
}

export interface TransferWebhookResponse {
  message: string;
}

export interface DedicationVirtualAccount {
  accountNumber: string;
  accountName: string;
  bankName: string;
}

export interface DedicationVirtualAccountResponse {
  status: string;
  data: DedicationVirtualAccount;
}

export interface TransactionsResponse {
  status: boolean;
  message: string;
  transactions: TransactionRecord[];
}

export interface TransactionByIdResponse {
  status: boolean;
  message: string;
  transaction: TransactionRecord;
}

export interface UserTransactionSearchParams {
  meterNumber?: string;
  amount?: number | string;
  startDate?: string;
  endDate?: string;
}

export interface UserTransactionSearchResponse {
  status: string;
  count: number;
  data: TransactionRecord[];
}

export async function fundWallet(payload: FundingWalletPayload) {
  const { data } = await api.post<FundingWalletResponse>(
    `${transactionBasePath}/initializePayment`,
    payload,
  );
  return data;
}

export async function getWalletBalance() {
  const { data } = await api.get<WalletBalanceResponse>(
    `${transactionBasePath}/getWalletBalance`,
  );
  return data;
}

export async function postTransferWebhook(payload: TransferWebhookPayload) {
  const { data } = await api.post<TransferWebhookResponse>(
    `${transactionBasePath}/transferWebhook`,
    payload,
  );
  return data;
}

export async function getDedicationVirtualAccount() {
  const { data } = await api.get<DedicationVirtualAccountResponse>(
    `${transactionBasePath}/getDedicationVirtualAccount`,
  );
  return data;
}

export async function getAllTransactions() {
  const { data } = await api.get<TransactionsResponse>(
    `${transactionBasePath}/getAllTransactions`,
  );

  if (!data.status) {
    throw new Error(data.message || "Unable to load transactions.");
  }
  if (!Array.isArray(data.transactions)) {
    throw new Error("The transactions response is invalid.");
  }

  return data;
}

export async function getTransactionById(transactionId: string) {
  if (!transactionId.trim()) {
    throw new Error("A transaction ID is required.");
  }

  const { data } = await api.get<TransactionByIdResponse>(
    `${transactionBasePath}/getTransactionById/${encodeURIComponent(transactionId)}`,
  );
  return data;
}

export async function searchUserTransactions(
  params: UserTransactionSearchParams,
) {
  const hasMeterNumber = Boolean(params.meterNumber?.trim());
  const hasAmount = params.amount !== undefined && params.amount !== "";
  const hasStartDate = Boolean(params.startDate?.trim());
  const hasEndDate = Boolean(params.endDate?.trim());

  if (!hasMeterNumber && !hasAmount && !(hasStartDate && hasEndDate)) {
    throw new Error(
      "Search using a meter number, an amount, or both a start and end date.",
    );
  }

  const { data } = await api.get<UserTransactionSearchResponse>(
    `${transactionBasePath}/searchUserTransactions`,
    { params },
  );
  return data;
}
