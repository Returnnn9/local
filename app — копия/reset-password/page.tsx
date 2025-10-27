"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают")
      return
    }

    if (password.length < 8) {
      setMessage("Пароль должен содержать минимум 8 символов")
      return
    }

    setMessage("Отправка...")
    // Here you would make an API call to reset the password
    // For now, just simulate success
    setTimeout(() => {
      setMessage("Пароль обновлён. Перенаправление на вход...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-white">
            Сброс пароля в <span className="text-[#9dc21b]">Lite</span>Crypto
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-4"
        >
          <input type="hidden" name="token" value={token || ""} />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Новый пароль (мин. 8 символов)"
              minLength={8}
              required
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:underline"
            >
              {showPassword ? "Скрыть" : "Показать"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтверждение пароля"
              minLength={8}
              required
              className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dc21b] text-xs font-medium hover:underline"
            >
              {showConfirmPassword ? "Скрыть" : "Показать"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
          >
            <span>⇄</span>
            <span>Сбросить пароль</span>
          </button>

          {message && <div className="text-center text-sm text-white">{message}</div>}
        </form>

        <p className="text-center mt-4">
          <a href="/login" className="text-[#9dc21b] hover:underline">
            Назад ко входу
          </a>
        </p>
      </main>

      <Footer />
    </div>
  )
}
