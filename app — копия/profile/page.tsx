"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

type Card = {
  id: string
  number: string
  bank: string
}

type ReferralInfo = {
  code: string
  link: string
  invited: number
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, logout, verifyAuth, token } = useAuth()
  const router = useRouter()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // New: cards and referral
  const [cards, setCards] = useState<Card[]>([])
  const [newCard, setNewCard] = useState({ number: "", bank: "" })
  const [cardMsg, setCardMsg] = useState("")
  const [cardMsgType, setCardMsgType] = useState<"success" | "error">("success")
  const [referral, setReferral] = useState<ReferralInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!token) {
        router.push("/login")
        return
      }
      const isAuthenticated = await verifyAuth()
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        // Fetch cards and referral data for this user
        fetchProfileDetails()
      }
    }
    checkAuthAndFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyAuth, router, token])

  const fetchProfileDetails = async () => {
    setLoading(true)
    try {
      // get cards
      const resCards = await fetch("/api/profile/cards", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (resCards.ok) {
        const { cards: cardList } = await resCards.json()
        setCards(Array.isArray(cardList) ? cardList : [])
      }
      // get referral
      const resRef = await fetch("/api/profile/referral", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (resRef.ok) {
        setReferral(await resRef.json())
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  // Cards
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setCardMsg("")
    if (!/^[0-9]{16}$/.test(newCard.number)) {
      setCardMsg("Некорректный номер карты")
      setCardMsgType("error")
      return
    }
    if (!newCard.bank.trim()) {
      setCardMsg("Укажите банк")
      setCardMsgType("error")
      return
    }
    try {
      const res = await fetch("/api/profile/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCard),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setCardMsg(data.error || "Ошибка при добавлении карты")
        setCardMsgType("error")
        return
      }
      setCardMsg("Карта добавлена")
      setCardMsgType("success")
      setNewCard({ number: "", bank: "" })
      fetchProfileDetails()
    } catch {
      setCardMsg("Ошибка при добавлении карты")
      setCardMsgType("error")
    }
  }

  const handleRemoveCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/profile/cards/${cardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setCardMsg(data.error || "Ошибка при удалении карты")
        setCardMsgType("error")
        return
      }
      setCardMsg("Карта удалена")
      setCardMsgType("success")
      setCards((prev) => prev.filter((c) => c.id !== cardId))
      fetchProfileDetails()
    } catch {
      setCardMsg("Ошибка при удалении карты")
      setCardMsgType("error")
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage(t.profile.passwordMismatch)
      setMessageType("error")
      return
    }

    if (newPassword.length < 8) {
      setMessage(t.profile.passwordTooShort)
      setMessageType("error")
      return
    }

    setMessage(t.profile.loading)
    setMessageType("success")

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || t.profile.passwordError)
        setMessageType("error")
        return
      }

      setMessage(t.profile.passwordChanged)
      setMessageType("success")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage(t.profile.passwordError)
      setMessageType("error")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {}
    logout()
    router.push("/")
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-white animate-pulse-subtle">{t?.profile?.loading ?? "Загрузка..."}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in-up">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Info */}
          <section className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] space-y-4 animate-scale-in">
            <h1 className="text-3xl font-bold text-white">{t.profile.title}</h1>
            <div className="flex justify-between items-center">
              <span className="text-[#666]">{t.profile.email || "Email"}:</span>
              <span className="font-medium text-white">{user.email}</span>
            </div>
            {user.telegram && (
              <div className="flex justify-between items-center">
                <span className="text-[#666]">Telegram:</span>
                <span className="font-medium text-white">{user.telegram}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[#666]">Email:</span>
              <span className="text-[#9dc21b]">{t.profile.verified}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {t.profile.logout}
            </button>
          </section>

          {/* Привязанные карты */}
          <section className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] animate-scale-in space-y-2">
            <h2 className="text-xl font-semibold mb-4 text-white">Привязанные карты</h2>
            <ul className="space-y-3 mb-4">
              {cards.length === 0 && (
                <li className="text-sm text-[#666]">Нет привязанных карт</li>
              )}
              {cards.map((card) => (
                <li key={card.id} className="flex items-center justify-between bg-[#191919] px-4 py-2 rounded-xl">
                  <div>
                    <span className="font-mono text-white">{card.number.replace(/(\d{4})/g, "$1 ").trim()}</span>
                    <span className="ml-3 text-[#9dc21b] font-medium">{card.bank}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-all"
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddCard} className="flex flex-col sm:flex-row gap-3">
              <input
                value={newCard.number}
                onChange={e =>
                  setNewCard(o => ({ ...o, number: e.target.value.replace(/\D/g, "").slice(0, 16) }))
                }
                placeholder="1234567812345678"
                required
                minLength={16}
                maxLength={16}
                className="w-full sm:w-[190px] bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
              />
              <input
                value={newCard.bank}
                onChange={e =>
                  setNewCard(o => ({ ...o, bank: e.target.value.slice(0, 32) }))
                }
                placeholder="Банк"
                required
                className="w-full sm:w-[160px] bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                Добавить
              </button>
            </form>
            {cardMsg && (
              <div className={`mt-2 text-center text-sm ${cardMsgType === "success" ? "text-[#9dc21b]" : "text-red-400"}`}>
                {cardMsg}
              </div>
            )}
          </section>

          {/* Referral System */}
          <section className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] animate-scale-in space-y-3">
            <h2 className="text-xl font-semibold mb-4 text-white">Реферальная система</h2>
            {!referral ? (
              <div className="text-[#666] text-sm">Нет данных</div>
            ) : (
              <div className="space-y-1">
                <div>
                  <span className="text-[#aaa]">Ваш код:</span>{" "}
                  <span className="font-mono text-[#fff]">{referral.code}</span>
                </div>
                <div>
                  <span className="text-[#aaa]">Ваша ссылка:</span>{" "}
                  <span className="text-[#9dc21b] font-mono">{referral.link}</span>
                  <button
                    aria-label="Copy referral link"
                    onClick={() => {
                      navigator.clipboard.writeText(referral.link)
                    }}
                    className="ml-2 px-2 py-1 bg-[#222] text-[#9dc21b] hover:bg-[#171c13] rounded text-xs"
                  >
                    Копировать
                  </button>
                </div>
                <div className="text-[#aaa] text-sm">
                  Количество приглашённых:{" "}
                  <span className="font-semibold text-white">{referral.invited ?? 0}</span>
                </div>
              </div>
            )}
          </section>

          {/* Change Password */}
          <section className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] animate-scale-in space-y-3">
            <h2 className="text-xl font-semibold mb-6 text-white">{t.profile.changePassword}</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder={t.profile.currentPassword}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors duration-300"
                >
                  {showCurrentPassword ? t.profile.hide : t.profile.show}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={t.profile.newPassword}
                  minLength={8}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors duration-300"
                >
                  {showNewPassword ? t.profile.hide : t.profile.show}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={t.profile.confirmPassword}
                  minLength={8}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors duration-300"
                >
                  {showConfirmPassword ? t.profile.hide : t.profile.show}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {t.profile.save}
              </button>
              {message && (
                <div
                  className={`text-center text-sm animate-fade-in ${messageType === "success" ? "text-[#9dc21b]" : "text-red-400"}`}
                >
                  {message}
                </div>
              )}
            </form>
          </section>

          <p className="text-center">
            <Link href="/" className="text-[#9dc21b] hover:underline transition-all duration-300">
              ← {t.footer.main}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
