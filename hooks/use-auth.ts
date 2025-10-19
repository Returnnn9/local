"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  telegram?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, telegram?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  verifyAuth: () => Promise<boolean>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ isLoading: false })
            return { success: false, error: data.error || "Ошибка входа" }
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          console.error("[v0] Login error:", error)
          set({ isLoading: false })
          return { success: false, error: "Ошибка сети" }
        }
      },

      register: async (email, password, telegram) => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, telegram }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ isLoading: false })
            return { success: false, error: data.error || "Ошибка регистрации" }
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          console.error("[v0] Registration error:", error)
          set({ isLoading: false })
          return { success: false, error: "Ошибка сети" }
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      verifyAuth: async () => {
        const { token } = get()
        if (!token) return false

        try {
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            set({ user: null, token: null })
            return false
          }

          const data = await response.json()
          set({ user: data.user })
          return true
        } catch (error) {
          console.error("[v0] Auth verification error:", error)
          set({ user: null, token: null })
          return false
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
