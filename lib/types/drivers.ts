export type DriverViewState = "list" | "add" | "edit" | "profile";

// ─── API Types ────────────────────────────────────────────────────────────────

export interface DriverDocument {
  _id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface DriverDetails {
  _id?: string;
  staffId?: string;
  routeId?: string;
  dateOfBirth?: string;
  licenseName?: string;
  licenseNumber?: string;
  licenseClass?: string;
  licenseExpirationDate?: string;
  pictureUrl?: string;
  documents?: DriverDocument[];
}

export interface DriverAddress {
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  postalCode?: string;
}

export interface DriverUser {
  _id: string;
  email: string;
  roles: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriverData {
  _id: string;
  firstName: string;
  lastName: string;
  user: DriverUser | null;
  isDriver: boolean;
  phone?: string;
  address?: DriverAddress;
  settings?: { language: string; _id: string };
  driverDetails?: DriverDetails;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDriverBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: DriverAddress;
  driverDetails?: Partial<DriverDetails>;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface DriverListProps {
  onAddDriver: () => void;
  onViewProfile: (driver: DriverData) => void;
  onEditDriver: (driver: DriverData) => void;
}

export interface DriverFormProps {
  onBack: () => void;
  driver?: DriverData;
}

export interface DriverProfileProps {
  driver: DriverData;
  onBack: () => void;
  onEdit: () => void;
  onAssignShift: () => void;
  shiftsRefreshKey?: number;
}

export interface AssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDriverId?: string;
  onSuccess?: () => void;
}

export interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}
