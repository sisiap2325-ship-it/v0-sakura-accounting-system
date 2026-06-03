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
import { Pencil, Trash2 } from 'lucide-react'
import {
  deleteIncomeCategory,
  deleteExpenseCategory,
} from '@/app/actions/master'

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
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada kategori. Buat kategori baru untuk memulai.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{category.name}</h3>
                  {category.code && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {category.code}
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Dibuat: {new Date(category.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteId(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
