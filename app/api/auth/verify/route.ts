import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Токен не предоставлен" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 })
    }

    // Get user from database
    const user = await db.users.findById(payload.id)
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        telegram: user.telegram,
      },
    })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
