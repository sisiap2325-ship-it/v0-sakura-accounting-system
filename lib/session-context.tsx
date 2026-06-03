'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'viewer'
}

export interface Session {
  user: User
  token: string
}

interface SessionContextType {
  session: Session | null
  isPending: boolean
  setSession: (session: Session | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    // Load session from localStorage
    const stored = localStorage.getItem('auth_session')
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse session')
      }
    }
    setIsPending(false)

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session') {
        if (e.newValue) {
          try {
            setSession(JSON.parse(e.newValue))
          } catch (err) {
            console.error('Failed to parse session')
          }
        } else {
          setSession(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <SessionContext.Provider value={{ session, isPending, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within SessionProvider')
  }
  return context
}
