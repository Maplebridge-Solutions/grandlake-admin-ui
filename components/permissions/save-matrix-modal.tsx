"use client";

import { createPortal } from "react-dom";
import { X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoleMatrixRecord } from "@/lib/types/permissions";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
  operationsAdmin: "Operations Admin",
  supportStaff: "Support Staff",
};

interface Props {
  records: RoleMatrixRecord[];
  saving: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function SaveMatrixModal({ records, saving, onConfirm, onClose }: Props) {
  const changedCount = records.length;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content-primary tracking-tight">
              Save Permission Changes
            </h2>
            <button
              onClick={onClose}
              disabled={saving}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          {/* Summary banner */}
          <div className="flex items-start gap-3 p-4 bg-brand-light border border-brand/20 rounded-2xl">
            <ShieldCheck size={20} className="text-brand mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-brand">
                {changedCount} permission {changedCount === 1 ? "row" : "rows"} will be updated
              </p>
              <p className="text-xs text-brand/70 mt-0.5">
                Changes take effect immediately for all active sessions.
              </p>
            </div>
          </div>

          {/* Scrollable entry preview */}
          <div className="max-h-60 overflow-y-auto rounded-2xl border border-surface-subtle divide-y divide-surface-subtle">
            {records.map((r) => (
              <div key={r._id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-content-primary">{r.menuItem}</span>
                  <span className="text-xs text-content-muted">{r.action}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(r.permissions) as [string, boolean][]).map(([role, granted]) => (
                    <span
                      key={role}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        granted
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-surface-subtle text-content-muted border border-surface-subtle"
                      }`}
                    >
                      {ROLE_LABELS[role] ?? role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-content-muted leading-relaxed">
            Are you sure you want to save these permission changes? All role access levels will be updated across the system.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-surface-subtle font-bold"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl bg-brand hover:bg-brand/90 text-white font-bold shadow-lg shadow-brand/20"
              onClick={onConfirm}
              disabled={saving}
            >
              <ShieldCheck size={16} className="mr-2" />
              {saving ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
