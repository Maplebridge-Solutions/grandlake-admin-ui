"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllLoginLogs } from "@/lib/api/admin";
import type { LoginLogRecord } from "@/lib/types/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DatePreset = "today" | "week" | "month" | "year";

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
];

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getDateRange(preset: DatePreset): { startDate: string; endDate: string } {
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

export default function LoginLogsTable() {
  const [logs, setLogs] = useState<LoginLogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("week");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllLoginLogs({ page, limit: pageSize, ...getDateRange(datePreset) });
      setLogs(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, datePreset]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setPage(1);
  };

  const q = searchQuery.toLowerCase();
  const filtered = logs.filter(
    (log) =>
      (log.actorEmail ?? "").toLowerCase().includes(q) ||
      (log.actorRole ?? "").toLowerCase().includes(q) ||
      log.eventType.toLowerCase().includes(q),
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
          <Input
            placeholder="Search by email, role or event..."
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-semibold shrink-0 transition-all whitespace-nowrap",
            "border-brand bg-brand-light text-brand",
          )}>
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

      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
          <table className="min-w-175 w-full text-left border-collapse">
            <thead className="bg-surface-page">
              <tr className="border-b border-surface-subtle">
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Timestamp</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Admin Email</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Admin Role</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">IP Address</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Event Type</th>
                <th className="py-4 px-4 text-xs font-bold text-content-primary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-subtle">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
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
                  <td colSpan={6} className="py-12 text-center text-content-muted text-sm">No results found.</td>
                </tr>
              ) : filtered.map((log) => (
                <tr key={log._id} className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors">
                  <td className="py-4 px-4 text-sm text-content-primary">{formatDate(log.createdAt)}</td>
                  <td className="py-4 px-4 text-sm font-medium text-content-primary">{log.actorEmail ?? "—"}</td>
                  <td className="py-4 px-4 text-sm text-content-primary capitalize">{log.actorRole ?? "—"}</td>
                  <td className="py-4 px-4 text-sm text-content-primary">{log.ipAddress}</td>
                  <td className="py-4 px-4 text-sm text-content-primary">{log.eventType}</td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border",
                        log.status === "success"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100",
                      )}
                    >
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
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
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
