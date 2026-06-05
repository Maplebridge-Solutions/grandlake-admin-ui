"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  Eye,
  ChevronRight,
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
import { getAllRoutes, deleteRoute } from "@/lib/api/routes";
import { cn } from "@/lib/utils";
import DeleteRouteModal from "./delete-route-modal";
import { toast } from "sonner";
import type { RouteData, RouteListProps } from "@/lib/types/routes";

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

export default function RouteList({ onViewRoute, onEditRoute }: RouteListProps) {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<RouteData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("all");

  useEffect(() => {
    async function fetchRoutes() {
      setLoading(true);
      try {
        const res = await getAllRoutes(getDateRange(datePreset));
        if (res.success) setRoutes(Array.isArray(res.data) ? res.data : []);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, [datePreset]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoute(deleteTarget._id);
      setRoutes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Route deleted successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete route.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const q = searchQuery.toLowerCase();
    return (
      route.name.toLowerCase().includes(q) ||
      route.origin?.name.toLowerCase().includes(q) ||
      route.destination?.name.toLowerCase().includes(q)
    );
  });


  return (
    <div className="space-y-6">
      <DeleteRouteModal
        target={deleteTarget}
        deleting={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
          <Input
            placeholder="Search for any route by name here"
            className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "rounded-full px-5 h-12 border font-semibold flex items-center gap-2 w-full lg:w-auto text-sm transition-all shrink-0",
            "border-brand bg-brand-light text-brand",
          )}>
            <Filter size={16} />
            {DATE_PRESETS.find((p) => p.id === datePreset)?.label}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle shadow-xl p-1">
            {DATE_PRESETS.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => setDatePreset(preset.id)}
                className={cn("rounded-lg cursor-pointer font-medium", datePreset === preset.id && "text-brand font-bold")}
              >
                {preset.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-surface-subtle rounded-3xl p-6 shadow-sm space-y-4">
              <div className="h-4 bg-surface-subtle rounded animate-pulse w-1/2" />
              <div className="h-3 bg-surface-subtle rounded animate-pulse w-3/4" />
              <div className="h-3 bg-surface-subtle rounded animate-pulse w-1/3" />
            </div>
          ))
        ) : filteredRoutes.length === 0 ? (
          <div className="col-span-full bg-white border border-surface-subtle rounded-3xl py-20 flex flex-col items-center justify-center space-y-2 shadow-sm">
            <h3 className="text-lg font-bold text-content-primary">No Routes Found</h3>
            <p className="text-content-muted text-sm">
              {searchQuery
                ? `No routes match "${searchQuery}"`
                : datePreset !== "all"
                  ? "No routes were created in this period. Try a different date range."
                  : "Create your first route using the button above."}
            </p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="bg-white border border-surface-subtle rounded-3xl p-6 shadow-sm hover:border-brand-light transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-content-primary">{route.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-content-muted">
                    <span className="truncate max-w-25">{route.origin?.name ?? "—"}</span>
                    <ChevronRight size={12} />
                    <span className="truncate max-w-25">{route.destination?.name ?? "—"}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                    <MoreHorizontal size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle w-40">
                    <DropdownMenuItem
                      onClick={() => onViewRoute(route)}
                      className="cursor-pointer rounded-lg gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditRoute(route)}
                      className="cursor-pointer rounded-lg gap-2"
                    >
                      <PenLine size={16} />
                      Edit Route
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(route)}
                      className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error"
                    >
                      <Trash2 size={16} />
                      Delete Route
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pt-4 border-t border-surface-subtle flex items-center justify-between">
                <span className="text-xs font-medium text-content-muted">
                  {route.stops.length} Stop{route.stops.length !== 1 ? "s" : ""}
                  {route.frequency ? ` · Every ${route.frequency} min` : ""}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRoute(route)}
                  className="text-brand hover:bg-brand-light font-bold text-xs rounded-lg"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
