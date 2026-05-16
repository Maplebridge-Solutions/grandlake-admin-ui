"use client";

import { useState, useEffect, useCallback } from "react";
import Pagination from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getTransactionOrders,
  getTransactionById,
} from "@/lib/api/transactions";
import { downloadReceipt } from "@/lib/utils/download-receipt";
import type { TransactionOrderRecord } from "@/lib/types/tickets";
import TransactionDetailModal from "./transaction-detail-modal";

const tabs = [
  { id: "all", label: "All transactions" },
  { id: "completed", label: "Completed only" },
  { id: "pending", label: "Pending only" },
];

const PAYMENT_METHOD_OPTIONS = [
  { id: "all", label: "All methods" },
  { id: "WALLET", label: "Wallet" },
  { id: "APPLE_PAY", label: "Apple Pay" },
  { id: "CARD", label: "Card" },
];

const TRANSACTION_TYPE_OPTIONS = [
  { id: "all", label: "All types" },
  { id: "PAYMENT", label: "Payment" },
  { id: "TOPUP", label: "Top-up" },
];

const getStatusStyles = (isPaid: boolean) =>
  isPaid
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-orange-50 text-orange-700 border-orange-100";

const getStatusIcon = (isPaid: boolean) =>
  isPaid ? (
    <CheckCircle2 size={14} className="mr-1.5" />
  ) : (
    <Clock size={14} className="mr-1.5" />
  );

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatAmount = (amount: number, currency: string) =>
  `${currency} ${amount.toFixed(2)}`;

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TransactionOrderRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof getTransactionOrders>[0] = {
        page,
        limit: pageSize,
      };
      if (typeFilter !== "all") params.type = typeFilter;
      if (paymentFilter !== "all") params.paymentMethod = paymentFilter;
      const res = await getTransactionOrders(params);
      setTransactions(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, typeFilter, paymentFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleDownloadReceipt = async (id: string) => {
    setDownloadingId(id);
    try {
      const res = await getTransactionById(id);
      downloadReceipt(res.data);
    } catch {
      // silently fail
    } finally {
      setDownloadingId(null);
    }
  };

  const q = searchQuery.toLowerCase();
  const filtered = transactions.filter((tx) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && tx.isPaid) ||
      (activeTab === "pending" && !tx.isPaid);

    const matchesSearch =
      !q ||
      tx._id.toLowerCase().includes(q) ||
      tx.paymentMethod.toLowerCase().includes(q) ||
      (tx.contactDetails?.firstName ?? "").toLowerCase().includes(q) ||
      (tx.contactDetails?.lastName ?? "").toLowerCase().includes(q) ||
      (() => {
        const p = tx.items?.[0]?.product;
        const name = typeof p === "object" ? p.name : (p ?? "");
        return name.toLowerCase().includes(q);
      })();

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <TransactionDetailModal
        transactionId={detailId}
        onClose={() => setDetailId(null)}
      />
      {/* Tabs — dropdown on mobile, pills on desktop */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full px-5 h-10 border border-surface-subtle bg-white font-semibold flex items-center gap-2 w-full text-sm hover:border-brand hover:text-brand transition-all">
            <Filter size={16} />
            {tabs.find((t) => t.id === activeTab)?.label ?? "All transactions"}
            <ChevronDown size={14} className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="rounded-xl border-surface-subtle w-56"
          >
            {tabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "rounded-lg cursor-pointer",
                  activeTab === tab.id && "text-brand font-bold",
                )}
              >
                {tab.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:flex flex-wrap gap-2 p-1 bg-surface-page rounded-2xl border border-surface-subtle w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
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

      {/* Search + Payment filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="Search by transaction ID, buyer name or payment method..."
            className="pl-12 h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-semibold shrink-0 transition-all whitespace-nowrap",
              paymentFilter !== "all"
                ? "border-brand bg-brand-light text-brand"
                : "border-surface-subtle bg-surface-page text-content-muted hover:border-brand hover:text-brand",
            )}
          >
            <Filter size={15} />
            {PAYMENT_METHOD_OPTIONS.find((o) => o.id === paymentFilter)
              ?.label ?? "All methods"}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-surface-subtle shadow-xl p-1 w-40"
          >
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => {
                  setPaymentFilter(opt.id);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg cursor-pointer font-medium",
                  paymentFilter === opt.id && "text-brand font-bold",
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-semibold shrink-0 transition-all whitespace-nowrap",
              typeFilter !== "all"
                ? "border-brand bg-brand-light text-brand"
                : "border-surface-subtle bg-surface-page text-content-muted hover:border-brand hover:text-brand",
            )}
          >
            <Filter size={15} />
            {TRANSACTION_TYPE_OPTIONS.find((o) => o.id === typeFilter)?.label ??
              "All types"}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-surface-subtle shadow-xl p-1 w-40"
          >
            {TRANSACTION_TYPE_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => {
                  setTypeFilter(opt.id);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg cursor-pointer font-medium",
                  typeFilter === opt.id && "text-brand font-bold",
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-subtle rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
          <table className="min-w-212.5 w-full text-left border-collapse">
            <thead className="bg-surface-page">
              <tr className="border-b border-surface-subtle">
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Buyer Name
                </th>
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Ticket
                </th>
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="py-4 px-4 text-xs font-bold text-content-muted uppercase tracking-wider">
                  Type
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
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-content-muted text-sm"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-brand-light/20 border-b border-surface-subtle transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-content-primary font-medium">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-sm text-content-primary font-medium">
                      {tx.contactDetails?.firstName || tx.contactDetails?.lastName
                        ? `${tx.contactDetails.firstName ?? ""} ${tx.contactDetails.lastName ?? ""}`.trim()
                        : "—"}
                    </td>
                    <td className="py-4 px-4 text-sm text-content-primary font-medium">
                      {(() => {
                        const p = tx.items?.[0]?.product;
                        return typeof p === "object" ? p.name : (p ?? "—");
                      })()}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-content-primary">
                      {formatAmount(tx.totalAmount, tx.currency)}
                    </td>
                    <td className="py-4 px-4 text-sm text-content-primary font-medium">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border",
                          tx.transactionType === "TOPUP"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-purple-50 text-purple-700 border-purple-100",
                        )}
                      >
                        {tx.transactionType === "TOPUP" ? "Top-up" : "Payment"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border",
                          getStatusStyles(tx.isPaid),
                        )}
                      >
                        {getStatusIcon(tx.isPaid)}
                        {tx.isPaid ? "Paid" : "Pending"}
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
                          <DropdownMenuItem
                            className="rounded-lg font-medium cursor-pointer"
                            onClick={() => setDetailId(tx._id)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg font-medium cursor-pointer"
                            disabled={downloadingId === tx._id}
                            onClick={() => handleDownloadReceipt(tx._id)}
                          >
                            {downloadingId === tx._id
                              ? "Downloading..."
                              : "Download Receipt"}
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600">
                            Issue Refund
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 pb-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
