"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IssuePassModalProps } from "@/lib/types/tickets";
import { toast } from "sonner";

interface FormErrors {
  userSearch?: string;
  ticket?: string;
  validity?: string;
  reason?: string;
}

export default function IssuePassModal({ isOpen, onClose }: IssuePassModalProps) {
  const [userSearch, setUserSearch] = useState("");
  const [ticket, setTicket] = useState("");
  const [validity, setValidity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const reset = () => {
    setUserSearch("");
    setTicket("");
    setValidity("");
    setReason("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!userSearch.trim()) e.userSearch = "Please enter a user email or phone number.";
    if (!ticket) e.ticket = "Please select a ticket.";
    if (!validity) e.validity = "Please select a validity period.";
    if (!reason.trim()) e.reason = "Please provide a reason for issuing.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // TODO: wire up API call
      toast.success("Pass issued successfully.");
      reset();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to issue pass.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Issue Pass
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
              <Input
                placeholder="Search for a user by email or phone number"
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setErrors((prev) => ({ ...prev, userSearch: undefined })); }}
                className={`h-12 pl-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.userSearch ? "border-red-400" : ""}`}
              />
            </div>
            {errors.userSearch && <p className="text-xs text-red-500 font-medium">{errors.userSearch}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Select Ticket</Label>
              <Select value={ticket} onValueChange={(v) => { setTicket(v ?? ""); setErrors((prev) => ({ ...prev, ticket: undefined })); }}>
                <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.ticket ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="youth-1-ride">Youth 1 Ride</SelectItem>
                  <SelectItem value="adult-1-ride">Adult 1 Ride</SelectItem>
                  <SelectItem value="day-pass">Day Pass</SelectItem>
                </SelectContent>
              </Select>
              {errors.ticket && <p className="text-xs text-red-500 font-medium">{errors.ticket}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Validity Period</Label>
              <Select value={validity} onValueChange={(v) => { setValidity(v ?? ""); setErrors((prev) => ({ ...prev, validity: undefined })); }}>
                <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.validity ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              {errors.validity && <p className="text-xs text-red-500 font-medium">{errors.validity}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-content-muted">Reason for Issuing</Label>
            <Textarea
              placeholder="Type here"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setErrors((prev) => ({ ...prev, reason: undefined })); }}
              className={`min-h-[120px] rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all resize-none ${errors.reason ? "border-red-400" : ""}`}
            />
            {errors.reason && <p className="text-xs text-red-500 font-medium">{errors.reason}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
          >
            <Check size={20} className="mr-2" />
            {loading ? "Issuing..." : "Issue Pass"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
