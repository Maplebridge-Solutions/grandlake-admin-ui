"use client";

import { useState } from "react";
import Pagination from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const passes = [
  {
    id: "1",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Jeremiah Agiopus",
    reason: "Apology for 40min delay",
    status: "Issued",
  },
  {
    id: "2",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Cody Fisher",
    reason: "Apology for 40min delay",
    status: "Issued",
  },
  {
    id: "3",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Kristin Watson",
    reason: "Apology for 40min delay",
    status: "Issued",
  },
  {
    id: "4",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Brooklyn Simmons",
    reason: "Apology for 40min delay",
    status: "Revoked",
  },
  {
    id: "5",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Floyd Miles",
    reason: "Apology for 40min delay",
    status: "Issued",
  },
  {
    id: "6",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Jane Cooper",
    reason: "Apology for 40min delay",
    status: "Issued",
  },
  {
    id: "7",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Darrell Steward",
    reason: "Apology for 40min delay",
    status: "Pending",
  },
  {
    id: "8",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Cameron Williamson",
    reason: "Apology for 40min delay",
    status: "Expired",
  },
  {
    id: "9",
    timestamp: "Today 08:00am",
    issuedBy: "Hannah Priyanka",
    issuedTo: "Annette Black",
    reason: "Apology for 40min delay",
    status: "Expired",
  },
];

import type { PassManagementProps } from "@/lib/types/tickets";

export default function PassManagement({ onIssueNew }: PassManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Issued":
        return "bg-green-50 text-green-700 border-green-100";
      case "Revoked":
        return "bg-red-50 text-red-700 border-red-100";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">
            Manage Passes
          </h2>
          <p className="text-content-muted mt-1">
            Issue and revoke digital passes here
          </p>
        </div>
        <Button
          className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20 w-full sm:w-auto"
          onClick={onIssueNew}
        >
          <Plus size={18} className="mr-2" />
          Issue New Pass
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="Search passes by user, admin or ticket name..."
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-12 px-5 rounded-2xl border border-surface-subtle bg-white font-bold text-content-muted hover:text-brand hover:border-brand transition-all flex items-center gap-2 text-sm w-full sm:w-auto">
            <Filter size={16} />
            This week
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle">
            {["Today","This week","This month","This year"].map((opt) => (
              <DropdownMenuItem key={opt} className="rounded-lg cursor-pointer">{opt}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <table className="min-w-[600px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Timestamp
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Issued By
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Issued To
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Reason For Issue
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Pass Status
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {passes.map((pass) => (
              <tr
                key={pass.id}
                className="group hover:bg-surface-page/50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {pass.timestamp}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {pass.issuedBy}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {pass.issuedTo}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {pass.reason}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border",
                        getStatusStyles(pass.status),
                      )}
                    >
                      {pass.status}
                    </span>
                    {pass.status === "Revoked" && (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
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
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">
                        View Details
                      </DropdownMenuItem>
                      {pass.status === "Issued" && (
                        <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600">
                          Revoke Pass
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
