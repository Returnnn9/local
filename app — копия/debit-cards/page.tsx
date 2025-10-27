"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import AlfaCardSvg from "@/icons/Frame 172.svg"
import IbtCardSvg from "@/icons/Frame 171.svg"
import BannerPng from "@/icons/baner.png"
import LiteCryptoLogo from "@/icons/logo.svg" // <-- добавляем лого

// Локализованные строки для дебетовых карт на русском, английском
const debitCardsStrings = {
  ru: {
    title: "Дебетовые карты",
    recommend: "Рекомендуем",
    priceLabel: "Стоимость карты",
    order: "Заказать",
    "alfa.title": "Карта Альфа-Банка",
    "ibt.title": "Карта IBT Bank",
    "alfa.bullets": [
      "Доставка в Европу и СНГ",
      "Пополнение через USDT, BTC, кассы РФ",
      "Поддержка NFC/ApplePay/GooglePay",
      "Возраст от 18 лет"
    ],
    "ibt.bullets": [
      "Доставка по всему миру",
      "Пополнение через криптовалюту и SWIFT",
      "ApplePay и GooglePay, contactless",
      "Возраст от 21 года"
    ]
  },
  en: {
    title: "Debit Cards",
    recommend: "Recommended",
    priceLabel: "Card price",
    order: "Order",
    "alfa.title": "Alfa-Bank Card",
    "ibt.title": "IBT Bank Card",
    "alfa.bullets": [
      "Delivery to Europe and CIS",
      "Top-up via USDT, BTC, or RF cash",
      "Supports NFC / ApplePay / GooglePay",
      "Available from 18 y.o."
    ],
    "ibt.bullets": [
      "Worldwide delivery",
      "Top-up via crypto and SWIFT",
      "ApplePay & GooglePay, contactless",
      "Available from 21 y.o."
    ]
  }
}

const CARDS = [
  {
    cardBg: "from-[#232323] to-[#5b5b5b]", // grey card
    gradient: "bg-gradient-to-tr from-[#232323] to-[#5b5b5b]",
    image: AlfaCardSvg,
    alt: { ru: "Карта Альфа-Банка", en: "Alfa-Bank Card" },
   
    number: "0000 0000 0000 0000",
    name: "CARDHOLDER NAME",
    expiry: "09/26",
    logo: "/icons/mastercard.svg",
    featured: true,
    info: "mastercard",
    titleCode: "alfa.title",
    pointsCode: "alfa.bullets",
    price: "15 000 ₽",
    btn: "order",
  },
  {
    cardBg: "from-[#98c611] to-[#334c1a]", // green card
    gradient: "bg-gradient-to-tr from-[#98c611] to-[#334c1a]",
    image: IbtCardSvg,
    alt: { ru: "Карта IBT Bank", en: "IBT Bank Card" },
    number: "0000 0000 0000 0000",
    name: "CARDHOLDER NAME",
    expiry: "09/26",
    logo: "/icons/mastercard.svg",
    featured: false,
    info: "mastercard",
    titleCode: "ibt.title",
    pointsCode: "ibt.bullets",
    price: "17 000 ₽",
    btn: "order",
  },
]

// Card Visual с максимально похожим стилем шрифта как в предоставленном изображении
// Теперь: шрифт значительно жирнее, размеры адаптивные для мобильных и больших экранов

function CardVisual({
  brand,
  number,
  name,
  expiry,
  logo,
  gradient
}: {
  brand: string
  number: string
  name: string
  expiry: string
  logo: string
  gradient: string
}) {
  return (
    <div
      className={`
        ${gradient} rounded-2xl 
        px-4 py-7
        sm:px-8 sm:py-8 
        md:px-12 md:py-9 
        lg:px-14 lg:py-10 
        w-full max-w-[570px] min-h-[170px] sm:min-h-[200px] md:min-h-[210px] lg:min-h-[230px] 
        shadow-2xl flex flex-col justify-between relative transition-all duration-300
      `}
    >
      {/* Бренд верхний левый - жирно и адаптивно и ЛОГО */}
      <div className="flex items-center gap-2">
        {/* ЛОГО слева */}
        <Image
          src={LiteCryptoLogo}
          alt="Lite Crypto Logo"
          width={90}        // увеличено с 60 до 90
          height={120}      // увеличено с 94 до 120
          className="object-contain select-none"
          draggable={false}
          style={{ minWidth: 40, minHeight: 40, maxWidth: 56, maxHeight: 56 }} // увеличены размеры
        />
        <span
          className="uppercase"
          style={{
            fontFamily: '"SF Pro Display", "Segoe UI", "Inter", Arial, sans-serif',
            fontWeight: 900, // жирнее
            fontSize: "clamp(1.1rem, 3vw, 1.45rem)", // адаптив
            color: "#d6eed3",
            letterSpacing: "0.06em",
            lineHeight: "116%",
            textShadow: "0 1px 1px #151a12, 0 0.5px 2px #d6eed327"
          }}
        >
          {brand}
        </span>
      </div>
      <div className="mt-7 md:mt-10 lg:mt-12">
        {/* Номер карты - ещё жирнее, адаптивно */}
        <div
          style={{
            fontFamily: '"SF Mono", "JetBrains Mono", "Menlo", "mono", monospace',
            fontWeight: 900, // максимально жирно
            fontSize: "clamp(1.08rem, 4vw, 2rem)", // от ~17px до 32px, адаптивно
            letterSpacing: "0.21em",
            color: "#f3f7f1",
            lineHeight: "1.1",
            textShadow: "0 1px 4px #67676733"
          }}
          className="mb-6 md:mb-7 lg:mb-8 select-none"
        >
          {number}
        </div>
        <div className="flex flex-wrap justify-between items-center w-full gap-x-3 gap-y-2">
          <div>
            {/* Имя карты - жирнее, поменьше, адаптивный размер, Uppercase */}
            <div
              style={{
                fontFamily: '"SF Pro Display", "Segoe UI", "Inter", Arial, sans-serif',
                fontWeight: 800, // более жирный
                fontSize: "clamp(0.7rem, 2vw, 1.08rem)", //12-17px
                letterSpacing: "0.12em",
                color: "#e6eedb",
                textTransform: "uppercase",
                marginBottom: "2px"
              }}
            >
              {name}
            </div>
            {/* Срок действия - жирнее и адаптив, светло-серый */}
            <div
              style={{
                fontFamily: '"SF Pro Display", "Segoe UI", "Inter", Arial, sans-serif',
                fontWeight: 600, // medium-bold
                fontSize: "clamp(0.7rem, 2vw, 1.03rem)", //12-16px
                letterSpacing: "0.09em",
                color: "#e6e6ea"
              }}
            >
              {expiry}
            </div>
          </div>
          <Image src={logo} alt="" width={50} height={30} className="object-contain" draggable={false} />
        </div>
      </div>
    </div>
  )
}

// Отдельная функция для получения строк перевода с type safety
function getT(t, key) {
  // ключ типа 'pointsCode' => 'alfa.bullets' или 'ibt.bullets'
  return (t as any)[key]
}

function Card({
  card,
  t
}: {
  card: typeof CARDS[number]
  t: any
}) {
  return (
    <div className="flex flex-col gap-6 md:gap-8 items-center flex-1 min-w-[90vw] sm:min-w-[440px] w-full max-w-full md:max-w-[650px] transition-all duration-200">
      <div className="w-full flex justify-center items-center">
        <CardVisual
          brand={card.brand}
          number={card.number}
          name={card.name}
          expiry={card.expiry}
          logo={card.logo}
          gradient={card.gradient}
        />
      </div>
      <div className={`bg-[#181818] border border-[#232925] ${card.featured
        ? "shadow-[0_6px_36px_0_#9dc21b22]"
        : "shadow-[0_2px_18px_#000a]"
        } rounded-3xl flex flex-col px-3 py-5 sm:px-6 sm:py-7 md:px-9 md:py-9 w-full min-h-[240px] sm:min-h-[270px] md:min-h-[320px] relative group transition-all duration-200 hover:border-[#9dc21b] hover:shadow-[0_12px_48px_0_#9dc21b18]`}>
        {card.featured && (
          <div className="absolute left-0 top-0 bg-gradient-to-tr from-[#9dc21b] to-[#bbdc60] text-[#232925] font-black px-3 md:px-4 py-1 rounded-tr-2xl rounded-bl-xl text-xs sm:text-sm shadow-md z-20 animate-pulse">
            {t.recommend}
          </div>
        )}
        <h2 className="font-black text-[1.17rem] sm:text-[1.24rem] md:text-[1.41rem] leading-7 text-white mb-4 mt-2 md:mb-5 md:mt-3 text-left tracking-tight">
          {t[card.titleCode]}
        </h2>
        <ul className="text-[0.97rem] sm:text-[1.05rem] md:text-[1.13rem] leading-[1.62rem] text-[#e7ffe7] font-semibold mb-7 list-disc list-inside space-y-2">
          {(t[card.pointsCode] as string[]).map((item: string, i: number) => (
            <li key={i} className="ml-1">{item}</li>
          ))}
        </ul>
        <div className="text-[#9dc21b] text-[1.13rem] sm:text-[1.22rem] md:text-[1.33rem] font-black mb-4 md:mb-5 mt-auto tracking-tight">
          {t.priceLabel}: {card.price}
        </div>
        <button className="w-full bg-[#9dc21b] text-[#1c2d13] font-black tracking-tight text-[1.12rem] sm:text-[1.17rem] md:text-[1.2rem] py-[14px] sm:py-[16px] md:py-[18px] rounded-lg cursor-pointer shadow-[0_3px_24px_#8dbe2488] transition-all duration-200 hover:bg-[#c6ea72] hover:text-[#191919] active:bg-[#b2d344] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9dc21b55]">
          {t[card.btn]}
        </button>
      </div>
    </div>
  )
}

export default function DebitCardsPage() {
  // Use language from useTranslation
  const { language } = useTranslation()
  // fallback если не en
  const t = language === "en" ? debitCardsStrings.en : debitCardsStrings.ru
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-1 sm:px-4 py-0">
        {/* Баннер */}
        <div className="w-full flex justify-center pt-6 md:pt-10 mb-0">
          <Image
            src={BannerPng}
            alt={t.title}
            className="rounded-2xl w-full max-w-full sm:max-w-[1060px] object-cover shadow-[0_8px_32px_#9dc21b22]"
            width={1040}
            height={220}
            priority
            draggable={false}
          />
        </div>
        {/* Карты - заголовок и рендер */}
        <h1 className="font-black text-2xl sm:text-3xl md:text-4xl text-left max-w-full sm:max-w-[1060px] mx-auto mt-8 sm:mt-12 mb-7 sm:mb-10 px-2 tracking-tight">
          {t.title}
        </h1>
        {/* сетка увеличена для длинных карточек: делаем gap-12 на мобильном и gap-20 на десктопе, ширина адаптив */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-full md:max-w-[1400px] mx-auto mb-20 md:mb-28 w-full items-start justify-center">
          {CARDS.map((card, idx) => (
            <Card key={idx} card={card} t={t} />
          ))}
        </section>
      </main>
      <Footer />
      <style>{`
        /* Для карты: SF Pro, Inter, Segoe UI (делаем максимально похожим на макет) */
        @font-face {
          font-family: 'SF Pro Display';
          src: local('SF Pro Display'), local('Segoe UI'), local('Inter'), local('Arial');
          font-style: normal;
          font-weight: 400 900;
        }
        @font-face {
          font-family: 'SF Mono';
          src: local('SF Mono'), local('Menlo'), local('JetBrains Mono'), local('monospace');
          font-style: normal;
          font-weight: 400 900;
        }
      `}</style>
    </div>
  )
}
