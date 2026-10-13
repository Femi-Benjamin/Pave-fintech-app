import { api } from "../lib/api-client";

export type GroupSavingFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "bi-weekly"
  | "yearly";

export interface GroupSaving {
  id: string;
  userId: string;
  name: string;
  description?: string;
  image?: string;
  targetAmount: number | string;
  contributionAmount: number | string;
  currentBalance: number | string;
  currency: string;
  frequency: GroupSavingFrequency;
  maxMembers: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  inviteCode?: string;
  visibility: "private" | "public";
  allowMemberWithdrawal?: boolean;
  approvalRequired?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface GroupSavingsListResponse {
  success: boolean;
  data: GroupSaving[];
}

export interface GroupSavingMember {
  id: string;
  groupSavingId: string;
  userId: string;
  role: string;
  totalContribution: number | string;
  joinedAt: string;
  status: string;
  User?: { firstName?: string; lastName?: string; email?: string };
}

export interface GroupSavingDetail extends GroupSaving {
  members: GroupSavingMember[];
}

export interface GroupSavingDetailResponse {
  success: boolean;
  message?: string;
  data: GroupSavingDetail;
}

export interface GroupSavingActionResponse {
  success: boolean;
  message: string;
  data?: GroupSaving | GroupSavingDetail | GroupSavingContribution;
}

export interface GroupSavingContribution {
  id: string;
  groupSavingId: string;
  userId: string;
  amount: number | string;
  paymentMethod: string;
  reference: string;
  status: string;
  createdAt: string;
}

export interface GroupSavingWithdrawal {
  id: string;
  groupSavingId: string;
  userId: string;
  amount: number | string;
  reference: string;
  narration?: string;
  status: string;
  processedAt?: string | null;
  createdAt: string;
  User?: { firstName?: string; lastName?: string; email?: string };
  GroupSaving?: { id: string; name: string };
}

export interface GroupSavingWithdrawalsResponse {
  success: boolean;
  count: number;
  data: GroupSavingWithdrawal[];
}

export interface GroupSavingWithdrawalResponse {
  success: boolean;
  data: GroupSavingWithdrawal;
}

export interface GroupSavingUpdatePayload {
  name?: string;
  description?: string;
  targetAmount?: number;
  contributionAmount?: number;
  currency?: string;
  frequency?: GroupSavingFrequency;
  allowMemberWithdrawal?: boolean;
  maxMembers?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  visibility?: "private" | "public";
  image?: string;
}

export interface GroupSavingContributionPayload {
  paymentMethod: "wallet";
  amount: number;
}

export interface GroupSavingWithdrawalPayload {
  amount: number;
  narration: string;
}

export interface GroupSavingInvitationPayload {
  email?: string;
  phoneNumber?: string;
}

export interface CreateGroupSavingPayload {
  name: string;
  description: string;
  targetAmount: number;
  contributionAmount: number;
  currency: string;
  frequency: GroupSavingFrequency;
  maxMembers: number;
  startDate: string;
  endDate: string;
  visibility: "private" | "public";
  image: string;
}

export async function createGroupSaving(payload: CreateGroupSavingPayload) {
  const { data } = await api.post<GroupSavingActionResponse>(
    "/api/v1/group-saving/create-group-saving",
    payload,
  );
  return ensureGroupSuccess(data, "Unable to create this AJO group.");
}

export async function getGroupSavings() {
  const { data } = await api.get<GroupSavingsListResponse>(
    "/api/v1/group-saving/get-all-groups",
  );
  if (!data.success) {
    throw new Error("Unable to load your AJO groups.");
  }
  return data;
}

function ensureGroupSuccess<T extends { success: boolean; message?: string }>(
  response: T,
  fallback: string,
): T {
  if (!response.success) {
    throw new Error(response.message || fallback);
  }
  return response;
}

export async function getGroupSaving(groupId: string) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.get<GroupSavingDetailResponse>(
    `/api/v1/group-saving/get-group/${encodeURIComponent(groupId)}`,
  );
  return ensureGroupSuccess(data, "Unable to load this AJO group.");
}

export async function updateGroupSaving(
  groupId: string,
  payload: GroupSavingUpdatePayload,
) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.put<GroupSavingActionResponse>(
    `/api/v1/group-saving/update-group/${encodeURIComponent(groupId)}`,
    payload,
  );
  return ensureGroupSuccess(data, "Unable to update this AJO group.");
}

export async function deleteGroupSaving(groupId: string) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.delete<GroupSavingActionResponse>(
    `/api/v1/group-saving/delete-group/${encodeURIComponent(groupId)}`,
  );
  return ensureGroupSuccess(data, "Unable to delete this AJO group.");
}

export async function joinGroupSaving(inviteCode: string) {
  if (!inviteCode.trim()) throw new Error("An invitation code is required.");
  const { data } = await api.post<GroupSavingActionResponse>(
    "/api/v1/group-saving/join-group-saving",
    { inviteCode: inviteCode.trim() },
  );
  return ensureGroupSuccess(data, "Unable to join this AJO group.");
}

export async function contributeToGroupSaving(
  groupId: string,
  payload: GroupSavingContributionPayload,
) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.post<GroupSavingActionResponse>(
    `/api/v1/group-saving/contribute/${encodeURIComponent(groupId)}`,
    payload,
  );
  return ensureGroupSuccess(data, "Unable to contribute to this AJO group.");
}

export async function withdrawFromGroupSaving(
  groupId: string,
  payload: GroupSavingWithdrawalPayload,
) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.post<GroupSavingActionResponse>(
    `/api/v1/group-saving/withdraw-contribute/${encodeURIComponent(groupId)}`,
    payload,
  );
  return ensureGroupSuccess(data, "Unable to withdraw from this AJO group.");
}

export async function getMyGroupWithdrawals() {
  const { data } = await api.get<GroupSavingWithdrawalsResponse>(
    "/api/v1/group-saving/get-my-withdrawals",
  );
  return ensureGroupSuccess(data, "Unable to load your AJO withdrawals.");
}

export async function getGroupWithdrawals(groupId: string) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.get<GroupSavingWithdrawalsResponse>(
    `/api/v1/group-saving/get-group-withdrawals/${encodeURIComponent(groupId)}`,
  );
  return ensureGroupSuccess(data, "Unable to load group withdrawals.");
}

export async function getGroupWithdrawal(withdrawalId: string) {
  if (!withdrawalId.trim()) throw new Error("A withdrawal ID is required.");
  const { data } = await api.get<GroupSavingWithdrawalResponse>(
    `/api/v1/group-saving/get-withdrawal/${encodeURIComponent(withdrawalId)}`,
  );
  if (!data.success) throw new Error("Unable to load this withdrawal.");
  return data.data;
}

export async function leaveGroupSaving(groupId: string) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const { data } = await api.post<GroupSavingActionResponse>(
    `/api/v1/group-saving/leave-group/${encodeURIComponent(groupId)}`,
  );
  return ensureGroupSuccess(data, "Unable to leave this AJO group.");
}

export async function inviteMemberToGroup(
  groupId: string,
  payload: GroupSavingInvitationPayload,
) {
  if (!groupId.trim()) throw new Error("A group ID is required.");
  const email = payload.email?.trim();
  const phoneNumber = payload.phoneNumber?.trim();
  if (!email && !phoneNumber) {
    throw new Error("Enter an email address or phone number to invite.");
  }
  const { data } = await api.post<GroupSavingActionResponse>(
    "/api/v1/group-saving/invite-member",
    {
      groupSavingId: groupId,
      ...(email ? { email } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
    },
  );
  return ensureGroupSuccess(data, "Unable to invite this member.");
}
