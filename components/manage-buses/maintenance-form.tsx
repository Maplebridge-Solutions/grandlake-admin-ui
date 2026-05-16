"use client";

import { ArrowLeft, Clock, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import MaintenanceLogsPanel from "./maintenance-logs-panel";
import type {
  BusData,
  MechanicData,
  MaintenanceRecord,
} from "@/lib/types/buses";

export interface MaintenanceFormState {
  formBusId: string;
  serviceType: string;
  maintenanceDate: string;
  maintenanceTime: string;
  estimatedReturnTime: string;
  assignedMechanic: string;
  comments: string;
}

export interface MaintenanceFormErrors {
  formBusId?: string;
  serviceType?: string;
  maintenanceDate?: string;
  maintenanceTime?: string;
  estimatedReturnTime?: string;
  assignedMechanic?: string;
}

interface MaintenanceFormProps {
  form: MaintenanceFormState;
  onChange: (patch: Partial<MaintenanceFormState>) => void;
  onClearError: (field: keyof MaintenanceFormErrors) => void;
  buses: BusData[];
  mechanics: MechanicData[];
  busId: string;
  editingTask: MaintenanceRecord | null;
  logs: MaintenanceRecord["logs"];
  logsLoading: boolean;
  saving: boolean;
  formErrors: MaintenanceFormErrors;
  onSave: () => void;
  onBack: () => void;
  onAddMechanic: (onCreated: (mechanic: MechanicData) => void) => void;
  onMechanicCreated: (mechanic: MechanicData) => void;
}

export default function MaintenanceForm({
  form,
  onChange,
  onClearError,
  buses,
  mechanics,
  busId,
  editingTask,
  logs,
  logsLoading,
  saving,
  formErrors,
  onSave,
  onBack,
  onAddMechanic,
  onMechanicCreated,
}: MaintenanceFormProps) {
  const selectedTaskBus = buses.find((b) => b._id === busId);

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
          {editingTask ? "Edit Maintenance" : "Schedule Maintenance"}
          {selectedTaskBus ? ` — Bus ${selectedTaskBus.busNumber}` : ""}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bus field */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-bold text-content-primary">
                  Bus <span className="text-status-error">*</span>
                </Label>
                {busId && selectedTaskBus ? (
                  <Input
                    readOnly
                    value={`Bus ${selectedTaskBus.busNumber}`}
                    className="h-12 bg-surface-page border-surface-subtle rounded-xl text-content-secondary"
                  />
                ) : (
                  <Select
                    value={form.formBusId}
                    onValueChange={(v) => { if (v) { onChange({ formBusId: v }); onClearError("formBusId"); } }}
                  >
                    <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", formErrors.formBusId && "border-status-error")}>
                      <SelectValue placeholder="Select a bus" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-surface-subtle">
                      {buses.map((b) => (
                        <SelectItem key={b._id} value={`Bus ${b.busNumber}`}>
                          Bus {b.busNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {formErrors.formBusId && <p className="text-xs text-status-error">{formErrors.formBusId}</p>}
              </div>

              {/* Service type */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-bold text-content-primary">
                  Type of service <span className="text-status-error">*</span>
                </Label>
                <Input
                  placeholder="e.g. Oil change"
                  value={form.serviceType}
                  onChange={(e) => { onChange({ serviceType: e.target.value }); onClearError("serviceType"); }}
                  className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", formErrors.serviceType && "border-status-error")}
                />
                {formErrors.serviceType && <p className="text-xs text-status-error">{formErrors.serviceType}</p>}
              </div>

              {/* Maintenance date */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Maintenance Date <span className="text-status-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.maintenanceDate}
                    onChange={(e) => { onChange({ maintenanceDate: e.target.value }); onClearError("maintenanceDate"); }}
                    className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10", formErrors.maintenanceDate && "border-status-error")}
                  />
                  <Calendar
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                    size={18}
                  />
                </div>
                {formErrors.maintenanceDate && <p className="text-xs text-status-error">{formErrors.maintenanceDate}</p>}
              </div>

              {/* Maintenance time */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Maintenance Time <span className="text-status-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={form.maintenanceTime}
                    onChange={(e) => { onChange({ maintenanceTime: e.target.value }); onClearError("maintenanceTime"); }}
                    className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10", formErrors.maintenanceTime && "border-status-error")}
                  />
                  <Clock
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                    size={18}
                  />
                </div>
                {formErrors.maintenanceTime && <p className="text-xs text-status-error">{formErrors.maintenanceTime}</p>}
              </div>

              {/* Estimated return time */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Estimated Return Time <span className="text-status-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={form.estimatedReturnTime}
                    onChange={(e) => { onChange({ estimatedReturnTime: e.target.value }); onClearError("estimatedReturnTime"); }}
                    className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-10", formErrors.estimatedReturnTime && "border-status-error")}
                  />
                  <Clock
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
                    size={18}
                  />
                </div>
                {formErrors.estimatedReturnTime && <p className="text-xs text-status-error">{formErrors.estimatedReturnTime}</p>}
              </div>

              {/* Assigned mechanic */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold text-content-primary">
                    Assigned Mechanic <span className="text-status-error">*</span>
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddMechanic(onMechanicCreated)}
                    className="h-8 w-8 rounded-full text-brand hover:bg-brand-light"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
                <Select
                  value={form.assignedMechanic}
                  onValueChange={(v) => { if (v) { onChange({ assignedMechanic: v }); onClearError("assignedMechanic"); } }}
                >
                  <SelectTrigger className={cn("h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand", formErrors.assignedMechanic && "border-status-error")}>
                    <SelectValue placeholder="Select a mechanic" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    {mechanics.map((m) => (
                      <SelectItem key={m._id} value={m.fullName}>
                        {m.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.assignedMechanic && <p className="text-xs text-status-error">{formErrors.assignedMechanic}</p>}
              </div>

              {/* Comments */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-bold text-content-primary">
                  Additional comments
                </Label>
                <Textarea
                  placeholder="Type here"
                  value={form.comments}
                  onChange={(e) => onChange({ comments: e.target.value })}
                  className="min-h-30 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand resize-none"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Saving..." : editingTask ? "Save Changes" : "Save"}
          </Button>
        </div>

        {/* Logs panel */}
        <div className="space-y-6">
          <MaintenanceLogsPanel logs={logs} loading={logsLoading} />
        </div>
      </div>
    </div>
  );
}
