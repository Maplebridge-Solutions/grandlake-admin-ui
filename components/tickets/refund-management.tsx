"use client";

import { useState } from "react";
import { Search, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ApproveRefundModal, DeclineRefundModal } from "./refund-action-modals";
import type { PendingRefund, RefundHistory } from "@/lib/types/tickets";

function isPendingRefund(item: PendingRefund | RefundHistory): item is PendingRefund {
  return "requestedOn" in item;
}

const pendingRefunds: PendingRefund[] = [
  {
    id: "1",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Jeremiah Agiopus",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "2",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Jenny Wilson",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "3",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Marvin McKinney",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "4",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Jacob Jones",
    reason: "Accidental purchase",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "5",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Guy Hawkins",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "6",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Arlene McCoy",
    reason: "App crashed",
    price: "CA$2.50",
    status: "Active",
  },
  {
    id: "7",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Albert Flores",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "8",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Theresa Webb",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
  {
    id: "9",
    requestedOn: "Today 08:00am",
    ticketName: "Youth 1 Ride",
    customerName: "Jane Cooper",
    reason: "Bus never arrived",
    price: "CA$2.50",
    status: "Inactive",
  },
];

const refundHistory: RefundHistory[] = [
  {
    id: "h1",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Jeremiah Agiopus",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Completed",
  },
  {
    id: "h2",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Albert Flores",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Completed",
  },
  {
    id: "h3",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Marvin McKinney",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Pending",
  },
  {
    id: "h4",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Leslie Alexander",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Completed",
  },
  {
    id: "h5",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Ralph Edwards",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Pending",
  },
  {
    id: "h6",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Brooklyn Simmons",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Pending",
  },
  {
    id: "h7",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Dianne Russell",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Declined",
  },
  {
    id: "h8",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Ronald Richards",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Pending",
  },
  {
    id: "h9",
    refundedOn: "Today 09:00am",
    ticketName: "Youth 1 Ride",
    refundedBy: "Hannah Priyanka",
    customerName: "Esther Howard",
    price: "CA$2.50",
    refundedTo: "VISA **** 2343",
    reason: "Customer called...",
    status: "Failed",
  },
];

export default function RefundManagement() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<PendingRefund | undefined>(undefined);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleApprove = (refund: PendingRefund) => {
    setSelectedRefund(refund);
    setIsApproveModalOpen(true);
  };

  const handleDecline = (refund: PendingRefund) => {
    setSelectedRefund(refund);
    setIsDeclineModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 border-b border-surface-subtle w-full">
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "pb-4 px-2 text-sm font-bold transition-all relative",
              activeTab === "pending"
                ? "text-brand"
                : "text-content-muted hover:text-brand",
            )}
          >
            Pending Requests
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "pb-4 px-2 text-sm font-bold transition-all relative",
              activeTab === "history"
                ? "text-brand"
                : "text-content-muted hover:text-brand",
            )}
          >
            Refund History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder={
              activeTab === "pending"
                ? "search for a refund by user name, ticket name or filter by date"
                : "search for a refund by user/admin name, ticket name or filter by date"
            }
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-12 px-6 rounded-2xl border-surface-subtle font-bold text-content-muted hover:text-brand hover:border-brand transition-all"
        >
          <Filter size={18} className="mr-2" />
          This week
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                {activeTab === "pending" ? "Requested On" : "Refunded On"}
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Ticket Name
              </th>
              {activeTab === "history" && (
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Refunded By
                </th>
              )}
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Customer Name
              </th>
              {activeTab === "pending" && (
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Reason Given
                </th>
              )}
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Price
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                {activeTab === "pending" ? "Ticket Status" : "Refunded To"}
              </th>
              {activeTab === "history" && (
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Reason For Refund
                </th>
              )}
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                {activeTab === "pending" ? "Actions" : "Refund Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {(activeTab === "pending" ? pendingRefunds : refundHistory).map(
              (item: PendingRefund | RefundHistory) => (
                <tr
                  key={item.id}
                  className="group hover:bg-surface-page/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-content-muted font-medium">
                    {isPendingRefund(item) ? item.requestedOn : item.refundedOn}
                  </td>
                  <td className="py-4 px-4 text-sm text-content-muted font-medium">
                    {item.ticketName}
                  </td>
                  {activeTab === "history" && !isPendingRefund(item) && (
                    <td className="py-4 px-4 text-sm text-content-muted font-medium">
                      {item.refundedBy}
                    </td>
                  )}
                  <td className="py-4 px-4 text-sm text-content-primary font-bold">
                    {item.customerName}
                  </td>
                  {activeTab === "pending" && isPendingRefund(item) && (
                    <td className="py-4 px-4 text-sm text-content-muted font-medium">
                      {item.reason}
                    </td>
                  )}
                  <td className="py-4 px-4 text-sm text-content-primary font-bold">
                    {item.price}
                  </td>
                  <td className="py-4 px-4 text-sm text-content-muted font-medium">
                    {isPendingRefund(item) ? (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          item.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-gray-100 text-gray-700 border-gray-200",
                        )}
                      >
                        {item.status}
                      </span>
                    ) : (
                      item.refundedTo
                    )}
                  </td>
                  {activeTab === "history" && !isPendingRefund(item) && (
                    <td className="py-4 px-4 text-sm text-content-muted font-medium">
                      {item.reason}
                    </td>
                  )}
                  <td className="py-4 px-4">
                    {isPendingRefund(item) ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 rounded-xl border-green-200 text-green-700 hover:bg-green-50 font-bold"
                          onClick={() => handleApprove(item)}
                        >
                          <Check size={16} className="mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 rounded-xl border-red-200 text-red-700 hover:bg-red-50 font-bold"
                          onClick={() => handleDecline(item)}
                        >
                          <X size={16} className="mr-1.5" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          item.status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : item.status === "Pending"
                              ? "bg-orange-50 text-orange-700 border-orange-100"
                              : item.status === "Declined"
                                ? "bg-red-50 text-red-700 border-red-100"
                                : "bg-red-50 text-red-700 border-red-100",
                        )}
                      >
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <Pagination />

      {/* Modals */}
      {selectedRefund && (
        <>
          <ApproveRefundModal
            isOpen={isApproveModalOpen}
            onClose={() => setIsApproveModalOpen(false)}
            refundData={{
              customerName: selectedRefund.customerName,
              price: selectedRefund.price,
              ticketStatus: selectedRefund.status,
            }}
          />
          <DeclineRefundModal
            isOpen={isDeclineModalOpen}
            onClose={() => setIsDeclineModalOpen(false)}
            refundData={{
              customerName: selectedRefund.customerName,
              price: selectedRefund.price,
              ticketStatus: selectedRefund.status,
              isAlreadyInUse: selectedRefund.status === "Active",
            }}
          />
        </>
      )}
    </div>
  );
}
