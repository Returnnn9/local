"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export default function RegisterPage() {
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")

  const { register, isLoading } = useAuth()
  const router = useRouter()

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^a-zA-Z0-9_@]/g, "")
    if (value.length > 0 && !value.startsWith("@")) {
      value = "@" + value
    }
    if (value.length > 33) {
      value = value.substring(0, 33)
    }
    setTelegram(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      setMessage(t.register.mustAccept)
      return
    }

    if (password !== confirmPassword) {
      setMessage(t.register.passwordMismatch)
      return
    }

    if (password.length < 8) {
      setMessage(t.register.passwordTooShort)
      return
    }

    setMessage(t.register.registering)

    const result = await register(email, password, telegram || undefined)

    if (result.success) {
      setMessage(t.register.registerSuccess)
      setTimeout(() => {
        router.push("/profile")
      }, 1000)
    } else {
      setMessage(result.error || t.register.registerError)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium text-center mb-8 text-white">
            {t.register.title} <span className="text-[#9dc21b]">Lite</span>Crypto
          </h1>

          <form onSubmit={handleSubmit} className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] space-y-4">
            <input type="text" name="website" value="" style={{ display: "none" }} autoComplete="off" readOnly />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.register.email}
              required
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />

            <input
              type="text"
              value={telegram}
              onChange={handleTelegramChange}
              onFocus={(e) => {
                if (!e.target.value) {
                  setTelegram("@")
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "@") {
                  setTelegram("")
                }
              }}
              placeholder={t.register.telegram}
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.register.password}
                minLength={8}
                required
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors"
              >
                {showPassword ? t.register.hide : t.register.show}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.register.confirmPassword}
                minLength={8}
                required
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors"
              >
                {showConfirm ? t.register.hide : t.register.show}
              </button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  agreed ? "bg-[#9dc21b] border-[#9dc21b]" : "border-[#2a2a2a] group-hover:border-[#9dc21b]"
                }`}
              >
                {agreed && <span className="text-black text-sm">✓</span>}
              </div>
              <span className="text-sm text-white">
                {t.register.acceptAgreement}{" "}
                <a href="/services" target="_blank" className="text-[#9dc21b] hover:underline" rel="noreferrer">
                  {t.register.userAgreement}
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">⇄</span>
              <span>{isLoading ? t.register.registering : t.register.createAccount}</span>
            </button>

            {message && <div className="text-center text-sm text-white">{message}</div>}
          </form>

          <p className="text-center mt-6 text-sm text-[#666]">
            {t.register.haveAccount}{" "}
            <Link href="/login" className="text-[#9dc21b] hover:underline">
              {t.register.loginLink}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
