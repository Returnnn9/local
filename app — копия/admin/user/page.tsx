"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface User {
  id: string
  email: string
  phone?: string
  telegram_username?: string
  telegram_user_id?: string
  email_verified_at?: number
  kyc_status: string
  created_at: number
  last_login_at?: number
}

interface Document {
  type: string
  hash?: string
  url: string
  created_at: number
}

interface Order {
  id: string
  from_currency?: string
  to_currency?: string
  from_amount?: string
  to_amount?: string
  status?: string
  created_at: number
}

function UserPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const { t } = useTranslation()

  const [user, setUser] = useState<User | null>(null)
  const [docs, setDocs] = useState<Document[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [modalImage, setModalImage] = useState("")

  useEffect(() => {
    if (userId) {
      loadUser()
    }
  }, [userId])

  const loadUser = async () => {
    if (!userId) return

    try {
      const res = await fetch(`/api/admin/kyc/user?userId=${encodeURIComponent(userId)}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setUser(data.user)
      setDocs(data.docs || [])
      setOrders(data.orders || [])
    } catch (err) {
      showToast(t.admin.loadingError, false)
    }
  }

  const handleApprove = async () => {
    if (!userId) return
    setMessage(t.admin.loading)

    try {
      const res = await fetch("/api/admin/kyc/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, note }),
      })
      if (!res.ok) throw new Error("Failed to approve")
      setMessage("")
      showToast(t.admin.approve)
      await loadUser()
    } catch (err) {
      setMessage("")
      showToast(t.admin.loading, false)
    }
  }

  const handleReject = async () => {
    const reason = prompt(t.admin.rejectReason)
    if (!reason) {
      showToast(t.admin.reasonRequired, false)
      return
    }

    if (!userId) return
    setMessage(t.admin.loading)

    try {
      const res = await fetch("/api/admin/kyc/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, reason, note }),
      })
      if (!res.ok) throw new Error("Failed to reject")
      setMessage("")
      showToast(t.admin.reject)
      await loadUser()
    } catch (err) {
      setMessage("")
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

  const tsToStr = (ts: number | undefined) => {
    if (!ts) return ""
    return new Date(ts * 1000).toLocaleString("ru-RU")
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

  if (!user) {
    return (
      <div className="admin-container">
        <div className="admin-card">{t("admin.loading")}</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-row" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
        <h1 className="admin-h1">{t("admin.userDetails")}</h1>
        <div className="admin-actions">
          <Link href="/admin" className="admin-btn">
            ← {t("admin.view")}
          </Link>
          <button onClick={handleLogout} className="admin-btn">
            {t("header.logout")}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-row">
          <div className="admin-col">
            <div>
              <b>ID:</b> {user.id}
            </div>
            <div>
              <b>Email:</b> {user.email}
            </div>
            <div>
              <b>Телефон:</b> {user.phone || "—"}
            </div>
            <div>
              <b>Telegram:</b>{" "}
              {user.telegram_username ? <span className="admin-badge">@{user.telegram_username}</span> : "—"} (
              {user.telegram_user_id || "—"})
            </div>
          </div>
          <div className="admin-col">
            <div>
              <b>Почта:</b>{" "}
              {user.email_verified_at ? `подтверждена ${tsToStr(user.email_verified_at)}` : "не подтверждена"}
            </div>
            <div>
              <b>KYC статус:</b> <span className="admin-badge">{user.kyc_status}</span>
            </div>
            <div>
              <b>Регистрация:</b> {tsToStr(user.created_at)}
            </div>
            <div>
              <b>Последний вход:</b> {tsToStr(user.last_login_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-h2">{t("admin.documents")}</h2>
        <div>
          {docs.map((doc, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <div className="admin-small">
                {doc.type.toUpperCase()} · {doc.hash || ""} · {tsToStr(doc.created_at)}
              </div>
              <img
                src={doc.url || "/placeholder.svg"}
                alt={doc.type}
                className="admin-img-preview"
                onClick={() => setModalImage(doc.url)}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-h2">{t("admin.actions")}</h2>
        <div className="admin-row">
          <textarea
            className="admin-textarea"
            placeholder={t("admin.notePlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="admin-actions" style={{ marginTop: "10px" }}>
          <button onClick={handleApprove} className="admin-btn admin-btn-ok">
            ✅ {t("admin.approve")}
          </button>
          <button onClick={handleReject} className="admin-btn admin-btn-danger">
            ❌ {t("admin.reject")}
          </button>
        </div>
        {message && (
          <div className="admin-small" style={{ marginTop: "8px" }}>
            {message}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2 className="admin-h2">{t("admin.orders")}</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Из</th>
                <th>В</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Создан</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.from_currency || ""}</td>
                  <td>{order.to_currency || ""}</td>
                  <td>{(order.from_amount || "") + " → " + (order.to_amount || "")}</td>
                  <td>{order.status || ""}</td>
                  <td className="admin-small">{tsToStr(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalImage && (
        <div className="admin-modal" onClick={() => setModalImage("")}>
          <img src={modalImage || "/placeholder.svg"} alt="Document" />
        </div>
      )}
    </div>
  )
}

export default function UserPage() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className="admin-container">
          <div className="admin-card">{t("admin.loading")}</div>
        </div>
      }
    >
      <UserPageContent />
    </Suspense>
  )
}
