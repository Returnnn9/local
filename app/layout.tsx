import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata: Metadata = {
  title: "LiteCrypto — Обмен криптовалюты",
  description: "Безопасный и быстрый обмен криптовалюты на рубли. Покупка и продажа BTC, USDT, ETH по лучшим курсам.",
  keywords: "обмен криптовалюты, купить биткоин, продать USDT, криптообменник, BTC в рубли",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
