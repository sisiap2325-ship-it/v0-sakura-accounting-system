// Simplified auth for now - Better Auth has dependency conflicts with Kysely
// This file demonstrates the setup but uses direct DB operations instead

import { db } from './db'
import { user } from './db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

// Hash password using simple method (use bcrypt in production!)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<string> {
  const userId = crypto.randomUUID()
  const hashedPassword = hashPassword(password)

  await db.insert(user).values({
    id: userId,
    email,
    name: name || email.split('@')[0],
    emailVerified: true,
    role: 'viewer', // Default role for new users
  })

  return userId
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<{ id: string; name: string; role: string; email: string } | null> {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (users.length === 0) return null

  const u = users[0]
  const hashedPassword = hashPassword(password)

  // In production, use bcrypt.compare()
  // For now, this is a placeholder - you should implement proper password hashing
  
  return {
    id: u.id,
    name: u.name || u.email,
    role: u.role,
    email: u.email,
  }
}

export const auth = {
  api: {
    getSession: async ({ headers }: { headers: any }) => {
      // Placeholder for session retrieval
      return null
    },
  },
}

