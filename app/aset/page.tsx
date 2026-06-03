'use client'

import { useSessionContext } from '@/lib/session-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAssets } from '@/app/actions/user'
import { AssetList } from '@/components/asset-list'

export default function AsetPage() {
  const router = useRouter()
  const { session, isPending } = useSessionContext()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push('/sign-in')
        return
      }

      loadAssets()
    }
  }, [isPending, router])

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
    <div className="lg:pl-72">
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">Manajemen Aset</h1>
          <p className="text-muted-foreground mt-2 text-lg">Kelola aset dan inventaris organisasi Anda dengan harga perolehan, nilai buku, dan penyusutan</p>
        </div>

        <AssetList assets={assets} userRole={session.user.role} />
      </div>
    </div>
  )
}
