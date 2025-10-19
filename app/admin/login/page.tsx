"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export default function AdminLoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error("Login failed")
      }

      const data = await res.json()

      // Check if user is admin
      if (data.user?.role !== "admin") {
        setError("Доступ запрещён. Требуются права администратора.")
        setLoading(false)
        return
      }

      router.push("/admin")
    } catch (err) {
      setError(t.admin.loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-card" style={{ maxWidth: "400px", margin: "100px auto" }}>
        <h1 className="admin-h1">{t.admin.loginTitle}</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            className="admin-input"
            type="email"
            placeholder={t.admin.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="admin-input"
            type="password"
            placeholder={t.admin.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="admin-row" style={{ justifyContent: "flex-end" }}>
            <button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
              {loading ? t.admin.loggingIn : t.admin.loginButton}
            </button>
          </div>
          {error && (
            <div className="admin-small" style={{ color: "#fda4af", marginTop: "8px" }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
