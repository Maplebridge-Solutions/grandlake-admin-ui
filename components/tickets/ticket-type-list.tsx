"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getAllTicketCatalog, updateTicketEntry } from "@/lib/api/tickets";
import type { TicketCatalogRecord } from "@/lib/types/tickets";
import EditTicketTypeModal from "./edit-ticket-type-modal";
import DeleteTicketTypeModal from "./delete-ticket-type-modal";
import { toast } from "sonner";

const CATEGORY_LABEL: Record<string, string> = {
  SINGLE_RIDE: "Single Ride",
  MULTI_RIDE: "Multi Ride",
  DAY_PASS: "Day Pass",
  WEEK_PASS: "Week Pass",
  MONTH_PASS: "Month Pass",
};

const RIDER_LABEL: Record<string, string> = {
  ADULT: "Adult",
  YOUTH: "Youth",
  SENIOR: "Senior",
  STUDENT: "Student",
};

type Tab = "all" | "active" | "inactive";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All tickets" },
  { id: "active", label: "Active only" },
  { id: "inactive", label: "Inactive only" },
];

export default function TicketTypeList({ onCreated }: { onCreated?: number }) {
  const [tickets, setTickets] = useState<TicketCatalogRecord[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editTicket, setEditTicket] = useState<TicketCatalogRecord | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<TicketCatalogRecord | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (ticket: TicketCatalogRecord) => {
    setTogglingId(ticket._id);
    try {
      await updateTicketEntry(ticket._id, { isActive: !ticket.isActive });
      toast.success(`Ticket marked as ${!ticket.isActive ? "active" : "inactive"}.`);
      fetchTickets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update ticket status.");
    } finally {
      setTogglingId(null);
    }
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        activeTab === "active"
          ? { isActive: true, page, limit: pageSize }
          : activeTab === "inactive"
            ? { isActive: false, page, limit: pageSize }
            : { page, limit: pageSize };
      const res = await getAllTicketCatalog(params);
      setTickets(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (onCreated) fetchTickets();
  }, [onCreated, fetchTickets]);

  const handleTabChange = (id: Tab) => {
    setActiveTab(id);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const q = searchQuery.toLowerCase();
  const filtered = tickets.filter((t) => {
    if (activeTab === "active" && !t.isActive) return false;
    if (activeTab === "inactive" && t.isActive) return false;
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.riderType.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <EditTicketTypeModal ticket={editTicket} onClose={() => setEditTicket(null)} onSuccess={fetchTickets} />
      <DeleteTicketTypeModal ticket={deleteTicket} onClose={() => setDeleteTicket(null)} onSuccess={fetchTickets} />
      {/* Tabs — dropdown on mobile/tablet, pills on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full sm:w-auto text-sm hover:border-brand hover:text-brand transition-all">
              <Filter size={16} />
              {tabs.find((t) => t.id === activeTab)?.label ?? "All tickets"}
              <ChevronDown size={14} className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-xl border-surface-subtle w-44">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn("rounded-lg cursor-pointer", activeTab === tab.id && "text-brand font-bold")}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden lg:flex gap-2 p-1 bg-surface-page rounded-2xl border border-surface-subtle w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-brand text-white shadow-md shadow-brand/10"
                  : "text-content-muted hover:text-brand hover:bg-brand-light/50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
          <Input
            placeholder="Search tickets by name or type..."
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <table className="min-w-162 w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Ticket Name</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Rider Type</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Category</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Rides</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Price</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Valid For</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <h3 className="text-lg font-bold text-content-primary">
                    {activeTab === "active"
                      ? "No Active Tickets"
                      : activeTab === "inactive"
                        ? "No Inactive Tickets"
                        : "No Ticket Types Created Yet"}
                  </h3>
                  <p className="text-content-muted mt-1 text-sm">
                    {searchQuery
                      ? `No tickets match "${searchQuery}"`
                      : activeTab === "all"
                        ? "Create ticket types to start selling tickets to your riders."
                        : "Try switching to a different filter."}
                  </p>
                </td>
              </tr>
            ) : filtered.map((ticket) => (
              <tr key={ticket._id} className="group hover:bg-surface-page/50 transition-colors">
                <td className="py-4 px-4 text-sm text-content-primary font-bold">{ticket.name}</td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {RIDER_LABEL[ticket.riderType] ?? ticket.riderType}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {CATEGORY_LABEL[ticket.category] ?? ticket.category}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">{ticket.ridesCount}</td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {ticket.currency} ${ticket.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-medium">
                  {ticket.validityDays === 1
                    ? "1 day"
                    : ticket.validityDays === 365
                      ? "1 year"
                      : `${ticket.validityDays} days`}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border",
                      ticket.isActive
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-gray-100 text-gray-700 border-gray-200",
                    )}
                  >
                    {ticket.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-surface-subtle rounded-lg transition-colors outline-none">
                      <MoreHorizontal size={20} className="text-content-muted" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle shadow-xl p-1">
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer" onClick={() => setEditTicket(ticket)}>Edit Ticket</DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-lg font-medium cursor-pointer"
                        disabled={togglingId === ticket._id}
                        onClick={() => handleToggleStatus(ticket)}
                      >
                        {togglingId === ticket._id
                          ? "Updating..."
                          : ticket.isActive ? "Mark as Inactive" : "Mark as Active"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600" onClick={() => setDeleteTicket(ticket)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
