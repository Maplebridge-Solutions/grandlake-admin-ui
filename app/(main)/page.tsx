"use client";

import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Bus,
  MapPin,
  AlertCircle,
  Plus,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BusOperation {
  fleet: string;
  route: string;
  gps: string;
  delay: string;
  status: string;
}

const summaryStats = [
  {
    title: "Ridership Summary",
    value: "2,450",
    change: "+8%",
    isPositive: true,
    icon: Bus,
  },
  {
    title: "Ticket Sales",
    value: "10,004",
    change: "-4%",
    isPositive: false,
    icon: TrendingUp,
  },
  {
    title: "Ticket Revenues",
    value: "CA$140,000,000.00",
    change: "-2%",
    isPositive: false,
    icon: TrendingUp,
  },
  {
    title: "Ticket Validations",
    value: "13,000",
    change: "+12%",
    isPositive: true,
    icon: TrendingUp,
  },
];

const busOperations = [
  {
    fleet: "150",
    route: "1 Main Stre... → 10 Civic Co...",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "24",
    route: "1 Main Stre... → 10 Civic Co...",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "19",
    route: "6373 Uppe... → 122 Bridge...",
    gps: "Online",
    delay: "2m late",
    status: "Inactive",
  },
  {
    fleet: "150A",
    route: "1100 Pleas... → Health Co...",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "B80",
    route: "1 Main Stre... → 10 Civic Co...",
    gps: "Offline 2m",
    delay: "On time",
    status: "Inactive",
  },
  {
    fleet: "124",
    route: "6373 Uppe... → 122 Bridge...",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "30",
    route: "1100 Pleas... → Health Co...",
    gps: "Online",
    delay: "2m early",
    status: "Inactive",
  },
  {
    fleet: "34",
    route: "1 Main Stre... → 10 Civic Co...",
    gps: "Offline 5m",
    delay: "On time",
    status: "Active",
  },
];

const alerts = [
  {
    message: "Bus T-365 is 4 minutes behind time",
    time: "2m ago",
    type: "error",
  },
  { message: "Bus T-5 is 5 minutes early", time: "2m ago", type: "warning" },
  { message: "Bus T-5 is 5 minutes early", time: "2m ago", type: "warning" },
  { message: "Bus T-5 is 5 minutes early", time: "2m ago", type: "warning" },
  { message: "Bus T-5 is 5 minutes early", time: "2m ago", type: "warning" },
  { message: "Bus T-5 is 5 minutes early", time: "2m ago", type: "warning" },
];

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
  { label: "See more", value: "more" },
];

export default function DashboardPage() {
  const [selectedBus, setSelectedBus] = useState<BusOperation | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("This week");

  const filteredBuses = useMemo(() => {
    if (activeFilter === "all") return busOperations;
    if (activeFilter === "active")
      return busOperations.filter((b) => b.status === "Active");
    if (activeFilter === "inactive")
      return busOperations.filter((b) => b.status === "Inactive");
    return busOperations;
  }, [activeFilter]);

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
          <h1 className="text-3xl font-bold text-content-primary">
            Welcome, Ryker
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
              {["Today", "This week", "This month", "This year"].map(
                (filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className="rounded-xl cursor-pointer"
                  >
                    {filter}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat) => (
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
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold border-none",
                      stat.isPositive
                        ? "bg-brand-pale text-brand"
                        : "bg-status-error-bg text-status-error",
                    )}
                  >
                    {stat.change}
                  </Badge>
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-content-primary">
                    Latest Bus Operations
                  </h2>
                  <p className="text-sm text-content-muted mt-1">
                    Tap on an item to view real time location and more
                  </p>
                </div>
                <Tabs
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                  className="w-auto"
                >
                  <TabsList className="bg-surface-page border border-surface-subtle rounded-full p-1 h-auto flex-wrap">
                    {filterTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-full px-4 sm:px-6 py-2 data-[state=active]:bg-brand data-[state=active]:text-white"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="rounded-2xl border border-surface-subtle overflow-x-auto">
                <Table>
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
                    {filteredBuses.map((bus, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-brand-light/50 border-b border-surface-subtle transition-colors cursor-pointer"
                        onClick={() => setSelectedBus(bus)}
                      >
                        <TableCell className="font-medium text-content-secondary py-4">
                          {bus.fleet}
                        </TableCell>
                        <TableCell className="text-content-secondary py-4">
                          {bus.route}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold border-none",
                              bus.gps.startsWith("Online")
                                ? "bg-status-info-bg text-brand"
                                : "bg-status-error-bg text-status-error",
                            )}
                          >
                            {bus.gps}
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
                              "rounded-md px-2 py-0.5 text-[10px] font-bold border-none",
                              bus.status === "Active"
                                ? "bg-brand-pale text-brand"
                                : "bg-surface-subtle text-content-muted",
                            )}
                          >
                            {bus.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
              Real time alerts
            </span>
          </div>
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-2xl bg-white border-l-4 shadow-sm relative",
                  alert.type === "error"
                    ? "border-status-error"
                    : "border-status-warning",
                )}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-content-primary leading-tight">
                    {alert.message}
                  </p>
                  <span className="text-[10px] font-semibold text-content-muted mt-2">
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
