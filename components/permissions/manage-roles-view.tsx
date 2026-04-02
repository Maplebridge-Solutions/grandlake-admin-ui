"use client";

import { Fragment } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const rolePermissions = [
  {
    category: "Dashboard",
    actions: [
      {
        name: "View Stats",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
    ],
  },
  {
    category: "Buses",
    actions: [
      {
        name: "View List",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
      { name: "Assign", superAdmin: true, opsAdmin: true, supportStaff: false },
      {
        name: "Add / Edit / Delete",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: false,
      },
      {
        name: "View Maintenance",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
      {
        name: "Schedule Maintenance",
        superAdmin: true,
        opsAdmin: false,
        supportStaff: false,
      },
    ],
  },
  {
    category: "Drivers",
    actions: [
      {
        name: "View List",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
      { name: "Assign", superAdmin: true, opsAdmin: true, supportStaff: false },
      {
        name: "Add / Edit / Delete",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: false,
      },
    ],
  },
  {
    category: "Routes",
    actions: [
      {
        name: "View Routes",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
      {
        name: "Change Routes/Stops",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: false,
      },
    ],
  },
  {
    category: "Tickets & Payment",
    actions: [
      {
        name: "View Transactions",
        superAdmin: true,
        opsAdmin: true,
        supportStaff: true,
      },
      {
        name: "Refund / Edit tickets",
        superAdmin: true,
        opsAdmin: false,
        supportStaff: false,
      },
    ],
  },
];

import type { ManageRolesViewProps } from "@/lib/types/permissions";

export default function ManageRolesView({
  onShowDetails,
}: ManageRolesViewProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Menu Items
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Actions
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Super Admin
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Operations Admin
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Support Staff
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {rolePermissions.map((section, sectionIdx) => (
              <Fragment key={sectionIdx}>
                {section.actions.map((action, actionIdx) => (
                  <tr
                    key={`${sectionIdx}-${actionIdx}`}
                    className="group hover:bg-surface-page/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-bold text-content-primary">
                      {actionIdx === 0 ? section.category : ""}
                    </td>
                    <td className="py-4 px-4 text-sm text-content-muted font-medium">
                      {action.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={action.superAdmin}
                          className="w-5 h-5 rounded border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={action.opsAdmin}
                          className="w-5 h-5 rounded border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={action.supportStaff}
                          className="w-5 h-5 rounded border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-surface-subtle rounded-lg transition-colors outline-none">
                          <MoreHorizontal
                            size={20}
                            className="text-content-muted"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-surface-subtle shadow-xl p-1"
                        >
                          <DropdownMenuItem
                            className="rounded-lg font-medium cursor-pointer"
                            onClick={onShowDetails}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">
                            Edit Permissions
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
