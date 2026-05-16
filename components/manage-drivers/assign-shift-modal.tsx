"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { AssignShiftModalProps } from "@/lib/types/drivers";
import type { DriverData } from "@/lib/types/drivers";
import type { BusData } from "@/lib/types/buses";
import type { RouteData } from "@/lib/types/routes";
import { getAllDrivers } from "@/lib/api/drivers";
import { getBuses, assignShift } from "@/lib/api/fleet";
import { getAllRoutes } from "@/lib/api/routes";
import { toast } from "sonner";

const RECURRING_DAYS_OPTIONS = [
  { label: "1 Day", value: 1 },
  { label: "5 Days", value: 5 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];
const getRecurringDaysValue = (label: string) =>
  RECURRING_DAYS_OPTIONS.find((o) => o.label === label)?.value ?? parseInt(label, 10);

interface FormErrors {
  driverName?: string;
  routeName?: string;
  busName?: string;
  shiftDate?: string;
  startTime?: string;
  endTime?: string;
}

function driverLabel(d: DriverData) {
  return `${d.firstName} ${d.lastName}${d.driverDetails?.staffId ? ` (${d.driverDetails.staffId})` : ""}`;
}

function busLabel(b: BusData) {
  return `Bus ${b.busNumber}${b.regOrPlateNumber ? ` — ${b.regOrPlateNumber}` : ""}`;
}

export default function AssignShiftModal({
  isOpen,
  onClose,
  defaultDriverId,
  onSuccess,
}: AssignShiftModalProps) {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);

  const [driverName, setDriverName] = useState("");
  const [secondaryDriverName, setSecondaryDriverName] = useState("");
  const [routeName, setRouteName] = useState("");
  const [busName, setBusName] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState("1 Day");

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchData() {
      try {
        const [driversRes, busesRes, routesRes] = await Promise.all([
          getAllDrivers({ limit: 100, isDriver: true }),
          getBuses({ limit: 100 }),
          getAllRoutes(),
        ]);
        if (driversRes.success) {
          const list = Array.isArray(driversRes.data) ? driversRes.data : [];
          setDrivers(list);
          if (defaultDriverId) {
            const match = list.find((d) => d._id === defaultDriverId);
            if (match) setDriverName(driverLabel(match));
          }
        }
        if (busesRes.success)
          setBuses(Array.isArray(busesRes.data) ? busesRes.data : []);
        if (routesRes.success)
          setRoutes(Array.isArray(routesRes.data) ? routesRes.data : []);
      } catch {
        // keep empty
      }
    }
    fetchData();
  }, [isOpen, defaultDriverId]);

  const resetForm = () => {
    setDriverName("");
    setSecondaryDriverName("");
    setRouteName("");
    setBusName("");
    setShiftDate("");
    setStartTime("");
    setEndTime("");
    setIsRecurring(false);
    setRecurringDays("1");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!driverName) e.driverName = "Driver is required.";
    if (!routeName) e.routeName = "Route is required.";
    if (!busName) e.busName = "Bus is required.";
    if (!shiftDate) e.shiftDate = "Shift date is required.";
    if (!startTime) e.startTime = "Start time is required.";
    if (!endTime) e.endTime = "End time is required.";
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
      const driverOptions = drivers.filter((d) => d.isDriver);
      const resolvedDriver = driverOptions.find(
        (d) => driverLabel(d) === driverName,
      );
      const resolvedSecondary = driverOptions.find(
        (d) => driverLabel(d) === secondaryDriverName,
      );
      const resolvedRoute = routes.find((r) => r.name === routeName);
      const resolvedBus = buses.find((b) => busLabel(b) === busName);

      const body = {
        driver: resolvedDriver?._id ?? "",
        ...(resolvedSecondary && { secondaryDriver: resolvedSecondary._id }),
        route: resolvedRoute?._id ?? "",
        bus: resolvedBus?._id ?? "",
        shiftDate,
        startTime,
        endTime,
        isRecurring,
        recurringDays: isRecurring ? getRecurringDaysValue(recurringDays) : 1,
      };
      await assignShift(body);
      toast.success("Shift assigned successfully.");
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to assign shift.",
      );
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
              Assign Driver Shift
            </DialogTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Driver <span className="text-status-error">*</span>
              </Label>
              <Select
                value={driverName}
                onValueChange={(v) => {
                  setDriverName(v ?? "");
                  setErrors((p) => ({ ...p, driverName: undefined }));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.driverName && "border-status-error",
                  )}
                >
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {driverOptions.map((d) => (
                    <SelectItem key={d._id} value={driverLabel(d)}>
                      {driverLabel(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverName && (
                <p className="text-xs text-status-error">{errors.driverName}</p>
              )}
            </div>

            {/* Secondary Driver */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Secondary Driver (optional)
              </Label>
              <Select
                value={secondaryDriverName}
                onValueChange={(v) => setSecondaryDriverName(v ?? "")}
              >
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select here" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {driverOptions
                    .filter((d) => driverLabel(d) !== driverName)
                    .map((d) => (
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
              <Select
                value={routeName}
                onValueChange={(v) => {
                  setRouteName(v ?? "");
                  setErrors((p) => ({ ...p, routeName: undefined }));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.routeName && "border-status-error",
                  )}
                >
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {routes.map((r) => (
                    <SelectItem key={r._id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.routeName && (
                <p className="text-xs text-status-error">{errors.routeName}</p>
              )}
            </div>

            {/* Bus */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Bus <span className="text-status-error">*</span>
              </Label>
              <Select
                value={busName}
                onValueChange={(v) => {
                  setBusName(v ?? "");
                  setErrors((p) => ({ ...p, busName: undefined }));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.busName && "border-status-error",
                  )}
                >
                  <SelectValue placeholder="Select a bus" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {buses.map((b) => (
                    <SelectItem key={b._id} value={busLabel(b)}>
                      {busLabel(b)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.busName && (
                <p className="text-xs text-status-error">{errors.busName}</p>
              )}
            </div>

            {/* Shift Date */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Date of Shift <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => {
                    setShiftDate(e.target.value);
                    setErrors((p) => ({ ...p, shiftDate: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10",
                    errors.shiftDate && "border-status-error",
                  )}
                />
                <Calendar
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                  size={18}
                />
              </div>
              {errors.shiftDate && (
                <p className="text-xs text-status-error">{errors.shiftDate}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Start Time <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setErrors((p) => ({ ...p, startTime: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10",
                    errors.startTime && "border-status-error",
                  )}
                />
                <Clock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                  size={18}
                />
              </div>
              {errors.startTime && (
                <p className="text-xs text-status-error">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                End Time <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setErrors((p) => ({ ...p, endTime: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10",
                    errors.endTime && "border-status-error",
                  )}
                />
                <Clock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                  size={18}
                />
              </div>
              {errors.endTime && (
                <p className="text-xs text-status-error">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(v) => setIsRecurring(!!v)}
              className="rounded-md border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
            />
            <Label
              htmlFor="recurring"
              className="text-sm font-bold text-content-primary cursor-pointer"
            >
              This is a recurring shift
            </Label>
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label className="text-sm font-bold text-content-primary">
                Number of days
              </Label>
              <Select
                value={recurringDays}
                onValueChange={(v) => setRecurringDays(v ?? "")}
              >
                <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle">
                  {RECURRING_DAYS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.label}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <CheckCircle2 size={20} />
            {saving ? "Assigning..." : "Assign Shift"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
