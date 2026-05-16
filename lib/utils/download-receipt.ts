import type { TransactionOrderRecord, TransactionProduct } from "@/lib/types/tickets";

function resolveProduct(product: TransactionProduct | string): TransactionProduct | null {
  return typeof product === "object" ? product : null;
}

function fmt(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short" });
}

export function downloadReceipt(tx: TransactionOrderRecord) {
  const buyer = tx.contactDetails
    ? `${tx.contactDetails.firstName} ${tx.contactDetails.lastName}`
    : "—";

  const itemsHtml = (tx.items ?? [])
    .map((item) => {
      const product = resolveProduct(item.product);
      const name = product?.name ?? (typeof item.product === "string" ? item.product : "—");
      const pills = product
        ? `<div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;">
            <span style="font-size:11px;padding:2px 8px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:#6b7280;">${product.category.replace(/_/g, " ")}</span>
            <span style="font-size:11px;padding:2px 8px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:#6b7280;">${product.riderType}</span>
            <span style="font-size:11px;padding:2px 8px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:#6b7280;">${product.transportMode}</span>
          </div>`
        : "";
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;vertical-align:top;">
            <div style="font-size:13px;font-weight:600;color:#111827;">${name}</div>
            ${pills}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;vertical-align:top;font-size:13px;color:#6b7280;">x${item.quantity}</td>
        </tr>`;
    })
    .join("");

  const statusBg = tx.isPaid ? "#ecfdf5" : "#fff7ed";
  const statusColor = tx.isPaid ? "#15803d" : "#c2410c";
  const statusText = tx.isPaid ? "Paid" : "Pending";

  const typeBadge = tx.transactionType
    ? `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${tx.transactionType === "TOPUP" ? "#eff6ff" : "#faf5ff"};color:${tx.transactionType === "TOPUP" ? "#1d4ed8" : "#7e22ce"};font-size:11px;font-weight:700;margin-left:6px;">${tx.transactionType === "TOPUP" ? "Top-up" : "Payment"}</span>`
    : "";

  const refundedBadge = tx.isRefunded
    ? `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:#fef2f2;color:#dc2626;font-size:11px;font-weight:700;margin-left:6px;">Refunded</span>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Receipt — ${tx._id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; padding: 40px 20px; color: #374151; }
    .card { background: #fff; max-width: 520px; margin: 0 auto; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .logo { font-size: 20px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; margin-bottom: 32px; }
    .amount-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
    .amount-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
    .amount-value { font-size: 36px; font-weight: 900; color: #111827; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .row-label { font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; }
    .row-value { text-align: right; font-weight: 500; color: #111827; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin: 20px 0 8px; }
    .items-table { width: 100%; border-collapse: collapse; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">GLK Transit</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${statusBg};color:${statusColor};font-size:11px;font-weight:700;">${statusText}</span>
      ${typeBadge}
      ${refundedBadge}
    </div>

    <div class="amount-block">
      <div class="amount-label">Total Amount</div>
      <div class="amount-value">${fmt(tx.totalAmount, tx.currency)}</div>
    </div>

    <div>
      <div class="row"><span class="row-label">Transaction ID</span><span class="row-value" style="font-family:monospace;font-size:11px;word-break:break-all;">${tx._id}</span></div>
      <div class="row"><span class="row-label">Buyer</span><span class="row-value">${buyer}</span></div>
      <div class="row"><span class="row-label">Payment Method</span><span class="row-value">${tx.paymentMethod}</span></div>
      ${tx.paymentReference && tx.paymentReference !== tx.paymentMethod ? `<div class="row"><span class="row-label">Reference</span><span class="row-value">${tx.paymentReference}</span></div>` : ""}
      <div class="row"><span class="row-label">Currency</span><span class="row-value">${tx.currency}</span></div>
      <div class="row"><span class="row-label">Date</span><span class="row-value">${fmtDate(tx.createdAt)}</span></div>
    </div>

    ${
      (tx.items ?? []).length > 0
        ? `<div class="section-title">Items</div>
           <table class="items-table"><tbody>${itemsHtml}</tbody></table>`
        : ""
    }

    <div class="footer">Thank you for riding with GLK Transit</div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${tx._id.slice(-8)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
