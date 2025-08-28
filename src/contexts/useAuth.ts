// useAuth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
    id: string | number;
    name: string;
    login: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    isHydrated: boolean;
    login: (payload: { user: User; token: string }) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
};

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isHydrated: false,

            login: ({ user, token }) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) state.isHydrated = true;
            },
            partialize: (s) => ({ user: s.user, token: s.token }),
        }
    )
);

export const useIsAuthenticated = () =>
    useAuth((s) => Boolean(s.token && s.user));
