export type DriverViewState = "list" | "add" | "edit" | "profile";

export interface Driver {
  id: string;
  staffId: string;
  name: string;
  timeLeftToBreak: string;
  breakProgress: number;
  activeRouteId: string;
  complianceAlert: string;
  status: "Active" | "Inactive" | "Incomplete";
  image: string;
}

export interface DriverListProps {
  onAddDriver: () => void;
  onViewProfile: (driver: Driver) => void;
  onEditDriver: (driver: Driver) => void;
}

export interface DriverFormProps {
  onBack: () => void;
  driver?: Driver;
}

export interface DriverProfileProps {
  driver: Driver;
  onBack: () => void;
  onEdit: () => void;
}

export interface AssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}
