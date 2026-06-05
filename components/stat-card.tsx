import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
  description?: string
  clickable?: boolean
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  description,
  clickable = false,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border hover:border-primary/30',
    success: 'bg-success/5 border border-success/30 hover:border-success/50',
    warning: 'bg-warning/5 border border-warning/30 hover:border-warning/50',
    danger: 'bg-danger/5 border border-danger/30 hover:border-danger/50',
  }

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  }

  const titleStyles = {
    default: 'text-muted-foreground',
    success: 'text-success/80',
    warning: 'text-warning/80',
    danger: 'text-destructive/80',
  }

  const trendIcon = trend?.isPositive ? (
    <TrendingUp className="w-3.5 h-3.5" />
  ) : (
    <TrendingDown className="w-3.5 h-3.5" />
  )

  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-200',
        variantStyles[variant],
        clickable && 'cursor-pointer hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between">
        {/* Left Content */}
        <div className="space-y-3 flex-1">
          {/* Title */}
          <div className="flex items-center justify-between">
            <p className={cn('text-sm font-semibold uppercase tracking-wide', titleStyles[variant])}>
              {title}
            </p>
          </div>

          {/* Value */}
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md',
                trend.isPositive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {trendIcon}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Right Icon */}
        <div
          className={cn(
            'rounded-lg p-3 ml-3 flex-shrink-0',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
