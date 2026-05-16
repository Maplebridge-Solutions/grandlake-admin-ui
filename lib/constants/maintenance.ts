export const MAINTENANCE_FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const MAINTENANCE_TABLE_HEADS = [
  { label: "Bus No.", className: "pl-8" },
  { label: "Type of service" },
  { label: "Set For" },
  { label: "Est. Return" },
  { label: "Assigned Mechanic" },
  { label: "Status" },
  { label: "Actions", className: "pr-8 text-right" },
];

export const maintenanceStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "SCHEDULED":
      return "bg-brand-pale text-brand";
    case "COMPLETED":
      return "bg-status-success-bg text-status-success";
    case "CANCELLED":
      return "bg-status-error-bg text-status-error";
    default:
      return "bg-status-warning-bg text-status-warning";
  }
};
