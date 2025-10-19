import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }

    // Find user
    const user = await db.users.findByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    await db.users.update(user.id, {
      last_login_at: Math.floor(Date.now() / 1000),
    })

    const token = await generateToken({
      userId: user.id,
      id: user.id,
      email: user.email,
      telegram: user.telegram,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      message: "Вход выполнен успешно",
      token,
      user: {
        id: user.id,
        email: user.email,
        telegram: user.telegram,
        role: user.role,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
