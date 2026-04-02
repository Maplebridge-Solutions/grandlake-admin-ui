"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DriverList from "@/components/manage-drivers/driver-list";
import DriverForm from "@/components/manage-drivers/driver-form";
import DriverProfile from "@/components/manage-drivers/driver-profile";
import AssignShiftModal from "@/components/manage-drivers/assign-shift-modal";
import IncidentReportModal from "@/components/manage-drivers/incident-report-modal";
import type { DriverViewState, Driver } from "@/lib/types/drivers";

export default function ManageDriversPage() {
  const [view, setView] = useState<DriverViewState>("list");
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(undefined);
  const [isAssignShiftModalOpen, setIsAssignShiftModalOpen] = useState(false);
  const [isIncidentReportModalOpen, setIsIncidentReportModalOpen] =
    useState(false);

  const handleAddDriver = () => {
    setSelectedDriver(undefined);
    setView("add");
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setView("edit");
  };

  const handleViewProfile = (driver: Driver) => {
    setSelectedDriver(driver);
    setView("profile");
  };

  const handleBack = () => {
    setView("list");
    setSelectedDriver(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-content-primary">
              Driver/Staff Management
            </h1>
            <p className="text-content-muted">
              Manage driver profiles and shifts, rosters here
            </p>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Main Content */}
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

        {view === "profile" && (
          <DriverProfile
            driver={selectedDriver!}
            onBack={handleBack}
            onEdit={() => setView("edit")}
          />
        )}
      </div>

      {/* Modals */}
      <AssignShiftModal
        isOpen={isAssignShiftModalOpen}
        onClose={() => setIsAssignShiftModalOpen(false)}
      />
      <IncidentReportModal
        isOpen={isIncidentReportModalOpen}
        onClose={() => setIsIncidentReportModalOpen(false)}
      />
    </div>
  );
}
