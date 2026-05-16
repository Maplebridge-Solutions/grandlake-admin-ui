"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationsModalProps } from "@/lib/types/notifications";
import {
  getMissedNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRecord,
} from "@/lib/api/notifications";
import { useNotificationSocket } from "@/lib/hooks/useNotificationSocket";
import { toast } from "sonner";

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-blue-50 text-blue-500",
  warning: "bg-orange-50 text-orange-500",
  error: "bg-red-50 text-red-500",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function NotificationsModal({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMissedNotifications();
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead).length;
      onUnreadCountChange?.(unread);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [onUnreadCountChange]);

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNotificationSocket(
    useCallback(
      (n: NotificationRecord) => {
        setNotifications((prev) => [n, ...prev]);
        onUnreadCountChange?.((prev) => (typeof prev === "number" ? prev + 1 : 1));
        toast.info(n.title, { description: n.message });
      },
      [onUnreadCountChange],
    ),
  );

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      const unread = notifications.filter((n) => !n.isRead && n._id !== id).length;
      onUnreadCountChange?.(unread);
    } catch {
      // silently fail
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
    } catch {
      toast.error("Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] bg-white rounded-2xl shadow-2xl border border-surface-subtle z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-surface-subtle">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-content-primary">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-brand text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-xs font-semibold text-brand hover:text-brand/80 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <CheckCheck size={14} />
                {markingAll ? "Marking..." : "Mark all read"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={18} className="text-content-muted" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 space-y-2 max-h-[480px] overflow-y-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl flex gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-subtle animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-subtle rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-surface-subtle rounded animate-pulse w-full" />
                  <div className="h-2 bg-surface-subtle rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-page flex items-center justify-center">
                <Bell size={22} className="text-content-muted" />
              </div>
              <p className="text-sm font-semibold text-content-primary">No notifications yet</p>
              <p className="text-xs text-content-muted">You&apos;re all caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={cn(
                  "p-3 rounded-xl flex gap-3 transition-all group cursor-pointer border",
                  n.isRead
                    ? "bg-white border-transparent hover:border-surface-subtle"
                    : "bg-brand-light/30 border-brand/10 hover:bg-brand-light/50",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase",
                    LEVEL_STYLES[n.level] ?? "bg-surface-subtle text-content-muted",
                  )}
                >
                  {n.level[0]}
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-sm font-bold text-content-primary leading-tight">
                    {n.title}
                    {!n.isRead && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-brand align-middle" />
                    )}
                  </p>
                  <p className="text-xs text-content-muted leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
