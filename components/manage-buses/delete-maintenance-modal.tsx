"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MaintenanceRecord } from "@/lib/types/buses";

interface DeleteMaintenanceModalProps {
  target: MaintenanceRecord | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMaintenanceModal({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteMaintenanceModalProps) {
  const busNumber = target
    ? target.bus == null
      ? ""
      : typeof target.bus === "object"
        ? target.bus.busNumber
        : target.bus
    : "";

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="w-lg max-w-lg sm:max-w-lg rounded-3xl border-surface-subtle p-8 space-y-6">
        <DialogTitle className="text-xl font-bold text-content-primary">
          Delete Maintenance Record?
        </DialogTitle>
        <p className="text-sm text-content-muted">
          Are you sure you want to delete the{" "}
          <span className="font-semibold text-content-primary">
            {target?.serviceType}
          </span>{" "}
          maintenance record for{" "}
          <span className="font-semibold text-content-primary">
            Bus {busNumber}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 border-surface-subtle"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-2xl h-12 bg-status-error hover:bg-status-error/90 text-white disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
