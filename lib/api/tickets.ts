import apiClient from "@/lib/client";
import type {
  TicketCatalogRecord,
  GetTicketsParams,
  CreateTicketBody,
} from "@/lib/types/tickets";

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

export const getAllTicketCatalog = async (
  params?: GetTicketsParams,
): Promise<ApiResponse<TicketCatalogRecord[]>> => {
  const response = await apiClient.get<ApiResponse<TicketCatalogRecord[]>>(
    "tickets",
    { params },
  );
  return response.data;
};

export const getSingleTicket = async (
  id: string,
): Promise<ApiResponse<TicketCatalogRecord>> => {
  const response = await apiClient.get<ApiResponse<TicketCatalogRecord>>(
    `tickets/${id}`,
  );
  return response.data;
};

export const createTicketEntry = async (
  body: CreateTicketBody,
): Promise<ApiResponse<TicketCatalogRecord>> => {
  const response = await apiClient.post<ApiResponse<TicketCatalogRecord>>(
    "tickets",
    body,
  );
  return response.data;
};

export const updateTicketEntry = async (
  id: string,
  body: Partial<CreateTicketBody>,
): Promise<ApiResponse<TicketCatalogRecord>> => {
  const response = await apiClient.patch<ApiResponse<TicketCatalogRecord>>(
    `tickets/${id}`,
    body,
  );
  return response.data;
};

export const deleteTicketEntry = async (
  id: string,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete<ApiResponse<unknown>>(`tickets/${id}`);
  return response.data;
};
