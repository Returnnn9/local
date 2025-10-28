import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, telegram } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 8 символов" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.users.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    const user = await db.users.create({
      email,
      password: hashedPassword,
      telegram: telegram || undefined,
      role: "user",
      kyc_status: "none",
    })

    const token = await generateToken({
      userId: user.id,
      id: user.id,
      email: user.email,
      telegram: user.telegram,
      role: user.role,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: "Регистрация успешна",
        token,
        user: {
          id: user.id,
          email: user.email,
          telegram: user.telegram,
          role: user.role,
        },
      },
      { status: 201 },
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
