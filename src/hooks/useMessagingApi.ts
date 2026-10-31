import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGroupChat,
  getGroupChat,
  getGroupChats,
  updateGroupChat,
  deleteGroupChat,
  sendGroupChatMessage,
  getGroupChatMessages,
  createOneOnOneChat,
  getAllUserChat,
  getOneOnOneChats,
  deleteOneOnOneMessage,
  deleteOneOnOneChat,
  getOneOnOneMessages,
} from "../api/messaging";
import type {
  CreateGroupChatPayload,
  UpdateGroupChatPayload,
  SendGroupMessagePayload,
  OneOnOneChatPayload,
} from "../api/messaging";

export const messagingQueryKeys = {
  all: ["messaging"] as const,
  groupChats: () => [...messagingQueryKeys.all, "groupChats"] as const,
  groupChat: (chatId: string) =>
    [...messagingQueryKeys.all, "groupChat", chatId] as const,
  groupMessages: (groupId: string) =>
    [...messagingQueryKeys.all, "groupMessages", groupId] as const,
  oneOnOneChats: () => [...messagingQueryKeys.all, "oneOnOneChats"] as const,
  oneOnOneMessages: (chatId: string) =>
    [...messagingQueryKeys.all, "oneOnOneMessages", chatId] as const,
  recipients: () => [...messagingQueryKeys.all, "recipients"] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useGroupChatsQuery(enabled = true) {
  return useQuery({
    queryKey: messagingQueryKeys.groupChats(),
    queryFn: getGroupChats,
    enabled,
    staleTime: 1000 * 15,
  });
}

export function useGroupChatQuery(groupId: string, enabled = true) {
  return useQuery({
    queryKey: messagingQueryKeys.groupChat(groupId),
    queryFn: () => getGroupChat(groupId),
    enabled: enabled && Boolean(groupId.trim()),
    staleTime: 1000 * 30,
  });
}

export function useGroupChatMessagesQuery(
  groupId: string,
  options?: { enabled?: boolean; refetchInterval?: number },
) {
  const enabled = (options?.enabled ?? true) && Boolean(groupId.trim());
  return useQuery({
    queryKey: messagingQueryKeys.groupMessages(groupId),
    queryFn: () => getGroupChatMessages(groupId),
    enabled,
    refetchInterval: options?.refetchInterval ?? 6000, // 6s controlled polling when chat is active
    refetchIntervalInBackground: false,
    staleTime: 1000 * 3,
  });
}

export function useOneOnOneChatsQuery(enabled = true) {
  return useQuery({
    queryKey: messagingQueryKeys.oneOnOneChats(),
    queryFn: getOneOnOneChats,
    enabled,
    staleTime: 1000 * 15,
  });
}

export function useOneOnOneMessagesQuery(
  chatId: string,
  options?: { enabled?: boolean; refetchInterval?: number },
) {
  const enabled = (options?.enabled ?? true) && Boolean(chatId.trim());
  return useQuery({
    queryKey: messagingQueryKeys.oneOnOneMessages(chatId),
    queryFn: () => getOneOnOneMessages(chatId),
    enabled,
    refetchInterval: options?.refetchInterval ?? 6000, // 6s controlled polling when chat is active
    refetchIntervalInBackground: false,
    staleTime: 1000 * 3,
  });
}

export function useChatRecipientsQuery(enabled = true) {
  return useQuery({
    queryKey: messagingQueryKeys.recipients(),
    queryFn: getAllUserChat,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateGroupChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupChatPayload) => createGroupChat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingQueryKeys.groupChats() });
    },
  });
}

export function useUpdateGroupChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: UpdateGroupChatPayload;
    }) => updateGroupChat(groupId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.groupChat(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.groupChats(),
      });
    },
  });
}

export function useDeleteGroupChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => deleteGroupChat(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingQueryKeys.groupChats() });
    },
  });
}

export function useSendGroupChatMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: SendGroupMessagePayload;
    }) => sendGroupChatMessage(groupId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.groupMessages(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.groupChats(),
      });
    },
  });
}

export function useCreateOrSendOneOnOneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OneOnOneChatPayload) => createOneOnOneChat(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.oneOnOneChats(),
      });
      const chatId = data?.data?.chat?.id;
      if (chatId) {
        queryClient.invalidateQueries({
          queryKey: messagingQueryKeys.oneOnOneMessages(chatId),
        });
      }
    },
  });
}

export function useDeleteOneOnOneMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      chatId: _chatId,
    }: {
      messageId: string;
      chatId?: string;
    }) => deleteOneOnOneMessage(messageId),
    onSuccess: (_data, variables) => {
      if (variables.chatId) {
        queryClient.invalidateQueries({
          queryKey: messagingQueryKeys.oneOnOneMessages(variables.chatId),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: messagingQueryKeys.all,
        });
      }
    },
  });
}

export function useDeleteOneOnOneChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: string) => deleteOneOnOneChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messagingQueryKeys.oneOnOneChats(),
      });
    },
  });
}
