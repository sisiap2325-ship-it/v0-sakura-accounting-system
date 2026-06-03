'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TransactionForm } from '@/components/transaction-form'
import { TransactionTable } from '@/components/transaction-table'
import { getTransactions, formatCurrency, getFinancialSummary } from '@/lib/store'
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/types'
import { Plus, Filter, Search } from 'lucide-react'

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const loadData = () => {
    const txns = getTransactions()
    setTransactions(txns)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...transactions]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter)
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(t => t.date >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.date <= dateTo)
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, typeFilter, categoryFilter, dateFrom, dateTo])

  const summary = getFinancialSummary(filteredTransactions)
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Daftar Transaksi</h1>
              <p className="text-muted-foreground mt-1">
                Kelola semua transaksi keuangan
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </button>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari keterangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                <option value="all">Semua Jenis</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                <option value="all">Semua Kategori</option>
                <optgroup label="Pemasukan">
                  {INCOME_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Pengeluaran">
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </optgroup>
              </select>

              {/* Date From */}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Dari Tanggal"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />

              {/* Date To */}
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Sampai Tanggal"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Pemasukan (Filter)</p>
              <p className="text-xl font-bold text-success mt-1">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Pengeluaran (Filter)</p>
              <p className="text-xl font-bold text-destructive mt-1">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
              <p className="text-xl font-bold text-foreground mt-1">
                {filteredTransactions.length} transaksi
              </p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-card rounded-xl border border-border">
            <TransactionTable 
              transactions={filteredTransactions}
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
