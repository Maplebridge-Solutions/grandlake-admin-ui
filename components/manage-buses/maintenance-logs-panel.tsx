"use client";

import type { MaintenanceRecord } from "@/lib/types/buses";

interface MaintenanceLogsPanelProps {
  logs: MaintenanceRecord["logs"];
  loading: boolean;
}

export default function MaintenanceLogsPanel({
  logs,
  loading,
}: MaintenanceLogsPanelProps) {
  return (
    <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-content-primary">Logs</h3>
        <p className="text-sm text-content-muted">Maintenance activity logs</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-surface-subtle rounded animate-pulse w-3/4" />
              <div className="h-3 bg-surface-subtle rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-content-muted text-center py-8">
          No logs yet
        </p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="p-4 rounded-2xl bg-white border-l-4 shadow-sm border-s-status-warning"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm text-content-primary">{log.message}</p>
                <p className="text-xs text-content-muted">
                  {log.actor} &middot; {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
