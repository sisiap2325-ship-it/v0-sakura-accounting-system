'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Database
} from 'lucide-react'
import { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const baseNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transaksi', href: '/transaksi', icon: Receipt },
  { name: 'Laporan Laba Rugi', href: '/laporan/laba-rugi', icon: TrendingUp },
  { name: 'Arus Kas', href: '/laporan/arus-kas', icon: Wallet },
  { name: 'Neraca', href: '/laporan/neraca', icon: Scale },
  { name: 'Riwayat Transaksi', href: '/laporan/riwayat', icon: FileText },
  { name: 'Aset', href: '/aset', icon: Package },
  { name: 'Master Kategori', href: '/master/kategori', icon: Database },
  { name: 'Master Akun', href: '/master/akun', icon: Database },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const userRole = (session?.user as any)?.role || 'viewer'

  const navigation = [
    ...baseNavigation,
    ...(userRole === 'admin' ? [{ name: 'Pengaturan', href: '/pengaturan', icon: Settings }] : []),
  ]

  // Filter Master Data for admin only
  const displayNavigation = navigation.filter(item => {
    if ((item.name === 'Master Kategori' || item.name === 'Master Akun') && userRole !== 'admin') {
      return false
    }
    return true
  })

  const handleLogout = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-lg"
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
          'fixed inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Image */}
          <div className="relative">
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src="/images/telaga-kusuma.png"
                alt="Wisata Telaga Kusuma"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sidebar" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
              <h1 className="font-bold text-lg text-white drop-shadow-lg">SAKURA</h1>
              <p className="text-xs text-white/90 drop-shadow">Sistem Akuntansi Keuangan Rakyat</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {displayNavigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Footer */}
          <div className="px-4 py-4 border-t border-sidebar-border space-y-4">
            {session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/20">
                  <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.user.name || 'User'}</p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize mt-1">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/akun"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === '/akun'
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-red-500/20 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}

            <p className="text-xs text-sidebar-foreground/60 text-center">
              SAKURA
            </p>
            <p className="text-xs text-sidebar-foreground/60 text-center">
              Sistem Akuntansi Keuangan Rakyat
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
