'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@/lib/session-context'
import { Sidebar } from '@/components/sidebar'
import { StatCard } from '@/components/stat-card'
import { TransactionForm } from '@/components/transaction-form'
import { TransactionTable } from '@/components/transaction-table'
import { MonthlyBarChart } from '@/components/charts'
import { 
  getTransactions, 
  getFinancialSummary, 
  getMonthlyData,
  formatCurrency 
} from '@/lib/store'
import { Transaction, FinancialSummary, MonthlyData, getCategoryLabel, ALL_CATEGORIES } from '@/lib/types'
import { CategoryPieChart } from '@/components/charts'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus,
  Calendar
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { session, isPending } = useSessionContext()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [isPending, router])

  const loadData = () => {
    const txns = getTransactions()
    setTransactions(txns)
    setSummary(getFinancialSummary(txns))
    setMonthlyData(getMonthlyData(txns, selectedYear))
  }

  useEffect(() => {
    loadData()
  }, [selectedYear])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const categoryLabels = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = cat.label
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        {/* Hero Section */}
        <div className="relative h-48 lg:h-56 overflow-hidden">
          <Image
            src="/images/telaga-kusuma.png"
            alt="Wisata Telaga Kusuma"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-4 lg:px-8 pt-12 lg:pt-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                SAKURA
              </h1>
              <p className="text-white/90 mt-2 text-lg drop-shadow">
                Sistem Akuntansi Keuangan Rakyat
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {/* Header - Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Selamat Datang, {session?.user?.name || 'User'}</h2>
              <p className="text-muted-foreground mt-2 text-base">
                Ringkasan keuangan dan aktivitas terbaru Anda
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-transparent text-sm font-medium text-foreground focus:outline-none"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Transaksi</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Total Pemasukan"
                value={formatCurrency(summary.totalIncome)}
                icon={TrendingUp}
                variant="success"
              />
              <StatCard
                title="Total Pengeluaran"
                value={formatCurrency(summary.totalExpense)}
                icon={TrendingDown}
                variant="danger"
              />
              <StatCard
                title="Laba Bersih"
                value={formatCurrency(summary.netIncome)}
                icon={Wallet}
                variant={summary.netIncome >= 0 ? 'success' : 'danger'}
              />
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Pemasukan & Pengeluaran Bulanan
              </h2>
              <MonthlyBarChart data={monthlyData} />
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Distribusi Pemasukan
              </h2>
              {summary && (
                <CategoryPieChart 
                  data={summary.incomeByCategory} 
                  labels={categoryLabels}
                />
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">
                Transaksi Terbaru
              </h2>
              <a 
                href="/transaksi" 
                className="text-sm text-primary hover:underline"
              >
                Lihat Semua
              </a>
            </div>
            <TransactionTable 
              transactions={recentTransactions}
              onDelete={loadData}
            />
          </div>
        </div>
      </main>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
