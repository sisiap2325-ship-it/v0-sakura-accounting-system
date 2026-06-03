import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// In-memory user store for development (when DATABASE_URL is not set)
const memoryUsers: Map<string, any> = new Map()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return hashPassword(plainPassword) === hashedPassword
}

async function getDbUsers() {
  try {
    const { db } = await import('@/lib/db')
    const { user } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    return { db, user, eq }
  } catch {
    return null
  }
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

    // Check if user exists in memory
    if (memoryUsers.has(email)) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = crypto.randomUUID()
    const hashedPassword = hashPassword(password)
    const userName = name || email.split('@')[0]
    
    // Store in memory
    memoryUsers.set(email, {
      id: userId,
      email,
      name: userName,
      password: hashedPassword,
      emailVerified: true,
      role: email === 'admin@sakura.com' ? 'admin' : 'viewer',
    })

    const token = crypto.randomUUID()
    return NextResponse.json({
      user: {
        id: userId,
        email,
        name: userName,
        role: email === 'admin@sakura.com' ? 'admin' : 'viewer',
      },
      token,
    })
  }

  // Sign in endpoint
  if (path.includes('/auth/signin')) {
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }

    const u = memoryUsers.get(email)
    if (!u || !verifyPassword(password, u.password)) {
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
