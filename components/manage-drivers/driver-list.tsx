"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  AlertCircle,
  Info,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Driver, DriverListProps } from "@/lib/types/drivers";

const initialDrivers: Driver[] = [
  {
    id: "1",
    staffId: "124309",
    name: "Mandela Magodo",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_6",
    complianceAlert: "Action needed",
    status: "Active",
    image: "https://picsum.photos/seed/driver1/100/100",
  },
  {
    id: "2",
    staffId: "224115",
    name: "Savannah Nguyen",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_91",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver2/100/100",
  },
  {
    id: "3",
    staffId: "098321",
    name: "Bessie Cooper",
    timeLeftToBreak: "2h left",
    breakProgress: 80,
    activeRouteId: "Route_63",
    complianceAlert: "Action needed",
    status: "Inactive",
    image: "https://picsum.photos/seed/driver3/100/100",
  },
  {
    id: "4",
    staffId: "230109",
    name: "Arlene McCoy",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_9",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver4/100/100",
  },
  {
    id: "5",
    staffId: "583056",
    name: "Cameron Williamson",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_17",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver5/100/100",
  },
  {
    id: "6",
    staffId: "948191",
    name: "Leslie Alexander",
    timeLeftToBreak: "0h left",
    breakProgress: 100,
    activeRouteId: "Route_92",
    complianceAlert: "Up to date",
    status: "Inactive",
    image: "https://picsum.photos/seed/driver6/100/100",
  },
  {
    id: "7",
    staffId: "038321",
    name: "Ralph Edwards",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_19",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver7/100/100",
  },
  {
    id: "8",
    staffId: "847301",
    name: "Marvin McKinney",
    timeLeftToBreak: "2h left",
    breakProgress: 80,
    activeRouteId: "Route_54",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver8/100/100",
  },
  {
    id: "9",
    staffId: "018390",
    name: "Robert Fox",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_5",
    complianceAlert: "Up to date",
    status: "Inactive",
    image: "https://picsum.photos/seed/driver9/100/100",
  },
  {
    id: "10",
    staffId: "637233",
    name: "Jerome Bell",
    timeLeftToBreak: "12h left",
    breakProgress: 40,
    activeRouteId: "Route_83",
    complianceAlert: "Up to date",
    status: "Active",
    image: "https://picsum.photos/seed/driver10/100/100",
  },
];


export default function DriverList({
  onViewProfile,
  onEditDriver,
}: DriverListProps) {
  const drivers = initialDrivers;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.staffId.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active")
      return matchesSearch && driver.status === "Active";
    if (activeFilter === "inactive")
      return matchesSearch && driver.status === "Inactive";
    if (activeFilter === "incomplete")
      return matchesSearch && driver.status === "Incomplete";

    return matchesSearch;
  });

  const isEmpty = drivers.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-48 h-48 opacity-50">
          <Image
            src="https://picsum.photos/seed/empty-driver/400/400"
            alt="No data"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-content-primary">
            No Driver/Staff Added Yet
          </h3>
          <p className="text-content-muted mt-2">
            You can see them here after you&apos;ve added them. You can add
          </p>
          <p className="text-content-muted">
            drivers/staff from button in top right
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
                { label: "All drivers", value: "all" },
                { label: "Active only", value: "active" },
                { label: "Inactive only", value: "inactive" },
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
              placeholder="search for drivers by name or staff id here"
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
                  Image
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Staff ID
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Driver Full Name
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Time Left to Break
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Active Route ID
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Compliance Alert
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
              {filteredDrivers.map((driver, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors cursor-pointer"
                  onClick={() => onViewProfile(driver)}
                >
                  <TableCell className="py-4 pl-8">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-surface-subtle">
                      <Image
                        src={driver.image}
                        alt={driver.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-content-secondary py-4">
                    {driver.staffId}
                  </TableCell>
                  <TableCell className="font-medium text-content-secondary py-4">
                    {driver.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3 w-32">
                      <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            driver.breakProgress > 70
                              ? "bg-status-error"
                              : "bg-brand",
                          )}
                          style={{ width: `${driver.breakProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-content-muted whitespace-nowrap">
                        {driver.timeLeftToBreak}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-content-secondary py-4">
                    {driver.activeRouteId}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {driver.complianceAlert === "Action needed" ? (
                        <div className="flex items-center gap-1.5 text-status-error">
                          <AlertCircle size={16} />
                          <span className="text-xs font-bold">
                            Action needed
                          </span>
                          <Info size={14} className="text-content-muted" />
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-content-secondary">
                          Up to date
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-bold border-none",
                        driver.status === "Active"
                          ? "bg-brand-pale text-brand"
                          : driver.status === "Inactive"
                            ? "bg-surface-subtle text-content-muted"
                            : "bg-status-warning-bg text-status-warning",
                      )}
                    >
                      {driver.status}
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
                        className="rounded-xl border-surface-subtle"
                      >
                        <DropdownMenuItem
                          onClick={() => onViewProfile(driver)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <User size={16} />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditDriver(driver)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <PenLine size={16} />
                          Edit Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error">
                          <Trash2 size={16} />
                          Delete Driver
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
