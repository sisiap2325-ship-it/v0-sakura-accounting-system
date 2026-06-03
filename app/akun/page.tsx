'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AccountPageClient } from '@/components/account-page-client'

export default function AkunPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [session?.user, isPending, router])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="container py-8">
      <AccountPageClient
        user={{
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        }}
      />
    </div>
  )
}
