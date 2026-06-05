'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Receipt,
  FileText,
  TrendingUp,
  Wallet,
  Scale,
  Menu,
  X,
  Package,
  Settings,
  UserCircle,
  LogOut,
  Database,
  BarChart3,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useSessionContext } from '@/lib/session-context'
import { useRouter } from 'next/navigation'

const baseNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transaksi', href: '/transaksi', icon: Receipt },
  {
    name: 'Laporan',
    icon: FileText,
    submenu: [
      { name: 'Laba Rugi', href: '/laporan/laba-rugi', icon: TrendingUp },
      { name: 'Arus Kas', href: '/laporan/arus-kas', icon: Wallet },
      { name: 'Neraca', href: '/laporan/neraca', icon: Scale },
      { name: 'Riwayat Transaksi', href: '/laporan/riwayat', icon: FileText },
    ],
  },
  { name: 'Aset', href: '/aset', icon: Package },
  { name: 'Master Kategori', href: '/master/kategori', icon: Database },
  { name: 'Master Akun', href: '/master/akun', icon: Database },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const { session } = useSessionContext()
  const router = useRouter()

  const userRole = session?.user?.role || 'viewer'

  const navigation = [
    ...baseNavigation,
    ...(userRole === 'admin' ? [{ name: 'Pengaturan', href: '/pengaturan', icon: Settings }] : []),
  ]

  // Filter Master Data for admin only
  const displayNavigation = navigation.filter(item => {
    if ('submenu' in item) return true
    if ((item.name === 'Master Kategori' || item.name === 'Master Akun') && userRole !== 'admin') {
      return false
    }
    return true
  })

  const handleLogout = () => {
    localStorage.removeItem('auth_session')
    router.push('/sign-in')
    router.refresh()
  }

  const isMenuActive = (item: any) => {
    if (item.href) {
      return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
    }
    if ('submenu' in item) {
      return item.submenu.some((sub: any) => pathname === sub.href || pathname.startsWith(sub.href))
    }
    return false
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-lg hover:bg-sidebar-accent transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with Logo */}
        <div className="px-6 py-6 bg-gradient-to-br from-primary to-primary/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-lg text-white tracking-tight">SAKURA</h1>
              <p className="text-xs text-white/80">Sistem Akuntansi</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/90">
            <Sparkles className="w-3 h-3" />
            <span>v0.1.0</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {displayNavigation.map((item) => {
            const isActive = isMenuActive(item)
            const hasSubmenu = 'submenu' in item
            const isExpanded = expandedMenu === item.name

            if (hasSubmenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Submenu */}
                  {isExpanded && (
                    <div className="mt-2 ml-2 pl-4 border-l border-sidebar-border space-y-1">
                      {item.submenu.map((subitem: any) => {
                        const isSubActive = pathname === subitem.href || pathname.startsWith(subitem.href)
                        return (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                              isSubActive
                                ? 'bg-sidebar-primary/80 text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                            )}
                          >
                            <subitem.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{subitem.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="px-4 py-4 border-t border-sidebar-border space-y-4 bg-sidebar-accent/20">
          {session?.user ? (
            <div className="space-y-3">
              {/* User Card */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent/40 hover:bg-sidebar-accent/60 transition-colors">
                <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{session.user.name || 'User'}</p>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-sidebar-primary/30 text-sidebar-primary-foreground capitalize mt-1">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5">
                <Link
                  href="/akun"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/akun'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : null}

          {/* Footer Text */}
          <div className="text-center pt-2 border-t border-sidebar-border/50 text-xs text-sidebar-foreground/60">
            <p className="font-semibold">SAKURA</p>
            <p>Sistem Akuntansi Keuangan</p>
          </div>
        </div>
      </aside>
    </>
  )
}
