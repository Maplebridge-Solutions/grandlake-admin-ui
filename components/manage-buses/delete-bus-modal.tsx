"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { BusData } from "@/lib/types/buses";

interface DeleteBusModalProps {
  target: BusData | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBusModal({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteBusModalProps) {
  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="w-lg max-w-lg sm:max-w-lg rounded-3xl border-surface-subtle p-8 space-y-6">
        <DialogTitle className="text-xl font-bold text-content-primary">
          Delete Bus?
        </DialogTitle>
        <p className="text-sm text-content-muted">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-content-primary">
            Bus {target?.busNumber}
          </span>
          {target?.trackingId ? (
            <>
              {" "}(Tracking ID:{" "}
              <span className="font-semibold text-content-primary">
                {target.trackingId}
              </span>
              )
            </>
          ) : null}
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
