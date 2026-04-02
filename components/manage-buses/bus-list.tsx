"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  Wrench,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
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
import type { Bus, BusListProps } from "@/lib/types/buses";

const initialBuses: Bus[] = [
  {
    fleet: "150",
    route: "1 Main Street, Minto → 10 Civic Court, Chipman",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "24",
    route: "6373 Upper salmon creek → 122 Bridge street",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "19",
    route: "Chipman Municipal Office → Chipman Health Center",
    gps: "Online",
    delay: "2m late",
    status: "Inactive",
  },
  {
    fleet: "150A",
    route: "1 Main Street, Minto → 10 Civic Court, Chipman",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "880",
    route: "6373 Upper salmon creek → 122 Bridge street",
    gps: "Offline 2m",
    delay: "On time",
    status: "Inactive",
  },
  {
    fleet: "124",
    route: "Chipman Municipal Office → Chipman Health Center",
    gps: "Online",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "30",
    route: "6373 Upper salmon creek → 122 Bridge street",
    gps: "Online",
    delay: "2m early",
    status: "Inactive",
  },
  {
    fleet: "34",
    route: "1100 Pleasant Drive → 10 Civic Court, Chipman",
    gps: "Offline 5m",
    delay: "On time",
    status: "Active",
  },
  {
    fleet: "34",
    route: "6373 Upper salmon creek → 122 Bridge street",
    gps: "Offline 5m",
    delay: "On time",
    status: "Maintenance",
  },
  {
    fleet: "34",
    route: "Chipman Municipal Office → Chipman Health Center",
    gps: "Offline 5m",
    delay: "On time",
    status: "Active",
  },
];


export default function BusList({
  onEditBus,
  onMaintenance,
}: BusListProps) {
  const buses = initialBuses;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.fleet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active")
      return matchesSearch && bus.status === "Active";
    if (activeFilter === "inactive")
      return matchesSearch && bus.status === "Inactive";
    if (activeFilter === "online")
      return matchesSearch && bus.gps.startsWith("Online");
    if (activeFilter === "offline")
      return matchesSearch && bus.gps.startsWith("Offline");
    if (activeFilter === "maintenance")
      return matchesSearch && bus.status === "Maintenance";

    return matchesSearch;
  });

  const isEmpty = buses.length === 0;

  if (isEmpty) {
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
          <h3 className="text-xl font-bold text-content-primary">
            No Buses Added Yet
          </h3>
          <p className="text-content-muted mt-2">
            You can view and manage buses here after you&apos;ve added buses.
          </p>
          <p className="text-content-muted">
            Add buses from button in top right
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-auto"
          >
            <TabsList className="bg-transparent border-none p-0 h-auto gap-2 flex-wrap">
              {[
                { label: "All buses", value: "all" },
                { label: "Active only", value: "active" },
                { label: "Inactive only", value: "inactive" },
                { label: "Online only", value: "online" },
                { label: "Offline only", value: "offline" },
                { label: "Scheduled maintenance", value: "maintenance" },
                { label: "Incomplete registration", value: "incomplete" },
              ].map((tab) => (
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

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
              size={18}
            />
            <Input
              placeholder="search for buses by route long name, trip id here"
              className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 h-12 border-surface-subtle font-semibold flex items-center gap-2 shrink-0"
          >
            <Filter size={18} />
            This week
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-page">
              <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                <TableHead className="font-bold text-content-primary py-4 pl-8">
                  Fleet Number
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Route Long Name
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  GPS
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Delay
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Status
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4 pr-8 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuses.map((bus, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors"
                >
                  <TableCell className="font-medium text-content-secondary py-5 pl-8">
                    {bus.fleet}
                  </TableCell>
                  <TableCell className="text-content-secondary py-5 max-w-xs truncate">
                    {bus.route}
                  </TableCell>
                  <TableCell className="py-5">
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
                  <TableCell className="py-5">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        bus.delay === "On time"
                          ? "text-content-secondary"
                          : bus.delay.includes("early")
                            ? "text-brand"
                            : "text-status-error",
                      )}
                    >
                      {bus.delay}
                    </span>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-bold border-none",
                        bus.status === "Active"
                          ? "bg-brand-pale text-brand"
                          : bus.status === "Maintenance"
                            ? "bg-status-warning-bg text-status-warning"
                            : "bg-surface-subtle text-content-muted",
                      )}
                    >
                      {bus.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 pr-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                        <MoreHorizontal size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-surface-subtle"
                      >
                        <DropdownMenuItem
                          onClick={() => onEditBus(bus)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <PenLine size={16} />
                          Edit Bus
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={onMaintenance}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <Wrench size={16} />
                          Schedule Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error">
                          <Trash2 size={16} />
                          Delete Bus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="px-8 pb-6">
          <Pagination />
        </div>
      </div>
    </div>
  );
}
