"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  Camera,
  Calendar,
  Mail,
  User,
  ShieldCheck,
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
import Image from "next/image";
import type { DriverFormProps } from "@/lib/types/drivers";

export default function DriverForm({ onBack, driver }: DriverFormProps) {
  const [documents, setDocuments] = useState<{ name: string; size: string }[]>(
    driver
      ? [
          { name: "Driving license.pdf", size: "6mb" },
          { name: "Fit-to-drive Medicals.pdf", size: "6mb" },
        ]
      : [],
  );

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          {driver ? `Edit Driver ${driver.name}` : "Add a Driver"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Identity */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <User className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Personal Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-bold text-content-primary"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Type here"
                  defaultValue={driver?.name}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dob"
                  className="text-sm font-bold text-content-primary"
                >
                  Date of Birth
                </Label>
                <div className="relative">
                  <Input
                    id="dob"
                    placeholder="DD/MM/YYYY"
                    className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12"
                  />
                  <Calendar
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="staffId"
                  className="text-sm font-bold text-content-primary"
                >
                  Staff ID
                </Label>
                <Input
                  id="staffId"
                  placeholder="01983B"
                  defaultValue={driver?.staffId}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-bold text-content-primary"
                >
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Select defaultValue="+1">
                    <SelectTrigger className="h-12 w-24 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-surface-subtle">
                      <SelectItem value="+1">🇨🇦 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    className="h-12 flex-1 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-content-primary"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="Type here"
                    className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12"
                  />
                  <Mail
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assign Section */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">Assign</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="routeId"
                  className="text-sm font-bold text-content-primary"
                >
                  Route_ID
                </Label>
                <Input
                  id="routeId"
                  placeholder="Type here"
                  defaultValue={driver?.activeRouteId}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="routeLongName"
                  className="text-sm font-bold text-content-muted"
                >
                  Route Long Name
                </Label>
                <Input
                  id="routeLongName"
                  placeholder="Upper coytown road -> Green drv"
                  disabled
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl text-content-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Legal and Licensing */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-brand" size={20} />
                <h3 className="text-lg font-bold text-content-primary">
                  Legal and Licensing
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand"
              >
                <Plus size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="licenseName"
                  className="text-sm font-bold text-content-primary"
                >
                  License 1 Name
                </Label>
                <Input
                  id="licenseName"
                  placeholder="Type here"
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="licenseNumber"
                  className="text-sm font-bold text-content-primary"
                >
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  placeholder="01983B"
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
            {driver ? "Save Changes" : "Save all"}
          </Button>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          {/* Driver Picture */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                Upload Driver Picture
              </h3>
              <p className="text-sm text-content-muted">
                This image should show full driver face without accessories
              </p>
            </div>

            <div className="relative w-full aspect-square bg-surface-page rounded-2xl border-2 border-dashed border-surface-subtle flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand transition-all overflow-hidden">
              {driver?.image ? (
                <Image
                  src={driver.image}
                  alt="Driver"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-brand-light/20 flex items-center justify-center text-brand">
                    <Camera size={32} />
                  </div>
                  <p className="text-sm font-bold text-brand">
                    Change Image Here
                  </p>
                </>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Button
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white hover:text-brand font-bold"
                >
                  Change Image
                </Button>
              </div>
            </div>

            {driver && (
              <div className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center">
                    <Image
                      src={driver.image}
                      alt="Passport"
                      width={24}
                      height={24}
                      className="rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-content-primary">
                      Passport.jpg
                    </p>
                    <p className="text-xs text-content-muted">6mb</p>
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
            )}
          </div>

          {/* Upload Documents */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                Upload Documents
              </h3>
              <p className="text-sm text-content-muted">
                This includes driver qualifications and licenses
              </p>
            </div>

            <div className="w-full h-40 bg-brand-pale/10 rounded-2xl border-2 border-dashed border-brand-light flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-brand-pale/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm text-brand group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-content-primary">
                  Tap here to upload (Pdf, png supported)
                </p>
                <p className="text-xs text-content-muted">Max size here</p>
              </div>
            </div>

            <div className="space-y-3">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted">
                      <FileText size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-content-primary">
                        {doc.name}
                      </p>
                      <p className="text-xs text-content-muted">{doc.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(i)}
                    className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
