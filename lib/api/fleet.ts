import apiClient from "@/lib/client";
import type {
  AddBusBody,
  AssignShiftBody,
  BusData,
  BusMeta,
  BusSchedule,
  BusScheduleDetail,
  CreateMaintenanceBody,
  UpdateMaintenanceBody,
  CreateMechanicBody,
  DriverShift,
  GetAllMaintenanceParams,
  GetBusesParams,
  GetIncidentReportsParams,
  GetMaintenanceLogsParams,
  GetMechanicsParams,
  GetShiftsParams,
  IncidentReport,
  MaintenanceLog,
  MaintenanceRecord,
  MechanicData,
  UpdateBusBody,
  UpdateMechanicBody,
} from "@/lib/types/buses";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: BusMeta;
}

export const addBus = async (
  body: AddBusBody,
): Promise<ApiResponse<BusData>> => {
  const response = await apiClient.post<ApiResponse<BusData>>("fleet", body);
  return response.data;
};

export const getBuses = async (
  params?: GetBusesParams,
): Promise<ApiResponse<BusData[]>> => {
  const response = await apiClient.get<ApiResponse<BusData[]>>("fleet", {
    params,
  });
  return response.data;
};

export const updateBus = async (
  id: string,
  body: UpdateBusBody,
): Promise<ApiResponse<BusData>> => {
  const response = await apiClient.put<ApiResponse<BusData>>(
    `fleet/${id}`,
    body,
  );
  return response.data;
};

export const deleteBus = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`fleet/${id}`);
  return response.data;
};

export const updateBusDocument = async (
  id: string,
  formData: FormData,
): Promise<ApiResponse<BusData>> => {
  const response = await apiClient.put<ApiResponse<BusData>>(
    `fleet/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const uploadBusDocuments = async (
  busId: string,
  formData: FormData,
): Promise<ApiResponse<BusData>> => {
  const response = await apiClient.post<ApiResponse<BusData>>(
    `fleet/${busId}/upload/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const getBusSchedules = async (
  busId: string,
): Promise<ApiResponse<BusScheduleDetail>> => {
  const response = await apiClient.get<ApiResponse<BusScheduleDetail>>(
    `fleet/${busId}/schedules`,
  );
  return response.data;
};

export const getAllSchedules = async (
  search?: string,
): Promise<ApiResponse<BusSchedule[]>> => {
  const response = await apiClient.get<ApiResponse<BusSchedule[]>>(
    "fleet/schedules",
    {
      params: search ? { search } : {},
    },
  );
  return response.data;
};

export const createMaintenance = async (
  busId: string,
  body: CreateMaintenanceBody,
): Promise<ApiResponse<MaintenanceRecord>> => {
  const response = await apiClient.post<ApiResponse<MaintenanceRecord>>(
    `fleet/${busId}/maintenance`,
    body,
  );
  return response.data;
};

export const updateMaintenance = async (
  busId: string,
  maintenanceId: string,
  body: UpdateMaintenanceBody,
): Promise<ApiResponse<MaintenanceRecord>> => {
  const response = await apiClient.put<ApiResponse<MaintenanceRecord>>(
    `fleet/${busId}/maintenance/${maintenanceId}`,
    body,
  );
  return response.data;
};

export const deleteMaintenance = async (
  busId: string,
  maintenanceId: string,
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `fleet/${busId}/maintenance/${maintenanceId}`,
  );
  return response.data;
};

export const getAllMaintenance = async (
  params?: GetAllMaintenanceParams,
): Promise<ApiResponse<MaintenanceRecord[]>> => {
  const response = await apiClient.get<ApiResponse<MaintenanceRecord[]>>(
    "fleet/maintenance",
    { params },
  );
  return response.data;
};

export const getMaintenance = async (
  busId: string,
): Promise<ApiResponse<MaintenanceRecord[]>> => {
  const response = await apiClient.get<ApiResponse<MaintenanceRecord[]>>(
    `fleet/${busId}/maintenance`,
  );
  return response.data;
};

export const createIncidentReport = async (
  formData: FormData,
): Promise<ApiResponse<IncidentReport>> => {
  const response = await apiClient.post<ApiResponse<IncidentReport>>(
    "fleet/incident-reports",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const getIncidentReportById = async (
  incidentId: string,
): Promise<ApiResponse<IncidentReport>> => {
  const response = await apiClient.get<ApiResponse<IncidentReport>>(
    `fleet/incident-reports/${incidentId}`,
  );
  return response.data;
};

export const getIncidentReports = async (
  params?: GetIncidentReportsParams,
): Promise<ApiResponse<{ data: IncidentReport[]; meta: BusMeta }>> => {
  const response = await apiClient.get<
    ApiResponse<{ data: IncidentReport[]; meta: BusMeta }>
  >("fleet/incident-reports", { params });
  return response.data;
};

export const assignShift = async (
  body: AssignShiftBody,
): Promise<ApiResponse<DriverShift>> => {
  const response = await apiClient.post<ApiResponse<DriverShift>>(
    "fleet/driver-shifts",
    body,
  );
  return response.data;
};

export const getShifts = async (
  params?: GetShiftsParams,
): Promise<ApiResponse<{ data: DriverShift[]; meta: BusMeta }>> => {
  const response = await apiClient.get<
    ApiResponse<{ data: DriverShift[]; meta: BusMeta }>
  >("fleet/driver-shifts", { params });
  return response.data;
};

export const createMechanic = async (
  body: CreateMechanicBody,
): Promise<ApiResponse<MechanicData>> => {
  const response = await apiClient.post<ApiResponse<MechanicData>>(
    "fleet/mechanics",
    body,
  );
  return response.data;
};

export const getMechanics = async (
  params?: GetMechanicsParams,
): Promise<ApiResponse<MechanicData[]>> => {
  const response = await apiClient.get<ApiResponse<MechanicData[]>>(
    "fleet/mechanics",
    { params },
  );
  return response.data;
};

export const updateMechanic = async (
  mechanicId: string,
  body: UpdateMechanicBody,
): Promise<ApiResponse<MechanicData>> => {
  const response = await apiClient.put<ApiResponse<MechanicData>>(
    `fleet/mechanics/${mechanicId}`,
    body,
  );
  return response.data;
};

export const deleteMechanic = async (
  mechanicId: string,
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `fleet/mechanics/${mechanicId}`,
  );
  return response.data;
};

export const getMaintenanceLogs = async (
  maintenanceId: string,
  params?: GetMaintenanceLogsParams,
): Promise<ApiResponse<MaintenanceLog[]>> => {
  const response = await apiClient.get<ApiResponse<MaintenanceLog[]>>(
    `fleet/maintenance/${maintenanceId}/logs`,
    { params },
  );
  return response.data;
};

