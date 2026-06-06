"use client";

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { Search, ArrowLeft, MoreHorizontal, Eye, Trash2, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getMechanics, deleteMechanic } from "@/lib/api/fleet";
import type { MechanicData } from "@/lib/types/buses";
import { toast } from "sonner";

interface MechanicsListProps {
  onBack: () => void;
  onAddMechanic: () => void;
}

export interface MechanicsListHandle {
  refresh: () => void;
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-surface-subtle last:border-0">
      <span className="w-44 text-xs font-bold text-content-muted uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-medium text-content-primary">{value || "—"}</span>
    </div>
  );
}

const MechanicsList = forwardRef<MechanicsListHandle, MechanicsListProps>(function MechanicsList({ onBack, onAddMechanic }, ref) {
  const [mechanics, setMechanics] = useState<MechanicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MechanicData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMechanics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMechanics({ limit: 100 });
      if (res.success) setMechanics(Array.isArray(res.data) ? res.data : []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics]);

  useImperativeHandle(ref, () => ({ refresh: fetchMechanics }));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMechanic(deleteTarget._id);
      setMechanics((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
      if (selectedMechanic?._id === deleteTarget._id) setSelectedMechanic(null);
      toast.success("Mechanic deleted successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete mechanic.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = mechanics.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-content-primary">Mechanics</h2>
            <p className="text-sm text-content-muted">View and manage all registered mechanics</p>
          </div>
          <Button
            onClick={onAddMechanic}
            className="rounded-full px-6 h-11 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20"
          >
            <Plus size={18} />
            Add Mechanic
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
        <Input
          placeholder="Search by name, email or specialization..."
          className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-surface-page">
              <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                <TableHead className="font-bold text-content-primary py-4 pl-8">Full Name</TableHead>
                <TableHead className="font-bold text-content-primary py-4">Specialization</TableHead>
                <TableHead className="font-bold text-content-primary py-4">Company</TableHead>
                <TableHead className="font-bold text-content-primary py-4">City</TableHead>
                <TableHead className="font-bold text-content-primary py-4">Experience</TableHead>
                <TableHead className="font-bold text-content-primary py-4">Status</TableHead>
                <TableHead className="font-bold text-content-primary py-4 pr-8 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-surface-subtle">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <h3 className="text-lg font-bold text-content-primary">
                      {searchQuery ? "No mechanics match your search" : "No Mechanics Added Yet"}
                    </h3>
                    <p className="text-content-muted mt-1 text-sm">
                      {searchQuery ? "Try a different search term." : "Add mechanics to assign them to maintenance jobs."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((mechanic) => (
                  <TableRow
                    key={mechanic._id}
                    className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors cursor-pointer"
                    onClick={() => setSelectedMechanic(mechanic)}
                  >
                    <TableCell className="py-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                          <User size={16} className="text-brand" />
                        </div>
                        <div>
                          <p className="font-bold text-content-primary text-sm">{mechanic.fullName}</p>
                          <p className="text-xs text-content-muted">{mechanic.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-content-primary">{mechanic.specialization}</TableCell>
                    <TableCell className="py-4 text-sm text-content-primary">{mechanic.company}</TableCell>
                    <TableCell className="py-4 text-sm text-content-primary">{mechanic.city}</TableCell>
                    <TableCell className="py-4 text-sm text-content-primary">
                      {mechanic.yearsOfExperience ? `${mechanic.yearsOfExperience} yrs` : "—"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg px-3 py-1 text-xs font-bold border-none",
                          mechanic.status === "ACTIVE"
                            ? "bg-brand-pale text-brand"
                            : "bg-surface-subtle text-content-muted",
                        )}
                      >
                        {mechanic.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-8 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                          <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle w-40">
                          <DropdownMenuItem
                            onClick={() => setSelectedMechanic(mechanic)}
                            className="cursor-pointer rounded-lg gap-2"
                          >
                            <Eye size={16} />
                            View Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(mechanic)}
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

      {/* View Info Modal */}
      <Dialog open={!!selectedMechanic} onOpenChange={() => setSelectedMechanic(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl border-surface-subtle p-0 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center shrink-0">
                <User size={26} className="text-brand" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-content-primary">
                  {selectedMechanic?.fullName}
                </DialogTitle>
                <p className="text-sm text-content-muted">{selectedMechanic?.specialization}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto rounded-lg px-3 py-1 text-xs font-bold border-none shrink-0",
                  selectedMechanic?.status === "ACTIVE"
                    ? "bg-brand-pale text-brand"
                    : "bg-surface-subtle text-content-muted",
                )}
              >
                {selectedMechanic?.status === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="bg-surface-page rounded-2xl px-4 py-2">
              <InfoRow label="Email" value={selectedMechanic?.email} />
              <InfoRow label="Phone" value={selectedMechanic?.phone} />
              <InfoRow label="Company" value={selectedMechanic?.company} />
              <InfoRow label="Address" value={selectedMechanic?.address} />
              <InfoRow label="City" value={selectedMechanic?.city} />
              <InfoRow label="State" value={selectedMechanic?.state} />
              <InfoRow label="Zip Code" value={selectedMechanic?.zipCode} />
              <InfoRow label="Experience" value={selectedMechanic?.yearsOfExperience ? `${selectedMechanic.yearsOfExperience} years` : undefined} />
              <InfoRow label="Notes" value={selectedMechanic?.notes} />
            </div>

            <Button
              onClick={() => { setDeleteTarget(selectedMechanic); setSelectedMechanic(null); }}
              variant="outline"
              className="w-full h-12 border-status-error text-status-error hover:bg-red-50 rounded-2xl font-bold flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Mechanic
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => !deleting && setDeleteTarget(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-3xl border-surface-subtle p-0 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <Trash2 size={28} className="text-status-error" />
            </div>
            <DialogTitle className="text-xl font-bold text-content-primary">Delete Mechanic</DialogTitle>
            <p className="text-sm text-content-muted">
              Are you sure you want to delete <span className="font-bold text-content-primary">{deleteTarget?.fullName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 h-12 rounded-2xl border-surface-subtle font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-12 rounded-2xl bg-status-error hover:bg-status-error/90 text-white font-bold"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default MechanicsList;
