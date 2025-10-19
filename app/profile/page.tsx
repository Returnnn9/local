"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export default function ProfilePage() {
  const { t } = useTranslation()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const { user, logout, verifyAuth, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        router.push("/login")
        return
      }
      const isAuthenticated = await verifyAuth()
      if (!isAuthenticated) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [verifyAuth, router, token])

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
      console.error("Password change error:", error)
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
    } catch (error) {
      console.error("Logout error:", error)
    }
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-white animate-pulse-subtle">{t.profile.loading}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in-up">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-white">{t.profile.title}</h1>

          {/* Profile Info */}
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] space-y-4 animate-scale-in">
            <div className="flex justify-between items-center">
              <span className="text-[#666]">{t.profile.email}:</span>
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
          </div>

          {/* Change Password */}
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] animate-scale-in">
            <h2 className="text-xl font-semibold mb-6 text-white">{t.profile.changePassword}</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t.profile.currentPassword}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors duration-300"
                >
                  {showCurrentPassword ? t.profile.hide : t.profile.show}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.profile.newPassword}
                  minLength={8}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors duration-300"
                >
                  {showNewPassword ? t.profile.hide : t.profile.show}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.profile.confirmPassword}
                  minLength={8}
                  required
                  className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </div>

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
