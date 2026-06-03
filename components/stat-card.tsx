import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-card border-l-4 border-l-success',
    warning: 'bg-card border-l-4 border-l-warning',
    danger: 'bg-card border-l-4 border-l-destructive',
  }

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  }

  return (
    <div className={cn('rounded-xl border p-6 shadow-sm', variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
