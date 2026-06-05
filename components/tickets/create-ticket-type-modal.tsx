"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
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
import { createTicketEntry } from "@/lib/api/tickets";
import type { CreateTicketTypeModalProps } from "@/lib/types/tickets";
import { toast } from "sonner";

interface FormErrors {
  name?: string;
  category?: string;
  riderType?: string;
  price?: string;
  validityDays?: string;
}

const CATEGORIES = [
  { label: "Single Ride", value: "SINGLE_RIDE" },
  { label: "Multi Ride", value: "MULTI_RIDE" },
  { label: "Day Pass", value: "DAY_PASS" },
  { label: "Week Pass", value: "WEEK_PASS" },
  { label: "Month Pass", value: "MONTH_PASS" },
];

const RIDER_TYPES = [
  { label: "Adult", value: "ADULT" },
  { label: "Youth", value: "YOUTH" },
  { label: "Senior", value: "SENIOR" },
  { label: "Student", value: "STUDENT" },
];

const VALIDITY_OPTIONS = [
  { label: "1 day", value: "1 day", days: 1 },
  { label: "7 days", value: "7 days", days: 7 },
  { label: "30 days", value: "30 days", days: 30 },
  { label: "365 days", value: "365 days", days: 365 },
];

const getCategoryValue = (label: string) => CATEGORIES.find((c) => c.label === label)?.value ?? label;
const getRiderTypeValue = (label: string) => RIDER_TYPES.find((r) => r.label === label)?.value ?? label;
const getValidityDays = (label: string) => VALIDITY_OPTIONS.find((v) => v.label === label)?.days ?? parseInt(label, 10);

export default function CreateTicketTypeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketTypeModalProps & { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [riderType, setRiderType] = useState("");
  const [ridesCount, setRidesCount] = useState("1");
  const [price, setPrice] = useState("");
  const [validityDays, setValidityDays] = useState("365 days");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const reset = () => {
    setName("");
    setCategory("");
    setRiderType("");
    setRidesCount("1");
    setPrice("");
    setValidityDays("365 days");
    setDescription("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Ticket name is required.";
    if (!category) e.category = "Please select a category.";
    if (!riderType) e.riderType = "Please select a rider type.";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) e.price = "Enter a valid price.";
    if (!validityDays) e.validityDays = "Please select a validity period.";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await createTicketEntry({
        name,
        description,
        category: getCategoryValue(category),
        riderType: getRiderTypeValue(riderType),
        transportMode: "BUS",
        ridesCount: parseInt(ridesCount, 10),
        price: parseFloat(price),
        currency: "CAD",
        validityDays: getValidityDays(validityDays),
      });
      toast.success("Ticket type created successfully.");
      reset();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create ticket type.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Create Ticket Type
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-sm font-bold text-content-muted">Ticket Name</Label>
              <Input
                placeholder="e.g. Adult 1 Ride"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all ${errors.name ? "border-red-400" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v ?? ""); if (v !== "Multi Ride") setRidesCount("1"); setErrors((prev) => ({ ...prev, category: undefined })); }}>
                <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all ${errors.category ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Rider Type</Label>
              <Select value={riderType} onValueChange={(v) => { setRiderType(v ?? ""); setErrors((prev) => ({ ...prev, riderType: undefined })); }}>
                <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all ${errors.riderType ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select rider type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  {RIDER_TYPES.map((r) => (
                    <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.riderType && <p className="text-xs text-red-500 font-medium">{errors.riderType}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className={`text-sm font-bold ${category === "Multi Ride" ? "text-content-muted" : "text-content-muted/40"}`}>
                Number of Rides
              </Label>
              <Select
                value={ridesCount}
                onValueChange={setRidesCount}
                disabled={category !== "Multi Ride"}
              >
                <SelectTrigger className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select rides" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  <SelectItem value="10">10 rides</SelectItem>
                  <SelectItem value="20">20 rides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Price</Label>
              <div className={`flex h-12 rounded-2xl border bg-surface-page transition-all ${errors.price ? "border-red-400" : "border-surface-subtle"}`}>
                <span className="flex items-center pl-4 pr-2 text-sm font-bold text-black shrink-0">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setErrors((prev) => ({ ...prev, price: undefined })); }}
                  onBlur={(e) => { const n = parseFloat(e.target.value); if (!isNaN(n)) setPrice(n.toFixed(2)); }}
                  className="flex-1 bg-transparent px-2 text-base font-semibold text-black outline-none placeholder:text-gray-400 placeholder:font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="flex items-center pl-2 pr-4 text-sm font-bold text-black shrink-0">
                  CAD
                </span>
              </div>
              {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Validity</Label>
              <Select value={validityDays} onValueChange={(v) => { setValidityDays(v ?? ""); setErrors((prev) => ({ ...prev, validityDays: undefined })); }}>
                <SelectTrigger className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all ${errors.validityDays ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  {VALIDITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.days} value={opt.label}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.validityDays && <p className="text-xs text-red-500 font-medium">{errors.validityDays}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">Description (optional)</Label>
              <Input
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand focus:bg-transparent transition-all"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
          >
            <Save size={20} className="mr-2" />
            {loading ? "Saving..." : "Save Ticket Type"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
