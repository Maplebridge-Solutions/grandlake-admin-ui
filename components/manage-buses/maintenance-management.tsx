"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Clock,
  Calendar,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MaintenanceTask, MaintenanceManagementProps } from "@/lib/types/buses";

const initialTasks: MaintenanceTask[] = [
  {
    busNo: "150",
    type: "Oil change",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Scheduled",
  },
  {
    busNo: "24",
    type: "Oil Change & Brakes",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Urgent Repair",
  },
  {
    busNo: "91",
    type: "Annual Inspection",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Completed",
  },
  {
    busNo: "5",
    type: "Oil change",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "North Station",
    status: "Scheduled",
  },
  {
    busNo: "200",
    type: "Engine Overheating",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Urgent Repair",
  },
  {
    busNo: "39",
    type: "Annual Inspection",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Scheduled",
  },
  {
    busNo: "12",
    type: "Oil change",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Main Depot",
    status: "In shop",
  },
  {
    busNo: "32",
    type: "Tire Rotation",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Scheduled",
  },
  {
    busNo: "98",
    type: "Oil change",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "City Center",
    status: "In shop",
  },
  {
    busNo: "30",
    type: "Annual Inspection",
    setFor: "8/16/13 09:00am",
    estimatedReturn: "8/16/13 09:00am",
    mechanic: "Downtown Garage",
    status: "Scheduled",
  },
];


export default function MaintenanceManagement({
  onAddMechanic,
}: MaintenanceManagementProps) {
  const [view, setView] = useState<"list" | "form">("list");
  const tasks = initialTasks;
  const [searchQuery, setSearchQuery] = useState("");

  if (view === "form") {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("list")}
            className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-content-primary">
            Schedule Maintenance for Bus 150
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Bus Number
                  </Label>
                  <Select defaultValue="150">
                    <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                      <SelectValue placeholder="Select here" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-surface-subtle">
                      <SelectItem value="150">150</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="91">91</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Bus Type
                  </Label>
                  <Select defaultValue="Single-deck">
                    <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                      <SelectValue placeholder="Select here" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-surface-subtle">
                      <SelectItem value="Single-deck">Single-deck</SelectItem>
                      <SelectItem value="Double-deck">Double-deck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Type of service
                  </Label>
                  <Input
                    placeholder="Oil change"
                    className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Set Maintenance Date
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="DD/MM/YYYY"
                      className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10"
                    />
                    <Calendar
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                      size={18}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Set Maintenance Time
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Type here"
                      className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10"
                    />
                    <Clock
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                      size={18}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Estimated Return Time
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Type here"
                      className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10"
                    />
                    <Clock
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                      size={18}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-content-primary">
                      Assigned Mechanic
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onAddMechanic}
                      className="h-8 w-8 rounded-full text-brand hover:bg-brand-light"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <Select>
                    <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                      <SelectValue placeholder="Select here" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-surface-subtle">
                      <SelectItem value="downtown">Downtown Garage</SelectItem>
                      <SelectItem value="north">North Station</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-bold text-content-primary">
                    Any additional details or comments?
                  </Label>
                  <Textarea
                    placeholder="Type here"
                    className="min-h-[120px] bg-surface-page border-surface-subtle rounded-xl focus:ring-brand resize-none"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
              Save
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-content-primary">Logs</h3>
                <p className="text-sm text-content-muted">
                  This includes registration, insurance and compliance documents
                </p>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-status-error/20">
                {[
                  {
                    text: "Maintenance completed: Dwayne King",
                    date: "24/07/2025, 09:52am",
                    status: "completed",
                  },
                  {
                    text: "Maintenance completed: Dwayne King",
                    date: "22/07/2025, 09:52am",
                    status: "completed",
                  },
                  {
                    text: "Maintenance cancelled: John Radley",
                    date: "24/07/2025, 09:52am",
                    status: "cancelled",
                  },
                  {
                    text: "Maintenance scheduled: John Radley",
                    date: "24/07/2025, 09:52am",
                    status: "scheduled",
                  },
                  {
                    text: "Maintenance completed: Dwayne King",
                    date: "24/07/2025, 09:52am",
                    status: "completed",
                  },
                  {
                    text: "Maintenance in progress: John Radley",
                    date: "24/07/2025, 09:52am",
                    status: "progress",
                  },
                  {
                    text: "Maintenance completed: John Radley",
                    date: "24/07/2025, 09:52am",
                    status: "completed",
                  },
                  {
                    text: "Maintenance completed: Dwayne King",
                    date: "24/07/2025, 09:52am",
                    status: "completed",
                  },
                ].map((log, i) => (
                  <div key={i} className="relative pl-6 space-y-1">
                    <div
                      className={cn(
                        "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                        log.status === "completed"
                          ? "bg-brand"
                          : log.status === "cancelled"
                            ? "bg-status-error"
                            : log.status === "progress"
                              ? "bg-status-warning"
                              : "bg-status-info",
                      )}
                    />
                    <p className="text-sm font-bold text-content-primary">
                      {log.text}
                    </p>
                    <p className="text-[10px] text-content-muted">{log.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs defaultValue="all" className="w-auto">
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
              placeholder="search for buses by number, bus type here"
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

      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-page">
              <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                <TableHead className="font-bold text-content-primary py-4 pl-8">
                  Bus No.
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Type of service
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Set For
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Estimated Return
                </TableHead>
                <TableHead className="font-bold text-content-primary py-4">
                  Assigned Mechanic
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
              {tasks.map((task, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors"
                >
                  <TableCell className="font-medium text-content-secondary py-5 pl-8">
                    {task.busNo}
                  </TableCell>
                  <TableCell className="text-content-secondary py-5">
                    {task.type}
                  </TableCell>
                  <TableCell className="text-content-secondary py-5 text-sm">
                    {task.setFor}
                  </TableCell>
                  <TableCell className="text-content-secondary py-5 text-sm">
                    {task.estimatedReturn}
                  </TableCell>
                  <TableCell className="text-content-secondary py-5">
                    {task.mechanic}
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold border-none",
                          task.status === "Scheduled"
                            ? "bg-brand-pale text-brand"
                            : task.status === "Urgent Repair"
                              ? "bg-status-error-bg text-status-error"
                              : task.status === "Completed"
                                ? "bg-status-success-bg text-status-success"
                                : "bg-surface-subtle text-content-muted",
                        )}
                      >
                        {task.status}
                      </Badge>
                      <ChevronRight size={14} className="text-content-muted" />
                    </div>
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
                          onClick={() => setView("form")}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <PenLine size={16} />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error">
                          <Trash2 size={16} />
                          Cancel Task
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
