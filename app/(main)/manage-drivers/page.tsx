"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DriverList from "@/components/manage-drivers/driver-list";
import DriverForm from "@/components/manage-drivers/driver-form";
import DriverProfile from "@/components/manage-drivers/driver-profile";
import AssignShiftModal from "@/components/manage-drivers/assign-shift-modal";
import IncidentReportModal from "@/components/manage-drivers/incident-report-modal";
import type { DriverViewState, DriverData } from "@/lib/types/drivers";

export default function ManageDriversPage() {
  const [view, setView] = useState<DriverViewState>("list");
  const [selectedDriver, setSelectedDriver] = useState<DriverData | undefined>(undefined);
  const [isAssignShiftModalOpen, setIsAssignShiftModalOpen] = useState(false);
  const [isIncidentReportModalOpen, setIsIncidentReportModalOpen] = useState(false);
  const [shiftsRefreshKey, setShiftsRefreshKey] = useState(0);

  const handleAddDriver = () => {
    setSelectedDriver(undefined);
    setView("add");
  };

  const handleEditDriver = (driver: DriverData) => {
    setSelectedDriver(driver);
    setView("edit");
  };

  const handleViewProfile = (driver: DriverData) => {
    setSelectedDriver(driver);
    setView("profile");
  };

  const handleBack = () => {
    setView("list");
    setSelectedDriver(undefined);
  };

  return (
    <div className="space-y-8">
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
              Driver/Staff Management
            </h1>
            <p className="text-content-muted">Manage driver profiles and shifts, rosters here</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAssignShiftModalOpen(true)}
              className="rounded-full px-6 h-12 border-brand text-brand hover:bg-brand-light font-semibold transition-all active:scale-[0.98]"
            >
              Assign Shift
            </Button>
            <Button
              onClick={handleAddDriver}
              className="rounded-full px-6 h-12 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              Add New Driver
            </Button>
          </div>
        </div>
      )}

      <div className="animate-in fade-in duration-500">
        {view === "list" && (
          <DriverList
            onAddDriver={handleAddDriver}
            onViewProfile={handleViewProfile}
            onEditDriver={handleEditDriver}
          />
        )}

        {(view === "add" || view === "edit") && (
          <DriverForm onBack={handleBack} driver={selectedDriver} />
        )}

        {view === "profile" && selectedDriver && (
          <DriverProfile
            driver={selectedDriver}
            onBack={handleBack}
            onEdit={() => setView("edit")}
            onAssignShift={() => setIsAssignShiftModalOpen(true)}
            shiftsRefreshKey={shiftsRefreshKey}
          />
        )}
      </div>

      <AssignShiftModal
        isOpen={isAssignShiftModalOpen}
        onClose={() => setIsAssignShiftModalOpen(false)}
        defaultDriverId={selectedDriver?._id}
        onSuccess={() => setShiftsRefreshKey((k) => k + 1)}
      />
      <IncidentReportModal
        isOpen={isIncidentReportModalOpen}
        onClose={() => setIsIncidentReportModalOpen(false)}
      />
    </div>
  );
}
