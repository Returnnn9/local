"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export default function LoginPage() {
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setMessage(t.login.mustAccept)
      return
    }

    setMessage(t.login.loggingIn)

    const result = await login(email, password)

    if (result.success) {
      setMessage(t.login.loginSuccess)
      setTimeout(() => {
        router.push("/profile")
      }, 1000)
    } else {
      setMessage(result.error || t.login.loginError)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium text-center mb-8 text-white">
            {t.login.title} <span className="text-[#9dc21b]">Lite</span>Crypto
          </h1>

          <form onSubmit={handleSubmit} className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] space-y-4">
            <input type="text" name="website" value="" style={{ display: "none" }} autoComplete="off" readOnly />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.login.email}
              required
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.password}
                required
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 pr-24 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:text-[#8ab019] transition-colors"
              >
                {showPassword ? t.login.hide : t.login.show}
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
                {t.login.acceptAgreement}{" "}
                <a href="/services" target="_blank" className="text-[#9dc21b] hover:underline" rel="noreferrer">
                  {t.login.userAgreement}
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">⇄</span>
              <span>{isLoading ? t.login.loggingIn : t.login.loginButton}</span>
            </button>

            {message && <div className="text-center text-sm text-white">{message}</div>}
          </form>

          <p className="text-center mt-6 text-sm text-[#666]">
            <Link href="/register" className="text-[#9dc21b] hover:underline">
              {t.login.register}
            </Link>
            {" · "}
            <Link href="/request-reset" className="text-[#9dc21b] hover:underline">
              {t.login.forgotPassword}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
