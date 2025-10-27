"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ExchangeRequest {
  id: string
  type: "buy" | "sell"
  giveAmount: string
  receiveAmount: string
  giveBank: string
  receiveCrypto: string
  cardNumber: string
  wallet: string
  rate: number | null
  createdAt: string
}

const stepInfos = [
  {
    label: "Обработка",
    desc: "⏳ Ваша заявка обрабатывается...",
    color: "#999"
  },
  {
    label: "Проверка",
    desc: "🔍 Проверяем данные и совершаем обмен...",
    color: "#9dc21b"
  },
  {
    label: "Завершено",
    desc: "✅ Обмен успешно завершён!",
    color: "text-green-400"
  }
] as const

const stepIcons = [
  (
    <svg key="spinning" className="inline w-6 h-6 animate-spin" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#9dc21b" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="30"/>
    </svg>
  ),
  (
    <svg key="magnifier" className="inline w-6 h-6 animate-bounce" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="#9dc21b" strokeWidth="2" fill="none"/>
      <line x1="16" y1="16" x2="21" y2="21" stroke="#9dc21b" strokeWidth="2" />
    </svg>
  ),
  (
    <svg key="check" className="inline w-6 h-6" viewBox="0 0 24 24">
      <polyline points="4,14 10,20 20,6" stroke="#2ecc40" strokeWidth="3" fill="none"/>
    </svg>
  )
] as const

const progressVariants = {
  processing: { width: "33%" },
  verifying: { width: "66%" },
  completed: { width: "100%" }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.98, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.18, 0.67, 0.6, 1.22] } },
  exit: { opacity: 0, scale: 0.98, y: -30 }
}

export default function ExchangePage() {
  const params = useSearchParams()
  const router = useRouter()
  const requestId = params.get("request")

  const [request, setRequest] = useState<ExchangeRequest | null>(null)
  const [status, setStatus] = useState<"processing" | "verifying" | "completed">("processing")
  const [activeStep, setActiveStep] = useState(0)
  const [showGlow, setShowGlow] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!requestId) return
    const data = sessionStorage.getItem(`exchange_${requestId}`)
    if (!data) {
      router.push("/")
      return
    }
    const parsed = JSON.parse(data)
    setRequest(parsed)

    // симуляция этапов обмена
    const steps = ["processing", "verifying", "completed"] as const
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      if (i < steps.length) {
        setStatus(steps[i])
        setActiveStep(i)
        if (i === 2) {
          setTimeout(() => setShowGlow(true), 900) // немного задержки для свечения "Успех"
        }
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [requestId, router])

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block animate-pulse text-xl">Загрузка заявки...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <AnimatePresence>
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            key={status}
            className="relative bg-gradient-to-br from-[#181c08] via-[#141414] to-[#222d19] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl overflow-hidden"
          >
            {showGlow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="pointer-events-none absolute -inset-2 z-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#cfff60dd] via-[#cfff6080] to-transparent blur-2xl"
              ></motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.5 }}
              className="relative z-10 text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#bcf527] via-[#76c722] to-[#477c13] bg-clip-text text-transparent drop-shadow"
            >
              Заявка #{request.id.slice(0, 8)}
            </motion.h1>

            {/* Данные заявки с анимацией */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.045 }
                }
              }}
              className="space-y-3 text-sm text-[#ccc] mb-8"
            >
              {[
                { label: "Тип операции", value: request.type === "buy" ? "Купить" : "Продать", animColor: "#bcf527" },
                { label: "Отдаёте", value: `${request.giveAmount} ₽ (${request.giveBank})`, animColor: "#bbdc60" },
                { label: "Получаете", value: `${request.receiveAmount} ${request.receiveCrypto}`, animColor: "#7fd180" },
                { label: "Карта", value: request.cardNumber, animColor: "#ffe081" },
                { label: "Кошелёк", value: request.wallet, animColor: "#74c3e9" },
                { label: "Курс", value: request.rate ? `${request.rate.toFixed(2)} ₽` : "—", animColor: "#9dc21b" },
                { label: "Создано", value: new Date(request.createdAt).toLocaleString(), animColor: "#999999" }
              ].map((item, idx) => (
                <motion.p
                  key={item.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.10 }}
                  className="flex items-center gap-1"
                >
                  <span className="">{item.label}:</span>{" "}
                  <span
                    className={`text-white font-semibold`}
                    style={
                      idx === 5
                        ? { color: "#9dc21b" }
                        : idx === 6
                        ? { color: "#999" }
                        : {}
                    }
                  >
                    {item.value}
                  </span>
                </motion.p>
              ))}
            </motion.div>

            {/* Прогресс обмена - с анимацией шагов */}
            <div className="mb-7">
              <h2 className="text-lg font-semibold mb-4 text-center text-[#8cc52d] tracking-wider">Статус обмена</h2>
              <div className="relative flex justify-between text-xs uppercase tracking-widest text-[#777] mb-2 z-10">
                {stepInfos.map((step, idx) => (
                  <motion.div
                    key={step.label}
                    className="flex flex-col items-center w-1/3"
                    initial={false}
                    animate={{
                      color: activeStep === idx
                        ? "#9dc21b"
                        : activeStep > idx
                        ? "#6fb550"
                        : "#555"
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: activeStep === idx ? 1.15 : 1,
                        filter:
                          activeStep === idx
                            ? "drop-shadow(0 0 12px #befc3a88)"
                            : "none"
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 13 }}
                      className="mb-1"
                    >
                      {stepIcons[idx]}
                    </motion.div>
                    <span className="font-medium transition-colors duration-300">{step.label}</span>
                  </motion.div>
                ))}
              </div>
              {/* Animated progress bar */}
              <div className="relative w-full h-3 rounded-full overflow-hidden bg-[#232b1c] shadow-sm mb-2">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#bcf527] via-[#96de4a] to-[#76c722]"
                  variants={progressVariants}
                  animate={status}
                  transition={{ duration: 0.6, type: "tween" }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-full pointer-events-none"
                  animate={{
                    opacity: status === "completed" ? 0.18 : 0,
                    background:
                      status === "completed"
                        ? "repeating-linear-gradient(-45deg,#bcf52740 0 10px,#477c1360 10px 20px)"
                        : "transparent"
                  }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Animated описание этапа */}
            <div className="text-center mt-10 min-h-[40px] flex justify-center items-center relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {status === "processing" && (
                    <span className="text-[#999] text-lg block">
                      {stepInfos[0].desc}
                    </span>
                  )}
                  {status === "verifying" && (
                    <span className="text-[#9dc21b] text-lg block drop-shadow">
                      {stepInfos[1].desc}
                    </span>
                  )}
                  {status === "completed" && (
                    <span className="text-green-400 font-semibold text-lg block drop-shadow-lg animate-glow">
                      {stepInfos[2].desc}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7, type: "spring", bounce: 0.35 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 0 0 #bcf52788,0 0 10px 2px #9dc21b42"
            }}
            whileTap={{
              scale: 0.94,
              backgroundColor: "#bbdc60"
            }}
            onClick={() => router.push("/")}
            className="relative bg-[#9dc21b] hover:bg-[#8ab019] active:bg-[#bbdc60] text-black font-semibold py-3 px-7 rounded-xl transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-[#bcf52755] text-lg"
          >
            На главную
          </motion.button>
        </motion.div>
      </main>
      <Footer />
      <style>{`
      @keyframes glow {
        0% { text-shadow: 0 0 10px #a8ec2f, 0 0 20px #bcf52740;}
        60% { text-shadow: 0 0 24px #98e82e, 0 0 70px #bcf52788;}
        100% { text-shadow: 0 0 12px #98e82e, 0 0 40px #bcf52744;}
      }
      .animate-glow {
        animation: glow 2s cubic-bezier(.21,1.16,.73,1.01) 1;
      }
      `}</style>
    </div>
  )
}
