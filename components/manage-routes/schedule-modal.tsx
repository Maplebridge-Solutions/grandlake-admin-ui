"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ScheduleModalProps } from "@/lib/types/routes";

function formatTime(t: string) {
  if (!t) return "--";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  if (h === 0) return `12:${m} AM`;
  if (h < 12) return `${h}:${m} AM`;
  if (h === 12) return `12:${m} PM`;
  return `${h - 12}:${m} PM`;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  schedules,
  routeName,
}: ScheduleModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const rows = schedules.map((s) =>
      `<tr>
        <td><strong>${s.day}</strong></td>
        <td>${formatTime(s.startTime)}</td>
        <td>${formatTime(s.endTime)}</td>
        <td>${s.is24hoursService ? "24h" : "Standard"}</td>
      </tr>`
    ).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Schedule — ${routeName ?? "Route"}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .route { font-size: 13px; font-weight: 600; color: #4f46e5; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; }
    th { background: #f9fafb; padding: 10px 14px; font-size: 12px; font-weight: 700; text-align: center; border-bottom: 1px solid #e5e7eb; }
    td { padding: 12px 14px; font-size: 12px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    tr:last-child td { border-bottom: none; }
  </style>
</head>
<body>
  <h1>Default Schedule</h1>
  ${routeName ? `<p class="route">Route: ${routeName}</p>` : ""}
  <table>
    <thead><tr><th>Day</th><th>Start</th><th>End</th><th>Service</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schedule-${(routeName ?? "route").toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl sm:max-w-2xl rounded-3xl border-surface-subtle p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogTitle className="text-2xl font-bold text-content-primary">
            Default Schedule
          </DialogTitle>

          {routeName && (
            <div className="bg-brand-pale/30 rounded-2xl p-4 text-center border border-brand-light/20">
              <p className="text-sm font-bold text-content-primary">
                Route: {routeName}
              </p>
            </div>
          )}

          <div ref={printRef}>
            {schedules.length === 0 ? (
              <p className="text-sm text-content-muted text-center py-8">
                No schedule days configured yet. Enable days in the schedule settings.
              </p>
            ) : (
              <div className="border border-surface-subtle rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 bg-surface-page border-b border-surface-subtle">
                  <div className="p-3 text-center">
                    <span className="text-xs font-bold text-content-primary">Day</span>
                  </div>
                  <div className="p-3 text-center border-l border-surface-subtle">
                    <span className="text-xs font-bold text-status-success">Start</span>
                  </div>
                  <div className="p-3 text-center border-l border-surface-subtle">
                    <span className="text-xs font-bold text-status-error">End</span>
                  </div>
                  <div className="p-3 text-center border-l border-surface-subtle">
                    <span className="text-xs font-bold text-content-muted">Service</span>
                  </div>
                </div>

                <div className="divide-y divide-surface-subtle">
                  {schedules.map((s) => (
                    <div key={s.day} className="grid grid-cols-4 divide-x divide-surface-subtle">
                      <div className="p-4 text-center text-xs font-semibold text-content-primary">
                        {s.day}
                      </div>
                      <div className="p-4 text-center text-xs text-content-secondary">
                        {formatTime(s.startTime)}
                      </div>
                      <div className="p-4 text-center text-xs text-content-secondary">
                        {formatTime(s.endTime)}
                      </div>
                      <div className="p-4 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          s.is24hoursService
                            ? "bg-brand-pale text-brand"
                            : "bg-surface-subtle text-content-muted"
                        }`}>
                          {s.is24hoursService ? "24h" : "Standard"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleDownload}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
