"use client";

import { X, Save } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AddMechanicModalProps } from "@/lib/types/buses";

export default function AddMechanicModal({
  isOpen,
  onClose,
}: AddMechanicModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl border-surface-subtle p-0 overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Add New Mechanic
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Name of Mechanic
              </Label>
              <Input
                placeholder="Type here"
                className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Type of Mechanic
              </Label>
              <Select defaultValue="company">
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-bold text-content-primary">
                Address of Mechanic
              </Label>
              <Input
                placeholder="Start typing here"
                className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Post Code
              </Label>
              <Input
                placeholder="Type here"
                className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                City
              </Label>
              <Select>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="minto">Minto</SelectItem>
                  <SelectItem value="chipman">Chipman</SelectItem>
                  <SelectItem value="grand-lake">Grand Lake</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Save size={20} />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
