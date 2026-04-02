"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bus,
  Route,
  Users,
  Ticket,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Manage Buses", icon: Bus, href: "/manage-buses" },
  { name: "Manage Routes", icon: Route, href: "/manage-routes" },
  { name: "Manage Drivers", icon: Users, href: "/manage-drivers" },
  { name: "Ticket/Payment", icon: Ticket, href: "/tickets" },
  {
    name: "User Permission",
    icon: ShieldCheck,
    href: "/permissions",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-surface-subtle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-surface-subtle transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="https://picsum.photos/seed/glk-logo/100/100"
                alt="GLK Logo"
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-content-primary leading-tight">
                MUNICIPALITY OF
              </span>
              <span className="text-sm font-extrabold text-content-primary leading-tight">
                GRAND LAKE
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "text-content-muted hover:bg-brand-light hover:text-brand",
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-white"
                        : "text-content-muted group-hover:text-brand",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-surface-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold">
                MS
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  Maplebridge Solutions
                </span>
                <span className="text-[10px] text-content-muted">
                  Admin Panel v1.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
