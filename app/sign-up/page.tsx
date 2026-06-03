'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AuthForm } from '@/components/auth-form'

export default function SignUpPage() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
  }, [session, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthForm mode="sign-up" />
    </div>
  )
}
