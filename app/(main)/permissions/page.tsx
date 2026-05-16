"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, UserPlus, ArrowLeft, Save } from "lucide-react";
import LoginLogsTable from "@/components/permissions/login-logs-table";
import AuditTrailsTable from "@/components/permissions/audit-trails-table";
import ManageRolesView from "@/components/permissions/manage-roles-view";
import ManageAdminsView from "@/components/permissions/manage-admins-view";
import AddAdminModal from "@/components/permissions/add-admin-modal";
import PermissionsDetailModal from "@/components/permissions/permissions-detail-modal";
import { cn } from "@/lib/utils";
import type {
  PermissionsViewState,
  LogTab,
  RoleMatrixRecord,
  PermissionDetailAdmin,
} from "@/lib/types/permissions";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
  operationsAdmin: "Operations Admin",
  supportStaff: "Support Staff",
};

function buildAdminList(
  permissions: RoleMatrixRecord["permissions"],
): PermissionDetailAdmin[] {
  return (Object.entries(permissions) as [string, boolean][])
    .filter(([, hasAccess]) => hasAccess)
    .map(([role]) => ({
      name: ROLE_LABELS[role] ?? role,
      role: ROLE_LABELS[role] ?? role,
    }));
}

export default function UserPermissionsPage() {
  const [view, setView] = useState<PermissionsViewState>("logs");
  const [logTab, setLogTab] = useState<LogTab>("login");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailAction, setDetailAction] = useState<RoleMatrixRecord | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [adminRefreshKey, setAdminRefreshKey] = useState(0);
  const saveFnRef = useRef<() => Promise<void>>(async () => {});

  const handleShowDetails = (action: RoleMatrixRecord) => {
    setDetailAction(action);
    setIsDetailModalOpen(true);
  };

  const handleRegisterSave = useCallback((fn: () => Promise<void>) => {
    saveFnRef.current = fn;
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveFnRef.current();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {view !== "logs" && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-surface-subtle"
              onClick={() => setView("logs")}
            >
              <ArrowLeft size={24} className="text-content-primary" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              {view === "logs"
                ? "User Permissions"
                : view === "manage-roles"
                  ? "Manage Roles"
                  : "Manage Admins"}
            </h1>
            <p className="text-content-muted mt-1">
              {view === "logs"
                ? "Manage roles and permissions for users here"
                : view === "manage-roles"
                  ? "Configure access levels for different admin roles"
                  : "Manage and monitor all administrative users"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {view === "logs" && (
            <>
              <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("manage-roles")}
              >
                <ShieldCheck size={18} className="mr-2" />
                Manage Roles
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("manage-admins")}
              >
                <Users size={18} className="mr-2" />
                Manage Admins
              </Button>
            </>
          )}
          {view === "manage-roles" && (
            <>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
          {view === "manage-admins" && (
            <Button
              className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
              onClick={() => setIsAddAdminModalOpen(true)}
            >
              <UserPlus size={18} className="mr-2" />
              Add Admin User
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-surface-subtle rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm">
        {view === "logs" && (
          <div className="space-y-6">
            {/* Tab Switching */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setLogTab("login")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                  logTab === "login"
                    ? "bg-brand-light text-brand border-brand"
                    : "bg-white text-content-muted border-surface-subtle hover:border-brand/50",
                )}
              >
                Login logs
              </button>
              <button
                onClick={() => setLogTab("audit")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                  logTab === "audit"
                    ? "bg-brand-light text-brand border-brand"
                    : "bg-white text-content-muted border-surface-subtle hover:border-brand/50",
                )}
              >
                Audit trails
              </button>
            </div>

            {/* Content based on log tab */}
            {logTab === "login" ? <LoginLogsTable /> : <AuditTrailsTable />}
          </div>
        )}

        {view === "manage-roles" && (
          <ManageRolesView
            onShowDetails={handleShowDetails}
            onRegisterSave={handleRegisterSave}
          />
        )}
        {view === "manage-admins" && <ManageAdminsView refreshKey={adminRefreshKey} />}
      </div>

      {/* Modals */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSuccess={() => { setView("manage-admins"); setAdminRefreshKey((k) => k + 1); }}
      />
      <PermissionsDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={
          detailAction
            ? `${detailAction.menuItem} — ${detailAction.action}`
            : "Permissions"
        }
        description="Roles that have access to this action"
        admins={detailAction ? buildAdminList(detailAction.permissions) : []}
      />
    </div>
  );
}
