import apiClient from "@/lib/client";
import type {
  TransactionOrderRecord,
  CreateTransactionBody,
  GetTransactionsParams,
} from "@/lib/types/tickets";

export async function getTransactionOrders(params?: GetTransactionsParams) {
  const res = await apiClient.get<{
    success: boolean;
    data: TransactionOrderRecord[];
    meta?: { totalPages: number; total: number };
  }>("/payment/transactions", { params });
  return res.data;
}

export async function getTransactionById(id: string) {
  const res = await apiClient.get<{
    success: boolean;
    data: TransactionOrderRecord;
  }>(`/payment/transactions/${id}`);
  return res.data;
}

export async function createTransactionOrders(body: CreateTransactionBody) {
  const res = await apiClient.post<{
    success: boolean;
    data: TransactionOrderRecord;
  }>("/payment/transactions/", body);
  return res.data;
}
