export type BusViewState = "list" | "add" | "edit" | "maintenance";

export interface BusListProps {
  onAddBus: () => void;
  onEditBus: (bus: BusData) => void;
  onMaintenance: (busId: string) => void;
}

export interface BusFormProps {
  onBack: () => void;
  bus?: BusData;
}

export interface MaintenanceManagementProps {
  onAddMechanic: (onCreated: (mechanic: MechanicData) => void) => void;
  onBack: () => void;
  busId: string;
}

export interface AddMechanicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (mechanic: MechanicData) => void;
}

// ─── Bus ──────────────────────────────────────────────────────────────────────

export interface BusDocument {
  _id: string;
  type: string;
  name: string;
  url: string;
  verified: boolean;
}

export interface BusData {
  _id: string;
  trackingId: string;
  busNumber: number;
  busType: string;
  route: string;
  regOrPlateNumber?: string;
  status: string;
  documentsVerified: boolean;
  wheelChairAccessible: boolean;
  online: boolean;
  documents: BusDocument[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface BusMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AddBusBody {
  trackingId: string;
  busNumber: number;
  route: string;
  busType: string;
  wheelChairAccessible: boolean;
}

export interface UpdateBusBody {
  trackingId?: string;
  busNumber?: number;
  route?: string;
  busType?: string;
  wheelChairAccessible?: boolean;
  status?: string;
  online?: boolean;
  regOrPlateNumber?: string;
}

export interface GetBusesParams {
  online?: boolean;
  search?: string;
  wheelChairAccessible?: boolean;
  documentsVerified?: boolean;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ─── Schedules ────────────────────────────────────────────────────────────────

export interface ScheduleTime {
  time: string;
  status: string;
}

export interface BusSchedule {
  busId: string;
  busNumber: number;
  routeName: string;
  fromStop: string;
  frequency: number;
  wheelchairAccessible: boolean;
  departures: ScheduleTime[];
}

export interface BusScheduleDetail {
  busNumber: number;
  routeName: string;
  times: ScheduleTime[];
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

export interface MaintenanceLog {
  _id: string;
  message: string;
  actor: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  _id: string;
  bus: BusData;
  serviceType: string;
  maintenanceDate: string;
  maintenanceTime: string;
  estimatedReturnTime: string;
  assignedMechanic: string;
  status: string;
  comments: string;
  logs: MaintenanceLog[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetAllMaintenanceParams {
  page?: number;
  limit?: number;
  status?: string;
  serviceType?: string;
  assignedMechanic?: string;
  bus?: string;
  startDate?: string;
  endDate?: string;
  age?: number;
}

export interface CreateMaintenanceBody {
  serviceType: string;
  maintenanceDate: string;
  maintenanceTime: string;
  estimatedReturnTime: string;
  assignedMechanic: string;
  comments?: string;
}

export type UpdateMaintenanceBody = Partial<CreateMaintenanceBody> & {
  status?: string;
};

export const MAINTENANCE_STATUSES = [
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

// ─── Incident Reports ─────────────────────────────────────────────────────────

export interface SupportingFile {
  _id: string;
  name: string;
  type: string;
  url: string;
}

export interface IncidentReportDriver {
  _id: string;
  firstName: string;
  lastName: string;
  user: string;
  phone: string;
}

export interface IncidentReportRoute {
  _id: string;
  name: string;
}

export interface IncidentReportBus {
  _id: string;
  busNumber: number;
  regOrPlateNumber: string;
  trackingId: string;
}

export interface IncidentReport {
  _id: string;
  driver: IncidentReportDriver | string;
  route: IncidentReportRoute | string;
  bus: IncidentReportBus | string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  description: string;
  supportingFiles: SupportingFile[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetIncidentReportsParams {
  page?: number;
  limit?: number;
  incidentType?: string;
  driver?: string;
  bus?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Mechanics ────────────────────────────────────────────────────────────────

export interface MechanicData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  status: string;
  company: string;
  notes?: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateMechanicBody {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  status?: string;
  company: string;
  notes?: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
}

export type UpdateMechanicBody = Partial<CreateMechanicBody>;

export interface GetMechanicsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  city?: string;
}

export interface GetMaintenanceLogsParams {
  page?: number;
  limit?: number;
}

// ─── Driver Shifts ────────────────────────────────────────────────────────────

export interface DriverShiftBus {
  _id: string;
  busNumber: number;
  regOrPlateNumber: string;
  trackingId: string;
}

export interface DriverShift {
  _id: string;
  driver: IncidentReportDriver | string;
  secondaryDriver?: IncidentReportDriver | string;
  route: IncidentReportRoute | string;
  bus: DriverShiftBus | string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssignShiftBody {
  driver: string;
  secondaryDriver?: string;
  route: string;
  bus: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays: number;
}

export interface GetShiftsParams {
  page?: number;
  limit?: number;
  driver?: string;
  shiftDate?: string;
}
