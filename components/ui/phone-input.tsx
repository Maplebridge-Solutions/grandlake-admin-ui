"use client";

import PhoneInputPrimitive, { type Country, isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

export { isValidPhoneNumber, parsePhoneNumber };

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  defaultCountry?: Country;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  disabled = false,
  error = false,
  defaultCountry = "CA",
  className,
}: PhoneInputProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-full items-center rounded-2xl border bg-surface-page px-3 transition-all focus-within:ring-2 focus-within:ring-brand focus-within:border-brand",
        error ? "border-red-400" : "border-surface-subtle",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      <PhoneInputPrimitive
        international
        limitMaxLength
        defaultCountry={defaultCountry}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 flex items-center gap-2 w-full"
        numberInputProps={{
          className: "flex-1 bg-transparent text-sm text-content-primary placeholder:text-content-muted outline-none w-full",
        }}
      />
    </div>
  );
}
