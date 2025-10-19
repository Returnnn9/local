import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, hashPassword, verifyPassword } from "@/lib/auth"
import { users } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userPayload = await verifyToken(token)

    if (!userPayload) {
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Новый пароль должен содержать минимум 8 символов" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.id === userPayload.id)
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 })
    }

    // Update password
    user.password = await hashPassword(newPassword)

    return NextResponse.json({
      ok: true,
      message: "Пароль успешно обновлён",
    })
  } catch (error) {
    console.error("[v0] Change password error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
