'use client'

import { useSession } from '@/lib/auth-client'
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
  const { data: session, isPending } = useSession()
  const [incomeAccounts, setIncomeAccounts] = useState([])
  const [expenseAccounts, setExpenseAccounts] = useState([])
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
      loadData()
    }
  }, [session?.user, isPending, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [incomeAcc, expenseAcc, incomeCat, expenseCat] = await Promise.all([
        getIncomeAccounts(session.user.id),
        getExpenseAccounts(session.user.id),
        getIncomeCategories(session.user.id),
        getExpenseCategories(session.user.id),
      ])
      setIncomeAccounts(incomeAcc as any)
      setExpenseAccounts(expenseAcc as any)
      setIncomeCategories(incomeCat as any)
      setExpenseCategories(expenseCat as any)
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

  if (!session?.user) return null

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
