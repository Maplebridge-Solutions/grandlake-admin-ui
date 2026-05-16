"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Upload,
  Clock,
  ChevronRight,
  Wand2,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { createRoute, updateRoute } from "@/lib/api/routes";
import type { RouteFormProps } from "@/lib/types/routes";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  frequency: string;
  is24hoursService: boolean;
}

const emptyDaySchedule = (): DaySchedule => ({
  enabled: false,
  startTime: "",
  endTime: "",
  frequency: "",
  is24hoursService: false,
});

interface FormErrors {
  name?: string;
  origin?: string;
  destination?: string;
  stops?: string;
  schedule?: string;
}

function timeOptions() {
  return Array.from({ length: 24 }, (_, h) => {
    const val = `${String(h).padStart(2, "0")}:00`;
    const label = h === 0 ? "12:00 AM" : h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
    return { val, label };
  });
}

export default function RouteForm({ onBack, route, readOnly = false, onViewSchedule }: RouteFormProps) {
  const [name, setName] = useState(route?.name ?? "");
  const [routeNumber, setRouteNumber] = useState(route?.routeNumber?.toString() ?? "");
  const [origin, setOrigin] = useState(route?.origin?.name ?? "");
  const [destination, setDestination] = useState(route?.destination?.name ?? "");
  const [stopSearch, setStopSearch] = useState("");
  const [frequency, setFrequency] = useState(route?.frequency?.toString() ?? "");
  const [stops, setStops] = useState<string[]>(
    route ? route.stops.map((s) => s.name) : [],
  );
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(() => {
    const base = Object.fromEntries(DAYS.map((d) => [d, emptyDaySchedule()]));
    if (route?.schedules?.length) {
      for (const s of route.schedules) {
        const day = DAYS.find((d) => d.toLowerCase() === s.date.toLowerCase()) ?? s.date;
        if (day && base[day] !== undefined) {
          base[day] = {
            enabled: true,
            startTime: s.startTime,
            endTime: s.endTime,
            frequency: "",
            is24hoursService: s.is24hoursService,
          };
        }
      }
    }
    return base;
  });
  const [scheduleView, setScheduleView] = useState<"default" | "variant">("default");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const removeStop = (index: number) => setStops(stops.filter((_, i) => i !== index));

  const addStop = () => {
    const trimmed = stopSearch.trim();
    if (trimmed && !stops.includes(trimmed)) {
      setStops((prev) => [...prev, trimmed]);
      setStopSearch("");
      setErrors((prev) => ({ ...prev, stops: undefined }));
    }
  };

  const patchDay = (day: string, patch: Partial<DaySchedule>) => {
    setDaySchedules((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
    setErrors((prev) => ({ ...prev, schedule: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Route name is required.";
    if (!origin.trim()) e.origin = "Origin location is required.";
    if (!destination.trim()) e.destination = "Final destination is required.";
    if (stops.length === 0) e.stops = "At least one stop is required.";
    const enabledDays = DAYS.filter((d) => daySchedules[d].enabled);
    if (enabledDays.length === 0) {
      e.schedule = "Please enable at least one schedule day.";
    } else {
      for (const d of enabledDays) {
        const ds = daySchedules[d];
        if (!ds.is24hoursService && (!ds.startTime || !ds.endTime)) {
          e.schedule = `Please set start and end time for ${d}.`;
          break;
        }
      }
    }
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const end24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const end24Time = `${pad(end24.getHours())}:${pad(end24.getMinutes())}`;

      const schedules = DAYS.filter((d) => daySchedules[d].enabled).map((d) => {
        const s = daySchedules[d];
        return {
          date: d,
          startTime: s.is24hoursService ? currentTime : s.startTime,
          endTime: s.is24hoursService ? end24Time : s.endTime,
          is24hoursService: s.is24hoursService,
        };
      });

      const body = {
        name: name.trim(),
        ...(routeNumber ? { routeNumber: Number(routeNumber) } : {}),
        ...(frequency ? { frequency: Number(frequency) } : {}),
        origin: { name: origin.trim() },
        destination: { name: destination.trim() },
        stops: stops.map((s) => ({ name: s })),
        schedules,
      };

      if (route) {
        await updateRoute(route._id, body);
      } else {
        await createRoute(body);
      }
      toast.success(route ? "Route updated successfully." : "Route created successfully.");
      onBack();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = cn(
    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
    readOnly && "opacity-70 cursor-not-allowed",
  );

  const times = timeOptions();

  const schedulePanel = (
    <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-6">
      {scheduleView === "default" ? (
        <>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-content-primary">
              {readOnly ? "Schedule" : "Set Default Schedule"}
            </h3>
            {!readOnly && (
              <p className="text-sm text-content-muted">
                Enable days and set start/end times. Toggle 24h for round-the-clock service.
              </p>
            )}
          </div>

          {!readOnly && (
            <Button variant="outline" className="w-full h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2">
              <Upload size={18} />
              Upload File Instead
            </Button>
          )}

          <div className="space-y-6">
            {DAYS.map((day) => {
              const ds = daySchedules[day];
              if (readOnly && !ds.enabled) return null;
              return (
                <div key={day} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={day}
                      checked={ds.enabled}
                      onCheckedChange={(v) => !readOnly && patchDay(day, { enabled: !!v })}
                      disabled={readOnly}
                      className="rounded-md border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                    />
                    <Label htmlFor={day} className="text-sm font-bold text-content-primary">
                      {day}
                    </Label>
                    {ds.enabled && (
                      <div className="flex items-center gap-2 ml-auto">
                        <Checkbox
                          id={`${day}-24h`}
                          checked={ds.is24hoursService}
                          onCheckedChange={(v) => !readOnly && patchDay(day, { is24hoursService: !!v })}
                          disabled={readOnly}
                          className="rounded-md border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                        />
                        <Label htmlFor={`${day}-24h`} className="text-xs text-content-muted">
                          24h service
                        </Label>
                      </div>
                    )}
                  </div>
                  {ds.enabled && !ds.is24hoursService && (
                    <div className="grid grid-cols-2 gap-3 pl-6">
                      <Select value={ds.startTime} onValueChange={(v) => !readOnly && patchDay(day, { startTime: v ?? "" })} disabled={readOnly}>
                        <SelectTrigger className={cn("h-10 bg-surface-page border-surface-subtle rounded-xl text-xs", !ds.startTime && errors.schedule && "border-status-error")}>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-surface-subtle">
                          {times.map(({ val, label }) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={ds.endTime} onValueChange={(v) => !readOnly && patchDay(day, { endTime: v ?? "" })} disabled={readOnly}>
                        <SelectTrigger className={cn("h-10 bg-surface-page border-surface-subtle rounded-xl text-xs", !ds.endTime && errors.schedule && "border-status-error")}>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-surface-subtle">
                          {times.map(({ val, label }) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              );
            })}
            {readOnly && !DAYS.some((d) => daySchedules[d].enabled) && (
              <p className="text-sm text-content-muted text-center py-4">No schedule configured.</p>
            )}
          </div>

          {errors.schedule && (
            <p className="text-xs text-status-error font-medium">{errors.schedule}</p>
          )}

          <Button variant="ghost" onClick={() => setScheduleView("variant")} className="w-full text-brand hover:bg-brand-light font-bold text-sm">
            View Variants
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-content-primary">
              {readOnly ? "Schedule Variants" : "Add Schedule Variant"}
            </h3>
            {!readOnly && (
              <p className="text-sm text-content-muted">
                A variant can be weekends or holiday schedule.
              </p>
            )}
          </div>

          {!readOnly && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2">
                <Upload size={18} />Upload File
              </Button>
              <Button variant="outline" className="flex-1 h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2">
                <Plus size={18} />Add Manually
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-4 bg-brand-light/10 rounded-2xl border border-brand-light group cursor-pointer"
              onClick={() => {
                const entries = DAYS.filter((d) => daySchedules[d].enabled).map((d) => ({
                  day: d,
                  startTime: daySchedules[d].startTime,
                  endTime: daySchedules[d].endTime,
                  is24hoursService: daySchedules[d].is24hoursService,
                }));
                onViewSchedule(entries, name);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm">
                  <Clock className="text-brand" size={20} />
                </div>
                <p className="text-sm font-bold text-content-primary">Default schedule</p>
              </div>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </Button>
                )}
                <ChevronRight size={18} className="text-content-muted" />
              </div>
            </div>
          </div>

          <Button variant="ghost" onClick={() => setScheduleView("default")} className="w-full text-brand hover:bg-brand-light font-bold text-sm">
            Back to Settings
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-content-primary">
          {readOnly ? "View Route" : route ? "Edit Route" : "Create a New Route"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — fields + schedule (on mobile) + save */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main fields */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Route Name {!readOnly && <span className="text-status-error">*</span>}
                </Label>
                <Input
                  placeholder="e.g. Minto to Chipman"
                  value={name}
                  onChange={(e) => { if (!readOnly) { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); } }}
                  readOnly={readOnly}
                  className={cn(inputClass, errors.name && "border-status-error")}
                />
                {errors.name && <p className="text-xs text-status-error">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">Route Number</Label>
                <Input
                  placeholder="e.g. 5"
                  type="number"
                  value={routeNumber}
                  onChange={(e) => !readOnly && setRouteNumber(e.target.value)}
                  readOnly={readOnly}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">Frequency (minutes)</Label>
                <Input
                  placeholder="e.g. 15"
                  type="number"
                  min={1}
                  value={frequency}
                  onChange={(e) => !readOnly && setFrequency(e.target.value)}
                  readOnly={readOnly}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Origin Location {!readOnly && <span className="text-status-error">*</span>}
                </Label>
                <Input
                  placeholder="e.g. 1 Main Street, Minto"
                  value={origin}
                  onChange={(e) => { if (!readOnly) { setOrigin(e.target.value); setErrors((p) => ({ ...p, origin: undefined })); } }}
                  readOnly={readOnly}
                  className={cn(inputClass, errors.origin && "border-status-error")}
                />
                {errors.origin && <p className="text-xs text-status-error">{errors.origin}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Final Destination {!readOnly && <span className="text-status-error">*</span>}
                </Label>
                <Input
                  placeholder="e.g. 10 Civic Court, Chipman"
                  value={destination}
                  onChange={(e) => { if (!readOnly) { setDestination(e.target.value); setErrors((p) => ({ ...p, destination: undefined })); } }}
                  readOnly={readOnly}
                  className={cn(inputClass, errors.destination && "border-status-error")}
                />
                {errors.destination && <p className="text-xs text-status-error">{errors.destination}</p>}
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-content-primary">
                    {readOnly ? "Stops" : "Add/Edit Stops"} {!readOnly && <span className="text-status-error text-sm">*</span>}
                  </h3>
                  {!readOnly && (
                    <p className="text-sm text-content-muted">Type a stop name and press Enter or + to add</p>
                  )}
                </div>
                {!readOnly && (
                  <Button variant="outline" className="rounded-full px-4 h-10 border-brand text-brand hover:bg-brand-light font-bold text-xs gap-2">
                    <Wand2 size={16} />
                    Generate Instead
                  </Button>
                )}
              </div>

              {!readOnly && (
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
                    <Input
                      placeholder="Type a stop name to add..."
                      value={stopSearch}
                      onChange={(e) => setStopSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addStop()}
                      className={cn("h-12 pl-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", errors.stops && "border-status-error")}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={addStop} className="h-12 w-12 rounded-xl border-brand text-brand hover:bg-brand-light">
                    <Plus size={18} />
                  </Button>
                </div>
              )}

              {errors.stops && <p className="text-xs text-status-error">{errors.stops}</p>}

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {stops.length === 0 ? (
                  <p className="text-sm text-content-muted text-center py-6">No stops added yet.</p>
                ) : (
                  stops.map((stop, i) => (
                    <div
                      key={i}
                      className={cn(
                        "group flex items-center justify-between p-4 bg-surface-page rounded-xl border border-transparent transition-all",
                        !readOnly && "hover:border-brand-light hover:bg-brand-light/5",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", i === 0 ? "bg-brand" : "bg-content-muted")} />
                        <span className={cn("text-sm font-medium", i === 0 ? "text-brand" : "text-content-secondary")}>{stop}</span>
                      </div>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStop(i)}
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-status-error hover:bg-status-error-bg transition-all"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Schedule panel — visible on mobile inside the left col, hidden on lg (shown in right col) */}
          <div className="lg:hidden">{schedulePanel}</div>

          {!readOnly && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? "Saving..." : route ? "Save Changes" : "Save all"}
            </Button>
          )}
        </div>

        {/* Right col — schedule panel on desktop */}
        <div className="hidden lg:block space-y-6">{schedulePanel}</div>
      </div>
    </div>
  );
}
