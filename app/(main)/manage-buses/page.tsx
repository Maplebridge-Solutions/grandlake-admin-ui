"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusList from "@/components/manage-buses/bus-list";
import BusForm from "@/components/manage-buses/bus-form";
import MaintenanceManagement from "@/components/manage-buses/maintenance-management";
import AddMechanicModal from "@/components/manage-buses/add-mechanic-modal";
import type { BusData, MechanicData } from "@/lib/types/buses";

export default function ManageBusesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") ?? "list";
  const maintenanceBusId = searchParams.get("id") ?? "";

  const [selectedBus, setSelectedBus] = useState<BusData | undefined>(undefined);
  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState(false);
  const onMechanicCreatedRef = useRef<((mechanic: MechanicData) => void) | null>(null);

  const handleAddBus = () => {
    setSelectedBus(undefined);
    router.push("?view=add");
  };

  const handleEditBus = (bus: BusData) => {
    setSelectedBus(bus);
    router.push("?view=edit");
  };

  const handleMaintenance = (busId: string = "") => {
    const params = busId ? `?view=maintenance&id=${busId}` : "?view=maintenance";
    router.push(params);
  };

  const handleBack = () => {
    setSelectedBus(undefined);
    router.push("?view=list");
  };

  const handleAddMechanic = (onCreated: (mechanic: MechanicData) => void) => {
    onMechanicCreatedRef.current = onCreated;
    setIsMechanicModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
              Bus/Fleet Management
            </h1>
            <p className="text-content-muted">Manage, edit and delete buses here</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleMaintenance()}
              className="rounded-full px-6 h-11 border-brand text-brand hover:bg-brand-light font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <Wrench size={18} />
              Maintenance
            </Button>
            <Button
              onClick={handleAddBus}
              className="rounded-full px-6 h-11 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex-1 sm:flex-none justify-center"
            >
              <Plus size={18} />
              Add a Bus
            </Button>
          </div>
        </div>
      )}

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
            onAddMechanic={handleAddMechanic}
            busId={maintenanceBusId}
          />
        )}
      </div>

      <AddMechanicModal
        isOpen={isMechanicModalOpen}
        onClose={() => setIsMechanicModalOpen(false)}
        onCreated={(mechanic) => {
          onMechanicCreatedRef.current?.(mechanic);
          onMechanicCreatedRef.current = null;
          setIsMechanicModalOpen(false);
        }}
      />
    </div>
  );
}
