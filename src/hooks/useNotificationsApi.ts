import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notifications";
import type { NotificationsResult } from "../api/notifications";

export const notificationsQueryKey = ["notifications"] as const;

export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: getUserNotifications,
    enabled,
    staleTime: 1000 * 30,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });
}

function useOptimistic<TVars>(
  mutationFn: (v: TVars) => Promise<void>,
  apply: (old: NotificationsResult, v: TVars) => NotificationsResult,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (vars: TVars) => {
      await qc.cancelQueries({ queryKey: notificationsQueryKey });
      const previous = qc.getQueryData<NotificationsResult>(notificationsQueryKey);
      if (previous) qc.setQueryData(notificationsQueryKey, apply(previous, vars));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(notificationsQueryKey, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}

const recount = (items: NotificationsResult["items"]): NotificationsResult => ({
  items,
  unreadCount: items.filter((n) => !n.isRead).length,
});

export function useMarkNotificationReadMutation() {
  return useOptimistic<string>(markNotificationRead, (old, id) =>
    recount(old.items.map((n) => (n.id === id ? { ...n, isRead: true } : n))),
  );
}

export function useMarkAllNotificationsReadMutation() {
  return useOptimistic<void>(markAllNotificationsRead, (old) =>
    recount(old.items.map((n) => ({ ...n, isRead: true }))),
  );
}

export function useDeleteNotificationMutation() {
  return useOptimistic<string>(deleteNotification, (old, id) =>
    recount(old.items.filter((n) => n.id !== id)),
  );
}

export function useDeleteAllNotificationsMutation() {
  return useOptimistic<void>(deleteAllNotifications, () => recount([]));
}
