export type TransactionType = 'income' | 'expense'

export type TransactionCategory = 
  | 'tiket_masuk'
  | 'parkir'
  | 'sewa_perahu'
  | 'sewa_gazebo'
  | 'warung'
  | 'foto'
  | 'event'
  | 'lainnya'
  | 'gaji'
  | 'listrik'
  | 'air'
  | 'perawatan'
  | 'operasional'
  | 'perlengkapan'
  | 'pajak'
  | 'retribusi'

export interface Transaction {
  id: string
  date: string
  type: TransactionType
  category: TransactionCategory
  description: string
  amount: number
  createdAt: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  netIncome: number
  incomeByCategory: Record<string, number>
  expenseByCategory: Record<string, number>
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  net: number
}

export const INCOME_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: 'tiket_masuk', label: 'Tiket Masuk' },
  { value: 'parkir', label: 'Parkir' },
  { value: 'sewa_perahu', label: 'Sewa Perahu' },
  { value: 'sewa_gazebo', label: 'Sewa Gazebo' },
  { value: 'warung', label: 'Warung/Kuliner' },
  { value: 'foto', label: 'Spot Foto' },
  { value: 'event', label: 'Event/Acara' },
  { value: 'lainnya', label: 'Pendapatan Lainnya' },
]

export const EXPENSE_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: 'gaji', label: 'Gaji Karyawan' },
  { value: 'listrik', label: 'Listrik' },
  { value: 'air', label: 'Air' },
  { value: 'perawatan', label: 'Perawatan & Perbaikan' },
  { value: 'operasional', label: 'Operasional' },
  { value: 'perlengkapan', label: 'Perlengkapan' },
  { value: 'pajak', label: 'Pajak' },
  { value: 'retribusi', label: 'Retribusi Desa' },
  { value: 'lainnya', label: 'Pengeluaran Lainnya' },
]

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

export function getCategoryLabel(category: TransactionCategory): string {
  const found = ALL_CATEGORIES.find(c => c.value === category)
  return found?.label || category
}

export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]
