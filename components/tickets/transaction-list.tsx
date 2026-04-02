"use client";

import { useState } from "react";
import Pagination from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "0938291",
    timestamp: "6/21/18 09:00am",
    route: "1 Main Stre... → 10 Civic Ce...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "ApplePay",
    status: "Success",
  },
  {
    id: "0938292",
    timestamp: "7/11/19 10:00am",
    route: "1000 Keas... → 10 Civic Ce...",
    price: "CA$2.50",
    ticket: "Youth 1 Ride",
    method: "1541",
    status: "Success",
  },
  {
    id: "0938293",
    timestamp: "8/21/15 01:00pm",
    route: "6373 Upper... → 122 Bridge...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "0921",
    status: "Pending",
  },
  {
    id: "0938294",
    timestamp: "8/16/13 08:00am",
    route: "1000 Keas... → 10 Civic Ce...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "GooglePay",
    status: "Refunding",
  },
  {
    id: "0938295",
    timestamp: "3/4/16 11:00am",
    route: "1 Main Stre... → 10 Civic Ce...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "1541",
    status: "Pending",
  },
  {
    id: "0938296",
    timestamp: "5/18/12 11:00am",
    route: "1000 Keas... → 10 Civic Ce...",
    price: "CA$2.50",
    ticket: "Adult 1 Ride",
    method: "1541",
    status: "Failed",
  },
  {
    id: "0938297",
    timestamp: "2/11/12 10:00am",
    route: "1000 Keas... → 10 Civic Ce...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "1141",
    status: "Pending",
  },
  {
    id: "0938298",
    timestamp: "8/2/18 08:00am",
    route: "6373 Upper... → 122 Bridge...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "1541",
    status: "Success",
  },
  {
    id: "0938299",
    timestamp: "4/21/12 11:00am",
    route: "6373 Upper... → 122 Bridge...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "1541",
    status: "Failed",
  },
  {
    id: "0938300",
    timestamp: "12/10/13 09:00am",
    route: "1 Main Stre... → 10 Civic Ce...",
    price: "CA$3.00",
    ticket: "Adult 1 Ride",
    method: "1541",
    status: "Success",
  },
];

export default function TransactionList() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "All transactions" },
    { id: "completed", label: "Completed only" },
    { id: "pending", label: "Pending only" },
    { id: "failed", label: "Failed only" },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-50 text-green-700 border-green-100";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Failed":
        return "bg-red-50 text-red-700 border-red-100";
      case "Refunding":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle2 size={14} className="mr-1.5" />;
      case "Pending":
        return <Clock size={14} className="mr-1.5" />;
      case "Failed":
        return <XCircle size={14} className="mr-1.5" />;
      case "Refunding":
        return <RefreshCw size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return tx.status === "Success";
    if (activeTab === "pending") return tx.status === "Pending";
    if (activeTab === "failed") return tx.status === "Failed";
    return true;
  });

  const isEmpty = filteredTransactions.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-48 h-48 opacity-50">
          <Image
            src="https://picsum.photos/seed/empty-transaction/400/400"
            alt="No data"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-content-primary">
            No Transaction Yet
          </h3>
          <p className="text-content-muted mt-2 max-w-xs">
            Refresh the page to see user transactions, or wait and come back
            later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-surface-page rounded-2xl w-fit border border-surface-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id
                ? "bg-brand text-white shadow-md shadow-brand/10"
                : "text-content-muted hover:text-brand hover:bg-brand-light/50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="search for transactions by last card 4 digits, name of buyer or transaction id"
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
          Filter date
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-subtle">
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Timestamp
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Route Long Name
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Price
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Ticket Name
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Payment Method
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {filteredTransactions.map((tx) => (
              <tr
                key={tx.id}
                className="group hover:bg-surface-page/50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {tx.timestamp}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {tx.id}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {tx.route}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {tx.price}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {tx.ticket}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {tx.method}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                      getStatusStyles(tx.status),
                    )}
                  >
                    {getStatusIcon(tx.status)}
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-surface-subtle rounded-lg transition-colors outline-none">
                      <MoreHorizontal
                        size={20}
                        className="text-content-muted"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-surface-subtle shadow-xl p-1"
                    >
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">
                        Download Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600">
                        Issue Refund
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
}
