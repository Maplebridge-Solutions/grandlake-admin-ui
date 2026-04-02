"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusList from "@/components/manage-buses/bus-list";
import BusForm from "@/components/manage-buses/bus-form";
import MaintenanceManagement from "@/components/manage-buses/maintenance-management";
import AddMechanicModal from "@/components/manage-buses/add-mechanic-modal";
import type { BusViewState, Bus } from "@/lib/types/buses";

export default function ManageBusesPage() {
  const [view, setView] = useState<BusViewState>("list");
  const [selectedBus, setSelectedBus] = useState<Bus | undefined>(undefined);
  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState(false);

  const handleAddBus = () => {
    setSelectedBus(undefined);
    setView("add");
  };

  const handleEditBus = (bus: Bus) => {
    setSelectedBus(bus);
    setView("edit");
  };

  const handleMaintenance = () => {
    setView("maintenance");
  };

  const handleBack = () => {
    setView("list");
    setSelectedBus(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-content-primary">
              Bus/Fleet Management
            </h1>
            <p className="text-content-muted">
              Manage, edit and delete buses here
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleMaintenance}
              className="rounded-full px-6 h-12 border-brand text-brand hover:bg-brand-light font-semibold flex items-center gap-2"
            >
              <Wrench size={18} />
              Maintenance
            </Button>
            <Button
              onClick={handleAddBus}
              className="rounded-full px-6 h-12 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              Add a Bus
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="animate-in fade-in duration-500">
        {view === "list" && (
          <BusList
            onAddBus={handleAddBus}
            onEditBus={handleEditBus}
            onMaintenance={handleMaintenance}
          />
        )}

        {(view === "add" || view === "edit") && (
          <BusForm onBack={handleBack} bus={selectedBus} />
        )}

        {view === "maintenance" && (
          <MaintenanceManagement
            onBack={handleBack}
            onAddMechanic={() => setIsMechanicModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <AddMechanicModal
        isOpen={isMechanicModalOpen}
        onClose={() => setIsMechanicModalOpen(false)}
      />
    </div>
  );
}
