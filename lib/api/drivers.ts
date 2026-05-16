import apiClient from "@/lib/client";
import type { DriverData, UpdateDriverBody } from "@/lib/types/drivers";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface GetDriversParams {
  page?: number;
  limit?: number;
  search?: string;
  isDriver?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface RegisterDriverBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  staffId: string;
  route: string;
}

export const registerDriver = async (
  body: RegisterDriverBody,
): Promise<ApiResponse<{ user: unknown; profile: DriverData }>> => {
  const response = await apiClient.post<
    ApiResponse<{ user: unknown; profile: DriverData }>
  >("auth/register-driver", body);
  return response.data;
};

export const getAllDrivers = async (
  params?: GetDriversParams,
): Promise<ApiResponse<DriverData[]>> => {
  const response = await apiClient.get<ApiResponse<DriverData[]>>("profiles", {
    params,
  });
  return response.data;
};

export const getDriver = async (
  id: string,
): Promise<ApiResponse<DriverData>> => {
  const response = await apiClient.get<ApiResponse<DriverData>>(
    `profiles/${id}`,
  );
  return response.data;
};

export const updateDriver = async (
  id: string,
  body: UpdateDriverBody,
): Promise<ApiResponse<DriverData>> => {
  const response = await apiClient.put<ApiResponse<DriverData>>(
    `profiles/${id}`,
    body,
  );
  return response.data;
};

export const deleteDriver = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`profiles/${id}`);
  return response.data;
};

export const uploadDriverDocuments = async (
  profileId: string,
  formData: FormData,
): Promise<ApiResponse<DriverData>> => {
  const response = await apiClient.post<ApiResponse<DriverData>>(
    `profiles/${profileId}/upload/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const uploadDriverPicture = async (
  profileId: string,
  formData: FormData,
): Promise<ApiResponse<DriverData>> => {
  const response = await apiClient.post<ApiResponse<DriverData>>(
    `profiles/${profileId}/upload/driver-picture`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};
