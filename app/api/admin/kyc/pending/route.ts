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

    const user = await db.users.findById(payload.id)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const allUsers = await db.users.getAll()
    const pending = allUsers
      .filter((u) => u.kyc_status === "pending")
      .map((u) => ({
        id: u.id,
        email: u.email,
        telegram_username: u.telegram_username,
        created_at: u.created_at,
      }))

    return NextResponse.json({ pending })
  } catch (error) {
    console.error("[v0] Admin KYC pending error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
