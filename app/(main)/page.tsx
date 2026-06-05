"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import BusMap from "@/components/bus-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Bus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardBusOperation } from "@/lib/types/dashboard";
import { useAuthStore } from "@/lib/stores/authStore";
import { getDashboardOverview } from "@/lib/api/dashboard";
import type { DashboardOverviewParams } from "@/lib/api/dashboard";
import { getMissedNotifications, type NotificationRecord } from "@/lib/api/notifications";
import { useNotificationSocket } from "@/lib/hooks/useNotificationSocket";

type TimeFilter = "Today" | "This week" | "This month" | "This year";

const TIME_FILTER_OPTIONS: TimeFilter[] = ["Today", "This week", "This month", "This year"];

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

function buildOverviewParams(filter: TimeFilter): DashboardOverviewParams {
  const now = new Date();
  if (filter === "Today") {
    const d = toDateString(now);
    return { period: "today", startDate: d, endDate: d };
  }
  if (filter === "This week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { period: "week", startDate: toDateString(start), endDate: toDateString(end) };
  }
  if (filter === "This month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { period: "month", startDate: toDateString(start), endDate: toDateString(end) };
  }
  // This year
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return { period: "year", startDate: toDateString(start), endDate: toDateString(end) };
}

const tableHeaders = [
  "Fleet Number",
  "Route Long Name",
  "GPS",
  "Delay",
  "Status",
];

const filterTabs = [
  { label: "All buses", value: "all" },
  { label: "Active only", value: "active" },
  { label: "Inactive only", value: "inactive" },
];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-CA").format(value);
}

export default function DashboardPage() {
  const [selectedBus, setSelectedBus] = useState<DashboardBusOperation | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("This week");

  const [alerts, setAlerts] = useState<NotificationRecord[]>([]);

  // Fetch recent notifications for the alerts panel
  useEffect(() => {
    getMissedNotifications()
      .then((res) => setAlerts(res.data.slice(0, 8)))
      .catch(() => {});
  }, []);

  // Push new notifications into the alerts panel in real time
  useNotificationSocket(
    useCallback((n: NotificationRecord) => {
      setAlerts((prev) => [n, ...prev].slice(0, 8));
    }, []),
  );

  const [overview, setOverview] = useState<{
    totalRiders: number;
    totalSales: number;
    totalAmount: number;
    currency: string;
    totalValidations: number;
    latestBusOperations: DashboardBusOperation[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      try {
        const res = await getDashboardOverview(buildOverviewParams(timeFilter));
        if (res.success) {
          const d = res.data;
          setOverview({
            totalRiders: d.ridershipSummary.totalRiders,
            totalSales: d.ticketSales.totalSales,
            totalAmount: d.ticketRevenue.totalAmount,
            currency: d.ticketRevenue.currency,
            totalValidations: d.ticketValidations.totalValidations,
            latestBusOperations: d.latestBusOperations,
          });
        }
      } catch {
        // keep stale data on error
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, [timeFilter]);

  const summaryStats = overview
    ? [
        {
          title: "Ridership Summary",
          value: formatNumber(overview.totalRiders),
          icon: Bus,
        },
        {
          title: "Ticket Sales",
          value: formatNumber(overview.totalSales),
          icon: TrendingUp,
        },
        {
          title: "Ticket Revenues",
          value: formatCurrency(overview.totalAmount, overview.currency),
          icon: TrendingUp,
        },
        {
          title: "Ticket Validations",
          value: formatNumber(overview.totalValidations),
          icon: TrendingUp,
        },
      ]
    : null;

  const filteredBuses = useMemo(() => {
    const buses = overview?.latestBusOperations ?? [];
    if (activeFilter === "active")
      return buses.filter((b) => b.status === "Active");
    if (activeFilter === "inactive")
      return buses.filter((b) => b.status === "Inactive");
    return buses;
  }, [activeFilter, overview]);

  return (
    <div className="space-y-8 relative">
      {/* Contained Full Screen Modal */}
      {selectedBus && (
        <div className="fixed inset-0 lg:left-64 top-20 z-40 bg-white animate-in slide-in-from-bottom-4 duration-300">
          <BusMap onClose={() => setSelectedBus(null)} isContained />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
            Welcome, {user?.profile?.firstName ?? "Admin"}
          </h1>
          <p className="text-content-secondary mt-1">
            Track metrics on your dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white border-surface-subtle rounded-full px-6 h-10 text-sm font-semibold inline-flex shrink-0 items-center justify-center border bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <TrendingUp size={16} className="mr-2" />
              {timeFilter}
              <ChevronDown size={16} className="ml-2 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-2xl border-surface-subtle"
            >
              {TIME_FILTER_OPTIONS.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => setTimeFilter(filter as TimeFilter)}
                  className="rounded-xl cursor-pointer"
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || !summaryStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white border-surface-subtle rounded-3xl shadow-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-surface-page border border-surface-subtle animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-surface-subtle rounded animate-pulse" />
                    <div className="h-7 w-24 bg-surface-subtle rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : summaryStats.map((stat) => (
              <Card
                key={stat.title}
                className="bg-white border-surface-subtle rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-page border border-surface-subtle flex items-center justify-center text-content-primary">
                      <stat.icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-content-primary">
                      {stat.title}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-content-primary truncate">
                      {stat.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Bus Operations */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="bg-white border-surface-subtle rounded-3xl shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-content-primary">
                    Latest Bus Operations
                  </h2>
                  <p className="text-sm text-content-muted mt-1">
                    Tap on an item to view real time location and more
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-surface-page border border-surface-subtle rounded-2xl flex-wrap w-auto">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveFilter(tab.value)}
                      className={cn(
                        "px-4 sm:px-6 py-2 rounded-full text-sm font-bold transition-all",
                        activeFilter === tab.value
                          ? "bg-brand text-white shadow-md shadow-brand/20"
                          : "text-content-muted hover:text-brand hover:bg-brand-light/50",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <Link
                    href="/manage-buses"
                    className="px-4 sm:px-6 py-2 rounded-full text-sm font-bold text-content-muted hover:text-brand hover:bg-brand-light/50 transition-all"
                  >
                    See more
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-surface-subtle overflow-x-auto overscroll-x-contain touch-pan-x">
                <Table className="min-w-[500px]">
                  <TableHeader className="bg-surface-page">
                    <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                      {tableHeaders.map((header) => (
                        <TableHead
                          key={header}
                          className="font-bold text-content-primary py-4 whitespace-nowrap"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow
                          key={i}
                          className="border-b border-surface-subtle"
                        >
                          {Array.from({ length: 5 }).map((__, j) => (
                            <TableCell key={j} className="py-4">
                              <div className="h-4 bg-surface-subtle rounded animate-pulse w-20" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredBuses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-content-muted"
                        >
                          No bus operations found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBuses.map((bus, i) => (
                        <TableRow
                          key={i}
                          className="hover:bg-brand-light/50 border-b border-surface-subtle transition-colors cursor-pointer"
                          onClick={() => setSelectedBus(bus)}
                        >
                          <TableCell className="font-medium text-content-secondary py-4">
                            {bus.fleetNumber}
                          </TableCell>
                          <TableCell className="text-content-secondary py-4">
                            {bus.routeLongName}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-lg px-3 py-1 text-xs font-bold border-none",
                                bus.gpsStatus === "Online"
                                  ? "bg-status-info-bg text-brand"
                                  : "bg-status-error-bg text-status-error",
                              )}
                            >
                              {bus.gpsStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                bus.delay === "On time"
                                  ? "text-content-secondary"
                                  : "text-status-error",
                              )}
                            >
                              {bus.delay}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-lg px-3 py-1 text-xs font-bold border-none",
                                bus.status === "Active"
                                  ? "bg-brand-pale text-brand"
                                  : "bg-surface-subtle text-content-muted",
                              )}
                            >
                              {bus.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content-primary">
              Latest Alerts
            </h2>
            <span className="text-xs font-semibold text-content-muted">
              Real time
            </span>
          </div>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white border border-surface-subtle shadow-sm text-center">
                <p className="text-sm font-semibold text-content-primary">No alerts</p>
                <p className="text-xs text-content-muted mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={cn(
                    "p-4 rounded-2xl bg-white border-l-4 shadow-sm",
                    alert.level === "error"
                      ? "border-status-error"
                      : alert.level === "warning"
                        ? "border-status-warning"
                        : "border-brand",
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-content-primary leading-tight">
                      {alert.title}
                    </p>
                    <p className="text-xs text-content-muted leading-relaxed line-clamp-2">
                      {alert.message}
                    </p>
                    <span className="text-xs font-semibold text-content-muted mt-1">
                      {timeAgo(alert.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
