'use client'

import { useSessionContext } from '@/lib/session-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MasterAccountForm } from '@/components/master-account-form'
import { MasterAccountList } from '@/components/master-account-list'
import {
  getIncomeAccounts,
  getExpenseAccounts,
  getIncomeCategories,
  getExpenseCategories,
} from '@/app/actions/master'

export default function MasterAkunPage() {
  const router = useRouter()
  const { session, isPending } = useSessionContext()
  const [incomeAccounts, setIncomeAccounts] = useState([])
  const [expenseAccounts, setExpenseAccounts] = useState([])
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

      loadData()
    }
  }, [session?.user?.id, session?.user?.role, isPending, router])

  const loadData = async () => {
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
      setIncomeAccounts([])
      setExpenseAccounts([])
    } catch (error) {
      console.error('Failed to load data:', error)
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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Master Akun</h1>
        <p className="text-gray-600 mt-2">Kelola akun pemasukan dan pengeluaran</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="income">Akun Pemasukan</TabsTrigger>
          <TabsTrigger value="expense">Akun Pengeluaran</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Akun Pemasukan</CardTitle>
              <CardDescription>Buat akun pemasukan baru untuk sistem keuangan</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterAccountForm
                type="income"
                userId={session.user.id}
                categories={incomeCategories}
                onSuccess={loadData}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Akun Pemasukan</CardTitle>
              <CardDescription>Kelola akun pemasukan yang sudah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterAccountList
                accounts={incomeAccounts}
                type="income"
                userId={session.user.id}
                categories={incomeCategories}
                onDelete={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Akun Pengeluaran</CardTitle>
              <CardDescription>Buat akun pengeluaran baru untuk sistem keuangan</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterAccountForm
                type="expense"
                userId={session.user.id}
                categories={expenseCategories}
                onSuccess={loadData}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Akun Pengeluaran</CardTitle>
              <CardDescription>Kelola akun pengeluaran yang sudah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <MasterAccountList
                accounts={expenseAccounts}
                type="expense"
                userId={session.user.id}
                categories={expenseCategories}
                onDelete={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
