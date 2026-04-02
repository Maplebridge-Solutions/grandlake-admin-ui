"use client";

import { X, User } from "lucide-react";

import type { PermissionsDetailModalProps } from "@/lib/types/permissions";

export default function PermissionsDetailModal({
  isOpen,
  onClose,
  title,
  description,
  admins,
}: PermissionsDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <p className="text-sm font-medium text-content-muted leading-relaxed">
            {description}
          </p>

          <div className="space-y-3">
            {admins.map((admin, idx) => (
              <div
                key={idx}
                className="p-4 bg-surface-page border border-surface-subtle rounded-2xl flex items-center gap-4 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-content-primary">
                    {admin.name}
                  </p>
                  <p className="text-xs font-medium text-content-muted">
                    {admin.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
