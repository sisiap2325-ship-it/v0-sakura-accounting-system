'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, ArrowDown, ArrowUp, Calendar } from 'lucide-react'
import {
  deleteIncomeCategory,
  deleteExpenseCategory,
} from '@/app/actions/master'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  code?: string
  description?: string
  createdAt: string
}

interface MasterCategoryListProps {
  categories: Category[]
  type: 'income' | 'expense'
  userId: string
  onDelete?: () => void
}

export function MasterCategoryList({
  categories,
  type,
  userId,
  onDelete,
}: MasterCategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      if (type === 'income') {
        await deleteIncomeCategory(userId, id)
      } else {
        await deleteExpenseCategory(userId, id)
      }
      onDelete?.()
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
          {type === 'income' ? (
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ArrowUp className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <p className="text-muted-foreground">
          Belum ada kategori {type === 'income' ? 'pemasukan' : 'pengeluaran'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <Card
            key={category.id}
            className={cn(
              'p-4 border border-border hover:shadow-md transition-all duration-200',
              'bg-card hover:bg-card/80'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Number Badge & Content */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    type === 'income'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  )}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    {category.code && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        ID: {category.code}
                      </Badge>
                    )}
                  </div>

                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(category.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(category.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori ini akan dihapus secara permanen. Semua transaksi yang menggunakan kategori ini akan terpengaruh. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
