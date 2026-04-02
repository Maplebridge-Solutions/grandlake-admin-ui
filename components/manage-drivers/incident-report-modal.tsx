"use client";

import { X, Calendar, Clock, Upload, AlertTriangle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import type { IncidentReportModalProps } from "@/lib/types/drivers";

export default function IncidentReportModal({
  isOpen,
  onClose,
}: IncidentReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl border-surface-subtle p-0 overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Incident Reporting
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
                Type of Incident
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="Accident">Accident</SelectItem>
                  <SelectItem value="Mechanical">Mechanical Failure</SelectItem>
                  <SelectItem value="Passenger">Passenger Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Date of Incident
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
                Time of Incident
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

          <div className="space-y-2">
            <Label className="text-sm font-bold text-content-primary">
              Describe Incident
            </Label>
            <Textarea
              placeholder="Type here"
              className="min-h-[120px] bg-surface-page border-surface-subtle rounded-2xl focus:ring-brand"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold text-content-primary">
              Supporting Files (optional)
            </Label>
            <div className="w-full h-32 bg-brand-pale/10 rounded-2xl border-2 border-dashed border-brand-light flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-brand-pale/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm text-brand group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-xs font-bold text-content-primary">
                Tap here to upload (Pdf, png supported)
              </p>
            </div>
          </div>

          <Button className="w-full h-14 bg-status-error hover:bg-status-error/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-status-error/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <AlertTriangle size={20} />
            Report Incident
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
