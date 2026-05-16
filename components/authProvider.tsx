"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUser } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearAuth, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    getUser()
      .then((user) => {
        if (user) {
          setUser(user);
        } else {
          clearAuth();
          router.replace("/login");
          return;
        }
      })
      .catch(() => {
        clearAuth();
        router.replace("/login");
      })
      .finally(() => {
        setChecked(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  if (!_hasHydrated || !checked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-page">
        <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
