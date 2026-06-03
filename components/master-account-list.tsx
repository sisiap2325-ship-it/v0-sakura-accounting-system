'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2 } from 'lucide-react'
import {
  deleteIncomeAccount,
  deleteExpenseAccount,
  updateIncomeAccount,
  updateExpenseAccount,
} from '@/app/actions/master'

interface Account {
  id: string
  name: string
  description?: string
  accountNumber?: string
  categoryId?: string
  createdAt?: Date
}

interface MasterAccountListProps {
  accounts: Account[]
  type: 'income' | 'expense'
  userId: string
  categories: Array<{ id: string; name: string }>
  onDelete?: () => void
}

export function MasterAccountList({
  accounts,
  type,
  userId,
  onDelete,
}: MasterAccountListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, Account>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEdit = (account: Account) => {
    setEditingId(account.id)
    setEditData((prev) => ({ ...prev, [account.id]: account }))
  }

  const handleSaveEdit = async (accountId: string) => {
    setError('')
    setLoading(true)

    try {
      const updated = editData[accountId]
      if (type === 'income') {
        await updateIncomeAccount(userId, accountId, {
          name: updated.name,
          description: updated.description,
          accountNumber: updated.accountNumber,
          categoryId: updated.categoryId,
        })
      } else {
        await updateExpenseAccount(userId, accountId, {
          name: updated.name,
          description: updated.description,
          accountNumber: updated.accountNumber,
          categoryId: updated.categoryId,
        })
      }

      setEditingId(null)
      onDelete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (accountId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun ini?')) return

    setError('')
    setLoading(true)

    try {
      if (type === 'income') {
        await deleteIncomeAccount(userId, accountId)
      } else {
        await deleteExpenseAccount(userId, accountId)
      }
      onDelete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (accountId: string, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]: value,
      },
    }))
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada akun. Silakan tambahkan akun baru.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>
      )}

      {accounts.map((account) => (
        <Card key={account.id}>
          <CardContent className="pt-6">
            {editingId === account.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Akun</label>
                  <Input
                    value={editData[account.id]?.name || ''}
                    onChange={(e) =>
                      handleChange(account.id, 'name', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nomor Akun</label>
                  <Input
                    value={editData[account.id]?.accountNumber || ''}
                    onChange={(e) =>
                      handleChange(account.id, 'accountNumber', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <Input
                    value={editData[account.id]?.description || ''}
                    onChange={(e) =>
                      handleChange(account.id, 'description', e.target.value)
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSaveEdit(account.id)}
                    disabled={loading}
                    size="sm"
                  >
                    Simpan
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{account.name}</h4>
                  {account.accountNumber && (
                    <p className="text-sm text-muted-foreground">
                      No. Akun: {account.accountNumber}
                    </p>
                  )}
                  {account.description && (
                    <p className="text-sm text-muted-foreground">{account.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(account)}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(account.id)}
                    variant="destructive"
                    size="sm"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
