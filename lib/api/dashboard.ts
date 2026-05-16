import apiClient from "@/lib/client";
import type { DashboardOverviewResponse } from "@/lib/types/dashboard";

export interface DashboardOverviewParams {
  period: "today" | "week" | "month" | "year";
  startDate: string;
  endDate: string;
}

export const getDashboardOverview = async (params: DashboardOverviewParams): Promise<DashboardOverviewResponse> => {
  const response = await apiClient.get<DashboardOverviewResponse>("dashboard/overview", { params });
  return response.data;
};
