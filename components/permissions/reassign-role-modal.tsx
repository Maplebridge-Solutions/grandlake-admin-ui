"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reassignAdminRole } from "@/lib/api/admin";
import { toast } from "sonner";
import type { AdminRecord } from "@/lib/types/permissions";

interface Props {
  admin: AdminRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  // { value: "admin", label: "Admin" },
  // { value: "super_admin", label: "Super Admin" },
  { value: "operations_admin", label: "Operations Admin" },
  { value: "support_staff", label: "Support Staff" },
];
const getRoleValue = (label: string) =>
  ROLES.find((r) => r.label === label)?.value ?? label;

const roleLabel: Record<string, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  superAdmin: "Super Admin",
  operations_admin: "Operations Admin",
  support_staff: "Support Staff",
};

export default function ReassignRoleModal({ admin, onClose, onSuccess }: Props) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!admin) return null;

  const handleClose = () => {
    setRole("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!role) {
      setError("Please select a new role.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await reassignAdminRole(admin.id, getRoleValue(role));
      toast.success(`${admin.name}'s role has been updated to ${role}.`);
      setRole("");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reassign role.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content-primary tracking-tight">Re-assign Role</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
            <p className="text-sm font-bold text-content-primary">{admin.name}</p>
            <p className="text-xs text-content-muted">{admin.email}</p>
            <p className="text-xs text-content-muted">
              Current role: <span className="font-bold text-brand">{roleLabel[admin.role] ?? admin.role}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-content-muted">New Role</Label>
            <Select value={role} onValueChange={(v) => { setRole(v ?? ""); setError(""); }}>
              <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${error ? "border-red-400" : ""}`}>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                {ROLES.filter((r) => r.value !== admin.role).map((r) => (
                  <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-surface-subtle font-bold"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl bg-brand hover:bg-brand/90 text-white font-bold shadow-lg shadow-brand/20 transition-all"
              onClick={handleConfirm}
              disabled={loading}
            >
              <RefreshCw size={16} className="mr-2" />
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
