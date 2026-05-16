"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, Upload, AlertTriangle, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import type { IncidentReportModalProps } from "@/lib/types/drivers";
import type { DriverData } from "@/lib/types/drivers";
import type { BusData } from "@/lib/types/buses";
import type { RouteData } from "@/lib/types/routes";
import { getAllDrivers } from "@/lib/api/drivers";
import { getBuses, createIncidentReport } from "@/lib/api/fleet";
import { getAllRoutes } from "@/lib/api/routes";
import { toast } from "sonner";

const INCIDENT_TYPES = [
  "Over Speeding",
  "Accident",
  "Mechanical Failure",
  "Passenger Issue",
  "Traffic Violation",
  "Other",
];

interface FormErrors {
  driverName?: string;
  routeName?: string;
  busName?: string;
  incidentType?: string;
  incidentDate?: string;
  incidentTime?: string;
  description?: string;
}

function driverLabel(d: DriverData) {
  return `${d.firstName} ${d.lastName}${d.driverDetails?.staffId ? ` (${d.driverDetails.staffId})` : ""}`;
}

function busLabel(b: BusData) {
  return `Bus ${b.busNumber}${b.regOrPlateNumber ? ` — ${b.regOrPlateNumber}` : ""}`;
}

export default function IncidentReportModal({ isOpen, onClose }: IncidentReportModalProps) {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);

  const [driverName, setDriverName] = useState("");
  const [secondaryDriverName, setSecondaryDriverName] = useState("");
  const [routeName, setRouteName] = useState("");
  const [busName, setBusName] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchData() {
      try {
        const [driversRes, busesRes, routesRes] = await Promise.all([
          getAllDrivers({ limit: 100, isDriver: true }),
          getBuses({ limit: 100 }),
          getAllRoutes(),
        ]);
        if (driversRes.success) setDrivers(Array.isArray(driversRes.data) ? driversRes.data : []);
        if (busesRes.success) setBuses(Array.isArray(busesRes.data) ? busesRes.data : []);
        if (routesRes.success) setRoutes(Array.isArray(routesRes.data) ? routesRes.data : []);
      } catch {
        // keep empty
      }
    }
    fetchData();
  }, [isOpen]);

  const resetForm = () => {
    setDriverName("");
    setSecondaryDriverName("");
    setRouteName("");
    setBusName("");
    setIncidentType("");
    setIncidentDate("");
    setIncidentTime("");
    setDescription("");
    setSupportingFiles([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSupportingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!driverName) e.driverName = "Driver is required.";
    if (!routeName) e.routeName = "Route is required.";
    if (!busName) e.busName = "Bus is required.";
    if (!incidentType) e.incidentType = "Incident type is required.";
    if (!incidentDate) e.incidentDate = "Incident date is required.";
    if (!incidentTime) e.incidentTime = "Incident time is required.";
    if (!description.trim()) e.description = "Description is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      const driverOptions = drivers.filter((d) => d.isDriver);
      const resolvedDriver = driverOptions.find((d) => driverLabel(d) === driverName);
      const resolvedSecondary = driverOptions.find((d) => driverLabel(d) === secondaryDriverName);
      const resolvedRoute = routes.find((r) => r.name === routeName);
      const resolvedBus = buses.find((b) => busLabel(b) === busName);

      const fd = new FormData();
      fd.append("driver", resolvedDriver?._id ?? "");
      if (resolvedSecondary) fd.append("secondaryDriver", resolvedSecondary._id);
      fd.append("route", resolvedRoute?._id ?? "");
      fd.append("bus", resolvedBus?._id ?? "");
      fd.append("incidentType", incidentType);
      fd.append("incidentDate", incidentDate);
      fd.append("incidentTime", incidentTime);
      fd.append("description", description);
      supportingFiles.forEach((file) => fd.append("supportingFiles", file));

      await createIncidentReport(fd);
      toast.success("Incident report submitted successfully.");
      handleClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit incident report.");
    } finally {
      setSaving(false);
    }
  };

  const driverOptions = drivers.filter((d) => d.isDriver);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] rounded-3xl border-surface-subtle p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-content-primary">
              Incident Reporting
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10 rounded-full hover:bg-surface-page transition-all">
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Driver <span className="text-status-error">*</span>
              </Label>
              <Select value={driverName} onValueChange={(v) => { setDriverName(v ?? ""); setErrors((p) => ({ ...p, driverName: undefined })); }}>
                <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.driverName && "border-status-error")}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {driverOptions.map((d) => (
                    <SelectItem key={d._id} value={driverLabel(d)}>
                      {driverLabel(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverName && <p className="text-xs text-status-error">{errors.driverName}</p>}
            </div>

            {/* Secondary Driver */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">Secondary Driver (optional)</Label>
              <Select value={secondaryDriverName} onValueChange={(v) => setSecondaryDriverName(v ?? "")}>
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {driverOptions.filter((d) => driverLabel(d) !== driverName).map((d) => (
                    <SelectItem key={d._id} value={driverLabel(d)}>
                      {driverLabel(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Route */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Route <span className="text-status-error">*</span>
              </Label>
              <Select value={routeName} onValueChange={(v) => { setRouteName(v ?? ""); setErrors((p) => ({ ...p, routeName: undefined })); }}>
                <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.routeName && "border-status-error")}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {routes.map((r) => (
                    <SelectItem key={r._id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.routeName && <p className="text-xs text-status-error">{errors.routeName}</p>}
            </div>

            {/* Bus */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Bus <span className="text-status-error">*</span>
              </Label>
              <Select value={busName} onValueChange={(v) => { setBusName(v ?? ""); setErrors((p) => ({ ...p, busName: undefined })); }}>
                <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.busName && "border-status-error")}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {buses.map((b) => (
                    <SelectItem key={b._id} value={busLabel(b)}>
                      {busLabel(b)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.busName && <p className="text-xs text-status-error">{errors.busName}</p>}
            </div>

            {/* Incident Type */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Type of Incident <span className="text-status-error">*</span>
              </Label>
              <Select value={incidentType} onValueChange={(v) => { setIncidentType(v ?? ""); setErrors((p) => ({ ...p, incidentType: undefined })); }}>
                <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.incidentType && "border-status-error")}>
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {INCIDENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && <p className="text-xs text-status-error">{errors.incidentType}</p>}
            </div>

            {/* Incident Date */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Date of Incident <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => { setIncidentDate(e.target.value); setErrors((p) => ({ ...p, incidentDate: undefined })); }}
                  className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10", errors.incidentDate && "border-status-error")}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" size={18} />
              </div>
              {errors.incidentDate && <p className="text-xs text-status-error">{errors.incidentDate}</p>}
            </div>

            {/* Incident Time */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Time of Incident <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="time"
                  value={incidentTime}
                  onChange={(e) => { setIncidentTime(e.target.value); setErrors((p) => ({ ...p, incidentTime: undefined })); }}
                  className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10", errors.incidentTime && "border-status-error")}
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" size={18} />
              </div>
              {errors.incidentTime && <p className="text-xs text-status-error">{errors.incidentTime}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-content-primary">
              Describe Incident <span className="text-status-error">*</span>
            </Label>
            <Textarea
              placeholder="Type here"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
              className={cn("min-h-[120px] bg-surface-page border-surface-subtle rounded-2xl focus:ring-brand", errors.description && "border-status-error")}
            />
            {errors.description && <p className="text-xs text-status-error">{errors.description}</p>}
          </div>

          {/* Supporting Files */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-content-primary">Supporting Files (optional)</Label>

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
              className="w-full h-32 bg-brand-pale/10 rounded-2xl border-2 border-dashed border-brand-light flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-brand-pale/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm text-brand group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-xs font-bold text-content-primary">Tap here to upload (PDF, PNG supported)</p>
            </div>

            {supportingFiles.length > 0 && (
              <div className="space-y-3">
                {supportingFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted">
                        <FileText size={18} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-bold text-content-primary truncate">{file.name}</p>
                        <p className="text-xs text-content-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSupportingFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full h-14 bg-status-error hover:bg-status-error/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-status-error/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <AlertTriangle size={20} />
            {saving ? "Reporting..." : "Report Incident"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
