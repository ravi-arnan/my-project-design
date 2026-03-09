import { useState, useRef, useEffect } from 'react'
import { LogOut, User, ChevronUp } from 'lucide-react'

interface UserMenuProps {
  user: {
    name: string
    avatarUrl?: string
  }
  collapsed?: boolean
  onLogout?: () => void
}

export function UserMenu({ user, collapsed = false, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div ref={ref} className="relative px-2 pb-3">
      <button
        onClick={() => setOpen(!open)}
        title={collapsed ? user.name : undefined}
        className={`w-full flex items-center gap-2.5 rounded-md p-2 transition-colors
          hover:bg-slate-100 dark:hover:bg-slate-800
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
            <span
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {initials}
            </span>
          </div>
        )}
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p
                className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {user.name}
              </p>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-slate-400 transition-transform ${open ? '' : 'rotate-180'}`}
              strokeWidth={1.5}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`absolute bottom-full mb-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50
          ${collapsed ? 'left-full ml-2 bottom-0 mb-0 w-48' : 'left-2 right-2'}
        `}>
          <button
            onClick={() => {
              setOpen(false)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <User className="w-4 h-4" strokeWidth={1.5} />
            Profile
          </button>
          <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
          <button
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
