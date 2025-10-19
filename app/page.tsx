"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"

export default function HomePage() {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [giveAmount, setGiveAmount] = useState("")
  const [receiveAmount, setReceiveAmount] = useState("")
  const [giveBank, setGiveBank] = useState("СБП")
  const [receiveCrypto, setReceiveCrypto] = useState("USDT (TRC20)")
  const [activeFaq, setActiveFaq] = useState("how")
  const [agreement1, setAgreement1] = useState(false)
  const [agreement2, setAgreement2] = useState(false)

  const banks = [
    { name: "СБП", icon: "/icons/sbp.png" },
    { name: "Т-банк", icon: "/icons/bank.svg" },
    { name: "Сбербанк", icon: "/icons/sberbank.png" },
    { name: "Альфа", icon: "/icons/alfa.png" },
    { name: "ВТБ", icon: "/icons/vtb.png" },
  ]

  const cryptos = [
    { name: "USDT (TRC20)", icon: "/icons/usdt.png" },
    { name: "USDC", icon: "/icons/usdc.png" },
    { name: "TRX", icon: "/icons/trx.png" },
    { name: "TON", icon: "/icons/ton.png" },
    { name: "ETH", icon: "/icons/eth.svg" },
    { name: "BTC", icon: "/icons/btc.png" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{t.home.title}</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Exchange Form */}
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a]">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("buy")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                  activeTab === "buy" ? "bg-[#9dc21b] text-black" : "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <span>💰</span>
                <span>{t.home.buy}</span>
              </button>
              <button
                onClick={() => setActiveTab("sell")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                  activeTab === "sell" ? "bg-[#9dc21b] text-black" : "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <span>💸</span>
                <span>{t.home.sell}</span>
              </button>
            </div>

            {/* Give Section */}
            <div className="mb-6">
              <div className="text-sm text-[#666] mb-2">{t.home.give}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={giveAmount}
                  onChange={(e) => setGiveAmount(e.target.value)}
                  placeholder={t.home.enterAmount}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                />
                <select
                  value={giveBank}
                  onChange={(e) => setGiveBank(e.target.value)}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-[#9dc21b] focus:outline-none transition-colors"
                >
                  {banks.map((bank) => (
                    <option key={bank.name} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder={t.home.enterCard}
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
              />
            </div>

            {/* Rate */}
            <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666]">{t.home.rate}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#9dc21b] rounded-full animate-pulse"></span>
                  <span className="text-sm text-white">1 USDT = 95.50 ₽</span>
                </div>
              </div>
            </div>

            {/* Receive Section */}
            <div className="mb-6">
              <div className="text-sm text-[#666] mb-2">{t.home.receive}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder={t.home.enterAmount}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                />
                <select
                  value={receiveCrypto}
                  onChange={(e) => setReceiveCrypto(e.target.value)}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-[#9dc21b] focus:outline-none transition-colors"
                >
                  {cryptos.map((crypto) => (
                    <option key={crypto.name} value={crypto.name}>
                      {crypto.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder={t.home.enterAddress}
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
              />
            </div>

            {/* Agreements */}
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setAgreement1(!agreement1)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    agreement1 ? "bg-[#9dc21b] border-[#9dc21b]" : "border-[#2a2a2a] group-hover:border-[#9dc21b]"
                  }`}
                >
                  {agreement1 && <span className="text-black text-sm">✓</span>}
                </div>
                <span className="text-sm text-white">
                  {t.home.acceptRules}{" "}
                  <a href="/services" target="_blank" className="text-[#9dc21b] hover:underline" rel="noreferrer">
                    {t.home.rulesLink}
                  </a>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setAgreement2(!agreement2)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    agreement2 ? "bg-[#9dc21b] border-[#9dc21b]" : "border-[#2a2a2a] group-hover:border-[#9dc21b]"
                  }`}
                >
                  {agreement2 && <span className="text-black text-sm">✓</span>}
                </div>
                <span className="text-sm text-white">
                  {t.home.acceptRules}{" "}
                  <a href="/aml-policy" target="_blank" className="text-[#9dc21b] hover:underline" rel="noreferrer">
                    {t.home.amlPolicy}
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors">
              <span className="text-xl">⇄</span>
              <span>{t.home.exchange}</span>
            </button>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <button
              onClick={() => setActiveFaq("how")}
              className={`w-full text-left p-4 rounded-xl font-medium transition-colors ${
                activeFaq === "how"
                  ? "bg-[#9dc21b] text-black"
                  : "bg-[#141414] text-white border border-[#2a2a2a] hover:border-[#9dc21b]"
              }`}
            >
              {t.home.faqHow}
            </button>

            <button
              onClick={() => setActiveFaq("time")}
              className={`w-full text-left p-4 rounded-xl font-medium transition-colors ${
                activeFaq === "time"
                  ? "bg-[#9dc21b] text-black"
                  : "bg-[#141414] text-white border border-[#2a2a2a] hover:border-[#9dc21b]"
              }`}
            >
              {t.home.faqTime}
            </button>

            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
              <p className="text-white leading-relaxed">
                {activeFaq === "how" ? t.home.faqHowAnswer : t.home.faqTimeAnswer}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
