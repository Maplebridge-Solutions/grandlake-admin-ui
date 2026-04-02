"use client";

import { useState } from "react";
import { ArrowLeft, Trash2, Search, X, FileText } from "lucide-react";
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
import type { BusFormProps } from "@/lib/types/buses";

export default function BusForm({ onBack, bus }: BusFormProps) {
  const [stops, setStops] = useState<string[]>(
    bus
      ? [
          "Fulton Road",
          "Heather street",
          "Northcrest avenue",
          "Avon road",
          "New England road",
          "Evans road",
          "Winterport Way",
        ]
      : [],
  );
  const [files, setFiles] = useState<{ name: string; size: string }[]>(
    bus
      ? [
          { name: "Registration Doc.pdf", size: "6mb" },
          { name: "Insurance.pdf", size: "6mb" },
          { name: "Compliance.pdf", size: "6mb" },
        ]
      : [],
  );

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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
          {bus ? `Edit Bus ${bus.fleet}` : "Add a Bus"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fleet"
                  className="text-sm font-bold text-content-primary"
                >
                  Fleet Number
                </Label>
                <Input
                  id="fleet"
                  placeholder="Type here"
                  defaultValue={bus?.fleet}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="license"
                  className="text-sm font-bold text-content-primary"
                >
                  License Plate Number
                </Label>
                <Input
                  id="license"
                  placeholder="Type here"
                  defaultValue={bus?.license || "FKM7115"}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="tracking"
                  className="text-sm font-bold text-content-primary"
                >
                  Tracking ID
                </Label>
                <Input
                  id="tracking"
                  placeholder="Type here"
                  defaultValue={bus?.tracking || "987"}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="route"
                  className="text-sm font-bold text-content-primary"
                >
                  Route ID
                </Label>
                <Select defaultValue={bus?.routeId || "5"}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="122">122</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-bold text-content-primary"
                >
                  Bus type
                </Label>
                <Select defaultValue={bus?.type || "Single-deck"}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    <SelectItem value="Single-deck">Single-deck</SelectItem>
                    <SelectItem value="Double-deck">Double-deck</SelectItem>
                    <SelectItem value="Minibus">Minibus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="accessible"
                  className="text-sm font-bold text-content-primary"
                >
                  Wheel-chair Accessible?
                </Label>
                <Select defaultValue={bus?.accessible || "Yes"}>
                  <SelectTrigger className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                    <SelectValue placeholder="Select here" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stops Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-content-primary">
                  Add/Edit Stops
                </h3>
                <p className="text-sm text-content-muted">
                  Hover on a stop to see the remove option
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                    size={18}
                  />
                  <Input
                    placeholder="search for a stop name here"
                    className="h-12 pl-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                  />
                </div>

                {stops.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-surface-subtle rounded-3xl bg-surface-page/50">
                    <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center mb-4">
                      <X className="text-content-muted" size={24} />
                    </div>
                    <h4 className="text-base font-bold text-content-primary">
                      Route Not Selected Yet
                    </h4>
                    <p className="text-sm text-content-muted text-center max-w-xs mt-1">
                      Select a bus route to see/edit stops. You can create new
                      routes from &apos;Manage routes&apos; in left menu
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            {bus ? "Save Changes" : "Save all"}
          </Button>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                {bus ? "Documents" : "Upload Documents"}
              </h3>
              <p className="text-sm text-content-muted">
                This includes registration, insurance and compliance documents
              </p>
            </div>

            <div className="border-2 border-dashed border-brand-light bg-brand-light/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-brand-light/10 transition-all group border-spacing-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-brand/20 rounded-2xl -rotate-3 group-hover:-rotate-6 transition-transform" />
                <div className="relative w-12 h-14 bg-white border border-surface-subtle rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="text-brand" size={24} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-content-primary">
                  Tap here to upload (Pdf, png supported)
                </p>
                <p className="text-xs text-content-muted">Max size here</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-surface-page rounded-2xl border border-surface-subtle hover:border-brand-light transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm">
                        <FileText
                          className="text-content-muted group-hover:text-brand transition-colors"
                          size={20}
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-content-primary">
                          {file.name}
                        </p>
                        <p className="text-xs text-content-muted">
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(i)}
                      className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
