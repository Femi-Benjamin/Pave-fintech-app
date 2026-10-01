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
  searchUserTransactions,
} from "../api/transactions";
import type {
  FundingWalletPayload,
  UserTransactionSearchParams,
} from "../api/transactions";
import {
  createSavingContribution,
  createSaving,
  deleteSaving,
  getSaving,
  getSavings,
  updateSaving,
  withdrawContribution,
} from "../api/savings";
import type {
  CreateSavingPayload,
  SavingContributionPayload,
  UpdateSavingPayload,
} from "../api/savings";

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

export const savingsQueryKeys = {
  all: ["savings"] as const,
  list: () => [...savingsQueryKeys.all, "list"] as const,
  detail: (savingId: string) =>
    [...savingsQueryKeys.all, "detail", savingId] as const,
};

export function useSavingsQuery(enabled = true) {
  return useQuery({
    queryKey: savingsQueryKeys.list(),
    queryFn: getSavings,
    enabled,
  });
}

export function useSavingQuery(savingId: string, enabled = true) {
  return useQuery({
    queryKey: savingsQueryKeys.detail(savingId),
    queryFn: () => getSaving(savingId),
    enabled: enabled && Boolean(savingId.trim()),
  });
}

export function useCreateSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSavingPayload) => createSaving(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: savingsQueryKeys.all }),
  });
}

export function useUpdateSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      savingId,
      payload,
    }: {
      savingId: string;
      payload: UpdateSavingPayload;
    }) => updateSaving(savingId, payload),
    onSuccess: async (_response, { savingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: savingsQueryKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: savingsQueryKeys.detail(savingId),
        }),
      ]);
    },
  });
}

export function useDeleteSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaving,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: savingsQueryKeys.all }),
  });
}

export function useWithdrawContributionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      savingId,
      payload,
    }: {
      savingId: string;
      payload: SavingContributionPayload;
    }) => withdrawContribution(savingId, payload),
    onSuccess: async (_response, { savingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: savingsQueryKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: savingsQueryKeys.detail(savingId),
        }),
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletBalance,
        }),
      ]);
    },
  });
}

export function useCreateSavingContributionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      savingId,
      payload,
    }: {
      savingId: string;
      payload: SavingContributionPayload;
    }) => createSavingContribution(savingId, payload),
    onSuccess: async (_response, { savingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: savingsQueryKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: savingsQueryKeys.detail(savingId),
        }),
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletBalance,
        }),
      ]);
    },
  });
}

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
