"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface RateLimitFile {
  ip: string
  country: string
  last_request: number
  last_request_formatted: string
  timestamp: number
}

interface RateLimitStats {
  total_ips: number
  active_today: number
  active_this_week: number
  last_cleanup: string
  top_countries: Record<string, number>
  files: RateLimitFile[]
}

export default function RateLimitPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [stats, setStats] = useState<RateLimitStats | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    setMessage(t.admin.loading)
    loadStats()
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/rate-limit-stats", {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setStats(data)
      setMessage(`${t.admin.loading}: ${new Date().toLocaleString("ru-RU")}`)
    } catch (err) {
      setMessage(t.admin.loading)
      showToast(t.admin.loading, false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      router.push("/admin/login")
    } catch (err) {
      console.error(err)
    }
  }

  const showToast = (msg: string, ok = true) => {
    const el = document.createElement("div")
    el.className = "admin-toast"
    el.style.background = ok ? "#064e3b" : "#7f1d1d"
    el.textContent = msg
    document.body.appendChild(el)

    setTimeout(() => {
      el.style.opacity = "0"
      setTimeout(() => el.remove(), 400)
    }, 1800)
  }

  const getActivityBadge = (lastRequest: number) => {
    const now = Math.floor(Date.now() / 1000)
    const hoursSince = Math.floor((now - lastRequest) / 3600)

    if (hoursSince < 1) {
      return (
        <span className="admin-badge" style={{ background: "#22c55e" }}>
          Сейчас
        </span>
      )
    } else if (hoursSince < 24) {
      return (
        <span className="admin-badge" style={{ background: "#f59e0b" }}>
          Сегодня
        </span>
      )
    } else if (hoursSince < 168) {
      return (
        <span className="admin-badge" style={{ background: "#6b7280" }}>
          Неделя
        </span>
      )
    } else {
      return (
        <span className="admin-badge" style={{ background: "#ef4444" }}>
          Старый
        </span>
      )
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-row" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
        <h1 className="admin-h1">📊 {t.admin.rateLimit}</h1>
        <div className="admin-actions">
          <Link href="/admin" className="admin-btn">
            ← {t.admin.view}
          </Link>
          <button onClick={loadStats} className="admin-btn admin-btn-primary">
            🔄
          </button>
          <button onClick={handleLogout} className="admin-btn">
            {t.header.logout}
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="admin-card">
            <h2 className="admin-h2">📈 {t.admin.status}</h2>
            <div className="admin-row">
              <div className="admin-col">
                <div>
                  <b>{t.admin.ipAddress}:</b> {stats.total_ips}
                </div>
                <div>
                  <b>{t.admin.requests}:</b> {stats.active_today}
                </div>
                <div>
                  <b>{t.admin.requests}:</b> {stats.active_this_week}
                </div>
              </div>
              <div className="admin-col">
                <div>
                  <b>{t.admin.lastSeen}:</b> {stats.last_cleanup || "—"}
                </div>
                <div>
                  <b>{t.admin.limit}:</b> 1 запрос/секунда на IP
                </div>
                <div>
                  <b>{t.admin.autoCleanup}:</b> файлы старше 7 дней
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="admin-h2">🌍 {t.admin.country}</h2>
            <div className="admin-row" style={{ flexWrap: "wrap", gap: "16px" }}>
              {Object.entries(stats.top_countries).map(([country, count]) => (
                <div
                  key={country}
                  style={{
                    background: "var(--admin-card)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: "8px",
                    padding: "12px",
                    minWidth: "120px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{country}</div>
                  <div className="admin-badge">{count} IP</div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h2 className="admin-h2">📋 {t.admin.ipAddress}</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.admin.ipAddress}</th>
                    <th>{t.admin.country}</th>
                    <th>{t.admin.lastSeen}</th>
                    <th>Timestamp</th>
                    <th>{t.admin.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.files.map((file) => (
                    <tr key={file.ip}>
                      <td>
                        <code>{file.ip}</code>
                      </td>
                      <td>{file.country}</td>
                      <td className="admin-small">{file.last_request_formatted}</td>
                      <td className="admin-small">{file.timestamp.toFixed(4)}</td>
                      <td>{getActivityBadge(file.last_request)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="admin-small" style={{ marginTop: "16px", textAlign: "center" }}>
        {message}
      </div>
    </div>
  )
}
