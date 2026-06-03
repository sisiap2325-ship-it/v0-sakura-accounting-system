'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MonthlyLineChart } from '@/components/charts'
import { 
  getTransactions, 
  getFinancialSummary, 
  getMonthlyData,
  formatCurrency 
} from '@/lib/store'
import { Transaction, FinancialSummary, MonthlyData, getCategoryLabel, MONTHS_ID } from '@/lib/types'
import { Calendar, Download, Printer } from 'lucide-react'

export default function LabaRugiPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Laporan Laba Rugi</h1>
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

          {/* Report Content */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6 print:shadow-none print:border-0">
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-xl font-bold text-foreground">LAPORAN LABA RUGI</h2>
              <p className="text-muted-foreground">Wisata Telaga Kusuma</p>
              <p className="text-muted-foreground">BUMDes Tunggulrejo</p>
              <p className="text-sm text-muted-foreground mt-2">Periode: {periodLabel}</p>
            </div>

            {summary && (
              <div className="space-y-6">
                {/* Pendapatan Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-3">
                    PENDAPATAN
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.incomeByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center py-1">
                        <span className="text-foreground">{getCategoryLabel(category as any)}</span>
                        <span className="font-mono text-foreground">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Pendapatan</span>
                      <span className="font-mono text-success">{formatCurrency(summary.totalIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Beban/Pengeluaran Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-3">
                    BEBAN OPERASIONAL
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.expenseByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center py-1">
                        <span className="text-foreground">{getCategoryLabel(category as any)}</span>
                        <span className="font-mono text-foreground">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Beban</span>
                      <span className="font-mono text-destructive">{formatCurrency(summary.totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Income */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">LABA BERSIH</span>
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
              Tren Laba Rugi Bulanan
            </h2>
            <MonthlyLineChart data={monthlyData} />
          </div>
        </div>
      </main>
    </div>
  )
}
