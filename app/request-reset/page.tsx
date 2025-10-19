"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

export default function RequestResetPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(t.resetPassword.sending)
    // Simulate API call
    setTimeout(() => {
      setMessage(t.resetPassword.successMessage)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium text-center mb-8 text-white">
            {t.resetPassword.title} <span className="text-[#9dc21b]">Lite</span>Crypto
          </h1>

          <form onSubmit={handleSubmit} className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] space-y-4">
            <input type="text" name="website" value="" style={{ display: "none" }} autoComplete="off" readOnly />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.resetPassword.email}
              required
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />

            <button
              type="submit"
              className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
              <span className="text-xl">⇄</span>
              <span>{t.resetPassword.sendLink}</span>
            </button>

            {message && <div className="text-center text-sm text-white">{message}</div>}
          </form>

          <p className="text-center mt-6 text-sm text-[#666]">
            <Link href="/login" className="text-[#9dc21b] hover:underline">
              {t.resetPassword.backToLogin}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
