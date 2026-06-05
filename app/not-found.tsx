"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export default function NotFound() {
  const router = useRouter();
  const { user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    router.replace(user ? "/" : "/login");
  }, [_hasHydrated, user, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface-page">
      <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
    </div>
  );
}
