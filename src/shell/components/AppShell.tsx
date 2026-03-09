import { useState, useEffect } from 'react'
import { MainNav, MobileMenuButton, defaultNavItems, type NavItem } from './MainNav'

interface AppShellProps {
  children: React.ReactNode
  navigationItems?: NavItem[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export default function AppShell({
  children,
  navigationItems = defaultNavItems,
  user = { name: 'Alex Morgan' },
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Auto-collapse on tablet-sized windows
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setCollapsed(e.matches)
    }
    handleChange(mq)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar – MainNav handles both desktop (hidden md:flex aside) and mobile (overlay) internally */}
      <MainNav
        items={navigationItems}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 h-14 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
          <span
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            PeopleOS
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
