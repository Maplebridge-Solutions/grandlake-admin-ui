import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserData } from "@/lib/types/auth";

interface AuthState {
  user: UserData | null;
  _hasHydrated: boolean;
  setUser: (user: UserData) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setUser: (user: UserData) => {
        set({ user });
      },

      clearAuth: () => {
        set({ user: null });
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
