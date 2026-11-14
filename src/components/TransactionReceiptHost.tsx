import { useMemo } from "react";
import { getApiErrorMessage } from "../api/auth";
import { useTransactionByIdQuery, useWalletBalanceQuery } from "../hooks/usePaveApi";
import { reconcileBalances } from "../utils/transactionBalances";
import { ProgressLoader } from "./ProgressLoader";
import { TransactionReceipt } from "./TransactionReceipt";

/**
 * Opens the receipt for one transaction: fetches its details (progress bar
 * while loading), corrects the balance before/after against the live wallet
 * balance, and shows the receipt sheet. Used by every screen that lists
 * transactions so they all behave the same way.
 */
export function TransactionReceiptHost({
  records,
  selectedId,
  onClose,
  reconcile = true,
}: {
  records: Record<string, unknown>[];
  selectedId: string;
  onClose: () => void;
  /** Turn off for partial lists such as search results. */
  reconcile?: boolean;
}) {
  const detailQuery = useTransactionByIdQuery(selectedId, Boolean(selectedId));
  const balanceQuery = useWalletBalanceQuery();

  const corrections = useMemo(
    () =>
      !reconcile || !balanceQuery.data
        ? new Map()
        : reconcileBalances(records, Number(balanceQuery.data.balance)),
    [reconcile, records, balanceQuery.data],
  );

  return (
    <>
      {selectedId && detailQuery.isLoading && (
        <ProgressLoader
          fullPage={false}
          title="Loading transaction details"
          subtitle="Fetching the full receipt"
        />
      )}
      {selectedId && detailQuery.isError && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {getApiErrorMessage(
            detailQuery.error,
            "Unable to load transaction details.",
          )}
        </p>
      )}
      <TransactionReceipt
        record={
          selectedId && detailQuery.data
            ? (detailQuery.data.transaction as unknown as Record<string, unknown>)
            : null
        }
        balanceOverride={corrections.get(selectedId) ?? null}
        onClose={onClose}
      />
    </>
  );
}
