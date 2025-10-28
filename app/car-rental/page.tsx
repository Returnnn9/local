"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useState } from "react"
import Image from "next/image"

// Хелпер для безопасного URL (поддержка пробелов и нестандартных путей)
const getSrcSafe = (src: any) => {
  if (typeof src === "object" && src?.src) return src.src
  if (typeof src !== "string") return src 
  return src.split("/").map(encodeURIComponent).join("/")
}

// Импорты изображений
import BMWM3Promo from "@/images/bmw-m3/bmw-m3-promo.jpg"
import BMWM3_0976 from "@/images/bmw-m3/img_0976.jpg"
import BMWM3_0978 from "@/images/bmw-m3/img_0978.jpg"
import BMWM3_9973 from "@/images/bmw-m3/img_9973.jpg"
import BMWM3_9974 from "@/images/bmw-m3/img_9974.jpg"
import BMWM3_9975 from "@/images/bmw-m3/img_9975.jpg"
import BMWM3_9979 from "@/images/bmw-m3/img_9979.jpg"
import BMWM3_9981 from "@/images/bmw-m3/img_9981.jpg"
import BMWM4Cabrio from "@/images/bmw_m4c/center.jpg"
// Исправлено: корректное имя файла для BMW M340-поста
import BMWM340 from "@/images/bmw-m340/bmw-m340-promo.jpg"
import BMWX3M from "@/images/bmw-x3m/bmw-x3m-promo.jpg"
import MERCEDESS580Long from "@/images/mercedes-s580-long/mercedes-s580-long-promo.jpg"
import PORSCHE911GT3 from "@/images/porsche-911-gt3/porsche-911-gt3-promo.jpg"
import PORSCHECayenne from "@/images/porsche-cayenne-coupe-turbo-gt/porsche-cayenne-coupe-turbo-gt-promo.jpg"
import TOYOTASupra from "@/images/toyota-supra/toyota-supra-promo.jpg"

// Данные автомобилей
const cars = [
  {
    brand: "BMW",
    model: "M3",
    image: BMWM3Promo,
    images: [BMWM3Promo, BMWM3_0976, BMWM3_0978, BMWM3_9973, BMWM3_9974, BMWM3_9975, BMWM3_9979, BMWM3_9981],
    description: "Мощный седан BMW M3 — сочетание динамики, технологий и бизнес-класса.",
    prices: { 1: 1200, 3: 1050, 7: 940, 30: 700 },
  },
  {
    brand: "BMW",
    model: "M4 Cabrio",
    image: BMWM4Cabrio,
    images: [BMWM4Cabrio],
    description: "Кабриолет BMW M4 — яркие эмоции и стиль на любой дороге.",
    prices: { 1: 1400, 3: 1270, 7: 1130, 30: 820 },
  },
  {
    brand: "BMW",
    model: "M340",
    image: BMWM340,
    images: [BMWM340],
    description: "BMW M340: премиум-класс и драйв в исполнении легендарной тройки.",
    prices: { 1: 1000, 3: 890, 7: 790, 30: 600 },
  },
  {
    brand: "BMW",
    model: "X3M",
    image: BMWX3M,
    images: [BMWX3M],
    description: "Спортивный кроссовер BMW X3M для уверенного передвижения и комфорта.",
    prices: { 1: 1100, 3: 990, 7: 870, 30: 650 },
  },
  {
    brand: "Mercedes",
    model: "S580 Long",
    image: MERCEDESS580Long,
    images: [MERCEDESS580Long],
    description: "Mercedes S580 Long — вершина немецкой роскоши и комфорта.",
    prices: { 1: 1600, 3: 1450, 7: 1280, 30: 950 },
  },
  {
    brand: "Porsche",
    model: "911 GT3",
    image: PORSCHE911GT3,
    images: [PORSCHE911GT3],
    description: "Porsche 911 GT3 — чистый спорткар для ценителей драйва.",
    prices: { 1: 2200, 3: 2000, 7: 1800, 30: 1300 },
  },
  {
    brand: "Porsche",
    model: "Cayenne",
    image: PORSCHECayenne,
    images: [PORSCHECayenne],
    description: "Универсальный и динамичный Porsche Cayenne.",
    prices: { 1: 1300, 3: 1170, 7: 1070, 30: 770 },
  },
  {
    brand: "Toyota",
    model: "Supra",
    image: TOYOTASupra,
    images: [TOYOTASupra],
    description: "Легендарное купе Toyota Supra для истинных фанатов скорости.",
    prices: { 1: 1100, 3: 1000, 7: 900, 30: 650 },
  },
]

const AED_TO_USD_RATE = 0.272
const brands = ["Все авто", ...Array.from(new Set(cars.map(car => car.brand)))]

export default function CarRentalPage() {
  const [currency, setCurrency] = useState<"AED" | "USD">("AED")
  const [orderModal, setOrderModal] = useState<{ car: typeof cars[0]; show: boolean }>({ car: cars[0], show: false })
  const [orderDays, setOrderDays] = useState<1 | 3 | 7 | 30>(1)
  const [orderCurrency, setOrderCurrency] = useState<"AED" | "USD">("AED")
  const [selectedBrand, setSelectedBrand] = useState("Все авто")
  const [currentIndex, setCurrentIndex] = useState(0)

  const formatPrice = (priceAED: number, curr: "AED" | "USD") => {
    return curr === "USD"
      ? `${Math.round(priceAED * AED_TO_USD_RATE).toLocaleString()} $`
      : `${priceAED.toLocaleString()} AED`
  }

  const openOrder = (car: typeof cars[0]) => {
    setOrderModal({ car, show: true })
    setOrderCurrency(currency)
    setOrderDays(1)
    setCurrentIndex(0)
  }

  const calculateTotal = () => {
    const daily = orderModal.car.prices[orderDays]
    const total = daily * orderDays
    return orderCurrency === "USD" ? Math.round(total * AED_TO_USD_RATE) : total
  }

  const filteredCars = selectedBrand === "Все авто" ? cars : cars.filter(car => car.brand === selectedBrand)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Заголовок и валюта */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Аренда авто</h1>
          <div className="flex items-center gap-3">
            <span className="text-[#999] text-sm font-medium">Валюта:</span>
            <div className="flex gap-2 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1">
              {["AED", "USD"].map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr as "AED" | "USD")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currency === curr ? "bg-[#9dc21b] text-black" : "text-[#999] hover:text-white"
                  }`}
                >
                  {curr === "AED" ? "AED (د.إ)" : "USD ($)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Фильтр брендов */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {brands.map((brand, i) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedBrand === brand ? "bg-[#9dc21b] text-black" : "bg-[#141414] text-[#999] hover:text-white"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredCars.map((car, i) => (
            <div key={i} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
              <div className="relative h-48 cursor-pointer group">
                <Image src={car.image} alt={`${car.brand} ${car.model}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <div className="text-[#9dc21b] text-sm font-semibold">{car.brand}</div>
                  <div className="text-white text-lg font-bold">{car.model}</div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  {[1, 3, 7, 30].map(d => (
                    <div key={d}>
                      <div className="flex justify-between py-2">
                        <span className="text-[#999] text-sm">{d === 1 ? "1 день" : `${d} дней`}</span>
                        <span className="text-white font-semibold">{formatPrice(car.prices[d as 1 | 3 | 7 | 30], currency)}</span>
                      </div>
                      {d !== 30 && <div className="h-px bg-[#2a2a2a]" />}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openOrder(car)}
                  className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-3 rounded-xl transition-colors"
                >
                  Заказать
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Модалка */}
      {orderModal.show && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setOrderModal({ ...orderModal, show: false })}>
          <div className="bg-[#191919] border border-[#9dc21b] rounded-xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOrderModal({ ...orderModal, show: false })} className="absolute right-4 top-4 text-white text-2xl hover:text-[#9dc21b]">×</button>
            <h3 className="text-[#9dc21b] text-xl font-semibold mb-6">Заказ</h3>

            <div className="space-y-6">
              {/* Карусель */}
              <div className="w-full flex flex-col items-center mb-6">
                <div className="relative w-full max-w-full mx-auto aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[#232a16] via-[#222] to-[#14160A] border-2 border-[#293f11] shadow-xl" style={{ minHeight: "200px" }}>
                  <Image src={getSrcSafe(orderModal.car.images[currentIndex])} alt={`${orderModal.car.brand} ${orderModal.car.model}`} fill style={{ objectFit: "cover" }} />
                  {orderModal.car.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentIndex(prev => (prev === 0 ? orderModal.car.images.length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#202d10]/80 hover:bg-[#afcd45]/90 text-white px-2 py-1 rounded-full shadow-lg"
                        type="button"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentIndex(prev => (prev === orderModal.car.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#202d10]/80 hover:bg-[#afcd45]/90 text-white px-2 py-1 rounded-full shadow-lg"
                        type="button"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[#aaa] text-sm mb-2">Автомобиль</div>
                <div className="text-white font-semibold text-base">{orderModal.car.brand} {orderModal.car.model}</div>
              </div>

              <div>
                <div className="text-[#aaa] text-sm mb-3">Срок аренды</div>
                <div className="flex gap-3 flex-wrap">
                  {[1, 3, 7, 30].map(d => (
                    <label key={d} className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg ${orderDays === d ? "bg-[#9dc21b]/10 border border-[#9dc21b]" : "hover:bg-[#232919]/30 border border-transparent"}`}>
                      <input type="radio" name="days" value={d} checked={orderDays === d} onChange={() => setOrderDays(d as 1 | 3 | 7 | 30)} className="accent-[#9dc21b]" />
                      <span className="text-white text-sm font-medium">{d === 1 ? "1 день" : `${d} дней`}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[#aaa] text-sm mb-3">Валюта</div>
                <div className="flex gap-4">
                  {["AED", "USD"].map(curr => (
                    <label key={curr} className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg ${orderCurrency === curr ? "bg-[#9dc21b]/10 border border-[#9dc21b]" : "hover:bg-[#232919]/30 border border-transparent"}`}>
                      <input type="radio" name="currency" value={curr} checked={orderCurrency === curr} onChange={() => setOrderCurrency(curr as "AED" | "USD")} className="accent-[#9dc21b]" />
                      <span className="text-white text-sm font-medium">{curr}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#2a2a2a] pt-5 flex justify-between items-center">
                <div className="text-[#9dc21b] font-semibold text-lg">
                  Итого: {calculateTotal().toLocaleString()} {orderCurrency}
                </div>
                <button className="bg-[#9dc21b] hover:bg-[#b9e541] shadow-lg text-black font-semibold py-2 px-7 rounded-lg transition-all text-base">Подтвердить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
