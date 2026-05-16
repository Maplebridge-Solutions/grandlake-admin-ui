"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTicketEntry } from "@/lib/api/tickets";
import { toast } from "sonner";
import type { TicketCatalogRecord } from "@/lib/types/tickets";

interface Props {
  ticket: TicketCatalogRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteTicketTypeModal({ ticket, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  if (!ticket) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTicketEntry(ticket._id);
      toast.success(`"${ticket.name}" deleted.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete ticket type.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content-primary tracking-tight">Delete Ticket Type</h2>
            <button onClick={onClose} disabled={loading} className="p-2 hover:bg-surface-subtle rounded-full transition-colors disabled:opacity-50">
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-1">
            <p className="text-sm font-bold text-red-700">{ticket.name}</p>
            <p className="text-xs text-red-600">{ticket.currency} ${ticket.price.toFixed(2)} · {ticket.riderType}</p>
          </div>

          <p className="text-sm text-content-muted leading-relaxed">
            Are you sure you want to delete this ticket type? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-surface-subtle font-bold"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 size={16} className="mr-2" />
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
