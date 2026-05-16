"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  PenLine,
  Trash2,
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import type { DriverProfileProps, DriverData } from "@/lib/types/drivers";
import type { DriverShift } from "@/lib/types/buses";
import type { RouteData } from "@/lib/types/routes";
import { getDriver } from "@/lib/api/drivers";
import { getShifts } from "@/lib/api/fleet";
import { getAllRoutes } from "@/lib/api/routes";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA");
}


export default function DriverProfile({ driver: initialDriver, onBack, onEdit, onAssignShift, shiftsRefreshKey }: DriverProfileProps) {
  const [driver, setDriver] = useState<DriverData>(initialDriver);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("past");
  const [shifts, setShifts] = useState<DriverShift[]>([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [assignedRoute, setAssignedRoute] = useState<RouteData | null>(null);

  useEffect(() => {
    async function fetchDriver() {
      try {
        const res = await getDriver(initialDriver._id);
        if (res.success && res.data) setDriver(res.data);
      } catch {
        // keep initial data
      } finally {
        setLoading(false);
      }
    }
    fetchDriver();
  }, [initialDriver._id]);

  useEffect(() => {
    if (!initialDriver.isDriver) { setShiftsLoading(false); return; }
    async function fetchShifts() {
      setShiftsLoading(true);
      try {
        const res = await getShifts({ driver: initialDriver._id, limit: 50 });
        if (res.success) setShifts(Array.isArray(res.data) ? res.data : []);
      } catch {
        // keep empty
      } finally {
        setShiftsLoading(false);
      }
    }
    fetchShifts();
  }, [initialDriver._id, initialDriver.isDriver, shiftsRefreshKey]);

  useEffect(() => {
    if (!initialDriver.isDriver) return;
    async function fetchRoute() {
      const routeId = initialDriver.driverDetails?.routeId;
      if (!routeId) return;
      try {
        const res = await getAllRoutes();
        if (res.success && Array.isArray(res.data)) {
          const match = res.data.find((r) => r._id === routeId);
          if (match) setAssignedRoute(match);
        }
      } catch {
        // keep null
      }
    }
    fetchRoute();
  }, [initialDriver.driverDetails?.routeId, initialDriver.isDriver]);

  const details = driver.driverDetails;
  const fullName = `${driver.firstName} ${driver.lastName}`;
  const pictureUrl = details?.pictureUrl?.replace(/^(https?):\/(?!\/)/, "$1://");

  const licenseExpired =
    details?.licenseExpirationDate
      ? new Date(details.licenseExpirationDate) < new Date()
      : false;

  const daysUntilExpiry = details?.licenseExpirationDate
    ? Math.ceil(
        (new Date(details.licenseExpirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-surface-subtle rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-surface-subtle rounded-3xl p-8 h-48" />
            ))}
          </div>
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-content-primary">
            {fullName} Profile
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {driver.isDriver && (
            <Button
              variant="outline"
              onClick={onAssignShift}
              className="rounded-full px-6 h-12 border-brand text-brand hover:bg-brand-light font-semibold transition-all active:scale-[0.98]"
            >
              Assign Shift
            </Button>
          )}
          {driver.isDriver && (
            <Button
              onClick={onEdit}
              className="rounded-full px-6 h-12 bg-brand hover:bg-brand/90 text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
            >
              <PenLine size={18} />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Identity */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <User className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Personal Identity
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-surface-subtle shadow-sm shrink-0 bg-surface-page flex items-center justify-center">
                {pictureUrl && !imgError ? (
                  <Image
                    src={pictureUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <User size={48} className="text-content-muted" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">Full Name</p>
                  <p className="text-base font-medium text-content-primary">{fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">Date of Birth</p>
                  <p className="text-base font-medium text-content-primary">{formatDate(details?.dateOfBirth)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">Staff ID</p>
                  <p className="text-base font-medium text-content-primary">{details?.staffId ?? "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-content-muted">Phone Number</p>
                  <p className="text-base font-medium text-content-primary">{driver.phone ?? "—"}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-bold text-content-muted">Email address</p>
                  <p className="text-base font-medium text-content-primary">{driver.user?.email ?? "—"}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-bold text-content-muted">Role(s)</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.user?.roles && driver.user.roles.length > 0 ? (
                      driver.user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-pale text-brand border border-brand/20 capitalize"
                        >
                          {role.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <p className="text-base font-medium text-content-primary">—</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Section — drivers only */}
          {driver.isDriver && (
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">Assigned Route</h3>
            </div>

            {assignedRoute ? (
              <div className="space-y-6">
                {/* Route summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                    <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Route Name</p>
                    <p className="text-sm font-bold text-content-primary">{assignedRoute.name}</p>
                  </div>
                  <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                    <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Route Number</p>
                    <p className="text-sm font-bold text-content-primary">
                      {assignedRoute.routeNumber ?? "—"}
                    </p>
                  </div>
                  {assignedRoute.origin && (
                    <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                      <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Origin</p>
                      <p className="text-sm font-bold text-content-primary">{assignedRoute.origin.name}</p>
                    </div>
                  )}
                  {assignedRoute.destination && (
                    <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                      <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Destination</p>
                      <p className="text-sm font-bold text-content-primary">{assignedRoute.destination.name}</p>
                    </div>
                  )}
                </div>

                {/* Schedule table */}
                {assignedRoute.schedules && assignedRoute.schedules.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-content-primary">Schedule</p>
                    <div className="rounded-2xl border border-surface-subtle overflow-hidden">
                      <Table>
                        <TableHeader className="bg-surface-page">
                          <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                            <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wide py-3 pl-5">Day / Date</TableHead>
                            <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wide py-3">Start Time</TableHead>
                            <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wide py-3">End Time</TableHead>
                            <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wide py-3 pr-5 text-right">24h Service</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignedRoute.schedules.map((s, i) => (
                            <TableRow key={s._id ?? i} className="border-b border-surface-subtle last:border-0 hover:bg-brand-light/10 transition-colors">
                              <TableCell className="py-3 pl-5 text-sm font-medium text-content-primary">
                                {s.date}
                              </TableCell>
                              <TableCell className="py-3 text-sm font-medium text-content-primary">
                                {s.startTime}
                              </TableCell>
                              <TableCell className="py-3 text-sm font-medium text-content-primary">
                                {s.endTime}
                              </TableCell>
                              <TableCell className="py-3 pr-5 text-right">
                                <Badge
                                  variant="outline"
                                  className={`border-none text-xs font-bold px-3 py-1 ${
                                    s.is24hoursService
                                      ? "bg-brand-pale text-brand"
                                      : "bg-surface-subtle text-content-muted"
                                  }`}
                                >
                                  {s.is24hoursService ? "Yes" : "No"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Route ID</p>
                  <p className="text-sm font-bold text-content-primary">{details?.routeId ?? "—"}</p>
                </div>
                <div className="p-4 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-content-muted uppercase tracking-wide">Route Name</p>
                  <p className="text-sm font-bold text-content-primary">—</p>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Legal and Licensing — drivers only */}
          {driver.isDriver && details && (details.licenseName || details.licenseNumber || details.licenseClass || details.licenseExpirationDate) && (
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <FileText className="text-brand" size={20} />
                <h3 className="text-lg font-bold text-content-primary">Legal and Licensing</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-content-muted">License Name</p>
                      <p className="text-sm font-bold text-content-primary">{details.licenseName ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-content-muted">License Number</p>
                      <p className="text-sm font-bold text-content-primary">{details.licenseNumber ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-content-muted">License Class</p>
                      <p className="text-sm font-bold text-content-primary">{details.licenseClass ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-content-muted">Expiration Date</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-content-primary">{formatDate(details.licenseExpirationDate)}</p>
                        {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                          <Badge
                            variant="outline"
                            className={`border-none text-xs font-bold px-3 py-1 ${
                              licenseExpired
                                ? "bg-status-error-bg text-status-error"
                                : "bg-status-warning-bg text-status-warning"
                            }`}
                          >
                            {licenseExpired ? "Expired" : `Expires in ${daysUntilExpiry}d`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Driver On-site Data — drivers only */}
          {driver.isDriver && (
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-content-primary">Driver On-site Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                <p className="text-xs font-bold text-content-muted">Tachograph/Smart Card ID</p>
                <p className="text-sm font-bold text-content-primary">—</p>
              </div>
              <div className="p-6 bg-surface-page border border-surface-subtle rounded-2xl space-y-1">
                <p className="text-xs font-bold text-content-muted">Card Expiration Date (if any)</p>
                <p className="text-sm font-bold text-content-primary">—</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Right Column - Shifts & Documents — drivers only */}
        {driver.isDriver && (
        <div className="space-y-8">
          {/* Driver Shifts */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-content-primary">Driver Shifts</h3>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-surface-page border border-surface-subtle h-10 p-1 rounded-xl">
                  <TabsTrigger value="past" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand shadow-none">
                    Past
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand shadow-none">
                    Upcoming
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-surface-subtle">
                    <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wider py-3">Date</TableHead>
                    <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wider py-3">Route</TableHead>
                    <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wider py-3">Time</TableHead>
                    <TableHead className="text-xs font-bold text-content-muted uppercase tracking-wider py-3 text-right">Bus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shiftsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-b border-surface-subtle">
                        {Array.from({ length: 4 }).map((__, j) => (
                          <TableCell key={j} className="py-3">
                            <div className="h-3 bg-surface-subtle rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : shifts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-content-muted">
                        No shifts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    shifts
                      .filter((shift) => {
                        const isPast = new Date(shift.shiftDate) < new Date();
                        return activeTab === "past" ? isPast : !isPast;
                      })
                      .map((shift) => {
                        const routeName = shift.route && typeof shift.route === "object" ? shift.route.name : "—";
                        const busNumber = shift.bus && typeof shift.bus === "object" ? shift.bus.busNumber : "—";
                        return (
                          <TableRow key={shift._id} className="hover:bg-brand-light/10 border-b border-surface-subtle transition-colors">
                            <TableCell className="py-3 text-sm font-medium text-content-primary">
                              {new Date(shift.shiftDate).toLocaleDateString("en-CA")}
                            </TableCell>
                            <TableCell className="py-3 text-sm font-medium text-content-primary max-w-[120px] truncate">
                              {routeName}
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="text-sm font-bold text-content-primary">
                                {shift.startTime} – {shift.endTime}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 text-right text-sm font-medium text-content-primary">
                              {busNumber !== "—" ? `Bus ${busNumber}` : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-content-primary">Uploaded Documents</h3>
            {details?.documents && details.documents.length > 0 ? (
              <div className="space-y-3">
                {details.documents.map((doc) => (
                  <a
                    key={doc._id}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle hover:border-brand-light transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted">
                        <FileText size={20} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-bold text-content-primary truncate">{doc.name}</p>
                        <p className="text-xs text-content-muted capitalize">{doc.type}</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-content-muted group-hover:text-brand shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted">
                      <FileText size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-content-primary">No documents uploaded yet.</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
