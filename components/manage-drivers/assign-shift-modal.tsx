"use client";

import { X, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import type { AssignShiftModalProps } from "@/lib/types/drivers";

export default function AssignShiftModal({
  isOpen,
  onClose,
}: AssignShiftModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl border-surface-subtle p-0 overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Assign Driver Shift
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-surface-page transition-all"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Driver Name/ID
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="1">Mandela Magodo (124309)</SelectItem>
                  <SelectItem value="2">Savannah Nguyen (224115)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Secondary Driver (optional)
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="1">Mandela Magodo (124309)</SelectItem>
                  <SelectItem value="2">Savannah Nguyen (224115)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Route_ID
              </Label>
              <Input
                placeholder="Route_15"
                disabled
                className="h-12 bg-surface-page border-surface-subtle rounded-xl text-content-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Bus No.
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="B001">Bus 001</SelectItem>
                  <SelectItem value="B002">Bus 002</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Date of Shift
              </Label>
              <div className="relative">
                <Input
                  placeholder="Select here"
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12"
                />
                <Calendar
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Number of days (if recurring)
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              className="rounded-md border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
            />
            <Label
              htmlFor="recurring"
              className="text-sm font-bold text-content-primary"
            >
              This is a recurring shift
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Start Time
              </Label>
              <div className="relative">
                <Input
                  placeholder="Select here"
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12"
                />
                <Clock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                End Time
              </Label>
              <div className="relative">
                <Input
                  placeholder="Select here"
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12"
                />
                <Clock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                  size={18}
                />
              </div>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Assign Shift
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
