"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { RouteData } from "@/lib/types/routes";

interface DeleteRouteModalProps {
  target: RouteData | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRouteModal({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteRouteModalProps) {
  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="w-lg max-w-lg sm:max-w-lg rounded-3xl border-surface-subtle p-8 space-y-6">
        <DialogTitle className="text-xl font-bold text-content-primary">
          Delete Route?
        </DialogTitle>
        <p className="text-sm text-content-muted">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-content-primary">
            {target?.name}
          </span>
          {target?.origin?.name ? (
            <>
              {" "}({target.origin.name}
              {target.destination?.name ? ` → ${target.destination.name}` : ""}
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
