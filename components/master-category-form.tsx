'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
  })
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>(type)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        setError('Nama kategori tidak boleh kosong')
        setLoading(false)
        return
      }

      if (categoryType === 'income') {
        await createIncomeCategory(userId, formData)
      } else {
        await createExpenseCategory(userId, formData)
      }

      setFormData({ name: '', description: '', code: '' })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat kategori')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: '', description: '', code: '' })
      setError('')
      setCategoryType(type)
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            Tambah Kategori
          </DialogTitle>
          <DialogDescription className="text-sm">
            Tambahkan kategori pemasukan atau pengeluaran baru untuk sistem akuntansi Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Nama Kategori */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nama Kategori <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Tiket Masuk, Gaji Karyawan"
              className="border-border focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          {/* Tipe Kategori */}
          <div className="space-y-3 pb-2">
            <Label className="text-sm font-semibold text-foreground">Tipe Kategori</Label>
            <RadioGroup value={categoryType} onValueChange={(value) => setCategoryType(value as 'income' | 'expense')}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                  <span className="text-lg">⬇️</span>
                  <span className="text-foreground">Pemasukan</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                  <span className="text-lg">⬆️</span>
                  <span className="text-foreground">Pengeluaran</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Kode Kategori */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-semibold text-foreground">
              Kode Kategori <span className="text-muted-foreground">(Opsional)</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Contoh: CAT001, EXP02"
              className="border-border focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Deskripsi <span className="text-muted-foreground">(Opsional)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail kategori ini..."
              rows={3}
              className="border-border focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
