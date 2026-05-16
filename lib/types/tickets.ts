export type TicketViewState =
  | "transactions"
  | "ticket-types"
  | "refunds"
  | "passes"
  | "refund-settings";

export interface TicketCatalogRecord {
  _id: string;
  name: string;
  description: string;
  category: "SINGLE_RIDE" | "PERIOD_PASS" | string;
  riderType: "ADULT" | "YOUTH" | "SENIOR" | "STUDENT" | string;
  transportMode: string;
  ridesCount: number;
  price: number;
  currency: string;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTicketsParams {
  riderType?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateTicketBody {
  name: string;
  description?: string;
  category: string;
  riderType: string;
  transportMode?: string;
  ridesCount: number;
  price: number;
  currency?: string;
  validityDays: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  route: string;
  price: string;
  ticket: string;
  method: string;
  status: "Success" | "Pending" | "Failed" | "Refunding";
}

export interface TicketType {
  id: string;
  name: string;
  type: string;
  routeAccess: string;
  price: string;
  validity: string;
  status: "Active" | "Draft" | "Disabled";
}

export interface PendingRefund {
  id: string;
  requestedOn: string;
  ticketName: string;
  customerName: string;
  reason: string;
  price: string;
  status: string;
}

export interface RefundHistory {
  id: string;
  refundedOn: string;
  ticketName: string;
  refundedBy: string;
  customerName: string;
  price: string;
  refundedTo: string;
  reason: string;
  status: "Completed" | "Pending" | "Declined" | "Failed";
}

export interface Pass {
  id: string;
  timestamp: string;
  issuedBy: string;
  issuedTo: string;
  reason: string;
  status: "Issued" | "Revoked" | "Pending" | "Expired";
}

export interface RefundModalData {
  customerName: string;
  price: string;
  ticketStatus: string;
  isAlreadyInUse?: boolean;
}

export interface PassManagementProps {
  onIssueNew: () => void;
}

export interface CreateTicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface IssuePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  refundData: RefundModalData;
}

export interface TransactionProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  riderType: string;
  transportMode: string;
  ridesCount: number;
  price: number;
  currency: string;
  validityDays: number;
  validityHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  _id: string;
  product: TransactionProduct | string;
  quantity: number;
}

export interface TransactionContactDetails {
  _id?: string;
  firstName: string;
  lastName: string;
}

export interface TransactionOrderRecord {
  _id: string;
  user: string;
  items: TransactionItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentReference?: string;
  transactionType?: string;
  isPaid: boolean;
  isRefunded?: boolean;
  contactDetails: TransactionContactDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionBody {
  items: TransactionItem[];
  currency: string;
  contactDetails: TransactionContactDetails;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
  paymentMethod?: string;
  isRefunded?: boolean;
}
