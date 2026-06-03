'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MonthlyBarChart } from '@/components/charts'
import { 
  getTransactions, 
  getFinancialSummary, 
  getMonthlyData,
  formatCurrency 
} from '@/lib/store'
import { Transaction, FinancialSummary, MonthlyData, getCategoryLabel, MONTHS_ID } from '@/lib/types'
import { Calendar, Printer, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react'

export default function ArusKasPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all')

  useEffect(() => {
    const txns = getTransactions()
    setTransactions(txns)
    setMonthlyData(getMonthlyData(txns, selectedYear))

    let startDate: string | undefined
    let endDate: string | undefined

    if (selectedMonth !== 'all') {
      const monthStr = String(selectedMonth).padStart(2, '0')
      startDate = `${selectedYear}-${monthStr}-01`
      endDate = `${selectedYear}-${monthStr}-31`
    } else {
      startDate = `${selectedYear}-01-01`
      endDate = `${selectedYear}-12-31`
    }

    const filteredTxns = txns.filter(t => t.date >= startDate! && t.date <= endDate!)
    setSummary(getFinancialSummary(filteredTxns))
  }, [selectedYear, selectedMonth])

  const handlePrint = () => {
    window.print()
  }

  const periodLabel = selectedMonth === 'all' 
    ? `Tahun ${selectedYear}` 
    : `${MONTHS_ID[selectedMonth - 1]} ${selectedYear}`

  // Calculate running balance for selected period
  const getFilteredTransactions = () => {
    let startDate: string
    let endDate: string

    if (selectedMonth !== 'all') {
      const monthStr = String(selectedMonth).padStart(2, '0')
      startDate = `${selectedYear}-${monthStr}-01`
      endDate = `${selectedYear}-${monthStr}-31`
    } else {
      startDate = `${selectedYear}-01-01`
      endDate = `${selectedYear}-12-31`
    }

    return transactions
      .filter(t => t.date >= startDate && t.date <= endDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const filteredTransactions = getFilteredTransactions()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Laporan Arus Kas</h1>
              <p className="text-muted-foreground mt-1">
                Wisata Telaga Kusuma - BUMDes Tunggulrejo
              </p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
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
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:outline-none"
              >
                <option value="all">Semua Bulan</option>
                {MONTHS_ID.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:hidden">
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <ArrowUpCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kas Masuk</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(summary.totalIncome)}</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <ArrowDownCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kas Keluar</p>
                  <p className="text-xl font-bold text-destructive">{formatCurrency(summary.totalExpense)}</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arus Kas Bersih</p>
                  <p className={`text-xl font-bold ${summary.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(summary.netIncome)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Content */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6 print:shadow-none print:border-0">
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-xl font-bold text-foreground">LAPORAN ARUS KAS</h2>
              <p className="text-muted-foreground">Wisata Telaga Kusuma</p>
              <p className="text-muted-foreground">BUMDes Tunggulrejo</p>
              <p className="text-sm text-muted-foreground mt-2">Periode: {periodLabel}</p>
            </div>

            {summary && (
              <div className="space-y-6">
                {/* Kas Masuk Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-success" />
                    ARUS KAS MASUK
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.incomeByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center py-1 pl-7">
                        <span className="text-foreground">{getCategoryLabel(category as any)}</span>
                        <span className="font-mono text-foreground">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold pl-7">
                      <span className="text-foreground">Total Kas Masuk</span>
                      <span className="font-mono text-success">{formatCurrency(summary.totalIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Kas Keluar Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
                    <ArrowDownCircle className="h-5 w-5 text-destructive" />
                    ARUS KAS KELUAR
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.expenseByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center py-1 pl-7">
                        <span className="text-foreground">{getCategoryLabel(category as any)}</span>
                        <span className="font-mono text-foreground">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold pl-7">
                      <span className="text-foreground">Total Kas Keluar</span>
                      <span className="font-mono text-destructive">{formatCurrency(summary.totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Cash Flow */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">ARUS KAS BERSIH</span>
                    <span className={`text-xl font-bold font-mono ${summary.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(summary.netIncome)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="bg-card rounded-xl border border-border p-6 print:hidden">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Grafik Arus Kas Bulanan
            </h2>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>
      </main>
    </div>
  )
}
