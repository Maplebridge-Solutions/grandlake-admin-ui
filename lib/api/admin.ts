import apiClient from "@/lib/client";
import type {
  RegisterAdminBody,
  AdminRecord,
  LoginLogRecord,
  AuditTrailRecord,
  RoleMatrixRecord,
  PaginationParams,
} from "@/lib/types/permissions";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const registerAdmin = async (
  body: RegisterAdminBody,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    "auth/register-admin",
    body,
  );
  return response.data;
};

export const getAllAdmins = async (
  params?: PaginationParams,
): Promise<ApiResponse<AdminRecord[]>> => {
  const response = await apiClient.get<ApiResponse<AdminRecord[]>>(
    "admin/admins",
    { params },
  );
  return response.data;
};

export const getAllLoginLogs = async (
  params?: PaginationParams,
): Promise<ApiResponse<LoginLogRecord[]>> => {
  const response = await apiClient.get<ApiResponse<LoginLogRecord[]>>(
    "admin/login-logs",
    { params },
  );
  return response.data;
};

export const getAllAuditTrails = async (
  params?: PaginationParams,
): Promise<ApiResponse<AuditTrailRecord[]>> => {
  const response = await apiClient.get<ApiResponse<AuditTrailRecord[]>>(
    "admin/audit-trails",
    { params },
  );
  return response.data;
};

export const getAllRoleMatrix = async (): Promise<
  ApiResponse<RoleMatrixRecord[]>
> => {
  const response =
    await apiClient.get<ApiResponse<RoleMatrixRecord[]>>("admin/roles/matrix");
  return response.data;
};

export const updateRoleMatrix = async (
  records: RoleMatrixRecord[],
): Promise<ApiResponse<unknown>> => {
  const entries = records.map(({ menuItem, action, permissions }) => ({
    menuItem,
    action,
    permissions,
  }));
  const response = await apiClient.put<ApiResponse<unknown>>(
    "admin/roles/matrix",
    { entries },
  );
  return response.data;
};

export const deactivateAdmin = async (
  userId: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `admin/admins/${userId}/deactivate`,
  );
  return response.data;
};

export const activateAdmin = async (
  userId: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `admin/admins/${userId}/activate`,
  );
  return response.data;
};

export const revokeAdminInvitation = async (
  inviteId: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    `admin/invitations/${inviteId}/revoke`,
  );
  return response.data;
};

export const resendAdminInvitation = async (
  inviteId: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    `admin/invitations/${inviteId}/resend`,
  );
  return response.data;
};

export const reassignAdminRole = async (
  userId: string,
  role: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `admin/admins/${userId}/reassign-role`,
    { role },
  );
  return response.data;
};
