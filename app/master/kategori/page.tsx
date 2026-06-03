'use client'

import { useSessionContext } from '@/lib/session-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MasterCategoryForm } from '@/components/master-category-form'
import { MasterCategoryList } from '@/components/master-category-list'
import { getIncomeCategories, getExpenseCategories } from '@/app/actions/master'

export default function MasterKategoriPage() {
  const router = useRouter()
  const { session, isPending } = useSessionContext()
  const [incomeCategories, setIncomeCategories] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('income')

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push('/sign-in')
        return
      }

      // Only admin can access
      if (session.user.role !== 'admin') {
        router.push('/')
        return
      }

      loadCategories()
    }
  }, [session?.user?.id, session?.user?.role, isPending, router])

  const loadCategories = async () => {
    try {
      setLoading(true)
      // TODO: Connect to database when available
      // For now, use mock data
      setIncomeCategories([
        { id: '1', name: 'Tiket Masuk', code: 'TK001', type: 'income', description: 'Pendapatan dari tiket masuk' },
        { id: '2', name: 'Parkir', code: 'PK001', type: 'income', description: 'Pendapatan dari parkir' },
      ])
      setExpenseCategories([
        { id: '3', name: 'Gaji Karyawan', code: 'GJ001', type: 'expense', description: 'Biaya gaji karyawan' },
        { id: '4', name: 'Listrik & Air', code: 'LA001', type: 'expense', description: 'Biaya listrik dan air' },
      ])
    } catch (error) {
      console.error('Failed to load categories:', error)
      // Use mock data on error
      setIncomeCategories([])
      setExpenseCategories([])
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

  if (isPending || !session?.user) return null

  return (
    <div className="lg:pl-72">
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">Master Kategori</h1>
          <p className="text-muted-foreground mt-2 text-lg">Kelola kategori pemasukan dan pengeluaran</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="income" className="text-base">Pemasukan</TabsTrigger>
            <TabsTrigger value="expense" className="text-base">Pengeluaran</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl">Tambah Kategori</CardTitle>
                  <CardDescription>Buat kategori pemasukan baru</CardDescription>
                </CardHeader>
                <CardContent>
                  <MasterCategoryForm
                    type="income"
                    userId={session.user.id}
                    onSuccess={loadCategories}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Daftar Kategori Pemasukan</CardTitle>
                  <CardDescription>Total: {incomeCategories.length} kategori</CardDescription>
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
            </div>
          </TabsContent>

          <TabsContent value="expense" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl">Tambah Kategori</CardTitle>
                  <CardDescription>Buat kategori pengeluaran baru</CardDescription>
                </CardHeader>
                <CardContent>
                  <MasterCategoryForm
                    type="expense"
                    userId={session.user.id}
                    onSuccess={loadCategories}
                  />
                </CardContent>
          </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Daftar Kategori Pengeluaran</CardTitle>
                  <CardDescription>Total: {expenseCategories.length} kategori</CardDescription>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
