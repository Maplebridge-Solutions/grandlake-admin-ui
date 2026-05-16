"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { BusData, BusListProps } from "@/lib/types/buses";
import { getBuses, deleteBus } from "@/lib/api/fleet";
import { toast } from "sonner";
import BusTable from "./table/bus-table";
import DeleteBusModal from "./delete-bus-modal";

const FILTER_TABS = [
  { label: "All buses", value: "all" },
  { label: "Active only", value: "active" },
  { label: "Inactive only", value: "inactive" },
  { label: "Online only", value: "online" },
  { label: "Offline only", value: "offline" },
];

export default function BusList({ onEditBus, onMaintenance }: BusListProps) {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBuses = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: pageSize };
      if (activeFilter === "active") params.status = "Active";
      if (activeFilter === "inactive") params.status = "Inactive";
      if (activeFilter === "online") params.online = true;
      if (activeFilter === "offline") params.online = false;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await getBuses(params);
      if (res.success) {
        setBuses(Array.isArray(res.data) ? res.data : []);
        setTotalPages(res.meta?.totalPages ?? 1);
      }
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, activeFilter, debouncedSearch]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, debouncedSearch]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const filteredBuses = buses;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await deleteBus(deleteTarget._id);
      setDeleteTarget(null);
      toast.success("Bus deleted successfully.");
      fetchBuses();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete bus.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!loading && buses.length === 0 && !searchQuery && activeFilter === "all") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-48 h-48 opacity-50">
          <Image
            src="https://picsum.photos/seed/empty-bus/400/400"
            alt="No data"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-content-primary">No Buses Added Yet</h3>
          <p className="text-content-muted mt-2">
            You can view and manage buses here after you&apos;ve added buses.
          </p>
          <p className="text-content-muted">Add buses from button in top right</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DeleteBusModal
        target={deleteTarget}
        deleting={deletingId === deleteTarget?._id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full sm:w-auto text-sm hover:border-brand hover:text-brand transition-all">
              <Filter size={16} />
              {FILTER_TABS.find((t) => t.value === activeFilter)?.label ?? "All buses"}
              <ChevronDown size={14} className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-xl border-surface-subtle w-56">
              {FILTER_TABS.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
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
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-auto">
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

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
            <Input
              placeholder="Search buses by fleet number or tracking ID..."
              className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <BusTable
        buses={filteredBuses}
        loading={loading}
        deletingId={deletingId}
        onEdit={onEditBus}
        onMaintenance={onMaintenance}
        onDelete={setDeleteTarget}
      />

      {!loading && filteredBuses.length > 0 && (
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
  );
}
