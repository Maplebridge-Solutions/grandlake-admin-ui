"use client";

import { X, Check, Info } from "lucide-react";
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

import type { AddAdminModalProps } from "@/lib/types/permissions";

export default function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Add Admin User
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
                Name of Admin
              </Label>
              <Input
                placeholder="Type here"
                className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Email address
              </Label>
              <Input
                placeholder="Type here"
                className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Admin ID
              </Label>
              <Input
                defaultValue="C-9290"
                className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-muted">
                Role
              </Label>
              <Select>
                <SelectTrigger className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="ops-admin">Operations Admin</SelectItem>
                  <SelectItem value="support-staff">Support Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <Info size={20} className="text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-bold">What happens next?</span> An
              invitation email will be sent to the user with a secure link to
              access the portal. You can edit access levels by visiting User
              Permissions &gt; Manage Roles/Admins.
            </p>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            <Check size={20} className="mr-2" />
            Add Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
