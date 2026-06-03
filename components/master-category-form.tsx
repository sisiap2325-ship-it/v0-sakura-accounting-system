'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  createIncomeCategory,
  createExpenseCategory,
} from '@/app/actions/master'

interface MasterCategoryFormProps {
  type: 'income' | 'expense'
  userId: string
  onSuccess?: () => void
}

export function MasterCategoryForm({ type, userId, onSuccess }: MasterCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (type === 'income') {
        await createIncomeCategory(userId, formData)
      } else {
        await createExpenseCategory(userId, formData)
      }

      setFormData({ name: '', description: '', code: '' })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nama Kategori
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Contoh: Penjualan Produk"
        />
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Kode Kategori
        </label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Contoh: PENJUAL01"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Deskripsi
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Deskripsi kategori..."
          rows={3}
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Menyimpan...' : 'Simpan Kategori'}
      </Button>
    </form>
  )
}
