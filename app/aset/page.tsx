'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAssets } from '@/app/actions/user'
import { AssetList } from '@/components/asset-list'

export default function AsetPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
      return
    }

    if (session?.user) {
      loadAssets()
    }
  }, [session?.user, isPending, router])

  const loadAssets = async () => {
    try {
      const data = await getAssets()
      setAssets(data as any)
    } catch (error) {
      console.error('Failed to load assets:', error)
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
        <h1 className="text-3xl font-bold">Asset Management</h1>
        <p className="text-gray-600 mt-2">Manage your organization&apos;s assets and inventory</p>
      </div>

      <AssetList assets={assets} userRole={session.user.role} />
    </div>
  )
}
