"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PenLine,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import type { Route, RouteListProps } from "@/lib/types/routes";

const initialRoutes: Route[] = [
  {
    id: "Route_10",
    name: "Route_10",
    origin: "1 Main Street, Minto",
    destination: "10 Civic Court, Chipman",
    buses: 32,
  },
  {
    id: "Route_10",
    name: "Route_10",
    origin: "6373 Upper salmon...",
    destination: "122 Bridge street",
    buses: 32,
  },
  {
    id: "Route_10",
    name: "Route_10",
    origin: "1100 Pleasant Drive",
    destination: "Health Complex",
    buses: 32,
  },
  {
    id: "Route_10",
    name: "Route_10",
    origin: "265 Main street",
    destination: "10 Civic Court, Chipman",
    buses: 32,
  },
  {
    id: "Route_690",
    name: "Route_690",
    origin: "Princess Park Camp...",
    destination: "Public Beach",
    buses: 32,
  },
  {
    id: "Route_10",
    name: "Route_10",
    origin: "Chipman Municipal...",
    destination: "Chipman Health Ce...",
    buses: 32,
  },
];


export default function RouteList({ onEditRoute }: RouteListProps) {
  const routes = initialRoutes;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutes = routes.filter(
    (route) =>
      route.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isEmpty = routes.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-48 h-48 opacity-50">
          <Image
            src="https://picsum.photos/seed/empty-route/400/400"
            alt="No data"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-content-primary">
            No Routes Created Yet
          </h3>
          <p className="text-content-muted mt-2">
            You can see routes here after you&apos;ve created them. Create
            routes
          </p>
          <p className="text-content-muted">from button in top right</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
          <Input
            placeholder="search for any route by name here"
            className="h-12 pl-12 bg-white border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="rounded-full px-6 h-12 border-surface-subtle font-semibold flex items-center gap-2 shrink-0"
        >
          <Filter size={18} />
          This week
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route, i) => (
          <div
            key={i}
            className="bg-white border border-surface-subtle rounded-3xl p-6 shadow-sm hover:border-brand-light transition-all group relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-content-primary">
                  {route.id}
                </h4>
                <div className="flex items-center gap-2 text-xs text-content-muted">
                  <span className="truncate max-w-[100px]">{route.origin}</span>
                  <ChevronRight size={12} />
                  <span className="truncate max-w-[100px]">
                    {route.destination}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-brand-light hover:text-brand inline-flex items-center justify-center transition-colors">
                  <MoreHorizontal size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border-surface-subtle"
                >
                  <DropdownMenuItem
                    onClick={() => onEditRoute(route)}
                    className="cursor-pointer rounded-lg gap-2"
                  >
                    <PenLine size={16} />
                    Edit Route
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error">
                    <Trash2 size={16} />
                    Delete Route
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="pt-4 border-t border-surface-subtle flex items-center justify-between">
              <span className="text-xs font-medium text-content-muted">
                {route.buses} Buses
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditRoute(route)}
                className="text-brand hover:bg-brand-light font-bold text-xs rounded-lg"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
