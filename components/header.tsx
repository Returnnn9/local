"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import LiteCryptoLogo from "@/icons/logo.svg"

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileLangOpen, setMobileLangOpen] = useState(false)

  const { user, logout } = useAuth()
  const router = useRouter()
  const { language, setLanguage, t } = useTranslation()

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileMenuOpen(false)
  }

  // Helper for close all dropdowns
  const closeAllMobileDropdowns = () => {
    setMobileMenuOpen(false)
    setMobileServicesOpen(false)
    setMobileLangOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#2a2a2a]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="group flex items-center gap-3 md:gap-4" onClick={closeAllMobileDropdowns}>
              {/* Logo image */}
              <Image
                src={LiteCryptoLogo}
                alt="LiteCrypto logo"
                width={90}
                height={90}
                className="transition-all duration-300 group-hover:scale-125"
                priority
                style={{
                  maxWidth: "110px",
                  maxHeight: "110px",
                  minWidth: "72px",
                  minHeight: "72px"
                }}
              />
              <span
                className="hidden sm:block font-extrabold tracking-wide text-xl md:text-2xl text-[#d6eed3] transition-all duration-300 group-hover:text-[#bcf527]"
                style={{
                  fontFamily: '"SF Pro Display", "Segoe UI", "Inter", Arial, sans-serif',
                  letterSpacing: "0.08em",
                  textShadow: "0 2px 8px #4b4b4b44"
                }}
              >
              </span>
            </Link>

            {/* Desktop navigation */}
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
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden animate-slide-in-down z-40">
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

          {/* Language + Profile/Login: desktop */}
          <div className="items-center gap-2 hidden md:flex">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#9dc21b]/30 transition-all duration-300 hover:scale-110"
                aria-label={t.header.language}
              >
                <Image src="/icons/globe.svg" alt="" width={14} height={14} />
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden animate-slide-in-down z-40">
                  <button
                    onClick={() => {
                      setLanguage("ru")
                      setLangDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-all duration-200 ${language === "ru" ? "text-[#9dc21b]" : "text-white"}`}
                  >
                    Русский
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      setLangDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-all duration-200 ${language === "en" ? "text-[#9dc21b]" : "text-white"}`}
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

          {/* Burger icon: mobile only */}
          <button
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] transition-all focus:outline-none"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? (
              <svg width={24} height={24} fill="none" className="text-white" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /></svg>
            ) : (
              <svg width={24} height={24} fill="none" className="text-white" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm md:hidden"
            onClick={closeAllMobileDropdowns}
            aria-label="Закрыть меню"
          />
          <nav className="fixed top-0 left-0 w-11/12 max-w-xs sm:max-w-sm h-full z-50 bg-[#111] border-r border-[#262626] shadow-2xl flex flex-col py-4 px-5 transition-transform animate-slide-in-left md:hidden">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" onClick={closeAllMobileDropdowns} className="flex items-center gap-2">
                {/* Logo in mobile menu */}
                <Image
                  src="/icons/logo.svg"
                  alt="LiteCrypto logo"
                  width={32}
                  height={32}
                  className="transition-all duration-300"
                  priority
                />
                <span className="text-2xl font-bold">
                  <span className="text-[#9dc21b]">Lite</span>
                  <span className="text-white">Crypto</span>
                </span>
              </Link>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full text-white hover:bg-[#222] transition-all"
                onClick={closeAllMobileDropdowns}
                aria-label="Закрыть меню"
              >
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /></svg>
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  onClick={closeAllMobileDropdowns}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#9dc21b] text-black font-medium hover:bg-[#b5d945] transition-all"
                >
                  <Image src="/icons/coins.svg" alt="" width={16} height={16} className="brightness-0" />
                  <span>{t.header.exchange}</span>
                </Link>
              </li>
              <li>
                {/* Services dropdown (mobile) */}
                <button
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#191919] border border-[#2a2a2a] text-white font-medium w-full transition-all justify-between"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-list"
                >
                  <span className="flex items-center gap-2">
                    <Image src="/icons/services.svg" alt="" width={16} height={16} />
                    {t.header.services}
                  </span>
                  <span className={`text-xs transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {mobileServicesOpen && (
                  <ul id="mobile-services-list" className="ml-4 mt-1">
                    <li>
                      <Link
                        href="/car-rental"
                        className="block px-4 py-2 rounded-lg hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all"
                        onClick={closeAllMobileDropdowns}
                      >
                        {t.header.carRental}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/concierge-service"
                        className="block px-4 py-2 rounded-lg hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all"
                        onClick={closeAllMobileDropdowns}
                      >
                        {t.header.concierge}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/debit-cards"
                        className="block px-4 py-2 rounded-lg hover:bg-[#1a1a1a] hover:text-[#9dc21b] transition-all"
                        onClick={closeAllMobileDropdowns}
                      >
                        {t.header.debitCards}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                {/* Language mobile */}
                <button
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#191919] border border-[#2a2a2a] text-white font-medium w-full transition-all justify-between"
                  onClick={() => setMobileLangOpen((v) => !v)}
                  aria-expanded={mobileLangOpen}
                  aria-controls="mobile-lang-list"
                >
                  <span className="flex items-center gap-2">
                    <Image src="/icons/globe.svg" alt="" width={16} height={16} />
                    {t.header.language}
                  </span>
                  <span className={`text-xs transition-transform duration-300 ${mobileLangOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {mobileLangOpen && (
                  <ul id="mobile-lang-list" className="ml-4 mt-1">
                    <li>
                      <button
                        onClick={() => {
                          setLanguage("ru")
                          setMobileLangOpen(false)
                          setMobileMenuOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 rounded hover:bg-[#1a1a1a] transition-all ${language === "ru" ? "text-[#9dc21b]" : "text-white"}`}
                      >
                        Русский
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setLanguage("en")
                          setMobileLangOpen(false)
                          setMobileMenuOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 rounded hover:bg-[#1a1a1a] transition-all ${language === "en" ? "text-[#9dc21b]" : "text-white"}`}
                      >
                        English
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              {!user ? (
                <li>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#9dc21b] text-black font-medium hover:bg-[#b5d945] transition-all"
                    onClick={closeAllMobileDropdowns}
                  >
                    <span>→</span>
                    <span>{t.header.login}</span>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#2a2a2a] text-white font-medium hover:bg-[#1a1a1a] hover:border-[#9dc21b]/30 transition-all"
                      onClick={closeAllMobileDropdowns}
                    >
                      <span>👤</span>
                      <span>{t.header.profile}</span>
                    </Link>
                  </li>
                  <li>
                    <span className="block px-4 py-2 text-sm text-[#666]">{user.email}</span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#2a2a2a] text-white font-medium hover:bg-[#1a1a1a] hover:border-red-500/30 hover:text-red-400 transition-all"
                    >
                      <span>⎋</span>
                      <span>{t.header.logout}</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
            <div className="mt-10 flex-1" />
            <span className="block text-xs text-[#444] text-center mt-8">
              &copy; {new Date().getFullYear()} LiteCrypto
            </span>
          </nav>
        </>
      )}
    </header>
  )
}
