"use client";

import { useState } from "react";
import { Search, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const auditTrails = [
  {
    id: "1",
    timestamp: "6/21/19 09:00am",
    adminId: "C-5523",
    adminName: "Hannah Priyanka",
    adminRole: "Operations Admin",
    action: "Changed a Price",
    details: '"Adult 1" from $15 to $18',
    status: "Success",
  },
  {
    id: "2",
    timestamp: "7/11/19 09:00am",
    adminId: "C-0292",
    adminName: "Ryker Kiran",
    adminRole: "Super Admin",
    action: "Changed a Price",
    details: '"Youth 1" from $15 to $18',
    status: "Pending",
  },
  {
    id: "3",
    timestamp: "8/21/15 09:00am",
    adminId: "System",
    adminName: "System",
    adminRole: "System",
    action: "Blocked Login",
    details: "Failed password 5 times (User: C...",
    status: "Success",
    hasInfo: true,
  },
  {
    id: "4",
    timestamp: "8/16/13 09:00am",
    adminId: "C-0192",
    adminName: "Ryker Kiran",
    adminRole: "Super Admin",
    action: "Added New Admin",
    details: 'Gave "Super" access to David Wri...',
    status: "Success",
    hasInfo: true,
  },
  {
    id: "5",
    timestamp: "3/4/16 09:00am",
    adminId: "C-1917",
    adminName: "Hannah Priyanka",
    adminRole: "Operations Admin",
    action: "Created Ticket Type",
    details: '"Airport Express" created',
    status: "Pending",
  },
  {
    id: "6",
    timestamp: "8/21/15 09:00am",
    adminId: "System",
    adminName: "System",
    adminRole: "System",
    action: "Blocked Login",
    details: "Failed password 5 times (User: L...",
    status: "Success",
    hasInfo: true,
  },
  {
    id: "7",
    timestamp: "8/21/15 09:00am",
    adminId: "System",
    adminName: "System",
    adminRole: "System",
    action: "Blocked Login",
    details: "Failed password 5 times (User: C...",
    status: "Success",
    hasInfo: true,
  },
  {
    id: "8",
    timestamp: "8/21/15 09:00am",
    adminId: "System",
    adminName: "System",
    adminRole: "System",
    action: "Blocked Login",
    details: "Failed password 5 times (User: S...",
    status: "Success",
    hasInfo: true,
  },
  {
    id: "9",
    timestamp: "4/21/12 09:00am",
    adminId: "C-9391",
    adminName: "Cameron Williamson",
    adminRole: "Support staff",
    action: "Revoked a ticket",
    details: "Ticket #9921 for User: Liamson N...",
    status: "Success",
    hasInfo: true,
  },
  {
    id: "10",
    timestamp: "12/10/13 09:00am",
    adminId: "C-1292",
    adminName: "Ryker Kiran",
    adminRole: "Super Admin",
    action: "Added New Admin",
    details: 'Gave "Support" access to Camer...',
    status: "Success",
    hasInfo: true,
  },
];

export default function AuditTrailsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="search audit trails by admin id or name"
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-12 px-6 rounded-2xl border-surface-subtle font-bold text-content-muted hover:text-brand hover:border-brand transition-all"
        >
          <Filter size={18} className="mr-2" />
          Filter date
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Timestamp
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Admin ID
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Admin Name
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Admin Role
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Action Taken
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Details
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {auditTrails.map((log) => (
              <tr
                key={log.id}
                className="group hover:bg-surface-page/50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {log.timestamp}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {log.adminId}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {log.adminName}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {log.adminRole}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {log.action}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px]">
                      {log.details}
                    </span>
                    {log.hasInfo && (
                      <Info
                        size={14}
                        className="text-content-muted cursor-pointer hover:text-brand"
                      />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border",
                      log.status === "Success"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : log.status === "Pending"
                          ? "bg-orange-50 text-orange-700 border-orange-100"
                          : "bg-red-50 text-red-700 border-red-100",
                    )}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
}
