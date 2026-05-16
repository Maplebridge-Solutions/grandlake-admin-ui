"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  User,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { DriverData, DriverListProps } from "@/lib/types/drivers";
import { getAllDrivers, deleteDriver } from "@/lib/api/drivers";
import { toast } from "sonner";

const TABLE_HEADS = [
  { label: "Image", className: "font-bold text-content-primary py-4 pl-8" },
  { label: "Staff ID", className: "font-bold text-content-primary py-4" },
  { label: "Full Name", className: "font-bold text-content-primary py-4" },
  { label: "Email", className: "font-bold text-content-primary py-4" },
  { label: "Route ID", className: "font-bold text-content-primary py-4" },
  { label: "Status", className: "font-bold text-content-primary py-4" },
  {
    label: "Actions",
    className: "font-bold text-content-primary py-4 pr-8 text-right",
  },
];

const FILTER_TABS = [
  { label: "All drivers", value: "all" },
  { label: "Drivers only", value: "driver" },
  { label: "Non-drivers", value: "non-driver" },
];

type DatePreset = "all" | "today" | "week" | "month" | "year";

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
];

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getDateRange(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();
  if (preset === "all") return {};
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

export default function DriverList({
  onViewProfile,
  onEditDriver,
}: DriverListProps) {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof getAllDrivers>[0] = {
        page,
        limit: pageSize,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeFilter === "driver") params.isDriver = true;
      if (activeFilter === "non-driver") params.isDriver = false;
      const dateRange = getDateRange(datePreset);
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      const res = await getAllDrivers(params);
      if (res.success) {
        setDrivers(Array.isArray(res.data) ? res.data : []);
        if (res.meta) setTotalPages(res.meta.totalPages);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, activeFilter, datePreset]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeFilter, datePreset]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDriver(id);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
      toast.success("Driver deleted successfully.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete driver.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full sm:w-auto text-sm hover:border-brand hover:text-brand transition-all">
              <Filter size={16} />
              {FILTER_TABS.find((t) => t.value === activeFilter)?.label ??
                "All drivers"}
              <ChevronDown size={14} className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="rounded-xl border-surface-subtle w-52"
            >
              {FILTER_TABS.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={cn(
                    "rounded-lg cursor-pointer",
                    activeFilter === tab.value && "text-brand font-bold",
                  )}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden lg:block">
          <Tabs
            value={activeFilter}
            onValueChange={handleFilterChange}
            className="w-auto"
          >
            <TabsList className="bg-transparent border-none p-0 h-auto gap-2 flex flex-wrap">
              {FILTER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-4 py-2 border border-surface-subtle data-[state=active]:bg-brand-light data-[state=active]:text-brand data-[state=active]:border-brand text-sm font-medium transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
              size={18}
            />
            <Input
              placeholder="Search by name, staff ID or email..."
              className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-semibold shrink-0 transition-all whitespace-nowrap",
              datePreset !== "all"
                ? "border-brand bg-brand-light text-brand"
                : "border-surface-subtle bg-white text-content-muted hover:border-brand hover:text-brand",
            )}>
              <Filter size={15} />
              {DATE_PRESETS.find((p) => p.id === datePreset)?.label}
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle shadow-xl p-1">
              {DATE_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => { setDatePreset(preset.id); setPage(1); }}
                  className={cn("rounded-lg cursor-pointer font-medium", datePreset === preset.id && "text-brand font-bold")}
                >
                  {preset.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-surface-page">
              <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                {TABLE_HEADS.map((h) => (
                  <TableHead key={h.label} className={h.className}>
                    {h.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="border-b border-surface-subtle"
                    >
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : drivers.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-16 text-center">
                        <h3 className="text-lg font-bold text-content-primary">No Driver/Staff Added Yet</h3>
                        <p className="text-content-muted mt-1 text-sm">You can see them here after you&apos;ve added them.</p>
                      </TableCell>
                    </TableRow>
                  )
                : drivers.map((driver) => (
                    <TableRow
                      key={driver._id}
                      className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors cursor-pointer"
                      onClick={() => onViewProfile(driver)}
                    >
                      <TableCell className="py-4 pl-8">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-surface-subtle bg-surface-page flex items-center justify-center">
                          {driver.driverDetails?.pictureUrl ? (
                            <Image
                              src={driver.driverDetails.pictureUrl}
                              alt={`${driver.firstName} ${driver.lastName}`}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                              unoptimized
                            />
                          ) : (
                            <User size={18} className="text-content-muted" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-content-primary py-4">
                        {driver.driverDetails?.staffId ?? "—"}
                      </TableCell>
                      <TableCell className="font-medium text-content-primary py-4">
                        {driver.firstName} {driver.lastName}
                      </TableCell>
                      <TableCell className="text-content-primary py-4 text-sm">
                        {driver.user?.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-content-primary py-4">
                        {(driver.driverDetails?.routeId &&
                          driver.driverDetails?.routeId) ??
                          "—"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-lg px-3 py-1 text-xs font-bold border-none capitalize",
                            driver.isDriver
                              ? "bg-brand-pale text-brand"
                              : "bg-surface-subtle text-content-muted",
                          )}
                        >
                          {driver.isDriver
                            ? "Driver"
                            : (driver.user?.roles?.[0]?.replace(/_/g, " ") ??
                              "Non-driver")}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="py-4 pr-8 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                            <MoreHorizontal size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl border-surface-subtle w-40"
                          >
                            <DropdownMenuItem
                              onClick={() => onViewProfile(driver)}
                              className="cursor-pointer rounded-lg gap-2"
                            >
                              <User size={16} />
                              View Profile
                            </DropdownMenuItem>
                            {(driver.isDriver ||
                              driver.user?.roles?.includes("admin")) && (
                              <DropdownMenuItem
                                onClick={() => onEditDriver(driver)}
                                className="cursor-pointer rounded-lg gap-2"
                              >
                                <PenLine size={16} />
                                {driver.user?.roles?.includes("admin")
                                  ? "Edit Admin"
                                  : "Edit Driver"}
                              </DropdownMenuItem>
                            )}
                            {!driver.user?.roles?.includes("admin") && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(driver._id)}
                                disabled={deletingId === driver._id}
                                className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error"
                              >
                                <Trash2 size={16} />
                                {deletingId === driver._id
                                  ? "Deleting..."
                                  : "Delete Driver"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {!loading && drivers.length > 0 && (
          <div className="px-8 pb-6">
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
