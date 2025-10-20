import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  login: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, login: string) => void;
  register: (name: string, login: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (name, login) => {
        set({ user: { name, login }, isAuthenticated: true });
      },
      register: (name, login, password) => {
        // In a real app, this would call an API
        set({ user: { name, login }, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
