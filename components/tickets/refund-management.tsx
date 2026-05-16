"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTransactionOrders } from "@/lib/api/transactions";
import type { TransactionOrderRecord } from "@/lib/types/tickets";

type DatePreset = "today" | "week" | "month" | "year";

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
];

function toDateString(d: Date) {
  return d.toISOString().split("T")[0];
}

function getDateRange(preset: DatePreset) {
  const now = new Date();
  if (preset === "today") {
    const d = toDateString(now);
    return { startDate: d, endDate: d };
  }
  if (preset === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startDate: toDateString(start), endDate: toDateString(end) };
  }
  if (preset === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: toDateString(start), endDate: toDateString(end) };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return { startDate: toDateString(start), endDate: toDateString(end) };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });

const formatAmount = (amount: number, currency: string) =>
  `${currency.toUpperCase()} $${(amount / 100).toFixed(2)}`;

export default function RefundManagement() {
  const [records, setRecords] = useState<TransactionOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("week");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransactionOrders({
        page,
        limit: pageSize,
        isRefunded: true,
        ...getDateRange(datePreset),
      });
      setRecords(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, datePreset]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setPage(1);
  };

  const q = searchQuery.toLowerCase();
  const filtered = records.filter((r) => {
    const name =
      `${r.contactDetails?.firstName ?? ""} ${r.contactDetails?.lastName ?? ""}`.toLowerCase();
    const ticket = (r.items?.[0] ? (typeof r.items[0].product === "object" ? r.items[0].product.name : r.items[0].product) : "—").toLowerCase();
    return name.includes(q) || ticket.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="flex gap-4 border-b border-surface-subtle w-full">
        <button className="pb-4 px-2 text-sm font-bold transition-all relative text-brand">
          Refund History
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="Search refunds by user, ticket name..."
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-semibold shrink-0 transition-all whitespace-nowrap border-brand bg-brand-light text-brand">
            <Filter size={15} />
            {DATE_PRESETS.find((p) => p.id === datePreset)?.label}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle shadow-xl p-1">
            {DATE_PRESETS.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={cn("rounded-lg cursor-pointer font-medium", datePreset === preset.id && "text-brand font-bold")}
              >
                {preset.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
          <table className="min-w-[700px] w-full text-left border-collapse">
            <thead className="bg-surface-page">
              <tr className="border-b border-surface-subtle">
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Refunded On</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Ticket Name</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Customer Name</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Amount</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Payment Method</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Refund Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-subtle">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-content-muted text-sm">
                    No refund records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const customerName =
                    r.contactDetails?.firstName || r.contactDetails?.lastName
                      ? `${r.contactDetails.firstName ?? ""} ${r.contactDetails.lastName ?? ""}`.trim()
                      : "—";
                  const ticketName = r.items?.[0] ? (typeof r.items[0].product === "object" ? r.items[0].product.name : r.items[0].product) : "—";

                  return (
                    <tr key={r._id} className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors">
                      <td className="py-4 px-4 text-sm text-content-primary">{formatDate(r.updatedAt)}</td>
                      <td className="py-4 px-4 text-sm text-content-primary font-medium">{ticketName}</td>
                      <td className="py-4 px-4 text-sm text-content-primary font-bold">{customerName}</td>
                      <td className="py-4 px-4 text-sm text-content-primary font-bold">
                        {formatAmount(r.totalAmount, r.currency)}
                      </td>
                      <td className="py-4 px-4 text-sm text-content-primary capitalize">{r.paymentMethod}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-100">
                          Refunded
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 pb-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
