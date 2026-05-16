"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Trash2,
  Upload,
  FileText,
  Camera,
  Mail,
  User,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
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
import { cn } from "@/lib/utils";
import type { DriverFormProps, DriverDocument } from "@/lib/types/drivers";
import type { RouteData } from "@/lib/types/routes";
import {
  registerDriver,
  getDriver,
  updateDriver,
  uploadDriverPicture,
  uploadDriverDocuments,
} from "@/lib/api/drivers";
import { getAllRoutes } from "@/lib/api/routes";
import { toast } from "sonner";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "@/components/ui/phone-input";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  dateOfBirth?: string;
  staffId?: string;
  route?: string;
}

export default function DriverForm({ onBack, driver }: DriverFormProps) {
  const isEdit = !!driver;
  const isAdmin = !!driver?.user?.roles?.includes("admin");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [staffId, setStaffId] = useState("");
  const [routeName, setRouteName] = useState("");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  const [documents, setDocuments] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<DriverDocument[]>(
    [],
  );
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureError, setPictureError] = useState("");

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      setPictureError("Image must be less than 1MB.");
      e.target.value = "";
      return;
    }
    setPictureError("");
    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const [loadingData, setLoadingData] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [routesRes, driverRes] = await Promise.all([
          getAllRoutes(),
          isEdit && driver ? getDriver(driver._id) : Promise.resolve(null),
        ]);

        const loaded =
          routesRes.success && Array.isArray(routesRes.data)
            ? routesRes.data
            : [];
        setRoutes(loaded);

        const freshDriver = driverRes?.success ? driverRes.data : driver;
        if (freshDriver) {
          setFirstName(freshDriver.firstName ?? "");
          setLastName(freshDriver.lastName ?? "");
          setEmail(freshDriver.user?.email ?? "");
          const rawPhone = freshDriver.phone ?? "";
          if (rawPhone && !rawPhone.startsWith("+")) {
            try {
              const parsed = parsePhoneNumber(rawPhone, "CA");
              setPhone(parsed?.number ?? rawPhone);
            } catch {
              setPhone(rawPhone);
            }
          } else {
            setPhone(rawPhone);
          }
          setDateOfBirth(
            freshDriver.driverDetails?.dateOfBirth
              ? freshDriver.driverDetails.dateOfBirth.split("T")[0]
              : "",
          );
          setStaffId(freshDriver.driverDetails?.staffId ?? "");
          const pic = freshDriver.driverDetails?.pictureUrl ?? null;
          setPicturePreview(pic);

          if (freshDriver.driverDetails?.routeId) {
            const match = loaded.find(
              (r) =>
                r.name === freshDriver.driverDetails!.routeId ||
                r._id === freshDriver.driverDetails!.routeId,
            );
            if (match) setRouteName(match.name);
          }

          if (freshDriver.driverDetails?.documents) {
            setExistingDocuments(freshDriver.driverDetails.documents);
          }
        }
      } catch {
        // keep initial values
      } finally {
        setRoutesLoading(false);
        setLoadingData(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (isAdmin) return e;
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!isEdit) {
      if (!email.trim()) e.email = "Email is required.";
      if (!password.trim()) e.password = "Password is required.";
    }
    if (!phone) e.phone = "Phone number is required.";
    else if (!isValidPhoneNumber(phone))
      e.phone = "Enter a valid phone number for the selected country.";
    if (!dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!staffId.trim()) e.staffId = "Staff ID is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      let profileId: string;

      const resolvedRouteId =
        routes.find((r) => r.name === routeName)?._id ?? routeName;

      if (isEdit && driver) {
        profileId = driver._id;

        // 1. Update profile fields — pass existing picture/documents so server keeps them
        if (!isAdmin) {
          await updateDriver(profileId, {
            firstName,
            lastName,
            phone,
            driverDetails: {
              staffId,
              routeId: resolvedRouteId,
              dateOfBirth,
              pictureUrl: picturePreview ?? undefined,
              documents: existingDocuments,
            },
          });
        }

        // 2. Upload new picture if one was selected
        if (pictureFile) {
          const picFd = new FormData();
          picFd.append("picture", pictureFile);
          await uploadDriverPicture(profileId, picFd);
        }

        // 3. Upload new documents if any were selected
        if (documents.length > 0) {
          const docFd = new FormData();
          documents.forEach((file) => docFd.append("documents", file));
          await uploadDriverDocuments(profileId, docFd);
        }
      } else {
        const res = await registerDriver({
          firstName,
          lastName,
          email,
          password,
          phone,
          dateOfBirth,
          staffId,
          route: resolvedRouteId,
        });
        profileId = res.data.profile._id;

        // Upload picture and documents for new driver
        const uploads: Promise<unknown>[] = [];

        if (pictureFile) {
          const fd = new FormData();
          fd.append("picture", pictureFile);
          uploads.push(uploadDriverPicture(profileId, fd));
        }

        if (documents.length > 0) {
          const fd = new FormData();
          documents.forEach((file) => fd.append("documents", file));
          uploads.push(uploadDriverDocuments(profileId, fd));
        }

        if (uploads.length > 0) await Promise.all(uploads);
      }

      toast.success(
        isEdit ? "Driver updated successfully." : "Driver added successfully.",
      );
      onBack();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-surface-subtle" />
          <div className="h-8 w-64 bg-surface-subtle rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 h-72" />
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 h-40" />
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 h-64" />
            <div className="bg-white border border-surface-subtle rounded-3xl p-8 h-48" />
          </div>
        </div>
      </div>
    );
  }

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
          {isEdit ? `Edit Driver ${firstName} ${lastName}` : "Add a Driver"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Identity */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <User className="text-brand" size={20} />
              <h3 className="text-lg font-bold text-content-primary">
                Personal Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-bold text-content-primary"
                >
                  First Name <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Type here"
                  value={firstName}
                  disabled={isAdmin}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors((p) => ({ ...p, firstName: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.firstName && "border-status-error",
                    isAdmin &&
                      "cursor-not-allowed disabled:opacity-100 disabled:text-content-primary",
                  )}
                />
                {errors.firstName && (
                  <p className="text-xs text-status-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-bold text-content-primary"
                >
                  Last Name <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Type here"
                  value={lastName}
                  disabled={isAdmin}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors((p) => ({ ...p, lastName: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.lastName && "border-status-error",
                    isAdmin &&
                      "cursor-not-allowed disabled:opacity-100 disabled:text-content-primary",
                  )}
                />
                {errors.lastName && (
                  <p className="text-xs text-status-error">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dob"
                  className="text-sm font-bold text-content-primary"
                >
                  Date of Birth <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  disabled={isAdmin}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setErrors((p) => ({ ...p, dateOfBirth: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.dateOfBirth && "border-status-error",
                    isAdmin &&
                      "cursor-not-allowed disabled:opacity-100 disabled:text-content-primary",
                  )}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-status-error">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="staffId"
                  className="text-sm font-bold text-content-primary"
                >
                  Staff ID <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="staffId"
                  placeholder="01983B"
                  value={staffId}
                  disabled={isAdmin}
                  onChange={(e) => {
                    setStaffId(e.target.value);
                    setErrors((p) => ({ ...p, staffId: undefined }));
                  }}
                  className={cn(
                    "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                    errors.staffId && "border-status-error",
                    isAdmin &&
                      "cursor-not-allowed disabled:opacity-100 disabled:text-content-primary",
                  )}
                />
                {errors.staffId && (
                  <p className="text-xs text-status-error">{errors.staffId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-bold text-content-primary"
                >
                  Phone Number <span className="text-status-error">*</span>
                </Label>
                <PhoneInput
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="Phone number"
                  disabled={isAdmin}
                  error={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-xs text-status-error">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-content-primary"
                >
                  Email Address{" "}
                  {!isEdit && <span className="text-status-error">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="Type here"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    disabled={isEdit}
                    className={cn(
                      "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand pr-12 cursor-not-allowed disabled:opacity-100 disabled:text-content-primary",
                      errors.email && "border-status-error",
                    )}
                  />
                  <Mail
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted"
                    size={18}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-status-error">{errors.email}</p>
                )}
              </div>

              {!isEdit && (
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-bold text-content-primary"
                  >
                    Password <span className="text-status-error">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Type here"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: undefined }));
                      }}
                      className={cn(
                        "h-12 pr-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                        errors.password && "border-status-error",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-status-error">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assign Section */}
          {!isAdmin && (
            <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand" size={20} />
                <h3 className="text-lg font-bold text-content-primary">
                  Assign
                </h3>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-content-primary">
                  Route
                </Label>
                <Select
                  value={routeName}
                  onValueChange={(v) => {
                    if (v) {
                      setRouteName(v);
                      setErrors((p) => ({ ...p, route: undefined }));
                    }
                  }}
                  disabled={routesLoading}
                >
                  <SelectTrigger
                    className={cn(
                      "h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand",
                      errors.route && "border-status-error",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        routesLoading ? "Loading routes..." : "Select a route"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-surface-subtle">
                    {routes.map((r) => (
                      <SelectItem key={r._id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.route && (
                  <p className="text-xs text-status-error">{errors.route}</p>
                )}
              </div>
            </div>
          )}

          {/* Legal and Licensing */}
          {/* <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-brand" size={20} />
                <h3 className="text-lg font-bold text-content-primary">Legal and Licensing</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-brand-light hover:text-brand">
                <Plus size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="licenseName" className="text-sm font-bold text-content-primary">
                  License 1 Name
                </Label>
                <Input
                  id="licenseName"
                  placeholder="Type here"
                  defaultValue={driver?.driverDetails?.licenseName}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="text-sm font-bold text-content-primary">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  placeholder="01983B"
                  defaultValue={driver?.driverDetails?.licenseNumber}
                  className="h-12 bg-surface-page border-surface-subtle rounded-xl focus:ring-brand"
                />
              </div>
            </div>
          </div>

          */}

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Save all"}
          </Button>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          {/* Driver Picture */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                Upload Driver Picture
              </h3>
              <p className="text-sm text-content-muted">
                This image should show full driver face without accessories
              </p>
            </div>

            <input
              ref={pictureInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePictureChange}
            />

            {pictureError && (
              <p className="text-xs text-status-error">{pictureError}</p>
            )}

            <div
              onClick={() => pictureInputRef.current?.click()}
              className="relative w-full aspect-square bg-surface-page rounded-2xl border-2 border-dashed border-surface-subtle flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand transition-all overflow-hidden"
            >
              {picturePreview ? (
                <Image
                  src={picturePreview}
                  alt="Driver"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-brand-light/20 flex items-center justify-center text-brand">
                    <Camera size={32} />
                  </div>
                  <p className="text-sm font-bold text-brand">
                    Tap to upload photo
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
          </div>

          {/* Upload Documents */}
          <div className="bg-white border border-surface-subtle rounded-3xl p-4 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-primary">
                Upload Documents
              </h3>
              <p className="text-sm text-content-muted">
                This includes driver qualifications and licenses
              </p>
            </div>

            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={handleDocChange}
            />

            <div
              onClick={() => docInputRef.current?.click()}
              className="w-full h-40 bg-brand-pale/10 rounded-2xl border-2 border-dashed border-brand-light flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-brand-pale/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-surface-subtle flex items-center justify-center shadow-sm text-brand group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-content-primary">
                  Tap here to upload (PDF, PNG supported)
                </p>
                <p className="text-xs text-content-muted">Max 10MB per file</p>
              </div>
            </div>

            {existingDocuments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wide">
                  Uploaded Documents
                </p>
                <div className="space-y-3">
                  {existingDocuments.map((doc) => (
                    <a
                      key={doc._id}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-surface-subtle hover:border-brand transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-surface-subtle flex items-center justify-center text-content-muted shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-sm font-bold text-content-primary truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-content-muted capitalize">
                            {doc.type}
                          </p>
                        </div>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-content-muted group-hover:text-brand shrink-0"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="space-y-2">
                {existingDocuments.length > 0 && (
                  <p className="text-xs font-bold text-content-muted uppercase tracking-wide">
                    New Documents
                  </p>
                )}
                <div className="space-y-3">
                  {documents.map((file, i) => (
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
                            {file.name}
                          </p>
                          <p className="text-xs text-content-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDocuments((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="h-8 w-8 rounded-full text-status-error hover:bg-status-error-bg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
