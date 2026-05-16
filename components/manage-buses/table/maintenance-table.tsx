"use client";

import { ChevronsUpDown, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import {
  MAINTENANCE_TABLE_HEADS,
  maintenanceStatusColor,
} from "@/lib/constants/maintenance";
import { MAINTENANCE_STATUSES } from "@/lib/types/buses";
import type { MaintenanceRecord } from "@/lib/types/buses";

interface MaintenanceTableProps {
  tasks: MaintenanceRecord[];
  loading: boolean;
  updatingStatusId: string | null;
  onEdit: (task: MaintenanceRecord) => void;
  onDelete: (task: MaintenanceRecord) => void;
  onStatusChange: (task: MaintenanceRecord, status: string) => void;
}

export default function MaintenanceTable({
  tasks,
  loading,
  updatingStatusId,
  onEdit,
  onDelete,
  onStatusChange,
}: MaintenanceTableProps) {
  return (
    <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <Table className="min-w-175">
          <TableHeader className="bg-surface-page">
            <TableRow className="hover:bg-transparent border-b border-surface-subtle">
              {MAINTENANCE_TABLE_HEADS.map((head) => (
                <TableHead
                  key={head.label}
                  className={cn(
                    "font-bold text-content-primary py-4",
                    head.className,
                  )}
                >
                  {head.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-b border-surface-subtle">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j} className="py-5">
                      <div className="h-4 bg-surface-subtle rounded animate-pulse w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-content-muted"
                >
                  No maintenance records found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task._id}
                  className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors"
                >
                  <TableCell className="font-medium text-content-primary py-5 pl-8">
                    {task.bus && typeof task.bus === "object" ? task.bus.busNumber : (task.bus ?? "—")}
                  </TableCell>
                  <TableCell className="text-content-primary py-5">
                    {task.serviceType}
                  </TableCell>
                  <TableCell className="text-content-primary py-5 text-sm">
                    {formatDate(task.maintenanceDate)} {task.maintenanceTime}
                  </TableCell>
                  <TableCell className="text-content-primary py-5 text-sm">
                    {formatDate(task.estimatedReturnTime)}
                  </TableCell>
                  <TableCell className="text-content-primary py-5">
                    {task.assignedMechanic}
                  </TableCell>

                  {/* Status dropdown */}
                  <TableCell className="py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={updatingStatusId === task._id}
                        className="outline-none"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-lg px-3 py-1 text-xs font-bold border border-current/20 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1",
                            maintenanceStatusColor(task.status),
                            updatingStatusId === task._id &&
                              "opacity-50 cursor-wait",
                          )}
                        >
                          {updatingStatusId === task._id
                            ? "Updating..."
                            : task.status}
                          <ChevronsUpDown size={10} className="shrink-0 opacity-60" />
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="rounded-xl border-surface-subtle w-40"
                      >
                        {MAINTENANCE_STATUSES.map((s) => (
                          <DropdownMenuItem
                            key={s.value}
                            disabled={task.status === s.value}
                            onClick={() => onStatusChange(task, s.value)}
                            className="rounded-lg cursor-pointer text-sm gap-2"
                          >
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full shrink-0",
                                maintenanceStatusColor(s.value).split(" ")[0],
                              )}
                            />
                            {s.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {/* Actions */}
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
                          onClick={() => onEdit(task)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <PenLine size={16} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(task)}
                          className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error"
                        >
                          <Trash2 size={16} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
