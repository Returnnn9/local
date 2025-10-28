"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "@/hooks/use-translation"

import SbpiIcon from "@/icons/sbp.png"
import SberbankIcon from "@/icons/sberbank.png"
import TinkoffIcon from "@/icons/tinkoff.png"
import VtbIcon from "@/icons/vtb.png"
import AlfaIcon from "@/icons/alfa.png"
import OzonIcon from "@/icons/ozon.png"
import PochtaIcon from "@/icons/pochta.png"
import PromsIcon from "@/icons/promsvyaz.png"
import RaifIcon from "@/icons/raiffeisen.png"
import RncbIcon from "@/icons/rncb.png"
import RshbIcon from "@/icons/rshb.png"
import RosIcon from "@/icons/ros.png"
import RsbIcon from "@/icons/rsb.png"
import TBankIcon from "@/icons/bank.svg"

import UsdtIcon from "@/icons/usdt.png"
import UsdcIcon from "@/icons/usdc.png"
import TrxIcon from "@/icons/trx.png"
import TonIcon from "@/icons/ton.png"
import EthIcon from "@/icons/eth.svg"
import BtcIcon from "@/icons/btc.png"

import ShoppingCartAdd from "@/public/shopping-cart-add (1) 1.svg"
import CartMinus from "@/public/cart-minus 1.svg"

// очистка суммы: только цифры и одна точка
function escapeInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "")
  const parts = cleaned.split(".")
  if (parts.length <= 2) return cleaned
  // если больше одной точки — оставляем первую и соединяем остальные
  return `${parts[0]}.${parts.slice(1).join("")}`
}

// очистка телефона: только цифры и +
function escapePhoneNumber(value: string) {
  // разрешены только цифры и +, максимум 16 символов
  return value.replace(/[^\d+]/g, "").slice(0, 16)
}

//
function escapeWallet(value: string) {
  return value.replace(/[^a-zA-Z0-9_:-]/g, "").slice(0, 60)
}


async function fetchUsdtrubRate(): Promise<number | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub",
      { signal: controller.signal }
    )
    clearTimeout(timeout)
    if (!res.ok) return null
    const json = await res.json()
    if (
      json &&
      json.tether &&
      typeof json.tether.rub === "number" &&
      isFinite(json.tether.rub)
    ) {
      return json.tether.rub
    }
    return null
  } catch {
    return null
  }
}

// хелпер для извлечения src из импортов изображений (StaticImageData или string)
function getImgSrc(icon: any): string {
  if (!icon) return ""
  if (typeof icon === "string") return icon
  return icon?.src ?? ""
}

export default function HomePage(): JSX.Element {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [giveAmount, setGiveAmount] = useState("")
  const [receiveAmount, setReceiveAmount] = useState("")
  const [giveBank, setGiveBank] = useState("СБП")
  const [receiveCrypto, setReceiveCrypto] = useState("USDT (TRC20)")
  const [activeFaq, setActiveFaq] = useState<"how" | "time">("how")
  const [agreement1, setAgreement1] = useState(false)
  const [agreement2, setAgreement2] = useState(false)
  const [usdtRubRate, setUsdtRubRate] = useState<number | null>(null)
  const [rateError, setRateError] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [wallet, setWallet] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMountedRef = useRef<boolean>(true)

  // Получить курс на старте и обновлять каждую минуту
  useEffect(() => {
    isMountedRef.current = true
    async function getRate() {
      setRateError(false)
      const rate = await fetchUsdtrubRate()
      if (!isMountedRef.current) return
      if (rate === null) {
        setRateError(true)
        setUsdtRubRate(null)
      } else {
        setUsdtRubRate(rate)
      }
    }
    getRate()
    const interval = setInterval(getRate, 60000)
    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  // Обновлённый список банков c импортированными через переменные иконками
  const banks: { name: string; icon: any }[] = [
    { name: "СБП", icon: SbpiIcon },
    { name: "Сбербанк", icon: SberbankIcon },
    { name: "Тинькофф", icon: TinkoffIcon },
    { name: "ВТБ", icon: VtbIcon },
    { name: "Альфа", icon: AlfaIcon },
    { name: "Озон Банк", icon: OzonIcon },
    { name: "Почта Банк", icon: PochtaIcon },
    { name: "Промсвязьбанк", icon: PromsIcon },
    { name: "Райффайзен", icon: RaifIcon },
    { name: "РНКБ", icon: RncbIcon },
    { name: "Россельхозбанк", icon: RshbIcon },
    { name: "Росбанк", icon: RosIcon },
    { name: "Русский Стандарт", icon: RsbIcon },
    // Старый Т-банк с иконкой svg если нужен
    { name: "Т-банк", icon: TBankIcon },
  ]

  // Обновлённый список крипто с импортированными через переменные иконками
  const cryptos: { name: string; icon: any }[] = [
    { name: "USDT (TRC20)", icon: UsdtIcon },
    { name: "USDC", icon: UsdcIcon },
    { name: "TRX", icon: TrxIcon },
    { name: "TON", icon: TonIcon },
    { name: "ETH", icon: EthIcon },
    { name: "BTC", icon: BtcIcon },
  ]

  const giveBankLabel = t?.home?.giveBank ?? "Банк отправки"
  const receiveCryptoLabel = t?.home?.receiveCrypto ?? "Криптовалюта получения"

  function validatePhone(value: string) {
    // Простой шаблон для РФ: +7XXXXXXXXXX или 89XXXXXXXXX
    const cleaned = value.replace(/\D/g, "")
    return (
      (value.startsWith("+7") && cleaned.length === 11) ||
      (value.startsWith("8") && cleaned.length === 11)
    )
  }

  function validateForm() {
    if (!giveAmount || isNaN(Number(giveAmount)) || Number(giveAmount) <= 0) {
      return t?.home?.giveAmountRequired ?? "Введите корректную сумму для отправки"
    }
    if (!phoneNumber || !validatePhone(phoneNumber)) {
      return t?.home?.phoneRequired ?? "Введите корректный номер телефона"
    }
    if (!receiveAmount || isNaN(Number(receiveAmount)) || Number(receiveAmount) <= 0) {
      return t?.home?.receiveAmountRequired ?? "Введите корректную сумму получения"
    }
    if (!wallet || wallet.length < 6) {
      return t?.home?.walletRequired ?? "Введите корректный адрес кошелька"
    }
    if (!agreement1 || !agreement2) {
      return t?.home?.agreementsRequired ?? "Пожалуйста, подтвердите все соглашения перед обменом."
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (isSubmitting) return
    const err = validateForm()
    if (err) {
      setFormError(err)
      return
    }
    setIsSubmitting(true)
    try {
      // Здесь обычно был бы запрос к API — пока показываем сообщение об успехе
      setFormError(t?.home?.submitSuccess ?? "Ваша заявка отправлена, ожидайте обратной связи")
      setGiveAmount("")
      setReceiveAmount("")
      setPhoneNumber("")
      setWallet("")
      setAgreement1(false)
      setAgreement2(false)
    } catch {
      setFormError(t?.home?.submitFail ?? "Ошибка при создании заявки. Попробуйте позже.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 md:text-left">
          {t?.home?.title ?? "Обмен криптовалюты"}
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a]"
            autoComplete="off"
            spellCheck={false}
          >
            <div className="flex gap-2 mb-6">
              {(["buy", "sell"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-[#9dc21b] text-black"
                      : "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <img
                    src={getImgSrc(tab === "buy" ? ShoppingCartAdd : CartMinus)}
                    alt={tab === "buy" ? "Buy" : "Sell"}
                    className="w-5 h-5"
                  />
                  <span>
                    {tab === "buy"
                      ? t?.home?.buy ?? "Купить"
                      : t?.home?.sell ?? "Продать"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-sm text-[#666] mb-2">{t?.home?.give ?? "Отдаёте"}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  name="giveAmount"
                  type="text"
                  inputMode="decimal"
                  value={giveAmount}
                  onChange={(e) => setGiveAmount(escapeInput(e.target.value))}
                  placeholder={t?.home?.enterAmount ?? "Введите сумму"}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                  maxLength={15}
                />
                <div className="relative">
                  <select
                    value={giveBank}
                    onChange={(e) => setGiveBank(e.target.value)}
                    className="bg-black border border-[#2a2a2a] appearance-none rounded-xl px-4 py-3 pr-12 focus:border-[#9dc21b] focus:outline-none transition-colors w-full"
                    title={giveBankLabel}
                  >
                    {banks.map((bank) => (
                      <option key={bank.name} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  {/* Показываем иконку выбранного банка */}
                  {(() => {
                    const current = banks.find((b) => b.name === giveBank)
                    return current ? (
                      <img
                        src={getImgSrc(current.icon)}
                        alt={current.name}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain pointer-events-none"
                      />
                    ) : null
                  })()}
                </div>
              </div>
              <input
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(escapePhoneNumber(e.target.value))}
                placeholder={t?.home?.enterPhone ?? "Введите номер телефона"}
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                maxLength={16}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="text-sm text-[#666]">{t?.home?.rate ?? "Курс"}</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#9dc21b] rounded-full animate-pulse"></span>
                <span className="text-sm">
                  {rateError
                    ? t?.home?.rateError ?? "Ошибка загрузки курса"
                    : usdtRubRate !== null
                    ? `1 USDT = ${usdtRubRate.toFixed(2)} ₽`
                    : t?.home?.rateLoading ?? "Получаем курс..."}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-[#666] mb-2">{t?.home?.receive ?? "Получаете"}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  name="receiveAmount"
                  type="text"
                  inputMode="decimal"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(escapeInput(e.target.value))}
                  placeholder={t?.home?.enterAmount ?? "Введите сумму"}
                  className="bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                  maxLength={15}
                />
                <div className="relative">
                  <select
                    value={receiveCrypto}
                    onChange={(e) => setReceiveCrypto(e.target.value)}
                    className="bg-black border border-[#2a2a2a] appearance-none rounded-xl px-4 py-3 pr-12 focus:border-[#9dc21b] focus:outline-none transition-colors w-full"
                    title={receiveCryptoLabel}
                  >
                    {cryptos.map((crypto) => (
                      <option key={crypto.name} value={crypto.name}>
                        {crypto.name}
                      </option>
                    ))}
                  </select>
                  {/* Показываем иконку выбранной криптовалюты */}
                  {(() => {
                    const current = cryptos.find((c) => c.name === receiveCrypto)
                    return current ? (
                      <img
                        src={getImgSrc(current.icon)}
                        alt={current.name}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain pointer-events-none"
                      />
                    ) : null
                  })()}
                </div>
              </div>
              <input
                name="wallet"
                type="text"
                value={wallet}
                onChange={(e) => setWallet(escapeWallet(e.target.value))}
                placeholder={t?.home?.enterAddress ?? "Введите адрес кошелька"}
                className="w-full bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 placeholder:text-[#666] focus:border-[#9dc21b] focus:outline-none transition-colors"
                maxLength={60}
              />
            </div>

            <div className="space-y-3 mb-6">
              {[
                {
                  checked: agreement1,
                  setChecked: setAgreement1,
                  link: "/services",
                  text: t?.home?.rulesLink ?? "Правила сервиса",
                },
                {
                  checked: agreement2,
                  setChecked: setAgreement2,
                  link: "/aml-policy",
                  text: t?.home?.amlPolicy ?? "AML политику",
                },
              ].map(({ checked, setChecked, link, text }, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                >
                  <div
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => setChecked((prev: boolean) => !prev)}
                    onKeyDown={(e) => {
                      if (["Enter", " "].includes(e.key)) {
                        e.preventDefault()
                        setChecked((prev: boolean) => !prev)
                      }
                    }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      checked
                        ? "bg-[#9dc21b] border-[#9dc21b]"
                        : "border-[#2a2a2a] group-hover:border-[#9dc21b]"
                    }`}
                  >
                    {checked && <span className="text-black text-sm">✓</span>}
                  </div>
                  <span className="text-sm">
                    {t?.home?.acceptRules ?? "Я принимаю"}{" "}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9dc21b] hover:underline"
                    >
                      {text}
                    </a>
                  </span>
                </label>
              ))}
            </div>

            {formError && (
              <div
                className={`mb-4 rounded bg-[#222] px-4 py-2 text-sm ${
                  formError ===
                  (t?.home?.submitSuccess ?? "Ваша заявка отправлена, ожидайте обратной связи")
                    ? "text-[#9dc21b]"
                    : "text-red-400"
                }`}
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors ${
                isSubmitting ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isSubmitting}
            >
              <span className="text-xl">⇄</span>
              <span>
                {isSubmitting
                  ? t?.home?.exchanging ?? "Обмен..."
                  : t?.home?.exchange ?? "Обменять"}
              </span>
            </button>
          </form>

          <div className="space-y-4">
            {["how", "time"].map((faqKey) => (
              <button
                key={faqKey}
                onClick={() => setActiveFaq(faqKey as "how" | "time")}
                type="button"
                aria-expanded={activeFaq === (faqKey as "how" | "time")}
                className={`w-full text-left p-4 rounded-xl font-medium transition-colors ${
                  activeFaq === (faqKey as "how" | "time")
                    ? "bg-[#9dc21b] text-black"
                    : "bg-[#141414] text-white border border-[#2a2a2a] hover:border-[#9dc21b]"
                }`}
              >
                {faqKey === "how"
                  ? t?.home?.faqHow ?? "Как проходит обмен?"
                  : t?.home?.faqTime ?? "Сколько времени занимает?"}
              </button>
            ))}

            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
              <p className="leading-relaxed">
                {activeFaq === "how"
                  ? t?.home?.faqHowAnswer ?? "После заполнения формы следуйте инструкциям на экране."
                  : t?.home?.faqTimeAnswer ?? "Обычно обмен занимает от 5 до 15 минут."}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
