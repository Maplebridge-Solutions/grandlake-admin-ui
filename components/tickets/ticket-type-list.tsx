"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ticketTypes = [
  {
    id: "1",
    name: "Youth 1 Ride",
    type: "One-time Pass",
    routeAccess: "All Routes",
    price: "CA$2.50",
    validity: "24 hours",
    status: "Active",
  },
  {
    id: "2",
    name: "Adult 1 Ride",
    type: "One-time Pass",
    routeAccess: "All Routes",
    price: "CA$3.00",
    validity: "24 hours",
    status: "Active",
  },
  {
    id: "3",
    name: "Senior 1 Ride",
    type: "One-time Pass",
    routeAccess: "All Routes",
    price: "CA$2.00",
    validity: "24 hours",
    status: "Draft",
  },
  {
    id: "4",
    name: "Weekly Pass",
    type: "Period Pass",
    routeAccess: "All Routes",
    price: "CA$20.00",
    validity: "7 days",
    status: "Active",
  },
  {
    id: "5",
    name: "Monthly Pass",
    type: "Period Pass",
    routeAccess: "All Routes",
    price: "CA$75.00",
    validity: "30 days",
    status: "Disabled",
  },
  {
    id: "6",
    name: "Student Pass",
    type: "Period Pass",
    routeAccess: "All Routes",
    price: "CA$60.00",
    validity: "30 days",
    status: "Active",
  },
  {
    id: "7",
    name: "Day Pass",
    type: "One-time Pass",
    routeAccess: "All Routes",
    price: "CA$8.00",
    validity: "24 hours",
    status: "Draft",
  },
];

export default function TicketTypeList() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "All tickets" },
    { id: "active", label: "Active only" },
    { id: "draft", label: "Draft only" },
    { id: "disabled", label: "Disabled only" },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-100";
      case "Draft":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Disabled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const isEmpty = ticketTypes.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-48 h-48 opacity-50">
          <Image
            src="https://picsum.photos/seed/empty-ticket/400/400"
            alt="No data"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-content-primary">
            No Ticket Types Created Yet
          </h3>
          <p className="text-content-muted mt-2 max-w-xs">
            Create ticket types to start selling tickets to your users
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
            placeholder="search for a ticket by name, type"
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
                Ticket Name
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Ticket Type
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Route Access
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Price
              </th>
              <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                Valid For
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
            {ticketTypes.map((ticket) => (
              <tr
                key={ticket.id}
                className="group hover:bg-surface-page/50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {ticket.name}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {ticket.type}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {ticket.routeAccess}
                </td>
                <td className="py-4 px-4 text-sm text-content-primary font-bold">
                  {ticket.price}
                </td>
                <td className="py-4 px-4 text-sm text-content-muted font-medium">
                  {ticket.validity}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                      getStatusStyles(ticket.status),
                    )}
                  >
                    {ticket.status}
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
                        Edit Ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600">
                        Delete
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
