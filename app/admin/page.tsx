"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface User {
  id: string
  email: string
  telegram_username?: string
  created_at: number
}

export default function AdminKYCPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [search, dateFrom, dateTo, users])

  const loadUsers = async () => {
    setMessage(t.admin.loading)
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/kyc/pending", {
        credentials: "include",
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login")
          return
        }
        throw new Error("Failed to load")
      }
      const data = await res.json()
      setUsers(data.pending || [])
      setMessage("")
    } catch (err) {
      setMessage(t.admin.loading)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    const q = search.trim().toLowerCase()
    const df = dateFrom ? new Date(dateFrom).getTime() / 1000 : 0
    const dt = dateTo ? new Date(dateTo).getTime() / 1000 + 86400 : 0

    const filtered = users.filter((user) => {
      if (
        q &&
        !(
          (user.email || "").toLowerCase().includes(q) ||
          (user.telegram_username || "").toLowerCase().includes(q) ||
          (user.id || "").toLowerCase().includes(q)
        )
      )
        return false

      if (df && user.created_at < df) return false
      if (dt && user.created_at > dt) return false

      return true
    })

    setFilteredUsers(filtered)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      router.push("/admin/login")
    } catch (err) {
      console.error(err)
    }
  }

  const tsToStr = (ts: number | undefined) => {
    if (!ts) return ""
    return new Date(ts * 1000).toLocaleString("ru-RU")
  }

  return (
    <div className="admin-container">
      <div className="admin-row" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
        <h1 className="admin-h1">{t.admin.kycPending}</h1>
        <div className="admin-actions">
          <Link href="/admin/rate-limit" className="admin-btn">
            📊 {t.admin.rateLimit}
          </Link>
          <button onClick={handleLogout} className="admin-btn">
            {t.header.logout}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-row" style={{ gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            className="admin-input"
            placeholder={t.admin.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 200px" }}
          />
          <input
            className="admin-input"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ flex: "0 0 auto" }}
          />
          <input
            className="admin-input"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ flex: "0 0 auto" }}
          />
          <button onClick={loadUsers} className="admin-btn" disabled={isLoading}>
            {isLoading ? t.admin.loading : "🔄"}
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Telegram</th>
                <th>{t.admin.date}</th>
                <th>{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    {message || t.admin.noData}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email || ""}</td>
                    <td>
                      {user.telegram_username ? <span className="admin-badge">@{user.telegram_username}</span> : "—"}
                    </td>
                    <td className="admin-small">{tsToStr(user.created_at)}</td>
                    <td>
                      <Link href={`/admin/user?userId=${encodeURIComponent(user.id)}`} className="admin-btn">
                        {t.admin.view}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-small" style={{ marginTop: "10px" }}>
          {message || `${t.admin.user}: ${filteredUsers.length}`}
        </div>
      </div>
    </div>
  )
}
