"use client";

import { X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import type { RefundModalProps } from "@/lib/types/tickets";

export function ApproveRefundModal({
  isOpen,
  onClose,
  refundData,
}: RefundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Approve Refund
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="p-6 bg-surface-page border border-surface-subtle rounded-[24px] space-y-4">
            <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
              Refund Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Customer Name
                </p>
                <p className="text-sm font-bold text-content-primary">
                  {refundData.customerName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">Price</p>
                <p className="text-sm font-bold text-content-primary">
                  {refundData.price}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Refund to
                </p>
                <p className="text-sm font-bold text-content-primary">
                  Same account as payment
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Ticket Status
                </p>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
                  {refundData.ticketStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-content-muted">
              Reason for Approval
            </Label>
            <Textarea
              placeholder="Type here"
              className="min-h-[120px] rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all resize-none"
            />
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            <Check size={20} className="mr-2" />
            Approve Refund
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeclineRefundModal({
  isOpen,
  onClose,
  refundData,
}: RefundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Decline Refund
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="p-6 bg-surface-page border border-surface-subtle rounded-[24px] space-y-4">
            <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
              Refund Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Customer Name
                </p>
                <p className="text-sm font-bold text-content-primary">
                  {refundData.customerName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">Price</p>
                <p className="text-sm font-bold text-content-primary">
                  {refundData.price}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Refund to
                </p>
                <p className="text-sm font-bold text-content-primary">
                  Same account as payment
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted">
                  Ticket Status
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-100">
                    {refundData.ticketStatus}
                  </span>
                  {refundData.isAlreadyInUse && (
                    <div className="flex items-center text-red-500 text-[10px] font-bold gap-1">
                      <AlertCircle size={12} />
                      Ticket is already in use
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-content-muted">
              Reason for Declining
            </Label>
            <Textarea
              placeholder="Type here"
              className="min-h-[120px] rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all resize-none"
            />
          </div>

          <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]">
            <X size={20} className="mr-2" />
            Decline Refund
          </Button>
        </div>
      </div>
    </div>
  );
}
