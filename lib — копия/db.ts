export interface User {
  id: string
  email: string
  telegram?: string
  telegram_username?: string
  telegram_user_id?: string
  phone?: string
  password: string
  role: "user" | "admin"
  email_verified_at?: number
  kyc_status: "pending" | "approved" | "rejected" | "none"
  kyc_note?: string
  kyc_rejection_reason?: string
  last_login_at?: number
  createdAt: Date
  created_at: number
}

export interface KYCDocument {
  id: string
  user_id: string
  type: "passport" | "selfie" | "address"
  url: string
  hash?: string
  created_at: number
}

export interface Order {
  id: string
  user_id: string
  from_currency: string
  to_currency: string
  from_amount: string
  to_amount: string
  status: "pending" | "completed" | "failed"
  created_at: number
}

export interface RateLimitEntry {
  ip: string
  country: string
  last_request: number
  timestamp: number
}

// In-memory storage
export const users: User[] = []
export const kycDocuments: KYCDocument[] = []
export const orders: Order[] = []
export const rateLimitEntries: RateLimitEntry[] = []

const defaultAdmin: User = {
  id: "admin-001",
  email: "admin@litecrypto.com",
  password: "$2a$10$YourHashedPasswordHere", // In production, hash this properly
  role: "admin",
  kyc_status: "approved",
  email_verified_at: Math.floor(Date.now() / 1000),
  last_login_at: Math.floor(Date.now() / 1000),
  createdAt: new Date(),
  created_at: Math.floor(Date.now() / 1000),
}
users.push(defaultAdmin)

export const db = {
  users: {
    create: async (data: Omit<User, "id" | "createdAt" | "created_at">): Promise<User> => {
      const now = Date.now()
      const user: User = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(now),
        created_at: Math.floor(now / 1000),
      }
      users.push(user)
      return user
    },

    findByEmail: async (email: string): Promise<User | undefined> => {
      return users.find((u) => u.email === email)
    },

    findById: async (id: string): Promise<User | undefined> => {
      return users.find((u) => u.id === id)
    },

    getAll: async (): Promise<User[]> => {
      return users
    },

    update: async (id: string, data: Partial<User>): Promise<User | undefined> => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) return undefined
      users[index] = { ...users[index], ...data }
      return users[index]
    },
  },

  kyc: {
    create: async (data: Omit<KYCDocument, "id" | "created_at">): Promise<KYCDocument> => {
      const doc: KYCDocument = {
        id: crypto.randomUUID(),
        ...data,
        created_at: Math.floor(Date.now() / 1000),
      }
      kycDocuments.push(doc)
      return doc
    },

    findByUserId: async (userId: string): Promise<KYCDocument[]> => {
      return kycDocuments.filter((d) => d.user_id === userId)
    },
  },

  orders: {
    create: async (data: Omit<Order, "id" | "created_at">): Promise<Order> => {
      const order: Order = {
        id: crypto.randomUUID(),
        ...data,
        created_at: Math.floor(Date.now() / 1000),
      }
      orders.push(order)
      return order
    },

    findByUserId: async (userId: string): Promise<Order[]> => {
      return orders.filter((o) => o.user_id === userId).slice(0, 10)
    },
  },

  rateLimit: {
    getAll: async (): Promise<RateLimitEntry[]> => {
      return rateLimitEntries
    },

    add: async (entry: RateLimitEntry): Promise<void> => {
      rateLimitEntries.push(entry)
    },
  },
}
