import { useState, useMemo } from 'react'
import type { OverdueUser } from '@/../product/sections/analytics-and-tracking/types'

/* ────────────────────────────────────────────
   Types & Helpers
   ──────────────────────────────────────────── */

interface OverdueListProps {
  overdueUsers: OverdueUser[]
  onViewUser?: (employeeId: string) => void
  onViewTraining?: (trainingId: string) => void
  onNavigateBack?: () => void
  onExportCsv?: (tableId: string) => void
}

type SortKey = 'employeeName' | 'department' | 'trainingTitle' | 'dueDate' | 'daysOverdue' | 'status'
type SortDir = 'asc' | 'desc'

const STATUS_STYLES: Record<OverdueUser['status'], { label: string; bg: string; text: string; ring: string }> = {
  not_started: {
    label: 'Not Started',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function urgencyLevel(days: number): 'critical' | 'high' | 'medium' {
  if (days >= 14) return 'critical'
  if (days >= 7) return 'high'
  return 'medium'
}

const URGENCY_STYLES = {
  critical: {
    dot: 'bg-red-500 dark:bg-red-400',
    text: 'text-red-700 dark:text-red-400',
    bar: 'bg-red-500 dark:bg-red-400',
  },
  high: {
    dot: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
  },
  medium: {
    dot: 'bg-yellow-500 dark:bg-yellow-400',
    text: 'text-yellow-700 dark:text-yellow-400',
    bar: 'bg-yellow-500 dark:bg-yellow-400',
  },
}

/* ────────────────────────────────────────────
   Sort Arrow Icon
   ──────────────────────────────────────────── */

function SortIcon({ dir, active }: { dir: SortDir; active: boolean }) {
  return (
    <span className={`inline-flex flex-col ml-0.5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
      <svg width="7" height="4" viewBox="0 0 7 4" className={`${dir === 'asc' && active ? 'opacity-100' : 'opacity-30'}`}>
        <path d="M3.5 0L7 4H0L3.5 0Z" fill="currentColor" />
      </svg>
      <svg width="7" height="4" viewBox="0 0 7 4" className={`${dir === 'desc' && active ? 'opacity-100' : 'opacity-30'}`}>
        <path d="M3.5 4L0 0H7L3.5 4Z" fill="currentColor" />
      </svg>
    </span>
  )
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export function OverdueList({
  overdueUsers,
  onViewUser,
  onViewTraining,
  onNavigateBack,
  onExportCsv,
}: OverdueListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('daysOverdue')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OverdueUser['status'] | 'all'>('all')
  const [deptFilter, setDeptFilter] = useState<string>('all')

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const departments = useMemo(() => {
    const depts = new Set(overdueUsers.map((u) => u.department))
    return ['all', ...Array.from(depts).sort()]
  }, [overdueUsers])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: overdueUsers.length, not_started: 0, in_progress: 0 }
    overdueUsers.forEach((u) => { counts[u.status] = (counts[u.status] || 0) + 1 })
    return counts
  }, [overdueUsers])

  const filtered = useMemo(() => {
    let items = [...overdueUsers]
    if (statusFilter !== 'all') items = items.filter((u) => u.status === statusFilter)
    if (deptFilter !== 'all') items = items.filter((u) => u.department === deptFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (u) =>
          u.employeeName.toLowerCase().includes(q) ||
          u.trainingTitle.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q),
      )
    }
    return items
  }, [overdueUsers, statusFilter, deptFilter, search])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return copy
  }, [filtered, sortKey, sortDir])

  // Summary stats
  const maxOverdue = Math.max(...overdueUsers.map((u) => u.daysOverdue), 1)
  const avgOverdue = overdueUsers.length > 0
    ? Math.round(overdueUsers.reduce((s, u) => s + u.daysOverdue, 0) / overdueUsers.length)
    : 0
  const criticalCount = overdueUsers.filter((u) => u.daysOverdue >= 14).length

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'department', label: 'Dept.' },
    { key: 'trainingTitle', label: 'Training' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'daysOverdue', label: 'Days Overdue', align: 'text-right' },
    { key: 'status', label: 'Status' },
  ]

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Analytics
          </button>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Overdue & At-Risk</span>
        </div>

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none">
              Overdue & At-Risk
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
              {overdueUsers.length} users
            </span>
          </div>
          <button
            onClick={() => onExportCsv?.('overdue-users')}
            className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Export CSV
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1.5">
              Total Overdue
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums leading-none text-red-600 dark:text-red-400">
              {overdueUsers.length}
            </p>
          </div>
          <div className="rounded border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/30 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1.5">
              Critical (14+ days)
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums leading-none text-red-600 dark:text-red-400">
              {criticalCount}
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1.5">
              Avg. Days Overdue
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums leading-none text-slate-900 dark:text-slate-100">
              {avgOverdue}
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1.5">
              Not Started
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums leading-none text-slate-900 dark:text-slate-100">
              {statusCounts.not_started}
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              >
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search name, training, dept…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-1">
              {([
                { key: 'all' as const, label: 'All' },
                { key: 'not_started' as const, label: 'Not Started' },
                { key: 'in_progress' as const, label: 'In Progress' },
              ]).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                    statusFilter === s.key
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.label} ({statusCounts[s.key] ?? 0})
                </button>
              ))}
            </div>

            {/* Department filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className={`px-3 py-2 text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none whitespace-nowrap ${col.align ?? 'text-left'}`}
                    >
                      {col.label}
                      <SortIcon dir={sortDir} active={sortKey === col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((user) => {
                  const urgency = urgencyLevel(user.daysOverdue)
                  const uStyle = URGENCY_STYLES[urgency]
                  const sStyle = STATUS_STYLES[user.status]

                  return (
                    <tr
                      key={`${user.employeeId}-${user.trainingId}`}
                      className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-3 py-1.5">
                        <button
                          onClick={() => onViewUser?.(user.employeeId)}
                          className="text-slate-800 dark:text-slate-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors text-left"
                        >
                          {user.employeeName}
                        </button>
                      </td>
                      <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">
                        {user.department}
                      </td>
                      <td className="px-3 py-1.5">
                        <button
                          onClick={() => onViewTraining?.(user.trainingId)}
                          className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors text-left truncate max-w-[220px] block"
                        >
                          {user.trainingTitle}
                        </button>
                      </td>
                      <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
                        {formatDate(user.dueDate)}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${uStyle.bar} transition-all`}
                              style={{ width: `${Math.min(100, (user.daysOverdue / maxOverdue) * 100)}%` }}
                            />
                          </div>
                          <span className={`font-mono tabular-nums font-semibold ${uStyle.text} min-w-[24px]`}>
                            {user.daysOverdue}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${sStyle.bg} ${sStyle.text}`}>
                          {sStyle.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      {overdueUsers.length === 0
                        ? 'No overdue users — all training assignments are on track.'
                        : 'No users match the current filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          {sorted.length > 0 && (
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Showing {sorted.length} of {overdueUsers.length} overdue assignments
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
