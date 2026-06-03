import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return hashPassword(plainPassword) === hashedPassword
}

export async function POST(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname
    const body = await req.json()

  // Sign up endpoint
  if (path.includes('/auth/signup')) {
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }

    // Check if user exists
    const existing = await db.select().from(user).where(eq(user.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = crypto.randomUUID()
    const hashedPassword = hashPassword(password)

    try {
      await db.insert(user).values({
        id: userId,
        email,
        name: name || email.split('@')[0],
        emailVerified: true,
        role: 'viewer',
      })

      // Store password in account table
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: email,
        providerId: 'email',
        userId,
        password: hashedPassword,
      })

      const token = crypto.randomUUID()
      return NextResponse.json({
        user: {
          id: userId,
          email,
          name: name || email.split('@')[0],
          role: 'viewer',
        },
        token,
      })
    } catch (error) {
      console.error('Signup error:', error)
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 })
    }
  }

  // Sign in endpoint
  if (path.includes('/auth/signin')) {
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }

    try {
      const users = await db.select().from(user).where(eq(user.email, email)).limit(1)
      if (users.length === 0) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      }

      const u = users[0]
      
      // Verify password from account table
      const accounts = await db.select().from(account).where(eq(account.userId, u.id)).limit(1)
      if (accounts.length === 0 || !verifyPassword(password, accounts[0].password || '')) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      }

      const token = crypto.randomUUID()

      return NextResponse.json({
        user: {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
        },
        token,
      })
    } catch (error) {
      console.error('Signin error:', error)
      return NextResponse.json({ message: 'Sign in failed' }, { status: 500 })
    }
  }

    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
