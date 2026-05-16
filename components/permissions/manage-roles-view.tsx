"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllRoleMatrix, updateRoleMatrix } from "@/lib/api/admin";
import { toast } from "sonner";
import type { RoleMatrixRecord } from "@/lib/types/permissions";
import type { ManageRolesViewProps } from "@/lib/types/permissions";
import SaveMatrixModal from "./save-matrix-modal";

interface GroupedSection {
  category: string;
  actions: RoleMatrixRecord[];
}

type PermissionKey = keyof RoleMatrixRecord["permissions"];

function groupSections(records: RoleMatrixRecord[]): GroupedSection[] {
  const grouped: Record<string, RoleMatrixRecord[]> = {};
  for (const item of records) {
    if (!grouped[item.menuItem]) grouped[item.menuItem] = [];
    grouped[item.menuItem].push(item);
  }
  return Object.entries(grouped).map(([category, actions]) => ({ category, actions }));
}

export default function ManageRolesView({ onShowDetails, onRegisterSave }: ManageRolesViewProps) {
  const [records, setRecords] = useState<RoleMatrixRecord[]>([]);
  const [sections, setSections] = useState<GroupedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllRoleMatrix();
        setRecords(res.data);
        setSections(groupSections(res.data));
      } catch {
        setSections([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const togglePermission = useCallback((id: string, key: PermissionKey) => {
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r._id === id
          ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
          : r,
      );
      setSections(groupSections(updated));
      return updated;
    });
  }, []);

  const handleConfirmSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateRoleMatrix(records);
      toast.success("Role permissions saved.");
      setShowSaveModal(false);
    } catch {
      toast.error("Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  }, [records]);

  // Register a fn that opens the modal rather than saving directly
  const save = useCallback(async () => {
    setShowSaveModal(true);
  }, []);

  useEffect(() => {
    onRegisterSave(save);
  }, [save, onRegisterSave]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showSaveModal && (
        <SaveMatrixModal
          records={records}
          saving={saving}
          onConfirm={handleConfirmSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <table className="min-w-150 w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Menu Items</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Actions</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Admin</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Super Admin</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Operations Admin</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Support Staff</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {sections.map((section, sectionIdx) => (
              <Fragment key={sectionIdx}>
                {section.actions.map((action, actionIdx) => (
                  <tr key={action._id} className="group hover:bg-surface-page/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-bold text-content-primary">
                      {actionIdx === 0 ? section.category : ""}
                    </td>
                    <td className="py-4 px-4 text-sm text-content-primary font-medium">
                      {action.action}
                    </td>
                    {(["admin", "superAdmin", "operationsAdmin", "supportStaff"] as PermissionKey[]).map((key) => (
                      <td key={key} className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={action.permissions[key]}
                            onCheckedChange={() => togglePermission(action._id, key)}
                            className="w-5 h-5 rounded border-surface-subtle data-checked:bg-brand data-checked:border-brand cursor-pointer"
                          />
                        </div>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-surface-subtle rounded-lg transition-colors outline-none">
                          <MoreHorizontal size={20} className="text-content-muted" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle shadow-xl p-1">
                          <DropdownMenuItem
                            className="rounded-lg font-medium cursor-pointer"
                            onClick={() => onShowDetails(action)}
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
