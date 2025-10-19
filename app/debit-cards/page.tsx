import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function DebitCardsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-slide-in-down">
          Дебетовые карты
        </h1>

        {/* Banner Section */}
        <div className="mb-12 rounded-2xl overflow-hidden animate-fade-in-up shadow-2xl">
          <Image
            src="/placeholder.svg?height=300&width=1200"
            alt="Виртуальные дебетовые карты"
            width={1200}
            height={300}
            className="w-full h-auto hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Cards Showcase */}
        <div className="mb-16 flex justify-center animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <Image
            src="/placeholder.svg?height=400&width=900"
            alt="Дебетовые карты"
            width={900}
            height={400}
            className="w-full max-w-4xl h-auto hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Cards Offers */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Alfa Bank Belarus Card */}
          <div className="bg-[#141414] border border-[#2a2a2a] hover:border-[#9dc21b] rounded-2xl p-8 flex flex-col transition-all duration-500 hover:shadow-[0_0_30px_rgba(157,194,27,0.3)] hover:-translate-y-2 animate-scale-in">
            <h2 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
              Белорусская карта
              <br />
              Альфа-Банка MasterCard World
            </h2>
            <div className="text-[#999] mb-8 leading-relaxed flex-1 space-y-3">
              <p className="transition-colors duration-300 hover:text-white">
                Цифровая карта с поддержкой Apple Pay, без физического носителя. Пополнение с российских карт — комиссия
                1%, выгодный курс конвертации валюты. Комиссия $87 при первом пополнении, далее обслуживание бесплатно.
              </p>
              <p className="text-[#9dc21b] font-medium">Срок оформления: 1–4 дня.</p>
            </div>
            <div className="text-[#9dc21b] font-bold text-2xl mb-6 animate-pulse-subtle">Стоимость: 15.000 ₽</div>
            <button className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-lg hover:scale-105 hover:shadow-lg">
              Заказать карту
            </button>
          </div>

          {/* IBT Tajikistan Card */}
          <div
            className="bg-[#141414] border border-[#2a2a2a] hover:border-[#9dc21b] rounded-2xl p-8 flex flex-col transition-all duration-500 hover:shadow-[0_0_30px_rgba(157,194,27,0.3)] hover:-translate-y-2 animate-scale-in"
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
              Именная премиальная карта банка IBT
              <br />
              Международный Банк Таджикистана
            </h2>
            <div className="text-[#999] mb-8 leading-relaxed flex-1 space-y-3">
              <p className="transition-colors duration-300 hover:text-white">
                Физическая карта для оплаты за границей и в иностранных сервисах. Apple Pay не поддерживается.
              </p>
              <p className="transition-colors duration-300 hover:text-white">
                Пополнение с российских карт — комиссия 1%.
              </p>
              <p className="transition-colors duration-300 hover:text-white">
                Обслуживание: 60 $ за 6 месяцев, далее 5 $/мес.
              </p>
              <p className="transition-colors duration-300 hover:text-white">
                Вывод средств на российские карты через приложение OSON.
              </p>
              <p className="text-[#9dc21b] font-medium">Срок оформления: 14 дней.</p>
            </div>
            <div className="text-[#9dc21b] font-bold text-2xl mb-6 animate-pulse-subtle">Стоимость: 17.000 ₽</div>
            <button className="w-full bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-lg hover:scale-105 hover:shadow-lg">
              Заказать карту
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
