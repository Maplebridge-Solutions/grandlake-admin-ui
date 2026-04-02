"use client";

import { useState } from "react";
import {
  ArrowLeft,
  PenLine,
  Trash2,
  MoreHorizontal,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { DriverProfileProps } from "@/lib/types/drivers";

const shifts = [
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "On - 16:04",
    status: "On",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
  {
    date: "12/12/2025",
    route: "Upper coytown road -> Green drv",
    time: "05:19 - 16:04",
    status: "Completed",
  },
];

export default function DriverProfile({
  driver,
  onBack,
  onEdit,
}: DriverProfileProps) {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-content-primary">
            {driver.name} Profile
          </h2>
          <Button
            onClick={onEdit}
            className="rounded-full px-6 h-12 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
          >
            <PenLine size={18} />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Identity */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <User className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Personal Identity
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-surface-subtle shadow-sm shrink-0">
                <Image
                  src={driver.image}
                  alt={driver.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">
                    Full Name
                  </p>
                  <p className="text-base font-medium text-content-primary">
                    {driver.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">
                    Date of Birth
                  </p>
                  <p className="text-base font-medium text-content-primary">
                    19/12/1990
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">
                    Staff ID
                  </p>
                  <p className="text-base font-medium text-content-primary">
                    {driver.staffId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">
                    Phone Number
                  </p>
                  <p className="text-base font-medium text-content-primary">
                    +1 4162012261
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-bold text-content-muted">
                    Email address
                  </p>
                  <p className="text-base font-medium text-content-primary">
                    Mandela23@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Section */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Assigned
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-content-muted">
                    Route_ID
                  </p>
                  <p className="text-sm font-bold text-content-primary">
                    {driver.activeRouteId}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-content-muted">
                    Route Long Name
                  </p>
                  <p className="text-sm font-bold text-content-primary">
                    Upper coytown road {"->"} Green drv
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal and Licensing */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <FileText className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Legal and Licensing
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Name
                    </p>
                    <p className="text-sm font-bold text-content-primary">
                      Route handling
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Number
                    </p>
                    <p className="text-sm font-bold text-content-primary">
                      392020
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Class
                    </p>
                    <p className="text-sm font-bold text-content-primary">2</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      Expiration Date
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-content-primary">
                        22/8/2025
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-status-error-bg text-status-error border-none text-[10px] font-bold px-1.5 py-0.5"
                      >
                        Expires in 2d
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Name
                    </p>
                    <p className="text-sm font-bold text-content-primary">
                      Route handling
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Number
                    </p>
                    <p className="text-sm font-bold text-content-primary">
                      392020
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      License Class
                    </p>
                    <p className="text-sm font-bold text-content-primary">2</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-content-muted">
                      Expiration Date
                    </p>
                    <p className="text-sm font-bold text-content-primary">
                      22/7/2028
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver On-site Data */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-content-primary">
              Driver On-site Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Tachograph/Smart Card ID
                </p>
                <p className="text-sm font-bold text-content-primary">
                  1029378801927491
                </p>
              </div>
              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Card Expiration Date (if any)
                </p>
                <p className="text-sm font-bold text-content-primary">
                  22/7/2028
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Shifts & Documents */}
        <div className="space-y-8">
          {/* Driver Shifts */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-content-primary">
                Driver Shifts
              </h3>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-auto"
              >
                <TabsList className="bg-surface-page border border-surface-subtle h-10 p-1 rounded-xl">
                  <TabsTrigger
                    value="upcoming"
                    className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand shadow-none"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand shadow-none"
                  >
                    Past
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                    <TableHead className="text-[10px] font-bold text-content-muted uppercase tracking-wider py-3">
                      Date
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-content-muted uppercase tracking-wider py-3">
                      Route Long Name
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-content-muted uppercase tracking-wider py-3">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-content-muted uppercase tracking-wider py-3 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-brand-light/10 border-b border-surface-subtle transition-colors group"
                    >
                      <TableCell className="py-3 text-[11px] font-medium text-content-secondary">
                        {shift.date}
                      </TableCell>
                      <TableCell className="py-3 text-[11px] font-medium text-content-secondary max-w-[120px] truncate">
                        {shift.route}
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={cn(
                            "text-[11px] font-bold",
                            shift.status === "On"
                              ? "text-brand"
                              : "text-content-secondary",
                          )}
                        >
                          {shift.time}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-6 w-6 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                            <MoreHorizontal size={14} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl border-surface-subtle"
                          >
                            <DropdownMenuItem className="cursor-pointer rounded-lg text-xs">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-lg text-xs">
                              Edit Shift
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-content-primary">
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {[{ name: "Driving license.pdf", size: "6mb" }].map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted">
                      <FileText size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-content-primary">
                        {doc.name}
                      </p>
                      <p className="text-xs text-content-muted">{doc.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
