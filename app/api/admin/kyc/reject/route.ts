import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { userId, reason, note } = body

    if (!userId || !reason) {
      return NextResponse.json({ error: "User ID and reason required" }, { status: 400 })
    }

    await db.users.update(userId, {
      kyc_status: "rejected",
      kyc_rejection_reason: reason,
      kyc_note: note || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Admin reject KYC error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
