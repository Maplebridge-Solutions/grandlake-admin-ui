"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, PowerOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deactivateAdmin, revokeAdminInvitation } from "@/lib/api/admin";
import { toast } from "sonner";
import type { AdminRecord } from "@/lib/types/permissions";

interface Props {
  admin: AdminRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeactivateAdminModal({ admin, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  if (!admin) return null;

  const isPending = admin.invitationStatus !== "accepted";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (isPending) {
        if (!admin.invitationId) throw new Error("Invitation ID not found.");
        await revokeAdminInvitation(admin.invitationId);
        toast.success(`Invitation for ${admin.name} has been revoked.`);
      } else {
        await deactivateAdmin(admin.id);
        toast.success(`${admin.name} has been deactivated.`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content-primary tracking-tight">
              {isPending ? "Revoke Invitation" : "Deactivate Admin"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-1">
            <p className="text-sm font-bold text-red-700">{admin.name}</p>
            <p className="text-xs text-red-600">{admin.email}</p>
          </div>

          <p className="text-sm text-content-muted leading-relaxed">
            {isPending
              ? "Are you sure you want to revoke this invitation? The invite link will be invalidated and the user will not be able to join."
              : "Are you sure you want to deactivate this admin? They will lose access to the portal immediately. You can reactivate them at any time."}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-surface-subtle font-bold"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all"
              onClick={handleConfirm}
              disabled={loading}
            >
              {isPending ? (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  {loading ? "Revoking..." : "Yes, Revoke"}
                </>
              ) : (
                <>
                  <PowerOff size={16} className="mr-2" />
                  {loading ? "Deactivating..." : "Yes, Deactivate"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
