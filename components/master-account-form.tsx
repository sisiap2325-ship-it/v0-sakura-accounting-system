'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createIncomeAccount,
  createExpenseAccount,
} from '@/app/actions/master'

interface MasterAccountFormProps {
  type: 'income' | 'expense'
  userId: string
  categories: Array<{ id: string; name: string }>
  onSuccess?: () => void
}

export function MasterAccountForm({
  type,
  userId,
  categories,
  onSuccess,
}: MasterAccountFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accountNumber: '',
    categoryId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (type === 'income') {
        await createIncomeAccount(userId, formData)
      } else {
        await createExpenseAccount(userId, formData)
      }

      setFormData({
        name: '',
        description: '',
        accountNumber: '',
        categoryId: '',
      })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nama Akun
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: Penjualan Produk A"
          required
        />
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">
          Nomor Akun
        </label>
        <Input
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Contoh: 4-1-001"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
          Kategori
        </label>
        {categories.length > 0 ? (
          <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-2 bg-yellow-50 text-yellow-700 text-sm rounded">
            Belum ada kategori. Silakan buat kategori terlebih dahulu di Master Kategori.
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Deskripsi
        </label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Deskripsi akun (opsional)"
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Menyimpan...' : 'Tambah Akun'}
      </Button>
    </form>
  )
}
