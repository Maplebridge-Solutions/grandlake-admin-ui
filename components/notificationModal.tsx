"use client";

import {
  X,
  Bell,
  ShieldAlert,
  Key,
  RefreshCcw,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { NotificationsModalProps } from "@/lib/types/notifications";

const notifications = [
  {
    id: "1",
    type: "Failed Login",
    description:
      "Multiple failed login attempts detected for Admin account: Mark Lee.",
    time: "Today, 09:21am",
    icon: ShieldAlert,
    iconBg: "bg-red-50 text-red-500",
  },
  {
    id: "2",
    type: "New Device",
    description:
      "A new device logged into the Super Admin portal from London, UK.",
    time: "Today, 09:21am",
    icon: Bell,
    iconBg: "bg-blue-50 text-blue-500",
  },
  {
    id: "3",
    type: "Permission Change",
    description:
      "Your access level was updated to Super Admin by Sarah Jenkins.",
    time: "Today, 09:21am",
    icon: Key,
    iconBg: "bg-orange-50 text-orange-500",
  },
  {
    id: "4",
    type: "Password Update",
    description: "System password for Support Staff was successfully changed.",
    time: "Today, 09:21am",
    icon: RefreshCcw,
    iconBg: "bg-green-50 text-green-500",
  },
  {
    id: "5",
    type: "Large Refund",
    description:
      "A high-value refund ($150.00) is pending approval for Ticket #TK-882.",
    time: "Today, 09:21am",
    icon: CreditCard,
    iconBg: "bg-purple-50 text-purple-500",
  },
  {
    id: "6",
    type: "Chargeback Alert",
    description:
      "A payment for Ticket #TK-104 was disputed by the bank (Chargeback).",
    time: "Today, 09:21am",
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-red-500",
  },
];

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to close on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown panel */}
      <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-surface-subtle z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-content-primary">
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={18} className="text-content-muted" />
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 bg-surface-page border border-surface-subtle rounded-xl flex gap-3 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    notification.iconBg,
                  )}
                >
                  <notification.icon size={18} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-content-primary leading-tight">
                    {notification.type}:{" "}
                    <span className="font-medium text-content-muted">
                      {notification.description}
                    </span>
                  </p>
                  <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
