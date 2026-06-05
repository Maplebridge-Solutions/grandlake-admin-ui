"use client";

import { Bell, ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useCallback } from "react";
import NotificationsModal from "./notificationModal";
import GlobalSearch from "./global-search";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const handleUnreadCountChange = useCallback(
    (count: number | ((prev: number) => number)) => setUnreadCount(count),
    [],
  );
  const router = useRouter();
  const { user, clearAuth, _hasHydrated } = useAuthStore();

  const profile = user?.profile;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName.charAt(0)}.`
    : "";
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
    : "";
  const role = user?.user?.role ?? user?.user?.roles?.[0] ?? "";

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="h-20  bg-white border-b border-surface-subtle flex items-center justify-between px-6 md:py-3 py-5 sm:px-10 lg:px-12 pl-16 sm:pl-10 lg:pl-12 sticky top-0 z-30">
      <GlobalSearch />

      {/* Spacer on mobile so right side stays right */}
      <div className="flex-1 md:hidden" />

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-content-muted hover:text-brand hover:bg-brand-light rounded-full"
          >
            <RefreshCw size={80} />
          </Button> */}
          <div className="relative">
            {/* <Button
              variant="ghost"
              // size="icon"
              className="text-content-muted hover:text-brand hover:bg-brand-light rounded-full relative"
            >
              <Bell
                size={1000}
                onClick={() => setIsNotificationsOpen((v) => !v)}
              />
              <span className="absolute top-2 right-2 w-2 h-2 bg-status-error-bright rounded-full border-2 border-white" />
            </Button> */}
            <button
              onClick={() => setIsNotificationsOpen((v) => !v)}
              className="p-2 rounded-full text-content-muted hover:text-brand hover:bg-brand-light transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-status-error-bright text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <NotificationsModal
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              onUnreadCountChange={handleUnreadCountChange}
            />
          </div>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-6 border-l border-surface-subtle cursor-pointer group outline-none bg-transparent border-t-0 border-r-0 border-b-0">
            {!_hasHydrated ? (
              <div className="hidden sm:flex flex-col items-end gap-1">
                <div className="h-3 w-20 bg-surface-subtle rounded animate-pulse" />
                <div className="h-2 w-14 bg-surface-subtle rounded animate-pulse" />
              </div>
            ) : (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-content-primary group-hover:text-brand transition-colors max-w-30 truncate">
                  {displayName}
                </span>
                <span className="text-xs font-semibold text-content-muted capitalize">
                  {role}
                </span>
              </div>
            )}
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-subtle group-hover:border-brand transition-all">
              <AvatarFallback className="bg-brand-light text-brand font-bold text-xs sm:text-sm">
                {_hasHydrated ? initials : ""}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              size={16}
              className="text-content-muted group-hover:text-brand transition-colors hidden sm:block"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-surface-subtle w-44 shadow-xl p-1">
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-lg gap-2 text-status-error focus:text-status-error font-semibold"
            >
              <LogOut size={15} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
