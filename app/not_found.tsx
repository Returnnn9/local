"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/hooks/use-translation"
import NotFoundIcon from "@/icons/404.svg"

const notFoundTexts = {
  title: {
    ru: "Страница не найдена",
    en: "Page not found",
  },
  desc: {
    ru: "Такой страницы не существует или она была удалена.",
    en: "This page does not exist or has been removed.",
  },
  toMain: {
    ru: "Назад на главную",
    en: "Back to main",
  },
}

export default function NotFoundPage() {
  const { language } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="bg-[#141414] rounded-2xl p-10 border border-[#2a2a2a] flex flex-col items-center max-w-lg w-full">
          <div className="mb-6 flex flex-col items-center">
            <img
              src={NotFoundIcon.src ? NotFoundIcon.src : NotFoundIcon}
              alt="404"
              className="w-24 h-24 mb-4 object-contain"
              draggable={false}
            />
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#9dc21b] drop-shadow mb-2">404</h1>
            <h2 className="text-xl font-bold mb-1 text-center">
              {notFoundTexts.title[language] ?? notFoundTexts.title.ru}
            </h2>
            <p className="text-[#888] text-center">
              {notFoundTexts.desc[language] ?? notFoundTexts.desc.ru}
            </p>
          </div>
          <a
            href="/"
            className="mt-6 w-full inline-block bg-[#9dc21b] hover:bg-[#8ab019] text-black font-semibold py-4 px-6 rounded-xl text-center transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-[#9dc21b]"
          >
            {notFoundTexts.toMain[language] ?? notFoundTexts.toMain.ru}
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
