'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUsers } from '@/app/actions/user'
import { UserManagement } from '@/components/user-management'

export default function PengaturanPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (session?.user) {
      loadUsers()
    }
  }, [session?.user, isPending, router])

  const loadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data as any)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isPending || loading) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage users and system settings</p>
      </div>

      <UserManagement users={users} />
    </div>
  )
}
