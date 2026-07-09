import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    token: null,
    login: (token, user) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
    setUser: (user) => set({ user }),
}), {
    name: 'auth-storage',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
}));
//# sourceMappingURL=authStore.js.map