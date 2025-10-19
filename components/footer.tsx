"use client"

import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-20 border-t border-[#2a2a2a]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-8">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-[#9dc21b] text-sm font-light transition-colors duration-300 group-hover:text-[#b5d945]">
                Lite
              </span>
              <span className="text-white text-xl font-bold transition-transform duration-300 group-hover:scale-105 inline-block">
                CRYPTO
              </span>
            </Link>
          </div>

          {/* Links Grid */}
          <div className="flex gap-20">
            {/* Column 1 */}
            <div>
              <h3 className="text-white text-sm font-normal mb-4 lowercase">{t.footer.main}</h3>
              <Link
                href="/"
                className="block text-[#9dc21b] text-sm transition-all duration-300 hover:text-[#b5d945] hover:translate-x-1 lowercase"
              >
                {t.footer.exchange}
              </Link>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-white text-sm font-normal mb-4 lowercase">{t.footer.services}</h3>
              <div className="space-y-3">
                <Link
                  href="/car-rental"
                  className="block text-[#9dc21b] text-sm transition-all duration-300 hover:text-[#b5d945] hover:translate-x-1 lowercase"
                >
                  {t.footer.carRental}
                </Link>
                <Link
                  href="/concierge-service"
                  className="block text-[#9dc21b] text-sm transition-all duration-300 hover:text-[#b5d945] hover:translate-x-1 lowercase"
                >
                  {t.footer.concierge}
                </Link>
                <Link
                  href="/debit-cards"
                  className="block text-[#9dc21b] text-sm transition-all duration-300 hover:text-[#b5d945] hover:translate-x-1 lowercase"
                >
                  {t.footer.debitCards}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#666] text-sm">{t.footer.copyright}</div>
          <Link
            href="/aml-policy"
            className="text-[#666] text-sm transition-all duration-300 hover:text-[#9dc21b] hover:underline underline-offset-4"
          >
            {t.footer.userAgreement}
          </Link>
        </div>
      </div>
    </footer>
  )
}
