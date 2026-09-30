import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  forgotPassword,
  getProfile,
  getUserAccountDetails,
  deleteUserAccount,
  loginWithFinger,
  resetPassword,
  updateProfile,
  uploadNinImage,
  uploadUserImage,
  verifyMfaToken,
  verifyNin,
  verifySecurityAnswer,
} from "../api/auth";
import type {
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyMfaTokenPayload,
  VerifyNinPayload,
  VerifySecurityAnswerPayload,
} from "../api/auth";
import type { ProfileResponse } from "../api/auth";
import { getDedicationVirtualAccount } from "../api/transactions";
import {
  fundWallet,
  getAllTransactions,
  getTransactionById,
  getWalletBalance,
  postTransferWebhook,
  searchUserTransactions,
} from "../api/transactions";
import type {
  FundingWalletPayload,
  TransferWebhookPayload,
  UserTransactionSearchParams,
} from "../api/transactions";

export const transactionQueryKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionQueryKeys.all, "list"] as const,
  detail: (transactionId: string) =>
    [...transactionQueryKeys.all, "detail", transactionId] as const,
  search: (params: UserTransactionSearchParams) =>
    [...transactionQueryKeys.all, "search", params] as const,
  walletBalance: ["walletBalance"] as const,
  dedicationVirtualAccount: ["dedicationVirtualAccount"] as const,
};

export function useUploadUserImageMutation() {
  return useMutation({ mutationFn: uploadUserImage });
}

export function useUploadNinImageMutation() {
  return useMutation({ mutationFn: uploadNinImage });
}

export function useVerifySecurityAnswerMutation() {
  return useMutation({
    mutationFn: (payload: VerifySecurityAnswerPayload) =>
      verifySecurityAnswer(payload),
  });
}

export function useVerifyMfaTokenMutation() {
  return useMutation({
    mutationFn: (payload: VerifyMfaTokenPayload) => verifyMfaToken(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
}

export function useLoginWithFingerMutation() {
  return useMutation({ mutationFn: loginWithFinger });
}

export function useVerifyNinMutation() {
  return useMutation({
    mutationFn: (payload: VerifyNinPayload) => verifyNin(payload),
  });
}

export function useProfileQuery(email: string, enabled = true) {
  return useQuery({
    queryKey: ["profile", email],
    queryFn: () => getProfile(email),
    enabled: enabled && Boolean(email),
  });
}

export function useUpdateProfileMutation(email: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (response: ProfileResponse) => {
      if (response.user) {
        queryClient.setQueryData(["profile", email], response);
      }
      void queryClient.invalidateQueries({ queryKey: ["profile", email] });
    },
  });
}

export function useDeleteUserAccountMutation() {
  return useMutation({ mutationFn: deleteUserAccount });
}

export function useUserAccountDetailsQuery(enabled = true) {
  return useQuery({
    queryKey: ["userAccountDetails"],
    queryFn: getUserAccountDetails,
    enabled,
  });
}

export function useDedicationVirtualAccountQuery(enabled = true) {
  return useQuery({
    queryKey: transactionQueryKeys.dedicationVirtualAccount,
    queryFn: getDedicationVirtualAccount,
    enabled,
  });
}

export function useFundWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FundingWalletPayload) => fundWallet(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.list() }),
  });
}

export function useWalletBalanceQuery(enabled = true) {
  return useQuery({
    queryKey: transactionQueryKeys.walletBalance,
    queryFn: getWalletBalance,
    enabled,
  });
}

export function useTransferWebhookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransferWebhookPayload) =>
      postTransferWebhook(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletBalance,
        }),
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.list(),
        }),
      ]);
    },
  });
}

export function useAllTransactionsQuery(enabled = true) {
  return useQuery({
    queryKey: transactionQueryKeys.list(),
    queryFn: getAllTransactions,
    enabled,
  });
}

export function useTransactionByIdQuery(
  transactionId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: transactionQueryKeys.detail(transactionId),
    queryFn: () => getTransactionById(transactionId),
    enabled: enabled && Boolean(transactionId.trim()),
  });
}

export function useSearchUserTransactionsQuery(
  params: UserTransactionSearchParams,
  enabled = true,
) {
  return useQuery({
    queryKey: transactionQueryKeys.search(params),
    queryFn: () => searchUserTransactions(params),
    enabled,
  });
}
