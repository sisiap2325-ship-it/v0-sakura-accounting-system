'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { 
  getTransactions, 
  formatCurrency,
  formatDate 
} from '@/lib/store'
import { Transaction, getCategoryLabel, MONTHS_ID } from '@/lib/types'
import { Calendar, Printer, Download, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RiwayatPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all')

  useEffect(() => {
    const txns = getTransactions()
    setTransactions(txns)
  }, [])

  const handlePrint = () => {
    window.print()
  }

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
  
  // Calculate running balance
  let runningBalance = 0
  const transactionsWithBalance = filteredTransactions.map(t => {
    if (t.type === 'income') {
      runningBalance += t.amount
    } else {
      runningBalance -= t.amount
    }
    return { ...t, balance: runningBalance }
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const periodLabel = selectedMonth === 'all' 
    ? `Tahun ${selectedYear}` 
    : `${MONTHS_ID[selectedMonth - 1]} ${selectedYear}`

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Debit', 'Kredit', 'Saldo']
    const rows = transactionsWithBalance.map(t => [
      t.date,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      getCategoryLabel(t.category),
      t.description,
      t.type === 'income' ? t.amount : '',
      t.type === 'expense' ? t.amount : '',
      t.balance
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `riwayat_transaksi_${selectedYear}_${selectedMonth}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h1>
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
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
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
          <div className="bg-card rounded-xl border border-border p-6 print:shadow-none print:border-0">
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-xl font-bold text-foreground">BUKU BESAR / RIWAYAT TRANSAKSI</h2>
              <p className="text-muted-foreground">Wisata Telaga Kusuma</p>
              <p className="text-muted-foreground">BUMDes Tunggulrejo</p>
              <p className="text-sm text-muted-foreground mt-2">Periode: {periodLabel}</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Debit (Masuk)</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Kredit (Keluar)</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Saldo Akhir</p>
                <p className={cn(
                  'text-xl font-bold',
                  runningBalance >= 0 ? 'text-success' : 'text-destructive'
                )}>
                  {formatCurrency(runningBalance)}
                </p>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-2 font-semibold text-foreground">No</th>
                    <th className="text-left py-3 px-2 font-semibold text-foreground">Tanggal</th>
                    <th className="text-left py-3 px-2 font-semibold text-foreground">Kategori</th>
                    <th className="text-left py-3 px-2 font-semibold text-foreground">Keterangan</th>
                    <th className="text-right py-3 px-2 font-semibold text-foreground">Debit</th>
                    <th className="text-right py-3 px-2 font-semibold text-foreground">Kredit</th>
                    <th className="text-right py-3 px-2 font-semibold text-foreground">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsWithBalance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Tidak ada transaksi pada periode ini
                      </td>
                    </tr>
                  ) : (
                    transactionsWithBalance.map((t, index) => (
                      <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2 text-foreground">{index + 1}</td>
                        <td className="py-3 px-2 text-foreground whitespace-nowrap">
                          {formatDate(t.date)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'p-1 rounded',
                              t.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                            )}>
                              {t.type === 'income' ? (
                                <TrendingUp className="h-3 w-3 text-success" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-destructive" />
                              )}
                            </span>
                            <span className="text-foreground">{getCategoryLabel(t.category)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground max-w-xs truncate">
                          {t.description}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-success">
                          {t.type === 'income' ? formatCurrency(t.amount) : '-'}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-destructive">
                          {t.type === 'expense' ? formatCurrency(t.amount) : '-'}
                        </td>
                        <td className={cn(
                          'py-3 px-2 text-right font-mono font-medium',
                          t.balance >= 0 ? 'text-foreground' : 'text-destructive'
                        )}>
                          {formatCurrency(t.balance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {transactionsWithBalance.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-border font-semibold">
                      <td colSpan={4} className="py-3 px-2 text-right text-foreground">Total</td>
                      <td className="py-3 px-2 text-right font-mono text-success">
                        {formatCurrency(totalIncome)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-destructive">
                        {formatCurrency(totalExpense)}
                      </td>
                      <td className={cn(
                        'py-3 px-2 text-right font-mono',
                        runningBalance >= 0 ? 'text-success' : 'text-destructive'
                      )}>
                        {formatCurrency(runningBalance)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Signature Section for Print */}
            <div className="hidden print:block mt-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-16">Disiapkan oleh,</p>
                  <p className="border-t border-border pt-2 text-foreground">Bendahara</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-16">Mengetahui,</p>
                  <p className="border-t border-border pt-2 text-foreground">Direktur BUMDes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
