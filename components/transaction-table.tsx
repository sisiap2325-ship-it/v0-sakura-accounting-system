'use client'

import { Transaction, getCategoryLabel } from '@/lib/types'
import { formatCurrency, formatDate, deleteTransaction } from '@/lib/store'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  onDelete?: () => void
  showActions?: boolean
}

export function TransactionTable({ transactions, onDelete, showActions = true }: TransactionTableProps) {
  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      deleteTransaction(id)
      onDelete?.()
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Belum ada transaksi</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tanggal</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kategori</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Keterangan</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Jumlah</th>
            {showActions && (
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4 text-sm text-foreground">
                {formatDate(transaction.date)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'p-1.5 rounded-lg',
                    transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                  )}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {transaction.description}
              </td>
              <td className={cn(
                'py-3 px-4 text-sm font-medium text-right font-mono',
                transaction.type === 'income' ? 'text-success' : 'text-destructive'
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </td>
              {showActions && (
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                    title="Hapus transaksi"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
