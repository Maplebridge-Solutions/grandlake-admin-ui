"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  PowerOff,
  Power,
  Send,
  Filter as FilterIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getAllAdmins,
  activateAdmin,
  resendAdminInvitation,
} from "@/lib/api/admin";
import { toast } from "sonner";
import type { AdminRecord } from "@/lib/types/permissions";
import DeactivateAdminModal from "@/components/permissions/deactivate-admin-modal";
import ReassignRoleModal from "@/components/permissions/reassign-role-modal";
import Pagination from "@/components/ui/pagination";

type Filter =
  | "All admins"
  | "admin"
  | "super_admin"
  | "operations_admin"
  | "support_staff";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All admins", value: "All admins" },
  { label: "Super Admins", value: "super_admin" },
  { label: "Admins", value: "admin" },
  { label: "Operations Admins", value: "operations_admin" },
  { label: "Support Staff", value: "support_staff" },
];

const roleLabel: Record<string, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
  super_admin: "Super Admin",
  operations_admin: "Operations Admin",
  support_staff: "Support Staff",
};

export default function ManageAdminsView({
  refreshKey,
}: {
  refreshKey?: number;
}) {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All admins");
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [deactivateTarget, setDeactivateTarget] = useState<AdminRecord | null>(
    null,
  );
  const [reassignTarget, setReassignTarget] = useState<AdminRecord | null>(
    null,
  );

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins({ page, limit: pageSize });
      setAdmins(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    if (refreshKey) fetchAdmins();
  }, [refreshKey, fetchAdmins]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleResend = async (admin: AdminRecord) => {
    if (!admin.invitationId) return;
    setResendingId(admin.id);
    try {
      await resendAdminInvitation(admin.invitationId);
      toast.success(`Invitation resent to ${admin.name}.`);
      await fetchAdmins();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to resend invitation.",
      );
    } finally {
      setResendingId(null);
    }
  };

  const handleActivate = async (admin: AdminRecord) => {
    setActivatingId(admin.id);
    try {
      await activateAdmin(admin.id);
      toast.success(`${admin.name} has been activated.`);
      await fetchAdmins();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to activate admin.",
      );
    } finally {
      setActivatingId(null);
    }
  };

  const filtered =
    activeFilter === "All admins"
      ? admins
      : admins.filter((a) => a.role === activeFilter);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA", { dateStyle: "medium" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mobile dropdown */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full sm:w-auto text-sm hover:border-brand hover:text-brand transition-all">
            <FilterIcon size={16} />
            {FILTERS.find((f) => f.value === activeFilter)?.label ??
              "All admins"}
            <ChevronDown size={14} className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="rounded-xl border-surface-subtle w-52"
          >
            {FILTERS.map((f) => (
              <DropdownMenuItem
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "rounded-lg cursor-pointer",
                  activeFilter === f.value && "text-brand font-bold",
                )}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop pills */}
      <div className="hidden lg:flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all border",
              activeFilter === f.value
                ? "bg-brand-light text-brand border-brand"
                : "bg-white text-content-muted border-surface-subtle hover:border-brand/50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-content-muted text-sm">
          No admins found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((admin) => {
            const isPending = admin.invitationStatus === "pending";
            const isRevoked = admin.invitationStatus === "revoked";
            const isAccepted = admin.invitationStatus === "accepted";
            const isDeactivated = admin.verified === false;
            const superAdmin =
              admin.role === "superAdmin" || admin.role === "super_admin";
            const busyActivate = activatingId === admin.id;
            const busyResend = resendingId === admin.id;

            const accentColor = isRevoked
              ? "bg-gray-300"
              : isPending
                ? "bg-orange-400"
                : isDeactivated
                  ? "bg-red-400"
                  : "bg-brand";

            return (
              <div
                key={admin.id}
                className="p-6 bg-white border border-surface-subtle rounded-[24px] space-y-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    accentColor,
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-content-primary">
                          {roleLabel[admin.role] ?? admin.role}
                        </h3>
                        {isPending && (
                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">
                            invitation pending
                          </span>
                        )}
                        {isRevoked && (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase">
                            invitation revoked
                          </span>
                        )}
                        {isDeactivated && (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
                            deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-content-muted mt-1">
                        {admin.name}
                      </p>
                      <p className="text-xs text-content-muted">
                        {admin.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted uppercase tracking-wider">
                      Date Added
                    </p>
                    <p className="text-sm text-content-muted">
                      {formatDate(admin.dateAdded)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  {/* Re-assign role — only for accepted, non-deactivated, non-super admins */}
                  {isAccepted && !isDeactivated && !superAdmin && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 rounded-xl text-content-muted hover:text-white hover:bg-brand bg-brand text-white h-10 font-bold text-xs"
                      onClick={() => setReassignTarget(admin)}
                    >
                      <RefreshCw size={14} className="mr-2" />
                      Re-assign role
                    </Button>
                  )}

                  {/* Pending — revoke */}
                  {isPending && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 h-10 font-bold text-xs px-4"
                      onClick={() => setDeactivateTarget(admin)}
                    >
                      <RefreshCw size={14} className="mr-2" />
                      Revoke invitation
                    </Button>
                  )}

                  {/* Revoked — resend */}
                  {isRevoked && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-brand/20 text-brand hover:bg-brand-light h-10 font-bold text-xs px-4"
                      disabled={busyResend}
                      onClick={() => handleResend(admin)}
                    >
                      <Send size={14} className="mr-2" />
                      {busyResend ? "Sending..." : "Send invite again"}
                    </Button>
                  )}

                  {/* Accepted, not deactivated, not super admin — deactivate */}
                  {isAccepted && !isDeactivated && !superAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 h-10 font-bold text-xs px-4"
                      onClick={() => setDeactivateTarget(admin)}
                    >
                      <PowerOff size={14} className="mr-2" />
                      Deactivate
                    </Button>
                  )}

                  {/* Deactivated (non-super) — activate */}
                  {isDeactivated && !superAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-green-100 text-green-600 hover:bg-green-50 h-10 font-bold text-xs px-4"
                      disabled={busyActivate}
                      onClick={() => handleActivate(admin)}
                    >
                      <Power size={14} className="mr-2" />
                      {busyActivate ? "Activating..." : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <DeactivateAdminModal
        admin={deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onSuccess={fetchAdmins}
      />
      <ReassignRoleModal
        admin={reassignTarget}
        onClose={() => setReassignTarget(null)}
        onSuccess={fetchAdmins}
      />
    </div>
  );
}
