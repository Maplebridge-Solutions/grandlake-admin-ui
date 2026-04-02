"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Upload,
  Clock,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import type { RouteFormProps } from "@/lib/types/routes";

export default function RouteForm({
  onBack,
  route,
  onViewSchedule,
}: RouteFormProps) {
  const [stops, setStops] = useState<string[]>(
    route
      ? [
          "Fulton Road",
          "Heather street",
          "Northcrest avenue",
          "Avon road",
          "New England road",
          "Evans road",
          "Winterport Way",
          "Brooth road",
          "Newcastle center street",
          "Hill street",
        ]
      : [],
  );
  const [scheduleView, setScheduleView] = useState<"default" | "variant">(
    "default",
  );

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-content-primary">
          {route ? `Edit Route ${route.id}` : "Create a New Route"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="shortName"
                  className="text-sm font-bold text-content-primary"
                >
                  Route Short Name
                </Label>
                <Input
                  id="shortName"
                  placeholder="Type here"
                  defaultValue={route?.name}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="routeId"
                  className="text-sm font-bold text-content-primary"
                >
                  Route ID
                </Label>
                <Input
                  id="routeId"
                  placeholder="Route_5"
                  defaultValue={route?.id || "Route_5"}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="origin"
                  className="text-sm font-bold text-content-primary"
                >
                  Origin Location
                </Label>
                <Select defaultValue={route?.origin}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    <SelectItem value="1 Main Street, Minto">
                      1 Main Street, Minto
                    </SelectItem>
                    <SelectItem value="6373 Upper salmon creek">
                      6373 Upper salmon creek
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="destination"
                  className="text-sm font-bold text-content-primary"
                >
                  Final Destination
                </Label>
                <Select defaultValue={route?.destination}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    <SelectItem value="10 Civic Court, Chipman">
                      10 Civic Court, Chipman
                    </SelectItem>
                    <SelectItem value="122 Bridge street">
                      122 Bridge street
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stops Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-content-primary">
                    Add/Edit Stops
                  </h3>
                  <p className="text-sm text-content-muted">
                    Hover on a stop to see the remove option
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full px-4 h-10 border-brand text-brand hover:bg-brand-light font-bold text-xs gap-2"
                >
                  <Wand2 size={16} />
                  Generate Instead
                </Button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                    size={18}
                  />
                  <Input
                    placeholder="search for a stop name here to add manually"
                    className="h-12 pl-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {stops.map((stop, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between p-4 bg-surface-page rounded-xl border border-transparent hover:border-brand-light hover:bg-brand-light/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            i === 0 ? "bg-brand" : "bg-content-muted",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            i === 0 ? "text-brand" : "text-content-secondary",
                          )}
                        >
                          {stop}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStop(i)}
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-status-error hover:bg-status-error-bg transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            {route ? "Save Changes" : "Save all"}
          </Button>
        </div>

        {/* Schedule Section */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            {scheduleView === "default" ? (
              <>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-content-primary">
                    Set Default Schedule
                  </h3>
                  <p className="text-sm text-content-muted">
                    Either upload as a file or set schedule manually. You can
                    create variations after saving default.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2"
                >
                  <Upload size={18} />
                  Upload File Instead
                </Button>

                <div className="space-y-6">
                  {["Monday", "Tuesday", "Wednesday"].map((day) => (
                    <div key={day} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={day}
                          className="rounded-md border-surface-subtle data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                        />
                        <Label
                          htmlFor={day}
                          className="text-sm font-bold text-content-primary"
                        >
                          {day}
                        </Label>
                        <span className="text-xs text-content-muted ml-auto">
                          This is a 24 hour service
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Select>
                          <SelectTrigger className="h-10 bg-surface-page border-surface-subtle rounded-xl text-xs">
                            <SelectValue placeholder="Choose start time" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-surface-subtle">
                            <SelectItem value="07:00">07:00 AM</SelectItem>
                            <SelectItem value="08:00">08:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="h-10 bg-surface-page border-surface-subtle rounded-xl text-xs">
                            <SelectValue placeholder="Choose end time" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-surface-subtle">
                            <SelectItem value="19:00">07:00 PM</SelectItem>
                            <SelectItem value="20:00">08:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Select>
                        <SelectTrigger className="h-10 bg-surface-page border-surface-subtle rounded-xl text-xs">
                          <SelectValue placeholder="Choose frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-surface-subtle">
                          <SelectItem value="15">Every 15 Minutes</SelectItem>
                          <SelectItem value="30">Every 30 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setScheduleView("variant")}
                  className="w-full text-brand hover:bg-brand-light font-bold text-sm"
                >
                  View Variants
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-content-primary">
                    Add Schedule Variant
                  </h3>
                  <p className="text-sm text-content-muted">
                    Either upload as a file or set schedule manually. A variant
                    can be weekends or holiday schedule.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2"
                  >
                    <Upload size={18} />
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-brand text-brand hover:bg-brand-light rounded-full font-bold text-sm gap-2"
                  >
                    <Plus size={18} />
                    Add Manually
                  </Button>
                </div>

                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between p-4 bg-brand-light/10 rounded-2xl border border-brand-light group cursor-pointer"
                    onClick={onViewSchedule}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm">
                        <Clock className="text-brand" size={20} />
                      </div>
                      <p className="text-sm font-bold text-content-primary">
                        Default schedule
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <ChevronRight size={18} className="text-content-muted" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setScheduleView("default")}
                  className="w-full text-brand hover:bg-brand-light font-bold text-sm"
                >
                  Back to Settings
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
