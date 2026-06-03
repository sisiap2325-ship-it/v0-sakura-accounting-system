'use client'

import { useState } from 'react'
import { 
  TransactionType, 
  TransactionCategory, 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES 
} from '@/lib/types'
import { addTransaction } from '@/lib/store'
import { X } from 'lucide-react'

interface TransactionFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income')
  const [category, setCategory] = useState<TransactionCategory>('tiket_masuk')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory(newType === 'income' ? 'tiket_masuk' : 'gaji')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      addTransaction({
        type,
        category,
        description,
        amount: parseFloat(amount.replace(/\D/g, '')),
        date
      })
      onSuccess()
      onClose()
    } catch {
      alert('Gagal menyimpan transaksi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return new Intl.NumberFormat('id-ID').format(parseInt(numbers) || 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Tambah Transaksi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Jenis Transaksi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  type === 'income'
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  type === 'expense'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-card-foreground">Tanggal</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-card-foreground">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-card-foreground">Keterangan</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Masukkan keterangan transaksi"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-card-foreground">Jumlah (Rp)</label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(formatAmountInput(e.target.value))}
              required
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-lg"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
