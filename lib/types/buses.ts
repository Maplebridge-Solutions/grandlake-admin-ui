export type BusViewState = "list" | "add" | "edit" | "maintenance";

export interface Bus {
  fleet: string;
  route: string;
  gps: string;
  delay: string;
  status: "Active" | "Inactive" | "Maintenance";
  license?: string;
  tracking?: string;
  routeId?: string;
  type?: string;
  accessible?: string;
}

export interface MaintenanceTask {
  busNo: string;
  type: string;
  setFor: string;
  estimatedReturn: string;
  mechanic: string;
  status: "Scheduled" | "Urgent Repair" | "Completed" | "In shop";
}

export interface BusListProps {
  onAddBus: () => void;
  onEditBus: (bus: Bus) => void;
  onMaintenance: () => void;
}

export interface BusFormProps {
  onBack: () => void;
  bus?: Bus;
}

export interface MaintenanceManagementProps {
  onAddMechanic: () => void;
  onBack: () => void;
}

export interface AddMechanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}
