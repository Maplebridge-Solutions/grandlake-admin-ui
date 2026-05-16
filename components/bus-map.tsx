"use client";

import { X, MapPin, Bus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BusMap({
  onClose,
  isContained = false,
}: {
  onClose: () => void;
  isContained?: boolean;
}) {
  const stops = [
    { name: "Fulton Road", time: "10:00 AM", status: "passed" },
    { name: "Heather street", time: "10:05 AM", status: "passed" },
    { name: "Northcrest avenue", time: "10:10 AM", status: "passed" },
    { name: "Avon road", time: "10:15 AM", status: "passed" },
    { name: "New England road", time: "10:20 AM", status: "passed" },
    { name: "Evans road", time: "10:25 AM", status: "passed" },
    { name: "Winterport Way", time: "10:30 AM", status: "passed" },
    { name: "Brooth road", time: "10:35 AM", status: "passed" },
    { name: "Newcastle center street", time: "10:40 AM", status: "current" },
    { name: "Hill street", time: "10:45 AM", status: "upcoming" },
    { name: "High street", time: "10:50 AM", status: "upcoming" },
    { name: "Chapman road", time: "10:55 AM", status: "upcoming" },
    { name: "Cedar road", time: "11:00 AM", status: "upcoming" },
    { name: "Union street", time: "11:05 AM", status: "upcoming" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white",
        !isContained && "fixed inset-0 z-50 p-4 bg-black/40 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "bg-white w-full flex overflow-hidden relative h-full",
          !isContained ? "max-w-6xl mx-auto rounded-3xl shadow-2xl" : "",
        )}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 z-10 bg-white shadow-md rounded-full hover:bg-brand-light hover:text-brand"
          onClick={onClose}
        >
          <X size={24} />
        </Button>

        {/* Map Area */}
        <div className="flex-1 relative bg-surface-subtle">
          <Image
            src="https://picsum.photos/seed/glk-map/1200/800"
            alt="Map View"
            fill
            className="object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          {/* Simulated Bus Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 bg-status-error rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                <Bus size={24} />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                <span className="text-xs font-bold text-content-primary">
                  Fleet No: 150
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="w-96 bg-white border-l border-surface-subtle flex flex-col h-full">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-content-primary">
                Fleet No: 150
              </h2>
              <div className="flex items-center gap-2 text-content-muted">
                <Navigation size={16} />
                <span className="text-sm font-medium">
                  Shirley rd ⇄ Fowler rd
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-brand-pale text-brand border-none font-bold">
                  Active
                </Badge>
                <Badge className="bg-brand-pale text-brand border-none font-bold">
                  Online
                </Badge>
              </div>
            </div>

            <div className="bg-brand-light/30 border border-brand-subtle rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand shadow-sm">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-content-muted uppercase tracking-wider">
                  Current Location
                </span>
                <span className="text-sm font-bold text-content-primary">
                  Metropolitan Avenue
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-content-primary">
                  Trip stops
                </h3>
                <span className="text-xs font-semibold text-content-muted">
                  This trip has 32 stops
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-brand-subtle" />

                  {stops.map((stop, i) => (
                    <div
                      key={i}
                      className="relative flex items-center justify-between"
                    >
                      <div
                        className={cn(
                          "absolute -left-[23px] w-4 h-4 rounded-full border-2 border-white shadow-sm z-10",
                          stop.status === "passed"
                            ? "bg-brand"
                            : stop.status === "current"
                              ? "bg-brand ring-4 ring-brand-pale"
                              : "bg-surface-subtle",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          stop.status === "passed"
                            ? "text-content-muted"
                            : stop.status === "current"
                              ? "text-brand font-bold"
                              : "text-content-secondary",
                        )}
                      >
                        {stop.name}
                      </span>
                      {stop.status === "current" && (
                        <Badge className="bg-brand-pale text-brand border-none text-xs font-bold px-3 py-1">
                          On time
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
