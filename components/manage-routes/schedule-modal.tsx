"use client";

import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ScheduleModalProps } from "@/lib/types/routes";

const timeSlots = [
  {
    am: "07:00",
    am2: "08:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
  {
    am: "07:00",
    am2: "09:00",
    am3: "11:00",
    pm: "12:00",
    pm2: "04:00",
    pm3: "08:00",
  },
];

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-3xl border-surface-subtle p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Default Schedule
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-surface-page"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="bg-brand-pale/30 rounded-2xl p-4 text-center border border-brand-light/20">
            <p className="text-sm font-bold text-content-primary">
              Bus Destination: Calgary Garage
            </p>
          </div>

          <div className="grid grid-cols-2 bg-surface-page rounded-2xl overflow-hidden border border-surface-subtle">
            <div className="p-4 text-center border-r border-surface-subtle">
              <p className="text-sm font-bold text-content-primary">
                Monday to Saturday
              </p>
              <p className="text-xs text-content-muted">
                Frequency- (Every 15 Minutes)
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-bold text-content-primary">Sunday</p>
              <p className="text-xs text-content-muted">
                Frequency- (Every 30 Minutes)
              </p>
            </div>
          </div>

          <div className="border border-surface-subtle rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="bg-status-success-bg/30 p-3 text-center border-r border-b border-surface-subtle">
                <span className="text-xs font-bold text-status-success">
                  AM
                </span>
              </div>
              <div className="bg-status-error-bg/30 p-3 text-center border-b border-surface-subtle">
                <span className="text-xs font-bold text-status-error">PM</span>
              </div>
            </div>

            <div className="divide-y divide-surface-subtle">
              {timeSlots.map((slot, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 divide-x divide-surface-subtle"
                >
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.am}
                  </div>
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.am2}
                  </div>
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.am3}
                  </div>
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.pm}
                  </div>
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.pm2}
                  </div>
                  <div className="p-4 text-center text-xs font-medium text-content-primary">
                    {slot.pm3}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Printer size={20} />
            Print Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
