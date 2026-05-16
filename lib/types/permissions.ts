export type PermissionsViewState = "logs" | "manage-roles" | "manage-admins";
export type LogTab = "login" | "audit";

export interface RegisterAdminBody {
  email: string;
  password: string;
  role: string;
  mode: "immediate" | "invite";
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AdminRecord {
  type: string;
  id: string;
  invitationId?: string;
  name: string;
  email: string;
  role: string;
  invitationStatus: string;
  dateAdded: string;
  verified: boolean;
}

export interface LoginLogRecord {
  _id: string;
  category: string;
  actorUser: string;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  eventType: string;
  actionTaken: string;
  details: string;
  status: string;
  createdAt: string;
}

export interface AuditTrailRecord {
  _id: string;
  category: string;
  actorUser: string;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  eventType: string;
  actionTaken: string;
  details: string;
  status: string;
  createdAt: string;
}

export interface RoleMatrixRecord {
  _id: string;
  menuItem: string;
  action: string;
  permissions: {
    admin: boolean;
    superAdmin: boolean;
    operationsAdmin: boolean;
    supportStaff: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface LoginLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  ipAddress: string;
  eventType: string;
  status: string;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  actionTaken: string;
  details: string;
  status: string;
}

export interface RolePermissionAction {
  id: string;
  name: string;
  superAdmin: boolean;
  opsAdmin: boolean;
  supportStaff: boolean;
}

export interface RolePermission {
  category: string;
  actions: RolePermissionAction[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  invitationStatus: string;
  dateAdded: string;
}

export interface PermissionDetailAdmin {
  name: string;
  role: string;
}

export interface ManageRolesViewProps {
  onShowDetails: (action: RoleMatrixRecord) => void;
  onRegisterSave: (saveFn: () => Promise<void>) => void;
}

export interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface PermissionsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  admins: PermissionDetailAdmin[];
}
