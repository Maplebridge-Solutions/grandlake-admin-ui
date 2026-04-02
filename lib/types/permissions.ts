export type PermissionsViewState = "logs" | "manage-roles" | "manage-admins";
export type LogTab = "login" | "audit";

export interface LoginLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  ipAddress: string;
  eventType: string;
  status: "Success" | "Failed";
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  action: string;
  details: string;
  status: "Success" | "Pending" | "Failed";
  hasInfo?: boolean;
}

export interface RolePermissionAction {
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
  role: string;
  status: "invitation pending" | "active";
  dateAdded: string;
}

export interface PermissionDetailAdmin {
  name: string;
  role: string;
}

export interface ManageRolesViewProps {
  onShowDetails: () => void;
}

export interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PermissionsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  admins: PermissionDetailAdmin[];
}
