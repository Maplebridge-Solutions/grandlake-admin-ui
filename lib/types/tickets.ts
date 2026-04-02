export type TicketViewState =
  | "transactions"
  | "ticket-types"
  | "refunds"
  | "passes"
  | "refund-settings";

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
