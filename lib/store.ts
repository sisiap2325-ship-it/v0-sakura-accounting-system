'use client'

import { Transaction, FinancialSummary, MonthlyData, MONTHS_ID } from './types'

const STORAGE_KEY = 'bumdes_transactions'
const STORAGE_VERSION_KEY = 'bumdes_version'
const CURRENT_VERSION = '2'

// Sample initial data for 2026
const initialTransactions: Transaction[] = [
  // Januari 2026
  {
    id: '1',
    date: '2026-01-05',
    type: 'income',
    category: 'tiket_masuk',
    description: 'Tiket masuk pengunjung akhir pekan',
    amount: 3500000,
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: '2',
    date: '2026-01-05',
    type: 'income',
    category: 'parkir',
    description: 'Pendapatan parkir',
    amount: 950000,
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: '3',
    date: '2026-01-10',
    type: 'expense',
    category: 'gaji',
    description: 'Gaji karyawan bulan Januari',
    amount: 6000000,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: '4',
    date: '2026-01-12',
    type: 'income',
    category: 'sewa_perahu',
    description: 'Sewa perahu wisata',
    amount: 1500000,
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: '5',
    date: '2026-01-15',
    type: 'expense',
    category: 'listrik',
    description: 'Tagihan listrik Januari',
    amount: 1200000,
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: '6',
    date: '2026-01-20',
    type: 'income',
    category: 'warung',
    description: 'Pendapatan warung kuliner',
    amount: 4200000,
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: '7',
    date: '2026-01-25',
    type: 'income',
    category: 'sewa_gazebo',
    description: 'Sewa gazebo rombongan',
    amount: 2000000,
    createdAt: '2026-01-25T10:00:00Z'
  },
  // Februari 2026
  {
    id: '8',
    date: '2026-02-01',
    type: 'income',
    category: 'tiket_masuk',
    description: 'Tiket masuk Februari minggu 1',
    amount: 4100000,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: '9',
    date: '2026-02-05',
    type: 'income',
    category: 'event',
    description: 'Event festival kuliner',
    amount: 7500000,
    createdAt: '2026-02-05T10:00:00Z'
  },
  {
    id: '10',
    date: '2026-02-10',
    type: 'expense',
    category: 'gaji',
    description: 'Gaji karyawan Februari',
    amount: 6000000,
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: '11',
    date: '2026-02-12',
    type: 'expense',
    category: 'perawatan',
    description: 'Perbaikan dermaga perahu',
    amount: 3500000,
    createdAt: '2026-02-12T10:00:00Z'
  },
  {
    id: '12',
    date: '2026-02-15',
    type: 'income',
    category: 'sewa_gazebo',
    description: 'Sewa gazebo untuk rombongan',
    amount: 2400000,
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: '13',
    date: '2026-02-20',
    type: 'income',
    category: 'foto',
    description: 'Pendapatan spot foto',
    amount: 1250000,
    createdAt: '2026-02-20T10:00:00Z'
  },
  {
    id: '14',
    date: '2026-02-22',
    type: 'income',
    category: 'parkir',
    description: 'Pendapatan parkir Februari',
    amount: 1100000,
    createdAt: '2026-02-22T10:00:00Z'
  },
  {
    id: '15',
    date: '2026-02-25',
    type: 'expense',
    category: 'listrik',
    description: 'Tagihan listrik Februari',
    amount: 1150000,
    createdAt: '2026-02-25T10:00:00Z'
  },
  // Maret 2026
  {
    id: '16',
    date: '2026-03-01',
    type: 'income',
    category: 'tiket_masuk',
    description: 'Tiket masuk Maret minggu 1',
    amount: 5200000,
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: '17',
    date: '2026-03-05',
    type: 'expense',
    category: 'operasional',
    description: 'BBM perahu dan kendaraan operasional',
    amount: 1800000,
    createdAt: '2026-03-05T10:00:00Z'
  },
  {
    id: '18',
    date: '2026-03-10',
    type: 'expense',
    category: 'gaji',
    description: 'Gaji karyawan Maret',
    amount: 6200000,
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    id: '19',
    date: '2026-03-15',
    type: 'income',
    category: 'parkir',
    description: 'Pendapatan parkir Maret',
    amount: 1400000,
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: '20',
    date: '2026-03-20',
    type: 'income',
    category: 'warung',
    description: 'Pendapatan warung Maret',
    amount: 5500000,
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    id: '21',
    date: '2026-03-25',
    type: 'expense',
    category: 'perlengkapan',
    description: 'Pembelian pelampung baru',
    amount: 2000000,
    createdAt: '2026-03-25T10:00:00Z'
  },
  {
    id: '22',
    date: '2026-03-28',
    type: 'income',
    category: 'sewa_perahu',
    description: 'Sewa perahu wisata',
    amount: 1800000,
    createdAt: '2026-03-28T10:00:00Z'
  },
  // April 2026
  {
    id: '23',
    date: '2026-04-01',
    type: 'income',
    category: 'tiket_masuk',
    description: 'Tiket masuk liburan paskah',
    amount: 8500000,
    createdAt: '2026-04-01T10:00:00Z'
  },
  {
    id: '24',
    date: '2026-04-05',
    type: 'income',
    category: 'event',
    description: 'Event wisata keluarga',
    amount: 4500000,
    createdAt: '2026-04-05T10:00:00Z'
  },
  {
    id: '25',
    date: '2026-04-10',
    type: 'expense',
    category: 'gaji',
    description: 'Gaji karyawan April',
    amount: 6500000,
    createdAt: '2026-04-10T10:00:00Z'
  },
  {
    id: '26',
    date: '2026-04-15',
    type: 'income',
    category: 'warung',
    description: 'Pendapatan warung April',
    amount: 6200000,
    createdAt: '2026-04-15T10:00:00Z'
  },
  {
    id: '27',
    date: '2026-04-20',
    type: 'expense',
    category: 'perawatan',
    description: 'Perawatan kolam renang',
    amount: 4500000,
    createdAt: '2026-04-20T10:00:00Z'
  },
  {
    id: '28',
    date: '2026-04-25',
    type: 'income',
    category: 'parkir',
    description: 'Pendapatan parkir April',
    amount: 2100000,
    createdAt: '2026-04-25T10:00:00Z'
  },
  // Mei 2026
  {
    id: '29',
    date: '2026-05-01',
    type: 'income',
    category: 'tiket_masuk',
    description: 'Tiket masuk libur lebaran',
    amount: 12500000,
    createdAt: '2026-05-01T10:00:00Z'
  },
  {
    id: '30',
    date: '2026-05-05',
    type: 'income',
    category: 'sewa_gazebo',
    description: 'Sewa gazebo lebaran',
    amount: 5500000,
    createdAt: '2026-05-05T10:00:00Z'
  },
  {
    id: '31',
    date: '2026-05-10',
    type: 'expense',
    category: 'gaji',
    description: 'Gaji + THR karyawan',
    amount: 12000000,
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: '32',
    date: '2026-05-12',
    type: 'income',
    category: 'warung',
    description: 'Pendapatan warung lebaran',
    amount: 9500000,
    createdAt: '2026-05-12T10:00:00Z'
  },
  {
    id: '33',
    date: '2026-05-13',
    type: 'income',
    category: 'foto',
    description: 'Pendapatan spot foto lebaran',
    amount: 3200000,
    createdAt: '2026-05-13T10:00:00Z'
  },
]

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return initialTransactions
  
  // Check version to refresh sample data when updated
  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY)
  if (storedVersion !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions))
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
    return initialTransactions
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions))
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
    return initialTransactions
  }
  
  return JSON.parse(stored)
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const transactions = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }
  transactions.push(newTransaction)
  saveTransactions(transactions)
  return newTransaction
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const transactions = getTransactions()
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return null
  
  transactions[index] = { ...transactions[index], ...updates }
  saveTransactions(transactions)
  return transactions[index]
}

export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions()
  const filtered = transactions.filter(t => t.id !== id)
  if (filtered.length === transactions.length) return false
  
  saveTransactions(filtered)
  return true
}

export function getFinancialSummary(
  transactions: Transaction[],
  startDate?: string,
  endDate?: string
): FinancialSummary {
  let filtered = transactions
  
  if (startDate) {
    filtered = filtered.filter(t => t.date >= startDate)
  }
  if (endDate) {
    filtered = filtered.filter(t => t.date <= endDate)
  }
  
  const incomeTransactions = filtered.filter(t => t.type === 'income')
  const expenseTransactions = filtered.filter(t => t.type === 'expense')
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  
  const incomeByCategory: Record<string, number> = {}
  incomeTransactions.forEach(t => {
    incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
  })
  
  const expenseByCategory: Record<string, number> = {}
  expenseTransactions.forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
  })
  
  return {
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
    incomeByCategory,
    expenseByCategory
  }
}

export function getMonthlyData(transactions: Transaction[], year: number): MonthlyData[] {
  const monthlyData: MonthlyData[] = MONTHS_ID.map((month, index) => {
    const monthStr = String(index + 1).padStart(2, '0')
    const startDate = `${year}-${monthStr}-01`
    const endDate = `${year}-${monthStr}-31`
    
    const monthTransactions = transactions.filter(
      t => t.date >= startDate && t.date <= endDate
    )
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      month,
      income,
      expense,
      net: income - expense
    }
  })
  
  return monthlyData
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
