// Admin API utilities
export class AdminAPI {
  private static API_BASE = ""
  private static csrfToken: string | null = null

  static async api(path: string, opts: RequestInit = {}) {
    const options = {
      credentials: "include" as RequestCredentials,
      ...opts,
    }

    const res = await fetch(this.API_BASE + path, options)
    if (!res.ok) throw new Error("HTTP " + res.status)

    const ct = res.headers.get("content-type") || ""
    if (ct.includes("application/json")) return res.json()
    return res.text()
  }

  static async getCsrf() {
    const data = await this.api("/backend/api/csrf-token.php")
    this.csrfToken = data.csrf_token
    return this.csrfToken
  }

  static getCsrfFromCookie() {
    const m = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)
    if (!m) return null
    const val = decodeURIComponent(m[1])
    const tok = val.split(".")[0]
    return tok || null
  }

  static async ensureCsrf() {
    const tok = this.getCsrfFromCookie()
    if (tok) {
      this.csrfToken = tok
      return tok
    }
    return await this.getCsrf()
  }

  static async adminPost(path: string, body?: any) {
    const token = await this.ensureCsrf()
    return this.api(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token || "",
      },
      body: JSON.stringify(body || {}),
    })
  }

  static tsToStr(ts: number | null | undefined) {
    if (!ts) return ""
    const d = new Date(ts * 1000)
    return d.toLocaleString("ru-RU")
  }

  static toast(msg: string, ok = true) {
    const el = document.createElement("div")
    el.className = "admin-toast"
    el.style.background = ok ? "#064e3b" : "#7f1d1d"
    el.textContent = msg
    document.body.appendChild(el)

    setTimeout(() => {
      el.style.opacity = "0"
      setTimeout(() => el.remove(), 400)
    }, 1800)
  }
}
