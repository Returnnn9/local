"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const { user, logout } = useAuth()
  const router = useRouter()
  const { language, setLanguage, t } = useTranslation()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#2a2a2a]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="group">
              <span className="text-2xl font-bold transition-all duration-300 group-hover:scale-105 inline-block">
                <span className="text-[#9dc21b] group-hover:text-[#b5d945] transition-colors">Lite</span>
                <span className="text-white">Crypto</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9dc21b] text-black font-medium hover:bg-[#b5d945] hover:shadow-lg hover:shadow-[#9dc21b]/20 transition-all duration-300 hover:scale-105"
              >
                <Image src="/icons/coins.svg" alt="" width={14} height={14} className="brightness-0" />
                <span>{t.header.exchange}</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#9dc21b]/30 transition-all duration-300 hover:scale-105"
                >
                  <Image src="/icons/services.svg" alt="" width={14} height={14} />
                  <span>{t.header.services}</span>
                  <span className={`text-xs transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden animate-slide-in-down">
                    <Link
                      href="/car-rental"
                      className="block px-4 py-3 hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all duration-200 hover:pl-6"
                    >
                      {t.header.carRental}
                    </Link>
                    <Link
                      href="/concierge-service"
                      className="block px-4 py-3 hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all duration-200 hover:pl-6"
                    >
                      {t.header.concierge}
                    </Link>
                    <Link
                      href="/debit-cards"
                      className="block px-4 py-3 hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all duration-200 hover:pl-6"
                    >
                      {t.header.debitCards}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#9dc21b]/30 transition-all duration-300 hover:scale-110"
                aria-label={t.header.language}
              >
                <Image src="/icons/globe.svg" alt="" width={14} height={14} />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden animate-slide-in-down">
                  <button
                    onClick={() => {
                      setLanguage("ru")
                      setLangDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-all duration-200 ${
                      language === "ru" ? "text-[#9dc21b]" : "text-white"
                    }`}
                  >
                    Русский
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      setLangDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-all duration-200 ${
                      language === "en" ? "text-[#9dc21b]" : "text-white"
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {!user ? (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9dc21b] text-black font-medium hover:bg-[#b5d945] hover:shadow-lg hover:shadow-[#9dc21b]/20 transition-all duration-300 hover:scale-105"
              >
                <span>→</span>
                <span>{t.header.login}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#9dc21b]/30 transition-all duration-300 hover:scale-105"
                >
                  <span>👤</span>
                  <span>{t.header.profile}</span>
                </Link>
                <span className="px-4 py-2 text-sm text-[#666]">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-red-500/30 hover:text-red-400 transition-all duration-300 hover:scale-105"
                >
                  <span>⎋</span>
                  <span>{t.header.logout}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
