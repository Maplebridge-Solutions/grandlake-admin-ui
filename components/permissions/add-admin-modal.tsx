"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Info, Eye, EyeOff } from "lucide-react";
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
import { registerAdmin } from "@/lib/api/admin";
import type { AddAdminModalProps } from "@/lib/types/permissions";
import { toast } from "sonner";
import PhoneInput from "@/components/ui/phone-input";

type ModeLabel = "Invite" | "Immediate";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  mode?: string;
  password?: string;
}

const MODES = [
  { label: "Invite", value: "invite" },
  { label: "Immediate", value: "immediate" },
];
const getModeValue = (label: string) =>
  MODES.find((m) => m.label === label)?.value ?? label;

const ROLES = [
  // { value: "admin", label: "Admin" },
  // { value: "super_admin", label: "Super Admin" },
  { value: "operations_admin", label: "Operations Admin" },
  { value: "support_staff", label: "Support Staff" },
];
const getRoleValue = (label: string) =>
  ROLES.find((r) => r.label === label)?.value ?? label;

export default function AddAdminModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAdminModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [mode, setMode] = useState<ModeLabel | "">("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("");
    setMode("");
    setPassword("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!role) e.role = "Please select a role.";
    if (!mode) e.mode = "Please select a mode.";
    if (mode === "Immediate" && !password.trim())
      e.password = "Password is required for immediate access.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await registerAdmin({
        email,
        password: getModeValue(mode) === "immediate" ? password : "TempPass123!",
        role: getRoleValue(role),
        mode: getModeValue(mode) as "invite" | "immediate",
        firstName,
        lastName,
        phone,
      });
      toast.success("Admin user added successfully.");
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              Add Admin User
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-subtle rounded-full transition-colors"
            >
              <X size={24} className="text-content-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                First Name
              </Label>
              <Input
                placeholder="Type here"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.firstName ? "border-red-400" : ""}`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                Last Name
              </Label>
              <Input
                placeholder="Type here"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.lastName ? "border-red-400" : ""}`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                Email address
              </Label>
              <Input
                placeholder="Type here"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                Phone
              </Label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(v) => {
                  setRole(v ?? "");
                  setErrors((prev) => ({ ...prev, role: undefined }));
                }}
              >
                <SelectTrigger
                  className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.role ? "border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.label}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.role}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-content-muted">
                Mode
              </Label>
              <Select
                value={mode}
                onValueChange={(v) => {
                  setMode(v as ModeLabel | "");
                  setPassword("");
                  setErrors((prev) => ({
                    ...prev,
                    mode: undefined,
                    password: undefined,
                  }));
                }}
              >
                <SelectTrigger
                  className={`h-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.mode ? "border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-surface-subtle shadow-xl">
                  {MODES.map((m) => (
                    <SelectItem key={m.value} value={m.label}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mode && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.mode}
                </p>
              )}
            </div>

            {mode === "Immediate" && (
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm font-bold text-content-muted">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Type here"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`h-12 pr-12 rounded-2xl border-surface-subtle bg-surface-page focus:ring-brand focus:border-brand transition-all ${errors.password ? "border-red-400" : ""}`}
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
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>
            )}
          </div>

          {mode === "Invite" && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
              <Info size={20} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-bold">What happens next?</span> An
                invitation email will be sent to the user with a secure link to
                access the portal. You can edit access levels by visiting User
                Permissions &gt; Manage Roles/Admins.
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
          >
            <Check size={20} className="mr-2" />
            {loading ? "Adding..." : "Add Admin"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
