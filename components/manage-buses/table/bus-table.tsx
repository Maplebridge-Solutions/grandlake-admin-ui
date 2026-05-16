"use client";

import { MoreHorizontal, PenLine, Trash2, Wrench } from "lucide-react";
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
import type { BusData } from "@/lib/types/buses";

const TABLE_HEADS = [
  { label: "Fleet Number", className: "font-bold text-content-primary py-4 pl-8" },
  { label: "Tracking ID", className: "font-bold text-content-primary py-4" },
  { label: "Bus Type", className: "font-bold text-content-primary py-4" },
  { label: "GPS", className: "font-bold text-content-primary py-4" },
  { label: "Status", className: "font-bold text-content-primary py-4" },
  { label: "Actions", className: "font-bold text-content-primary py-4 pr-8 text-right" },
];

interface BusTableProps {
  buses: BusData[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (bus: BusData) => void;
  onMaintenance: (busId: string) => void;
  onDelete: (bus: BusData) => void;
}

export default function BusTable({
  buses,
  loading,
  deletingId,
  onEdit,
  onMaintenance,
  onDelete,
}: BusTableProps) {
  return (
    <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <Table className="min-w-162.5">
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-surface-subtle">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} className="py-5">
                      <div className="h-4 bg-surface-subtle rounded animate-pulse w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : buses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-content-muted">
                  No buses found.
                </TableCell>
              </TableRow>
            ) : (
              buses.map((bus) => (
                <TableRow
                  key={bus._id}
                  className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors"
                >
                  <TableCell className="font-medium text-content-primary py-5 pl-8">
                    {bus.busNumber}
                  </TableCell>
                  <TableCell className="text-content-primary py-5">
                    {bus.trackingId || "--"}
                  </TableCell>
                  <TableCell className="text-content-primary py-5">
                    {bus.busType}
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-bold border-none",
                        bus.online
                          ? "bg-status-info-bg text-brand"
                          : "bg-status-error-bg text-status-error",
                      )}
                    >
                      {bus.online ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-bold border-none",
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
                      <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle w-48">
                        <DropdownMenuItem
                          onClick={() => onEdit(bus)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <PenLine size={16} />
                          Edit Bus
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onMaintenance(bus._id)}
                          className="cursor-pointer rounded-lg gap-2"
                        >
                          <Wrench size={16} />
                          Schedule Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(bus)}
                          disabled={deletingId === bus._id}
                          className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error"
                        >
                          <Trash2 size={16} />
                          {deletingId === bus._id ? "Deleting..." : "Delete Bus"}
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
