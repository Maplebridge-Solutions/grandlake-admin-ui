"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteList from "@/components/manage-routes/route-list";
import RouteForm from "@/components/manage-routes/route-form";
import ScheduleModal from "@/components/manage-routes/schedule-modal";
import type { RouteViewState, Route } from "@/lib/types/routes";

export default function ManageRoutesPage() {
  const [view, setView] = useState<RouteViewState>("list");
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>(undefined);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleAddRoute = () => {
    setSelectedRoute(undefined);
    setView("add");
  };

  const handleEditRoute = (route: Route) => {
    setSelectedRoute(route);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedRoute(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-content-primary">
              Routes and Schedule Management
            </h1>
            <p className="text-content-muted">
              Manage trip routes and schedules here
            </p>
          </div>
          <Button
            onClick={handleAddRoute}
            className="rounded-full px-6 h-12 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
          >
            <Plus size={18} />
            Create New Routes
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="animate-in fade-in duration-500">
        {view === "list" && (
          <RouteList
            onAddRoute={handleAddRoute}
            onEditRoute={handleEditRoute}
          />
        )}

        {(view === "add" || view === "edit") && (
          <RouteForm
            onBack={handleBack}
            route={selectedRoute}
            onViewSchedule={() => setIsScheduleModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
