"use client";

import { Search, Bell, RefreshCw, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NotificationsModal from "./notificationModal";

export default function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-surface-subtle flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      {/* Search Bar - Hidden on small mobile, compact on others */}
      <div className="flex-1 max-w-2xl relative hidden sm:block">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
          size={18}
        />
        <Input
          type="search"
          placeholder="search for anything here"
          className="h-11 pl-12 bg-surface-page border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
        />
      </div>

      {/* Mobile Search Icon (when bar is hidden) */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-content-muted hover:text-brand hover:bg-brand-light rounded-full"
        >
          <Search size={20} />
        </Button>
      </div>

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
            <div className="text-content-muted hover:text-brand hover:bg-brand-light rounded-full relative">
              <Bell
                size={20}
                onClick={() => setIsNotificationsOpen((v) => !v)}
              />
              <span className="absolute bottom-4 right-0 w-2 h-2 bg-status-error-bright rounded-full border-2 border-white" />
            </div>

            <NotificationsModal
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-6 border-l border-surface-subtle cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-content-primary group-hover:text-brand transition-colors">
              Ryker .K.
            </span>
            <span className="text-[10px] font-semibold text-content-muted">
              Super Admin
            </span>
          </div>
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-subtle group-hover:border-brand transition-all">
            <AvatarImage src="https://picsum.photos/seed/ryker/100/100" />
            <AvatarFallback className="bg-brand-light text-brand font-bold text-xs sm:text-sm">
              RK
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            size={16}
            className="text-content-muted group-hover:text-brand transition-colors hidden sm:block"
          />
        </div>
      </div>
    </header>
  );
}
