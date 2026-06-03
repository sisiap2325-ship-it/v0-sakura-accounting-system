'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetForm } from '@/components/asset-form'
import { deleteAsset } from '@/app/actions/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'

interface Asset {
  id: string
  name: string
  category: string
  value: number
  acquisitionCost: number
  bookValue: number
  depreciation: number
  depreciationRate: number
  depreciationMethod: string
  condition: string
  location: string
  purchaseDate: string
  notes: string | null
}

interface AssetListProps {
  assets: Asset[]
  userRole: string
}

export function AssetList({ assets: initialAssets, userRole }: AssetListProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDeleteAsset = async (id: string) => {
    setLoading(true)
    try {
      await deleteAsset(session?.user?.id || '', id, userRole)
      router.refresh()
      setDeleteId(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete asset')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingId(null)
    router.refresh()
  }

  const canEdit = userRole !== 'viewer'

  return (
    <div className="space-y-6">
      {/* Create Asset Form */}
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
            <CardDescription>Register a new asset to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <Button onClick={() => setShowForm(true)}>+ Add Asset</Button>
            ) : (
              <div>
                <AssetForm onSuccess={handleFormSuccess} userRole={userRole} />
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="mt-4 w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets ({initialAssets.length})</CardTitle>
          <CardDescription>All registered assets in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          {initialAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assets registered yet. {canEdit && 'Add one above to get started.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Nama Aset</th>
                    <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                    <th className="text-left py-3 px-4 font-semibold">Harga Perolehan</th>
                    <th className="text-left py-3 px-4 font-semibold">Nilai Buku</th>
                    <th className="text-left py-3 px-4 font-semibold">Penyusutan</th>
                    <th className="text-left py-3 px-4 font-semibold">Tarif (%/th)</th>
                    <th className="text-left py-3 px-4 font-semibold">Kondisi</th>
                    <th className="text-left py-3 px-4 font-semibold">Lokasi</th>
                    {canEdit && (
                      <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {initialAssets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{asset.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {asset.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">Rp {asset.acquisitionCost.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-right">Rp {asset.bookValue.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-right">Rp {asset.depreciation.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-center">{asset.depreciationRate}%</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                            asset.condition === 'excellent'
                              ? 'bg-green-100 text-green-800'
                              : asset.condition === 'good'
                                ? 'bg-blue-100 text-blue-800'
                                : asset.condition === 'fair'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {asset.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4">{asset.location}</td>
                      {canEdit && (
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Pencil className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Asset</DialogTitle>
                                </DialogHeader>
                                <AssetForm
                                  asset={asset}
                                  onSuccess={handleFormSuccess}
                                  userRole={userRole}
                                />
                              </DialogContent>
                            </Dialog>

                            {userRole === 'admin' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteId(asset.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Aset?</AlertDialogTitle>
            <AlertDialogDescription>
              Aset ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteAsset(deleteId)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
