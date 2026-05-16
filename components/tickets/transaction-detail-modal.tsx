"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Clock, RotateCcw, Download } from "lucide-react";
import { getTransactionById } from "@/lib/api/transactions";
import { cn } from "@/lib/utils";
import { downloadReceipt } from "@/lib/utils/download-receipt";
import type {
  TransactionOrderRecord,
  TransactionProduct,
} from "@/lib/types/tickets";

interface Props {
  transactionId: string | null;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    dateStyle: "long",
    timeStyle: "short",
  });

const formatAmount = (amount: number, currency: string) =>
  `${currency} ${amount.toFixed(2)}`;

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-surface-subtle last:border-0">
      <span className="text-xs font-bold text-content-muted uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-content-primary text-right">
        {value}
      </span>
    </div>
  );
}

function resolveProduct(
  product: TransactionProduct | string,
): TransactionProduct | null {
  return typeof product === "object" ? product : null;
}

export default function TransactionDetailModal({
  transactionId,
  onClose,
}: Props) {
  const [tx, setTx] = useState<TransactionOrderRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transactionId) return;
    setTx(null);
    setLoading(true);
    const load = async () => {
      try {
        const res = await getTransactionById(transactionId);
        setTx(res.data);
      } catch {
        setTx(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [transactionId]);

  if (!transactionId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-content-primary tracking-tight">
              Transaction Details
            </h2>
            <p className="text-xs text-content-muted mt-0.5 font-mono">
              {transactionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
          >
            <X size={20} className="text-content-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 overflow-y-auto">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            </div>
          ) : !tx ? (
            <p className="py-16 text-center text-sm text-content-muted">
              Failed to load transaction.
            </p>
          ) : (
            <div className="space-y-6">
              {/* Status badges */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                    tx.isPaid
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-orange-50 text-orange-700 border-orange-100",
                  )}
                >
                  {tx.isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  {tx.isPaid ? "Paid" : "Pending"}
                </span>
                {tx.isRefunded && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-red-50 text-red-600 border-red-100">
                    <RotateCcw size={13} />
                    Refunded
                  </span>
                )}
                {tx.transactionType && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border bg-surface-page text-content-muted border-surface-subtle">
                    {tx.transactionType}
                  </span>
                )}
              </div>

              {/* Amount */}
              <div className="bg-surface-page border border-surface-subtle rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-extrabold text-content-primary">
                  {formatAmount(tx.totalAmount, tx.currency)}
                </p>
              </div>

              {/* Core details */}
              <div className="rounded-2xl border border-surface-subtle px-4">
                <Row
                  label="Transaction ID"
                  value={
                    <span className="font-mono text-xs break-all">
                      {tx._id}
                    </span>
                  }
                />
                <Row
                  label="Buyer"
                  value={
                    tx.contactDetails
                      ? `${tx.contactDetails.firstName} ${tx.contactDetails.lastName}`
                      : "—"
                  }
                />
                <Row label="Payment Method" value={tx.paymentMethod} />
                {tx.paymentReference &&
                  tx.paymentReference !== tx.paymentMethod && (
                    <Row
                      label="Payment Reference"
                      value={tx.paymentReference}
                    />
                  )}
                <Row label="Currency" value={tx.currency} />
                <Row label="Created" value={formatDate(tx.createdAt)} />
                <Row label="Updated" value={formatDate(tx.updatedAt)} />
              </div>

              {/* Items */}
              {tx.items?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-3">
                    Items
                  </p>
                  <div className="rounded-2xl border border-surface-subtle divide-y divide-surface-subtle overflow-hidden">
                    {tx.items.map((item) => {
                      const product = resolveProduct(item.product);
                      return (
                        <div key={item._id} className="px-4 py-3 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-bold text-content-primary">
                              {product?.name ??
                                (typeof item.product === "string"
                                  ? item.product
                                  : "—")}
                            </span>
                            <span className="text-xs font-bold text-content-muted bg-surface-page border border-surface-subtle px-2.5 py-1 rounded-full shrink-0">
                              Qty {item.quantity}
                            </span>
                          </div>
                          {product && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-page border border-surface-subtle text-content-muted">
                                {product.category.replace(/_/g, " ")}
                              </span>
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-page border border-surface-subtle text-content-muted">
                                {product.riderType}
                              </span>
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-page border border-surface-subtle text-content-muted">
                                {product.transportMode}
                              </span>
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-light text-brand border border-brand/20">
                                {formatAmount(product.price, product.currency)}{" "}
                                / ride
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Download button */}
          {tx && (
            <div className="px-8 py-4 shrink-0 mt-4">
              <button
                onClick={() => downloadReceipt(tx)}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors"
              >
                <Download size={16} />
                Download Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
