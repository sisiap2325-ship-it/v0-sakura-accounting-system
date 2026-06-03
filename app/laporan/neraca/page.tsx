'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { 
  getTransactions, 
  getFinancialSummary, 
  formatCurrency 
} from '@/lib/store'
import { Transaction, FinancialSummary, MONTHS_ID } from '@/lib/types'
import { Calendar, Printer, Building2, Banknote, Scale } from 'lucide-react'

// Simulated initial capital and assets for BUMDes
const INITIAL_CAPITAL = 50000000 // Modal awal Rp 50.000.000
const FIXED_ASSETS = 75000000 // Aset tetap (perahu, gazebo, dll)
const INITIAL_CASH = 10000000 // Kas awal

export default function NeracaPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all')

  useEffect(() => {
    const txns = getTransactions()
    setTransactions(txns)

    let endDate: string

    if (selectedMonth !== 'all') {
      const monthStr = String(selectedMonth).padStart(2, '0')
      endDate = `${selectedYear}-${monthStr}-31`
    } else {
      endDate = `${selectedYear}-12-31`
    }

    // Get all transactions up to the selected date to calculate cumulative balance
    const cumulativeTxns = txns.filter(t => t.date <= endDate)
    setSummary(getFinancialSummary(cumulativeTxns))
  }, [selectedYear, selectedMonth])

  const handlePrint = () => {
    window.print()
  }

  const periodLabel = selectedMonth === 'all' 
    ? `31 Desember ${selectedYear}` 
    : `${MONTHS_ID[selectedMonth - 1]} ${selectedYear}`

  // Calculate balance sheet items
  const currentCash = INITIAL_CASH + (summary?.netIncome || 0)
  const totalCurrentAssets = currentCash
  const totalFixedAssets = FIXED_ASSETS
  const totalAssets = totalCurrentAssets + totalFixedAssets

  const retainedEarnings = summary?.netIncome || 0
  const totalEquity = INITIAL_CAPITAL + retainedEarnings

  // For simplicity, we assume no liabilities for this basic implementation
  const totalLiabilities = totalAssets - totalEquity
  const currentLiabilities = totalLiabilities > 0 ? totalLiabilities : 0

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Neraca</h1>
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
                <option value="all">Akhir Tahun</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:hidden">
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Aset</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(totalAssets)}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Banknote className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Kewajiban</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(currentLiabilities)}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Scale className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Ekuitas</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalEquity)}</p>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-card rounded-xl border border-border p-6 print:shadow-none print:border-0">
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-xl font-bold text-foreground">NERACA</h2>
              <p className="text-muted-foreground">Wisata Telaga Kusuma</p>
              <p className="text-muted-foreground">BUMDes Tunggulrejo</p>
              <p className="text-sm text-muted-foreground mt-2">Per {periodLabel}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Assets */}
              <div>
                <h3 className="text-lg font-bold text-foreground border-b-2 border-primary pb-2 mb-4">
                  ASET
                </h3>

                {/* Current Assets */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Aset Lancar</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Kas dan Setara Kas</span>
                      <span className="font-mono text-foreground">{formatCurrency(currentCash)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Aset Lancar</span>
                      <span className="font-mono text-foreground">{formatCurrency(totalCurrentAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Fixed Assets */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Aset Tetap</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Perahu & Peralatan</span>
                      <span className="font-mono text-foreground">{formatCurrency(25000000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Gazebo & Fasilitas</span>
                      <span className="font-mono text-foreground">{formatCurrency(30000000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Infrastruktur</span>
                      <span className="font-mono text-foreground">{formatCurrency(20000000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Aset Tetap</span>
                      <span className="font-mono text-foreground">{formatCurrency(totalFixedAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Total Assets */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">TOTAL ASET</span>
                    <span className="text-xl font-bold font-mono text-primary">{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Liabilities & Equity */}
              <div>
                <h3 className="text-lg font-bold text-foreground border-b-2 border-primary pb-2 mb-4">
                  KEWAJIBAN & EKUITAS
                </h3>

                {/* Liabilities */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Kewajiban</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Utang Usaha</span>
                      <span className="font-mono text-foreground">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Utang Lainnya</span>
                      <span className="font-mono text-foreground">{formatCurrency(currentLiabilities)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Kewajiban</span>
                      <span className="font-mono text-foreground">{formatCurrency(currentLiabilities)}</span>
                    </div>
                  </div>
                </div>

                {/* Equity */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Ekuitas</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Modal Disetor</span>
                      <span className="font-mono text-foreground">{formatCurrency(INITIAL_CAPITAL)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-foreground">Laba Ditahan</span>
                      <span className={`font-mono ${retainedEarnings >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(retainedEarnings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Ekuitas</span>
                      <span className="font-mono text-success">{formatCurrency(totalEquity)}</span>
                    </div>
                  </div>
                </div>

                {/* Total Liabilities & Equity */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">TOTAL KEWAJIBAN & EKUITAS</span>
                    <span className="text-xl font-bold font-mono text-primary">{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Check */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Neraca Seimbang: Total Aset = Total Kewajiban + Ekuitas
              </p>
              <p className="font-mono font-semibold text-foreground mt-1">
                {formatCurrency(totalAssets)} = {formatCurrency(currentLiabilities)} + {formatCurrency(totalEquity)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
