"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteList from "@/components/manage-routes/route-list";
import RouteForm from "@/components/manage-routes/route-form";
import ScheduleModal from "@/components/manage-routes/schedule-modal";
import type { RouteViewState, RouteData, ScheduleEntry } from "@/lib/types/routes";

export default function ManageRoutesPage() {
  const [view, setView] = useState<RouteViewState>("list");
  const [selectedRoute, setSelectedRoute] = useState<RouteData | undefined>(undefined);
  const [scheduleModal, setScheduleModal] = useState<{
    open: boolean;
    schedules: ScheduleEntry[];
    routeName: string;
  }>({ open: false, schedules: [], routeName: "" });

  const handleAddRoute = () => {
    setSelectedRoute(undefined);
    setView("add");
  };

  const handleViewRoute = (route: RouteData) => {
    setSelectedRoute(route);
    setView("view");
  };

  const handleEditRoute = (route: RouteData) => {
    setSelectedRoute(route);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedRoute(undefined);
  };

  return (
    <div className="space-y-8">
      {view === "list" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
              Routes and Schedule Management
            </h1>
            <p className="text-content-muted">Manage trip routes and schedules here</p>
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

      <div className="animate-in fade-in duration-500">
        {view === "list" && (
          <RouteList
            onAddRoute={handleAddRoute}
            onViewRoute={handleViewRoute}
            onEditRoute={handleEditRoute}
          />
        )}

        {(view === "add" || view === "edit" || view === "view") && (
          <RouteForm
            onBack={handleBack}
            route={selectedRoute}
            readOnly={view === "view"}
            onViewSchedule={(schedules, routeName) =>
              setScheduleModal({ open: true, schedules, routeName })
            }
          />
        )}
      </div>

      <ScheduleModal
        isOpen={scheduleModal.open}
        onClose={() => setScheduleModal((prev) => ({ ...prev, open: false }))}
        schedules={scheduleModal.schedules}
        routeName={scheduleModal.routeName}
      />
    </div>
  );
}
