"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Image from "next/image"

const categories = [
  { id: "excursions", label: "Экскурсии", image: "/placeholder.svg?height=96&width=309" },
  { id: "safari", label: "Сафари", image: "/placeholder.svg?height=96&width=309" },
  { id: "cruise", label: "Круиз", image: "/placeholder.svg?height=96&width=309" },
  { id: "parks", label: "Парки", image: "/placeholder.svg?height=96&width=309" },
  { id: "aquaparks", label: "Аквапарки", image: "/placeholder.svg?height=96&width=309" },
  { id: "zoos", label: "Зоопарки/сады", image: "/placeholder.svg?height=96&width=309" },
  { id: "museums", label: "Музеи", image: "/placeholder.svg?height=96&width=309" },
  { id: "viewpoints", label: "Смотровые", image: "/placeholder.svg?height=96&width=309" },
  { id: "flights", label: "Полёты", image: "/placeholder.svg?height=96&width=309" },
  { id: "sea", label: "Море/рыбалка", image: "/placeholder.svg?height=96&width=309" },
  { id: "winter", label: "Зима", image: "/placeholder.svg?height=96&width=309" },
  { id: "shows", label: "Шоу", image: "/placeholder.svg?height=96&width=309" },
]

const servicesData: Record<string, Array<{ name: string; adult: number; child: number }>> = {
  excursions: [
    { name: "Абу-Даби экскурсия до 4-ех человек", adult: 1220, child: 1220 },
    { name: "Абу-Даби экскурсия до 7-ми человек", adult: 1410, child: 1410 },
    { name: "Абу-Даби экскурсия групповая", adult: 320, child: 260 },
    { name: "Дубай экскурсия групповая", adult: 240, child: 240 },
    { name: "Дубай экскурсия до 4-ех человек", adult: 960, child: 960 },
    { name: "Дубай экскурсия до 7-ми человек", adult: 1220, child: 1220 },
  ],
  safari: [
    { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
    { name: "Ночной сафари с ночёвкой", adult: 450, child: 450 },
    { name: "Сафари парк", adult: 110, child: 50 },
  ],
  cruise: [
    { name: "Круизы с ужином (стандарт)", adult: 230, child: 230 },
    { name: "Круизы с ужином (премиум)", adult: 250, child: 250 },
    { name: "Круизы с ужином (VIP)", adult: 320, child: 320 },
  ],
  parks: [
    { name: "AYA", adult: 140, child: 140 },
    { name: "Дубай Парк (Legoland, Lego Water Park)", adult: 320, child: 320 },
    { name: "Ferrari Park", adult: 380, child: 380 },
    { name: "Warner Bros", adult: 380, child: 380 },
    { name: "IMG World", adult: 260, child: 260 },
  ],
  aquaparks: [
    { name: "Яс аквапарк", adult: 290, child: 290 },
    { name: "Wild Wadi аквапарк", adult: 270, child: 270 },
    { name: "Атлантис аквапарк", adult: 390, child: 390 },
  ],
  zoos: [
    { name: "Парк бабочек", adult: 70, child: 70 },
    { name: "Green Planet", adult: 190, child: 160 },
    { name: "Dubai Аквариум / Зоопарк", adult: 170, child: 170 },
  ],
  museums: [
    { name: "Музей будущего", adult: 180, child: 180 },
    { name: "Qasr Al Watan (президентский дворец)", adult: 65, child: 45 },
    { name: "Лувр Абу-Даби", adult: 85, child: 85 },
  ],
  viewpoints: [
    { name: "Бурдж-Халифа 124-125 этажи", adult: 220, child: 180 },
    { name: "Бурдж-Халифа 148 этаж", adult: 490, child: 490 },
    { name: "The View at the Palm", adult: 170, child: 130 },
  ],
  flights: [
    { name: "Вертолёт 12 минут", adult: 830, child: 830 },
    { name: "Вертолёт 17 минут", adult: 1060, child: 1060 },
    { name: "Воздушный шар", adult: 1060, child: 1230 },
    { name: "SKYDIVE (прыжок с парашютом)", adult: 3140, child: 3140 },
  ],
  sea: [{ name: "Мусандам, Оман (рыбалка, дайвинг)", adult: 380, child: 380 }],
  winter: [
    { name: "SKI Dubai (Classic)", adult: 260, child: 260 },
    { name: "SKI Dubai (Daycation)", adult: 290, child: 290 },
  ],
  shows: [
    { name: "La Perle (bronze)", adult: 280, child: 280 },
    { name: "La Perle (silver)", adult: 330, child: 330 },
    { name: "La Perle (gold)", adult: 380, child: 380 },
  ],
}

type CartItem = {
  service: string
  price: number
  originalPrice: number
  type: "Взрослый" | "Ребенок"
}

const services = [
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
  { name: "Сафари на джипах с ужином", adult: 190, child: 160 },
]

export default function ConciergeServicePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currency, setCurrency] = useState<"AED" | "USD">("AED")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const USD_TO_AED_RATE = 3.67

  const convertPrice = (aedPrice: number, toCurrency: "AED" | "USD") => {
    if (toCurrency === "USD") {
      return Math.round(aedPrice / USD_TO_AED_RATE)
    }
    return aedPrice
  }

  const formatPrice = (price: number, curr: "AED" | "USD") => {
    return curr === "USD" ? `$${price}` : `${price} AED`
  }

  const addToCart = (service: string, originalPrice: number, type: "Взрослый" | "Ребенок") => {
    const price = convertPrice(originalPrice, currency)
    setCart([...cart, { service, price, originalPrice, type }])
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
  }

  const handleCurrencyChange = (newCurrency: "AED" | "USD") => {
    setCurrency(newCurrency)
    // Update cart prices
    setCart(
      cart.map((item) => ({
        ...item,
        price: convertPrice(item.originalPrice, newCurrency),
      })),
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        {/* Page Header with Currency Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-2xl text-white animate-slide-in-left">Консьерж-сервис</h1>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <span className="text-[#999] text-sm font-medium">Валюта:</span>
            <div className="flex bg-[#141414] border border-[#333] rounded-lg overflow-hidden">
              <button
                onClick={() => handleCurrencyChange("AED")}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  currency === "AED" ? "bg-[#9dc21b] text-black" : "text-[#999] hover:bg-[#1a1a1a] hover:text-[#9dc21b]"
                }`}
              >
                AED (د.إ)
              </button>
              <button
                onClick={() => handleCurrencyChange("USD")}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  currency === "USD" ? "bg-[#9dc21b] text-black" : "text-[#999] hover:bg-[#1a1a1a] hover:text-[#9dc21b]"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

      
        {/* Categories Grid */}
       

        {/* Search Bar */}
        <div className="max-w-xl mb-8 animate-slide-in-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 pl-10 text-white placeholder:text-[#666] focus:outline-none focus:border-[#9dc21b] transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Services Table */}
        <div className="max-w-6xl animate-fade-in-up">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto] gap-4 mb-4 pb-3 border-b border-[#333]">
            <div className="text-white font-semibold text-lg">Название</div>
            <div className="text-white font-semibold text-lg text-right min-w-[200px]">Стоимость</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] gap-4 items-center py-4 border-b border-[#2a2a2a] hover:bg-[#141414] transition-colors rounded-lg px-4 animate-slide-in-right"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="text-white">{service.name}</div>
                <div className="flex gap-8 justify-end min-w-[200px]">
                  <div className="text-white font-medium text-center w-16">{convertPrice(service.adult, currency)}</div>
                  <div className="text-white font-medium text-center w-16">{convertPrice(service.child, currency)}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center text-[#666] py-12 italic">Ничего не найдено</div>
          )}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed right-5 top-1/2 -translate-y-1/2 bg-[#9dc21b] text-black px-5 py-4 rounded-full shadow-lg flex items-center gap-3 font-semibold hover:scale-105 transition-transform duration-300 z-50 animate-bounce-in"
        >
          <span className="text-xl">🛒</span>
          <span className="bg-black text-[#9dc21b] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cart.length}
          </span>
          <span className="text-sm">{formatPrice(cartTotal, currency)}</span>
        </button>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="bg-[#0a0a0a] border border-[#9dc21b] rounded-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#333]">
              <h3 className="text-2xl font-bold text-[#9dc21b]">Корзина</h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#999] hover:text-white text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#333] transition-all duration-300"
              >
                ×
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center text-[#999] italic py-10">Корзина пуста</div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-[#333] last:border-0 animate-slide-in-right"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm mb-1">{item.service}</div>
                      <div className="text-[#999] text-xs">{item.type}</div>
                    </div>
                    <div className="text-[#9dc21b] font-semibold ml-4">{formatPrice(item.price, currency)}</div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="ml-3 text-red-500 hover:bg-red-500/20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#333] space-y-4">
                <div className="text-center text-white text-lg">
                  <strong>
                    Итого: <span className="text-[#9dc21b]">{formatPrice(cartTotal, currency)}</span>
                  </strong>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full border border-[#9dc21b] text-[#9dc21b] hover:bg-[#9dc21b] hover:text-black py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Очистить корзину
                </button>
                <button className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black py-3 rounded-lg font-semibold transition-all duration-300">
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
