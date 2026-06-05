"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, X, FileText, Plus } from "lucide-react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";
import type { BusFormProps } from "@/lib/types/buses";
import type { RouteData } from "@/lib/types/routes";
import { addBus, updateBus, uploadBusDocuments } from "@/lib/api/fleet";
import { getAllRoutes } from "@/lib/api/routes";
import { toast } from "sonner";

const BUS_TYPES = [
  { label: "Single", value: "Single" },
  { label: "Multi", value: "Multi" },
];

const ACCESSIBLE_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const getAccessibleValue = (label: string) => ACCESSIBLE_OPTIONS.find((a) => a.label === label)?.value ?? false;

interface FormErrors {
  busNumber?: string;
  route?: string;
  busType?: string;
}

export default function BusForm({ onBack, bus }: BusFormProps) {
  const isEdit = !!bus;

  const [busNumber, setBusNumber] = useState(bus?.busNumber?.toString() ?? "");
  const [trackingId, setTrackingId] = useState(bus?.trackingId ?? "");
  const [route, setRoute] = useState("");
  const [busType, setBusType] = useState(bus?.busType ?? "Single");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [wheelChairAccessible, setWheelChairAccessible] = useState(
    bus?.wheelChairAccessible ? "Yes" : "No",
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const res = await getAllRoutes();
        if (res.success) {
          const loaded = Array.isArray(res.data) ? res.data : [];
          setRoutes(loaded);
          if (isEdit && bus?.route) {
            const match = loaded.find((r) => r._id === bus.route);
            if (match) setRoute(match.name);
          }
        }
      } catch {
        // keep empty
      } finally {
        setRoutesLoading(false);
      }
    }
    fetchRoutes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!busNumber.trim()) e.busNumber = "Fleet number is required.";
    if (!route) e.route = "Route is required.";
    if (!busType) e.busType = "Bus type is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      let busId = bus?._id;
      const routeId = routes.find((r) => r.name === route)?._id ?? route;
      if (isEdit && busId) {
        await updateBus(busId, {
          busNumber: Number(busNumber),
          trackingId,
          route: routeId,
          busType,
          wheelChairAccessible: getAccessibleValue(wheelChairAccessible),
        });
      } else {
        const res = await addBus({
          busNumber: Number(busNumber),
          trackingId,
          route: routeId,
          busType,
          wheelChairAccessible: getAccessibleValue(wheelChairAccessible),
        });
        busId = res.data._id;
      }

      if (busId && pendingFiles.length > 0) {
        const formData = new FormData();
        pendingFiles.forEach((file) => formData.append("documents", file));
        await uploadBusDocuments(busId, formData);
      }

      toast.success(isEdit ? "Bus updated successfully." : "Bus added successfully.");
      onBack();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-content-primary">
          {isEdit ? `Edit Bus ${bus.busNumber}` : "Add a Bus"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="busNumber" className="text-sm font-bold text-content-primary">
                  Fleet Number <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="busNumber"
                  type="number"
                  placeholder="e.g. 123456"
                  value={busNumber}
                  onChange={(e) => { setBusNumber(e.target.value); setErrors((p) => ({ ...p, busNumber: undefined })); }}
                  className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.busNumber && "border-status-error")}
                />
                {errors.busNumber && <p className="text-xs text-status-error">{errors.busNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingId" className="text-sm font-bold text-content-primary">
                  Tracking ID
                </Label>
                <Input
                  id="trackingId"
                  placeholder="e.g. 1234Hsfd"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Route <span className="text-status-error">*</span>
                </Label>
                <Select
                  value={route}
                  onValueChange={(v) => { if (v) { setRoute(v); setErrors((p) => ({ ...p, route: undefined })); } }}
                  disabled={routesLoading || routes.length === 0}
                >
                  <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.route && "border-status-error")}>
                    <SelectValue placeholder={routesLoading ? "Loading routes..." : routes.length === 0 ? "No routes available" : "Select a route"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    {routes.map((r) => (
                      <SelectItem key={r._id} value={r.name}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.route && <p className="text-xs text-status-error">{errors.route}</p>}
                {!routesLoading && routes.length === 0 && (
                  <Link
                    href="/manage-routes"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline mt-1"
                  >
                    <Plus size={13} />
                    No routes yet — create one first
                  </Link>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Bus Type <span className="text-status-error">*</span>
                </Label>
                <Select
                  value={busType}
                  onValueChange={(v) => { if (v) { setBusType(v); setErrors((p) => ({ ...p, busType: undefined })); } }}
                >
                  <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.busType && "border-status-error")}>
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    {BUS_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.label}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.busType && <p className="text-xs text-status-error">{errors.busType}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Wheel-chair Accessible?
                </Label>
                <Select value={wheelChairAccessible} onValueChange={(v) => v && setWheelChairAccessible(v)}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    {ACCESSIBLE_OPTIONS.map((a) => (
                      <SelectItem key={a.label} value={a.label}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Save all"}
          </Button>
        </div>

        {/* Upload Documents */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                {isEdit ? "Documents" : "Upload Documents"}
              </h3>
              <p className="text-sm text-content-muted">
                Registration, insurance and compliance documents
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-brand-light bg-brand-light/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-brand-light/10 transition-all group"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-brand/20 rounded-2xl -rotate-3 group-hover:-rotate-6 transition-transform" />
                <div className="relative w-12 h-14 bg-white border border-surface-subtle rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="text-brand" size={24} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-content-primary">Tap here to upload (PDF, PNG supported)</p>
                <p className="text-xs text-content-muted">Max 10MB per file</p>
              </div>
            </div>

            {isEdit && bus.documents && bus.documents.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Uploaded</p>
                {bus.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-surface-page rounded-2xl border border-surface-subtle">
                    <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm shrink-0">
                      <FileText className="text-content-muted" size={20} />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-bold text-content-primary truncate">{doc.name}</p>
                      <p className="text-xs text-content-muted capitalize">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Pending upload</p>
                {pendingFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-page rounded-2xl border border-surface-subtle hover:border-brand-light transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm">
                        <FileText className="text-content-muted group-hover:text-brand transition-colors" size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-content-primary">{file.name}</p>
                        <p className="text-xs text-content-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(i)}
                      className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
