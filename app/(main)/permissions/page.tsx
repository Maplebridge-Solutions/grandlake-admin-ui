"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  UserPlus,
  ArrowLeft,
  Save,
} from "lucide-react";
import LoginLogsTable from "@/components/permissions/login-logs-table";
import AuditTrailsTable from "@/components/permissions/audit-trails-table";
import ManageRolesView from "@/components/permissions/manage-roles-view";
import ManageAdminsView from "@/components/permissions/manage-admins-view";
import AddAdminModal from "@/components/permissions/add-admin-modal";
import PermissionsDetailModal from "@/components/permissions/permissions-detail-modal";
import { cn } from "@/lib/utils";
import type { PermissionsViewState, LogTab } from "@/lib/types/permissions";

export default function UserPermissionsPage() {
  const [view, setView] = useState<PermissionsViewState>("logs");
  const [logTab, setLogTab] = useState<LogTab>("login");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
            <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
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

        <div className="flex items-center gap-3">
          {view === "logs" ? (
            <>
              <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("manage-roles")}
              >
                <ShieldCheck size={18} className="mr-2" />
                Manage Roles/Admins
              </Button>
              <Button
                className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
                onClick={() => setIsAddAdminModalOpen(true)}
              >
                <UserPlus size={18} className="mr-2" />
                Add Admin User
              </Button>
            </>
          ) : view === "manage-roles" ? (
            <>
              <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("manage-admins")}
              >
                <Users size={18} className="mr-2" />
                Admins
              </Button>
              <Button className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20">
                <Save size={18} className="mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20">
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-surface-subtle rounded-[32px] p-6 shadow-sm min-h-[600px]">
        {view === "logs" && (
          <div className="space-y-6">
            {/* Tab Switching */}
            <div className="flex gap-4">
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
          <ManageRolesView onShowDetails={() => setIsDetailModalOpen(true)} />
        )}
        {view === "manage-admins" && <ManageAdminsView />}
      </div>

      {/* Modals */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
      />
      <PermissionsDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Permissions"
        description="Admins who can view dashboard stats"
        admins={[
          { name: "Ryker Kyran", role: "Super Admin" },
          { name: "Hannah Priyanka", role: "Operational Admin" },
        ]}
      />
    </div>
  );
}
