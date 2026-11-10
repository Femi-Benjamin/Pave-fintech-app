import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBankList,
  verifyAccountName,
  makeTransfer,
} from "../api/transfer";
import type {
  BankItem,
  AccountVerificationData,
  MakeTransferPayload,
  MakeTransferResponse,
} from "../api/transfer";
import { transactionQueryKeys } from "./usePaveApi";

export const transferQueryKeys = {
  all: ["transfer"] as const,
  bankList: () => [...transferQueryKeys.all, "bankList"] as const,
};

/**
 * Cache bank list for the whole session with a long stale time
 */
export function useBankListQuery(enabled = true) {
  return useQuery<BankItem[]>({
    queryKey: transferQueryKeys.bankList(),
    queryFn: getBankList,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}

/**
 * Verifies account number and bank code via query parameters
 */
export function useVerifyAccountNameMutation() {
  return useMutation<
    AccountVerificationData,
    Error,
    { accountNumber: string; bankCode: string }
  >({
    mutationFn: verifyAccountName,
  });
}

/**
 * Initiates bank transfer and invalidates wallet balance + transactions on success
 */
export function useMakeTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation<MakeTransferResponse, Error, MakeTransferPayload>({
    mutationFn: makeTransfer,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletBalance,
        }),
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.all,
        }),
      ]);
    },
  });
}
