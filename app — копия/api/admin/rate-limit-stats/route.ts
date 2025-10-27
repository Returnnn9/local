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

    const entries = await db.rateLimit.getAll()
    const now = Math.floor(Date.now() / 1000)
    const oneDayAgo = now - 86400
    const oneWeekAgo = now - 604800

    const activeToday = entries.filter((e) => e.last_request >= oneDayAgo).length
    const activeThisWeek = entries.filter((e) => e.last_request >= oneWeekAgo).length

    // Count by country
    const countryCounts: Record<string, number> = {}
    entries.forEach((e) => {
      countryCounts[e.country] = (countryCounts[e.country] || 0) + 1
    })

    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce(
        (acc, [country, count]) => {
          acc[country] = count
          return acc
        },
        {} as Record<string, number>,
      )

    return NextResponse.json({
      total_ips: entries.length,
      active_today: activeToday,
      active_this_week: activeThisWeek,
      last_cleanup: entries.length > 0 ? new Date().toLocaleString("ru-RU") : null,
      top_countries: topCountries,
      files: entries.map((e) => ({
        ip: e.ip,
        country: e.country,
        last_request: e.last_request,
        last_request_formatted: new Date(e.last_request * 1000).toLocaleString("ru-RU"),
        timestamp: e.timestamp,
      })),
    })
  } catch (error) {
    console.error("[v0] Admin rate limit stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
