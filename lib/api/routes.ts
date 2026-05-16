import apiClient from "@/lib/client";
import type {
  CreateRouteBody,
  RouteData,
  UpdateRouteBody,
} from "@/lib/types/routes";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const createRoute = async (
  body: CreateRouteBody,
): Promise<ApiResponse<RouteData>> => {
  const response = await apiClient.post<ApiResponse<RouteData>>("routes", body);
  return response.data;
};

export interface GetRoutesParams {
  startDate?: string;
  endDate?: string;
}

export const getAllRoutes = async (params?: GetRoutesParams): Promise<ApiResponse<RouteData[]>> => {
  const response = await apiClient.get<ApiResponse<RouteData[]>>("routes", { params });
  return response.data;
};

export const updateRoute = async (
  id: string,
  body: UpdateRouteBody,
): Promise<ApiResponse<RouteData>> => {
  const response = await apiClient.put<ApiResponse<RouteData>>(
    `routes/${id}`,
    body,
  );
  return response.data;
};

export const deleteRoute = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`routes/${id}`);
  return response.data;
};
