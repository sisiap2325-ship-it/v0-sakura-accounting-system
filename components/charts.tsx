'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { MonthlyData } from '@/lib/types'
import { formatCurrency } from '@/lib/store'

interface MonthlyChartProps {
  data: MonthlyData[]
}

const COLORS = [
  'oklch(0.45 0.12 160)',
  'oklch(0.55 0.15 85)',
  'oklch(0.55 0.22 25)',
  'oklch(0.55 0.12 220)',
  'oklch(0.60 0.10 300)',
  'oklch(0.65 0.12 130)',
  'oklch(0.50 0.15 50)',
  'oklch(0.55 0.10 250)',
]

export function MonthlyBarChart({ data }: MonthlyChartProps) {
  const filteredData = data.filter(d => d.income > 0 || d.expense > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 155)" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 155)' }}
          tickFormatter={(value) => value.substring(0, 3)}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 155)' }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0.02 155)',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="income" name="Pemasukan" fill="oklch(0.55 0.15 145)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Pengeluaran" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyLineChart({ data }: MonthlyChartProps) {
  const filteredData = data.filter(d => d.income > 0 || d.expense > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 155)" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 155)' }}
          tickFormatter={(value) => value.substring(0, 3)}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 155)' }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0.02 155)',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="income" 
          name="Pemasukan" 
          stroke="oklch(0.55 0.15 145)" 
          strokeWidth={2}
          dot={{ fill: 'oklch(0.55 0.15 145)' }}
        />
        <Line 
          type="monotone" 
          dataKey="expense" 
          name="Pengeluaran" 
          stroke="oklch(0.55 0.22 25)" 
          strokeWidth={2}
          dot={{ fill: 'oklch(0.55 0.22 25)' }}
        />
        <Line 
          type="monotone" 
          dataKey="net" 
          name="Laba Bersih" 
          stroke="oklch(0.45 0.12 160)" 
          strokeWidth={2}
          dot={{ fill: 'oklch(0.45 0.12 160)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface CategoryPieChartProps {
  data: Record<string, number>
  labels: Record<string, string>
}

export function CategoryPieChart({ data, labels }: CategoryPieChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: labels[key] || key,
    value
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Tidak ada data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0.02 155)',
            borderRadius: '8px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
