'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MasterCategoryForm } from '@/components/master-category-form'
import { MasterCategoryList } from '@/components/master-category-list'
import { getIncomeCategories, getExpenseCategories } from '@/app/actions/master'

export default function MasterKategoriPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [incomeCategories, setIncomeCategories] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('income')

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
      return
    }

    // Only admin can access
    if (session?.user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (session?.user) {
      loadCategories()
    }
  }, [session?.user, isPending, router])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const [income, expense] = await Promise.all([
        getIncomeCategories(session.user.id),
        getExpenseCategories(session.user.id),
      ])
      setIncomeCategories(income as any)
      setExpenseCategories(expense as any)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Master Kategori</h1>
        <p className="text-gray-600 mt-2">Kelola kategori pemasukan dan pengeluaran</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="income">Kategori Pemasukan</TabsTrigger>
          <TabsTrigger value="expense">Kategori Pengeluaran</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Kategori Pemasukan</CardTitle>
              <CardDescription>Buat kategori pemasukan baru untuk sistem keuangan</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterCategoryForm
                type="income"
                userId={session.user.id}
                onSuccess={loadCategories}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori Pemasukan</CardTitle>
              <CardDescription>Kelola kategori pemasukan yang sudah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterCategoryList
                categories={incomeCategories}
                type="income"
                userId={session.user.id}
                onDelete={loadCategories}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Kategori Pengeluaran</CardTitle>
              <CardDescription>Buat kategori pengeluaran baru untuk sistem keuangan</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterCategoryForm
                type="expense"
                userId={session.user.id}
                onSuccess={loadCategories}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori Pengeluaran</CardTitle>
              <CardDescription>Kelola kategori pengeluaran yang sudah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterCategoryList
                categories={expenseCategories}
                type="expense"
                userId={session.user.id}
                onDelete={loadCategories}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
