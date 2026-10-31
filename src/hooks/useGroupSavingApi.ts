import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  contributeToGroupSaving,
  createGroupSaving,
  deleteGroupSaving,
  getCombinedGroupSavings,
  getGroupSaving,
  getGroupSavings,
  getGroupWithdrawal,
  getGroupWithdrawals,
  getJoinedGroupSavings,
  getMyGroupWithdrawals,
  inviteMemberToGroup,
  joinGroupSaving,
  leaveGroupSaving,
  mergeGroupSavings,
  updateGroupSaving,
  withdrawFromGroupSaving,
} from "../api/groupSaving";
import type {
  CreateGroupSavingPayload,
  GroupSavingInvitationPayload,
  GroupSavingContributionPayload,
  GroupSavingUpdatePayload,
  GroupSavingWithdrawalPayload,
} from "../api/groupSaving";

export const groupSavingsQueryKeys = {
  all: ["groupSavings"] as const,
  list: () => [...groupSavingsQueryKeys.all, "list"] as const,
  joined: () => [...groupSavingsQueryKeys.all, "joined"] as const,
  combined: () => [...groupSavingsQueryKeys.all, "combined"] as const,
  detail: (groupId: string) =>
    [...groupSavingsQueryKeys.all, "detail", groupId] as const,
  myWithdrawals: () =>
    [...groupSavingsQueryKeys.all, "myWithdrawals"] as const,
  withdrawal: (withdrawalId: string) =>
    [...groupSavingsQueryKeys.all, "withdrawal", withdrawalId] as const,
  withdrawals: (groupId: string) =>
    [...groupSavingsQueryKeys.detail(groupId), "withdrawals"] as const,
};

export function useGroupSavingsQuery(enabled = true) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.combined(),
    queryFn: getCombinedGroupSavings,
    enabled,
  });
}

export function useJoinedGroupSavingsQuery(enabled = true) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.joined(),
    queryFn: getJoinedGroupSavings,
    enabled,
  });
}

export function useGroupSavingQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.detail(groupId),
    queryFn: () => getGroupSaving(groupId),
    enabled: enabled && Boolean(groupId.trim()),
  });
}

export function useMyGroupWithdrawalsQuery(enabled = true) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.myWithdrawals(),
    queryFn: getMyGroupWithdrawals,
    enabled,
  });
}

export function useGroupWithdrawalsQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.withdrawals(groupId),
    queryFn: () => getGroupWithdrawals(groupId),
    enabled: enabled && Boolean(groupId.trim()),
  });
}

export function useGroupWithdrawalQuery(
  withdrawalId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: groupSavingsQueryKeys.withdrawal(withdrawalId),
    queryFn: () => getGroupWithdrawal(withdrawalId),
    enabled: enabled && Boolean(withdrawalId.trim()),
  });
}

export function useCreateGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupSavingPayload) =>
      createGroupSaving(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
  });
}

export function useUpdateGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupSavingUpdatePayload;
    }) => updateGroupSaving(groupId, payload),
    onSuccess: async (_response, { groupId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: groupSavingsQueryKeys.detail(groupId),
        }),
      ]);
    },
  });
}

export function useDeleteGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupSaving,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
  });
}

export function useJoinGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinGroupSaving,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
        queryClient.refetchQueries({
          queryKey: groupSavingsQueryKeys.combined(),
        }),
        queryClient.refetchQueries({
          queryKey: groupSavingsQueryKeys.joined(),
        }),
        queryClient.refetchQueries({
          queryKey: groupSavingsQueryKeys.list(),
        }),
      ]);
    },
  });
}

export function useContributeToGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupSavingContributionPayload;
    }) => contributeToGroupSaving(groupId, payload),
    onSuccess: async (_response, { groupId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: groupSavingsQueryKeys.detail(groupId),
        }),
        queryClient.invalidateQueries({ queryKey: ["walletBalance"] }),
      ]);
    },
  });
}

export function useWithdrawFromGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupSavingWithdrawalPayload;
    }) => withdrawFromGroupSaving(groupId, payload),
    onSuccess: async (_response, { groupId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: groupSavingsQueryKeys.detail(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupSavingsQueryKeys.withdrawals(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupSavingsQueryKeys.myWithdrawals(),
        }),
        queryClient.invalidateQueries({ queryKey: ["walletBalance"] }),
      ]);
    },
  });
}

export function useLeaveGroupSavingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveGroupSaving,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: groupSavingsQueryKeys.all }),
  });
}

export function useInviteMemberToGroupMutation() {
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupSavingInvitationPayload;
    }) => inviteMemberToGroup(groupId, payload),
  });
}
