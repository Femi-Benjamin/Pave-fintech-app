import { normalizeTransactionStatus, type TxStatus } from "./transactionStatus";

/** How often the open transfer screen re-checks a pending transfer. */
export function transferPollInterval(
  status: TxStatus,
  elapsedMs: number,
): number | false {
  if (status !== "pending") return false;
  if (elapsedMs < 60_000) return 3_000;
  if (elapsedMs < 5 * 60_000) return 6_000;
  return 15_000;
}

export interface TransferView {
  variant: "success" | "pending";
  title: string;
  message: string;
  statusLabel: string;
  status: TxStatus;
}

/** Wording for the transfer-details screen from the latest known status. */
export function transferView(status: TxStatus): TransferView {
  if (status === "success") {
    return {
      status,
      variant: "success",
      title: "Transfer successful",
      message: "Your money has been sent to the recipient's bank account.",
      statusLabel: "Successful",
    };
  }
  if (status === "failed") {
    return {
      status,
      variant: "pending",
      title: "Transfer unsuccessful",
      message:
        "This transfer did not go through. Any amount deducted will be returned to your wallet. If it is not back shortly, contact support with the reference below.",
      statusLabel: "Failed",
    };
  }
  return {
    status,
    variant: "pending",
    title: "Transfer initiated",
    message:
      "Your transfer has been submitted and is being confirmed. This page updates by itself, so you can wait here.",
    statusLabel: "Pending",
  };
}

/** Latest status: the live record wins over the initial response. */
export function latestTransferStatus(
  live?: string | null,
  initial?: string | null,
): TxStatus {
  return normalizeTransactionStatus(live || initial);
}
