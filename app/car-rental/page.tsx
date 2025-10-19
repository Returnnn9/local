"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Image from "next/image"

// Car data with pricing
const cars = [
  {
    brand: "BMW",
    model: "M4 Cabrio",
    image: "/placeholder.svg?height=400&width=600",
    description: "Спортивный кабриолет BMW M4 с мощным двигателем и элегантным дизайном",
    prices: { 1: 1350, 3: 1200, 7: 1000, 30: 800 },
  },
  {
    brand: "BMW",
    model: "X3M",
    image: "/placeholder.svg?height=400&width=600",
    description: "Мощный спортивный кроссовер BMW X3M с высокими показателями производительности",
    prices: { 1: 1270, 3: 1100, 7: 990, 30: 990 },
  },
  {
    brand: "BMW",
    model: "M3",
    image: "/placeholder.svg?height=400&width=600",
    description: "Легендарный спортивный седан BMW M3 с непревзойденной динамикой",
    prices: { 1: 1320, 3: 1100, 7: 990, 30: 880 },
  },
  {
    brand: "BMW",
    model: "M340",
    image: "/placeholder.svg?height=400&width=600",
    description: "Премиальный седан BMW M340 с идеальным балансом комфорта и производительности",
    prices: { 1: 880, 3: 810, 7: 750, 30: 550 },
  },
  {
    brand: "PORSCHE",
    model: "911 GT3",
    image: "/placeholder.svg?height=400&width=600",
    description: "Легендарный спорткар Porsche 911 GT3 с непревзойденными характеристиками",
    prices: { 1: 2860, 3: 2640, 7: 2530, 30: 2200 },
  },
  {
    brand: "PORSCHE",
    model: "Cayenne Coupe Turbo GT",
    image: "/placeholder.svg?height=400&width=600",
    description: "Мощный люксовый кроссовер Porsche Cayenne с эксклюзивным спортивным дизайном",
    prices: { 1: 1710, 3: 1540, 7: 1430, 30: 1210 },
  },
  {
    brand: "MERCEDES",
    model: "S580 Long",
    image: "/placeholder.svg?height=400&width=600",
    description: "Премиальный седан Mercedes-Benz S580 Long с непревзойденным уровнем комфорта",
    prices: { 1: 1430, 3: 1210, 7: 990, 30: 880 },
  },
  {
    brand: "TOYOTA",
    model: "Supra",
    image: "/placeholder.svg?height=400&width=600",
    description: "Легендарный японский спорткар Toyota Supra с неповторимым характером и стилем",
    prices: { 1: 830, 3: 720, 7: 610, 30: 440 },
  },
]

const AED_TO_USD_RATE = 0.272

const brands = ["Все авто", "BMW", "Porsche", "Mercedes", "Toyota"]

export default function CarRentalPage() {
  const [currency, setCurrency] = useState<"AED" | "USD">("AED")
  const [orderModal, setOrderModal] = useState<{ car: (typeof cars)[0]; show: boolean }>({ car: cars[0], show: false })
  const [orderDays, setOrderDays] = useState<1 | 3 | 7 | 30>(1)
  const [orderCurrency, setOrderCurrency] = useState<"AED" | "USD">("AED")
  const [selectedBrand, setSelectedBrand] = useState("Все авто")

  const formatPrice = (priceAED: number, curr: "AED" | "USD") => {
    if (curr === "USD") {
      const usd = Math.round(priceAED * AED_TO_USD_RATE)
      return `${usd.toLocaleString()} $`
    }
    return `${priceAED.toLocaleString()} AED`
  }

  const openOrder = (car: (typeof cars)[0]) => {
    setOrderModal({ car, show: true })
    setOrderCurrency(currency)
    setOrderDays(1)
  }

  const calculateTotal = () => {
    const dailyAED = orderModal.car.prices[orderDays]
    const totalAED = dailyAED * orderDays
    if (orderCurrency === "USD") {
      return Math.round(totalAED * AED_TO_USD_RATE)
    }
    return totalAED
  }

  const filteredCars = selectedBrand === "Все авто" ? cars : cars.filter((car) => car.brand === selectedBrand)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header with Currency Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Аренда авто</h1>
          <div className="flex items-center gap-3">
            <span className="text-[#999] text-sm font-medium">Валюта:</span>
            <div className="flex gap-2 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1">
              <button
                onClick={() => setCurrency("AED")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currency === "AED" ? "bg-[#9dc21b] text-black" : "text-[#999] hover:text-white"
                }`}
              >
                AED (د.إ)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currency === "USD" ? "bg-[#9dc21b] text-black" : "text-[#999] hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Brand Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 animate-slide-in-up">
          {brands.map((brand, index) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedBrand === brand
                  ? "bg-[#9dc21b] text-black"
                  : "bg-[#141414] text-[#999] hover:text-white hover:bg-[#1a1a1a]"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-[#999] text-center max-w-4xl mx-auto mb-12 leading-relaxed">
          Премиальные автомобили без лишних формальностей. Спортивные купе, бизнес-седаны и внедорожники — в вашем
          распоряжении по лучшим условиям. Мы обеспечим быструю подачу, прозрачные тарифы и круглосуточную поддержку.
        </p>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredCars.map((car, index) => (
            <div key={index} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
              {/* Car Image */}
              <div className="relative h-48 bg-[#0a0a0a] cursor-pointer group">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <div className="text-[#9dc21b] text-sm font-semibold">{car.brand}</div>
                  <div className="text-white text-lg font-bold">{car.model}</div>
                </div>
              </div>

              {/* Pricing Table */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  {[1, 3, 7, 30].map((days) => (
                    <div key={days}>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[#999] text-sm">
                          {days === 1 ? "1 день" : days === 3 ? "3 дня" : days === 7 ? "7 дней" : "30 дней"}
                        </span>
                        <span className="text-white font-semibold">
                          {formatPrice(car.prices[days as keyof typeof car.prices], currency)}
                        </span>
                      </div>
                      {days !== 30 && <div className="h-px bg-[#2a2a2a]" />}
                    </div>
                  ))}
                </div>

                {/* Order Button */}
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

      {/* Order Modal */}
      {orderModal.show && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setOrderModal({ ...orderModal, show: false })}
        >
          <div
            className="bg-[#191919] border border-[#9dc21b] rounded-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOrderModal({ ...orderModal, show: false })}
              className="absolute right-4 top-4 text-white text-2xl hover:text-[#9dc21b] transition-colors"
            >
              ×
            </button>

            <h3 className="text-[#9dc21b] text-xl font-semibold mb-6">Заказ</h3>

            <div className="space-y-6">
              {/* Car Name */}
              <div>
                <div className="text-[#999] text-sm mb-2">Автомобиль</div>
                <div className="text-white font-semibold">
                  {orderModal.car.brand} {orderModal.car.model}
                </div>
              </div>

              {/* Rental Period */}
              <div>
                <div className="text-[#999] text-sm mb-3">Срок аренды</div>
                <div className="flex gap-3 flex-wrap">
                  {[1, 3, 7, 30].map((days) => (
                    <label key={days} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="days"
                        value={days}
                        checked={orderDays === days}
                        onChange={() => setOrderDays(days as 1 | 3 | 7 | 30)}
                        className="accent-[#9dc21b]"
                      />
                      <span className="text-white text-sm">
                        {days === 1 ? "1 день" : days === 3 ? "3 дня" : days === 7 ? "7 дней" : "30 дней"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div>
                <div className="text-[#999] text-sm mb-3">Валюта</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="currency"
                      value="AED"
                      checked={orderCurrency === "AED"}
                      onChange={() => setOrderCurrency("AED")}
                      className="accent-[#9dc21b]"
                    />
                    <span className="text-white text-sm">AED</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="currency"
                      value="USD"
                      checked={orderCurrency === "USD"}
                      onChange={() => setOrderCurrency("USD")}
                      className="accent-[#9dc21b]"
                    />
                    <span className="text-white text-sm">USD</span>
                  </label>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-center">
                <div className="text-[#9dc21b] font-semibold text-lg">
                  Итого: {calculateTotal().toLocaleString()} {orderCurrency === "USD" ? "$" : "AED"}
                </div>
                <button className="bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-2 px-6 rounded-lg transition-colors">
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
