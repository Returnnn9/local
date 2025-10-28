import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const adminUser = await db.users.findById(payload.id)

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = request.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const user = await db.users.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const docs = await db.kyc.findByUserId(userId)
    const orders = await db.orders.findByUserId(userId)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        telegram_username: user.telegram_username,
        telegram_user_id: user.telegram_user_id,
        email_verified_at: user.email_verified_at,
        kyc_status: user.kyc_status,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
      docs,
      orders,
    })
  } catch (error) {
    console.error("[v0] Admin user detail error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
