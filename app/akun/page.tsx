'use client'

import { useSessionContext } from '@/lib/session-context'
import { Sidebar } from '@/components/sidebar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AccountPageClient } from '@/components/account-page-client'

export default function AkunPage() {
  const router = useRouter()
  const { session, isPending } = useSessionContext()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [isPending, router])

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
    <>
      <Sidebar />
      <div className="lg:pl-72">
        <div className="p-4 lg:p-8">
          <AccountPageClient
            user={{
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: session.user.role,
            }}
          />
        </div>
      </div>
    </>
  )
}
