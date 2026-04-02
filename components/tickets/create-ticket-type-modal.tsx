"use client";

import { X, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CreateTicketTypeModalProps } from "@/lib/types/tickets";

export default function CreateTicketTypeModal({
  isOpen,
  onClose,
}: CreateTicketTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Create Ticket Type
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Ticket Type Name
              </Label>
              <Input
                placeholder="Yearly Pass"
                className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Duration
              </Label>
              <Select defaultValue="one-month">
                <SelectTrigger className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="one-day">One day</SelectItem>
                  <SelectItem value="one-week">One week</SelectItem>
                  <SelectItem value="one-month">One month</SelectItem>
                  <SelectItem value="one-year">One year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-content-primary">
                Create Sub-tickets (Optional)
              </h3>
              <Button
                size="icon"
                variant="outline"
                className="w-8 h-8 rounded-full border-brand text-brand hover:bg-brand-light"
              >
                <Plus size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-muted">
                  Ticket Name
                </Label>
                <Input
                  placeholder="Adult 1+"
                  className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-muted">
                  Price
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted font-bold">
                    CA$
                  </span>
                  <Input
                    placeholder="3.00"
                    className="h-12 pl-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Quantity cap (if any)
              </Label>
              <Select defaultValue="3-per-person">
                <SelectTrigger className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="no-limit">No limit</SelectItem>
                  <SelectItem value="1-per-person">1 per person</SelectItem>
                  <SelectItem value="3-per-person">3 per person</SelectItem>
                  <SelectItem value="5-per-person">5 per person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            <Save size={20} className="mr-2" />
            Save Ticket Type
          </Button>
        </div>
      </div>
    </div>
  );
}
