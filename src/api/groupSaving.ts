import axios from "axios";
import { api } from "../lib/api-client";
import { normalizeNigerianPhone } from "../utils/phone";

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
  members?: GroupSavingMember[];
  isMember?: boolean;
  userRole?: string;
  role?: string;
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

export function extractEntityId(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string" || typeof val === "number") return String(val).trim();
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const id = obj.id ?? obj._id ?? obj.userId ?? obj.user_id;
    if (id) return String(id).trim();
  }
  return "";
}

export function isGroupSavingMember(
  group: Pick<GroupSaving, "userId" | "members"> | null | undefined,
  userId: string,
  userEmail?: string,
): boolean {
  if (!group || (!userId && !userEmail)) return false;
  const normalizedUserId = userId ? String(userId).trim() : "";
  const normalizedEmail = userEmail ? String(userEmail).trim().toLowerCase() : "";

  // 1. Group Owner / Admin Check
  const ownerId = extractEntityId(
    group.userId ??
      (group as any).creatorId ??
      (group as any).createdBy ??
      (group as any).adminId ??
      (group as any).ownerId,
  );
  if (normalizedUserId && ownerId && ownerId === normalizedUserId) {
    return true;
  }

  // 2. Direct membership indicators on the group record
  const raw = group as Record<string, unknown>;
  if (raw.isMember === true || raw.hasJoined === true || raw.isJoined === true) {
    return true;
  }
  const userRole = String(
    raw.userRole || raw.role || raw.membershipRole || "",
  )
    .toLowerCase()
    .trim();
  if (["member", "admin", "owner", "active", "joined"].includes(userRole)) {
    return true;
  }

  // 3. Members list check
  const rawMembers =
    group.members ??
    (raw.memberIds as any) ??
    (raw.participants as any) ??
    (raw.groupMembers as any);

  if (Array.isArray(rawMembers) && rawMembers.length > 0) {
    return rawMembers.some((member) => {
      if (!member) return false;
      const rawStatus =
        typeof member === "object"
          ? String((member as any).status || "").toLowerCase().trim()
          : "";
      if (
        rawStatus &&
        [
          "pending",
          "rejected",
          "declined",
          "removed",
          "inactive",
          "left",
          "cancelled",
        ].includes(rawStatus)
      ) {
        return false;
      }
      const memberUserId =
        typeof member === "string" || typeof member === "number"
          ? String(member).trim()
          : extractEntityId(
              (member as any).userId ??
                (member as any).user ??
                (member as any).User?.id ??
                (member as any).User?._id ??
                (member as any).memberId ??
                (member as any).id ??
                (member as any)._id,
            );
      if (
        normalizedUserId &&
        memberUserId &&
        memberUserId === normalizedUserId
      ) {
        return true;
      }
      if (normalizedEmail && typeof member === "object") {
        const memberEmail = String(
          (member as any).User?.email ??
            (member as any).user?.email ??
            (member as any).email ??
            "",
        )
          .toLowerCase()
          .trim();
        if (memberEmail && memberEmail === normalizedEmail) {
          return true;
        }
      }
      return false;
    });
  }

  return false;
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

export function normalizeGroupSavingsList(response: any): GroupSaving[] {
  if (!response) return [];
  const list =
    response.data?.groupSavings ??
    response.data?.groups ??
    response.data?.savings ??
    response.groupSavings ??
    response.groups ??
    response.savings ??
    response.data ??
    response;

  if (Array.isArray(list)) return list;
  if (list && typeof list === "object" && (list.id || list._id || list.name)) {
    return [list as GroupSaving];
  }
  return [];
}

export async function getGroupSavings(): Promise<GroupSavingsListResponse> {
  const { data } = await api.get<any>(
    "/api/v1/group-saving/get-all-groups",
  );
  if (!data?.success && data?.status !== true && data?.status !== "success") {
    throw new Error(data?.message || "Unable to load your AJO groups.");
  }
  return {
    success: true,
    data: normalizeGroupSavingsList(data),
  };
}

export async function getJoinedGroupSavings(): Promise<GroupSavingsListResponse> {
  const { data } = await api.get<any>(
    "/api/v1/group-saving/get-group-saving",
  );
  if (!data?.success && data?.status !== true && data?.status !== "success") {
    throw new Error(data?.message || "Unable to load joined AJO groups.");
  }
  return {
    success: true,
    data: normalizeGroupSavingsList(data),
  };
}

export function mergeGroupSavings(
  primaryList: GroupSaving[] = [],
  supplementaryList: GroupSaving[] = [],
): GroupSaving[] {
  const map = new Map<string, GroupSaving>();

  for (const group of primaryList) {
    const id = extractEntityId(group.id ?? (group as any)._id);
    if (id) {
      map.set(id, group);
    }
  }

  for (const group of supplementaryList) {
    const id = extractEntityId(group.id ?? (group as any)._id);
    if (!id) continue;
    const existing = map.get(id);
    if (!existing) {
      map.set(id, group);
    } else {
      const existingMembers = Array.isArray(existing.members) ? existing.members : [];
      const newMembers = Array.isArray(group.members) ? group.members : [];
      const mergedMembers =
        newMembers.length > existingMembers.length ? newMembers : existingMembers;
      map.set(id, {
        ...existing,
        ...group,
        members: mergedMembers,
        isMember: Boolean(existing.isMember || group.isMember),
        userRole:
          existing.userRole ||
          group.userRole ||
          (existing as any).role ||
          (group as any).role,
      });
    }
  }

  return Array.from(map.values());
}

export async function getCombinedGroupSavings(): Promise<GroupSavingsListResponse> {
  const [allRes, joinedRes] = await Promise.allSettled([
    getGroupSavings(),
    getJoinedGroupSavings(),
  ]);

  const allGroups = allRes.status === "fulfilled" ? allRes.value.data : [];
  const joinedGroups = joinedRes.status === "fulfilled" ? joinedRes.value.data : [];

  if (allRes.status === "rejected" && joinedRes.status === "rejected") {
    const error = allRes.reason || joinedRes.reason;
    throw new Error(error?.message || "Unable to load your AJO groups.");
  }

  const merged = mergeGroupSavings(allGroups, joinedGroups);
  return {
    success: true,
    data: merged,
  };
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

export interface JoinGroupSavingResult {
  success: boolean;
  message: string;
  alreadyMember?: boolean;
  data?: GroupSaving | GroupSavingDetail | GroupSavingContribution;
}

export function isAlreadyMemberMessage(msg?: string): boolean {
  if (!msg || typeof msg !== "string") return false;
  const lower = msg.toLowerCase().trim();
  return (
    lower.includes("already a member") ||
    lower.includes("already member") ||
    lower.includes("already joined")
  );
}

export async function joinGroupSaving(
  inviteCode: string,
): Promise<JoinGroupSavingResult> {
  const code = inviteCode.trim();
  if (!code) throw new Error("An invitation code is required.");

  try {
    const { data } = await api.post<GroupSavingActionResponse>(
      "/api/v1/group-saving/join-group-saving",
      { inviteCode: code },
    );

    if (!data.success) {
      const msg = data.message || "Unable to join this AJO group.";
      if (isAlreadyMemberMessage(msg)) {
        return {
          success: true,
          message: msg,
          alreadyMember: true,
          data: data.data,
        };
      }
      throw new Error(msg);
    }

    const isAlready = isAlreadyMemberMessage(data.message);
    return {
      success: true,
      message: data.message || "Successfully joined AJO group.",
      alreadyMember: isAlready,
      data: data.data,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as
        | { message?: string; error?: string; data?: any }
        | undefined;
      const message = responseData?.message || responseData?.error;
      if (message && isAlreadyMemberMessage(message)) {
        return {
          success: true,
          message,
          alreadyMember: true,
          data: responseData?.data,
        };
      }
    }
    throw error;
  }
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
  const rawPhone = payload.phoneNumber?.trim();
  if (!email && !rawPhone) {
    throw new Error("Enter an email address or phone number to invite.");
  }
  let phoneNumber: string | undefined;
  if (rawPhone) {
    const normalized = normalizeNigerianPhone(rawPhone);
    if (!normalized.valid) {
      throw new Error("Enter a valid 11-digit phone number, e.g. 08012345678.");
    }
    phoneNumber = normalized.value;
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
