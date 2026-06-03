'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAsset, updateAsset } from '@/app/actions/user'

interface Asset {
  id: string
  name: string
  category: string
  value: number
  condition: string
  location: string
  purchaseDate: string
  notes: string | null
}

interface AssetFormProps {
  asset?: Asset
  onSuccess: () => void
  userRole: string
}

export function AssetForm({ asset, onSuccess, userRole }: AssetFormProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    category: asset?.category || '',
    value: asset?.value.toString() || '',
    condition: asset?.condition || '',
    location: asset?.location || '',
    purchaseDate: asset?.purchaseDate || '',
    notes: asset?.notes || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userId = session?.user?.id
      if (!userId) throw new Error('User not authenticated')

      if (asset) {
        if (userRole === 'viewer') {
          throw new Error('Viewers cannot edit assets')
        }
        await updateAsset(userId, asset.id, {
          name: formData.name,
          category: formData.category,
          value: Number(formData.value),
          condition: formData.condition,
          location: formData.location,
          purchaseDate: formData.purchaseDate,
          notes: formData.notes,
        }, userRole)
      } else {
        await createAsset(userId, {
          name: formData.name,
          category: formData.category,
          value: Number(formData.value),
          condition: formData.condition,
          location: formData.location,
          purchaseDate: formData.purchaseDate,
          notes: formData.notes,
        })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 rounded bg-red-50 text-red-800">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Asset Name *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Office Desk"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select category</option>
            <option value="furniture">Furniture</option>
            <option value="electronics">Electronics</option>
            <option value="vehicle">Vehicle</option>
            <option value="equipment">Equipment</option>
            <option value="building">Building</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Value (IDR) *</label>
          <Input
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Condition *</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Office Building A"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purchase Date *</label>
          <Input
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this asset"
          className="w-full border rounded-md px-3 py-2 min-h-24"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
      </Button>
    </form>
  )
}
