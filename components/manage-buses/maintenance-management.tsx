"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAINTENANCE_FILTER_TABS } from "@/lib/constants/maintenance";
import MaintenanceForm, { type MaintenanceFormState, type MaintenanceFormErrors } from "./maintenance-form";
import MaintenanceTable from "./table/maintenance-table";
import DeleteMaintenanceModal from "./delete-maintenance-modal";
import type {
  MaintenanceManagementProps,
  MaintenanceRecord,
  MechanicData,
  BusData,
} from "@/lib/types/buses";
import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceLogs,
  getBuses,
  getMechanics,
} from "@/lib/api/fleet";
import { toast } from "sonner";

const EMPTY_FORM: MaintenanceFormState = {
  formBusId: "",
  serviceType: "",
  maintenanceDate: "",
  maintenanceTime: "",
  estimatedReturnTime: "",
  assignedMechanic: "",
  comments: "",
};

export default function MaintenanceManagement({
  onAddMechanic,
  onBack,
  busId,
}: MaintenanceManagementProps) {
  const [view, setView] = useState<"list" | "form">("list");
  const [tasks, setTasks] = useState<MaintenanceRecord[]>([]);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [mechanics, setMechanics] = useState<MechanicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<MaintenanceRecord | null>(null);
  const [logs, setLogs] = useState<MaintenanceRecord["logs"]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [form, setForm] = useState<MaintenanceFormState>({ ...EMPTY_FORM, formBusId: busId });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<MaintenanceFormErrors>({});
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [busRes, mechanicRes] = await Promise.all([
          getBuses({ limit: 100 }),
          getMechanics({ limit: 100, status: "ACTIVE" }),
        ]);
        if (busRes.success) setBuses(Array.isArray(busRes.data) ? busRes.data : []);
        if (mechanicRes.success) setMechanics(Array.isArray(mechanicRes.data) ? mechanicRes.data : []);
      } catch {
        // keep empty
      }
    }
    fetchDropdownData();
  }, []);

  useEffect(() => {
    async function fetchMaintenance() {
      setLoading(true);
      try {
        const res = await getAllMaintenance(busId ? { bus: busId } : undefined);
        if (res.success) setTasks(Array.isArray(res.data) ? res.data : []);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedMechanic.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && t.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const resetForm = () => {
    setEditingTask(null);
    setForm({ ...EMPTY_FORM, formBusId: busId });
    setFormErrors({});
    setLogs([]);
  };

  const handleEditTask = (task: MaintenanceRecord) => {
    setEditingTask(task);
    setForm({
      formBusId: task.bus == null ? "" : `Bus ${typeof task.bus === "object" ? task.bus.busNumber : task.bus}`,
      serviceType: task.serviceType,
      maintenanceDate: task.maintenanceDate.split("T")[0],
      maintenanceTime: task.maintenanceTime,
      estimatedReturnTime: task.estimatedReturnTime.split(".")[0].slice(0, 16),
      assignedMechanic: task.assignedMechanic,
      comments: task.comments ?? "",
    });
    setFormErrors({});
    setLogs([]);
    setLogsLoading(true);
    setView("form");
    async function fetchLogs() {
      try {
        const res = await getMaintenanceLogs(task._id);
        if (res.success) setLogs(Array.isArray(res.data) ? res.data : []);
      } catch {
        // keep empty
      } finally {
        setLogsLoading(false);
      }
    }
    fetchLogs();
  };

  const handleStatusChange = async (task: MaintenanceRecord, status: string) => {
    setUpdatingStatusId(task._id);
    try {
      const taskBusId = typeof task.bus === "object" ? task.bus._id : task.bus;
      const res = await updateMaintenance(taskBusId, task._id, { status });
      if (res.success) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
        toast.success("Maintenance status updated.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const taskBusId = typeof deleteTarget.bus === "object" ? deleteTarget.bus._id : deleteTarget.bus;
      const res = await deleteMaintenance(taskBusId, deleteTarget._id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
        setDeleteTarget(null);
        toast.success("Maintenance record deleted.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete maintenance record.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    const rawBusId = form.formBusId ? String(form.formBusId).replace(/^Bus\s*/i, "").trim() : "";
    const targetBusId = busId || buses.find((b) => b.busNumber === Number(rawBusId))?._id;
    const errs: MaintenanceFormErrors = {};
    if (!targetBusId) errs.formBusId = "Bus is required.";
    if (!form.serviceType) errs.serviceType = "Type of service is required.";
    if (!form.maintenanceDate) errs.maintenanceDate = "Maintenance date is required.";
    if (!form.maintenanceTime) errs.maintenanceTime = "Maintenance time is required.";
    if (!form.estimatedReturnTime) errs.estimatedReturnTime = "Estimated return time is required.";
    if (!form.assignedMechanic) errs.assignedMechanic = "Assigned mechanic is required.";
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setSaving(true);
    try {
      if (editingTask) {
        const editBusId = typeof editingTask.bus === "object" ? editingTask.bus._id : editingTask.bus;
        const res = await updateMaintenance(editBusId, editingTask._id, {
          serviceType: form.serviceType,
          maintenanceDate: form.maintenanceDate,
          maintenanceTime: form.maintenanceTime,
          estimatedReturnTime: form.estimatedReturnTime,
          assignedMechanic: form.assignedMechanic,
          comments: form.comments,
        });
        if (res.success) {
          setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data : t)));
          toast.success("Maintenance record updated.");
          resetForm();
          setView("list");
        }
      } else {
        const res = await createMaintenance(targetBusId!, {
          serviceType: form.serviceType,
          maintenanceDate: form.maintenanceDate,
          maintenanceTime: form.maintenanceTime,
          estimatedReturnTime: form.estimatedReturnTime,
          assignedMechanic: form.assignedMechanic,
          comments: form.comments,
        });
        if (res.success) {
          setTasks((prev) => [res.data, ...prev]);
          toast.success("Maintenance scheduled successfully.");
          resetForm();
          setView("list");
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (view === "form") {
    return (
      <MaintenanceForm
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        onClearError={(field) => setFormErrors((prev) => ({ ...prev, [field]: undefined }))}
        buses={buses}
        mechanics={mechanics}
        busId={busId}
        editingTask={editingTask}
        logs={logs}
        logsLoading={logsLoading}
        saving={saving}
        formErrors={formErrors}
        onSave={handleSave}
        onBack={() => { resetForm(); setView("list"); }}
        onAddMechanic={onAddMechanic}
        onMechanicCreated={(mechanic) => {
          setMechanics((prev) => [...prev, mechanic]);
          setForm((prev) => ({ ...prev, assignedMechanic: mechanic.fullName }));
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DeleteMaintenanceModal
        target={deleteTarget}
        deleting={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-content-primary">
            Maintenance
            {busId && buses.find((b) => b._id === busId)
              ? ` — Bus ${buses.find((b) => b._id === busId)!.busNumber}`
              : ""}
          </h2>
          <Button
            onClick={() => { resetForm(); setView("form"); }}
            className="rounded-full px-6 h-11 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20"
          >
            <Plus size={18} />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4">
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full sm:w-auto text-sm hover:border-brand hover:text-brand transition-all">
              <Filter size={16} />
              {MAINTENANCE_FILTER_TABS.find((t) => t.value === activeFilter)?.label}
              <ChevronDown size={14} className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-xl border-surface-subtle w-48">
              {MAINTENANCE_FILTER_TABS.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className="rounded-lg cursor-pointer"
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden lg:block">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-auto">
            <TabsList className="bg-transparent border-none p-0 h-auto gap-2 flex flex-wrap">
              {MAINTENANCE_FILTER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-4 py-2 border border-surface-subtle data-[state=active]:bg-brand-light data-[state=active]:text-brand data-[state=active]:border-brand text-sm font-medium transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
          <Input
            placeholder="Search by service or mechanic..."
            className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <MaintenanceTable
        tasks={filteredTasks}
        loading={loading}
        updatingStatusId={updatingStatusId}
        onEdit={handleEditTask}
        onDelete={setDeleteTarget}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
