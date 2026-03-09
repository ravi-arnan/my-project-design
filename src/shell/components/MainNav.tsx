import {
  LayoutDashboard,
  BookOpen,
  Play,
  Library,
  BarChart3,
  Settings,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'
import { UserMenu } from './UserMenu'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

interface MainNavProps {
  items: NavItem[]
  collapsed?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
  onNavigate?: (href: string) => void
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
}

const bottomItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function MainNav({
  items,
  collapsed = false,
  mobileOpen = false,
  onMobileClose,
  onNavigate,
  user = { name: 'Alex Morgan' },
  onLogout,
}: MainNavProps) {
  const handleClick = (href: string) => {
    onNavigate?.(href)
    onMobileClose?.()
  }

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>P</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            PeopleOS
          </span>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 rounded-md text-sm font-medium transition-colors relative
                ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
                ${
                  item.isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                }
              `}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
              )}
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom nav items */}
      <div className="px-2 pb-2 space-y-0.5 border-t border-slate-200 dark:border-slate-800 pt-2">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 rounded-md text-sm font-medium transition-colors
                ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
                text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800
              `}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </div>

      {/* User menu */}
      <div className="border-t border-slate-200 dark:border-slate-800 shrink-0">
        <UserMenu user={user} collapsed={collapsed} onLogout={onLogout} />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop / Tablet sidebar */}
      <aside
        className={`hidden md:flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-[width] duration-200 shrink-0
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-950 shadow-xl animate-slide-in-left">
            <div className="absolute top-3 right-3">
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  )
}

/** Mobile hamburger button */
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
    >
      <Menu className="w-5 h-5" strokeWidth={1.5} />
    </button>
  )
}

/** Default navigation items for PeopleOS */
export const defaultNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Training Builder', href: '/training-builder', icon: BookOpen },
  { label: 'Training Player', href: '/training-player', icon: Play },
  { label: 'Question Bank', href: '/question-bank', icon: Library },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]
