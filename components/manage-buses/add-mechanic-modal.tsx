"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
import { createMechanic } from "@/lib/api/fleet";
import { toast } from "sonner";
import PhoneInput, { isValidPhoneNumber } from "@/components/ui/phone-input";

const STATUSES = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];
const getStatusValue = (label: string) => STATUSES.find((s) => s.label === label)?.value ?? label;

export default function AddMechanicModal({
  isOpen,
  onClose,
  onCreated,
}: AddMechanicModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setSpecialization("");
    setYearsOfExperience("");
    setCompany("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setNotes("");
    setStatus("ACTIVE");
    setErrors({});
  };

  const clearError = (field: string) => setErrors((p) => { const n = { ...p }; delete n[field]; return n; });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email.trim()) e.email = "Email is required.";
    if (!phone) e.phone = "Phone is required.";
    else if (!isValidPhoneNumber(phone)) e.phone = "Enter a valid phone number for the selected country.";
    if (!specialization.trim()) e.specialization = "Specialization is required.";
    if (!company.trim()) e.company = "Company is required.";
    if (!address.trim()) e.address = "Address is required.";
    if (!city) e.city = "City is required.";
    if (!state.trim()) e.state = "State is required.";
    if (!zipCode.trim()) e.zipCode = "Zip code is required.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      const res = await createMechanic({
        fullName,
        email,
        phone,
        specialization,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        status: getStatusValue(status),
        company,
        notes,
        address,
        city,
        state,
        zipCode,
      });
      if (res.success) {
        toast.success("Mechanic added successfully.");
        onCreated?.(res.data);
        handleClose();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add mechanic.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[760px] rounded-3xl border-surface-subtle p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Add New Mechanic
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-full hover:bg-surface-page"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Full Name <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. John Carter"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.fullName && "border-status-error")}
              />
              {errors.fullName && <p className="text-xs text-status-error">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Email <span className="text-status-error">*</span>
              </Label>
              <Input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.email && "border-status-error")}
              />
              {errors.email && <p className="text-xs text-status-error">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Phone <span className="text-status-error">*</span>
              </Label>
              <PhoneInput
                value={phone}
                onChange={(v) => { setPhone(v); clearError("phone"); }}
                placeholder="Phone number"
                error={!!errors.phone}
              />
              {errors.phone && <p className="text-xs text-status-error">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Specialization <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. Engine and transmission"
                value={specialization}
                onChange={(e) => { setSpecialization(e.target.value); clearError("specialization"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.specialization && "border-status-error")}
              />
              {errors.specialization && <p className="text-xs text-status-error">{errors.specialization}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Years of Experience
              </Label>
              <Input
                type="number"
                placeholder="e.g. 8"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Status
              </Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-bold text-content-primary">
                Company <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. Lakeside Auto Works"
                value={company}
                onChange={(e) => { setCompany(e.target.value); clearError("company"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.company && "border-status-error")}
              />
              {errors.company && <p className="text-xs text-status-error">{errors.company}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-bold text-content-primary">
                Address <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. 12 Marine Road"
                value={address}
                onChange={(e) => { setAddress(e.target.value); clearError("address"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.address && "border-status-error")}
              />
              {errors.address && <p className="text-xs text-status-error">{errors.address}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                City <span className="text-status-error">*</span>
              </Label>
              <Select value={city} onValueChange={(v) => { if (v) { setCity(v); clearError("city"); } }}>
                <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.city && "border-status-error")}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  <SelectItem value="Minto">Minto</SelectItem>
                  <SelectItem value="Chipman">Chipman</SelectItem>
                  <SelectItem value="Grand Lake">Grand Lake</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && <p className="text-xs text-status-error">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                State <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. Lagos"
                value={state}
                onChange={(e) => { setState(e.target.value); clearError("state"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.state && "border-status-error")}
              />
              {errors.state && <p className="text-xs text-status-error">{errors.state}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Zip / Post Code <span className="text-status-error">*</span>
              </Label>
              <Input
                placeholder="e.g. 100001"
                value={zipCode}
                onChange={(e) => { setZipCode(e.target.value); clearError("zipCode"); }}
                className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.zipCode && "border-status-error")}
              />
              {errors.zipCode && <p className="text-xs text-status-error">{errors.zipCode}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-bold text-content-primary">
                Notes
              </Label>
              <Input
                placeholder="e.g. Available weekdays"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
