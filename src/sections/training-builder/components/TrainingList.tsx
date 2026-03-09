import { useState, useRef, useEffect } from 'react'
import type {
  Training,
  TrainingStatus,
  Department,
} from '@/../product/sections/training-builder/types'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Archive,
  Copy,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  RefreshCw,
  Clock,
  Filter,
  ChevronDown,
} from 'lucide-react'

interface TrainingListProps {
  trainings: Training[]
  departments: Department[]
  onCreateTraining?: () => void
  onEditTraining?: (trainingId: string) => void
  onArchiveTraining?: (trainingId: string) => void
  onDuplicateTraining?: (trainingId: string) => void
  onViewAnalytics?: (trainingId: string) => void
}

type SortField = 'title' | 'status' | 'assignedCount' | 'completionRate' | 'lastUpdated'
type SortDir = 'asc' | 'desc'

const statusConfig: Record<TrainingStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: {
    label: 'Draft',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  published: {
    label: 'Published',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
}

function StatusBadge({ status }: { status: TrainingStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function CompletionBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden min-w-[48px]">
        <div
          className={`h-full rounded-full transition-all ${
            rate >= 80
              ? 'bg-emerald-500 dark:bg-emerald-400'
              : rate >= 50
                ? 'bg-amber-500 dark:bg-amber-400'
                : rate > 0
                  ? 'bg-indigo-500 dark:bg-indigo-400'
                  : 'bg-slate-200 dark:bg-slate-700'
          }`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400 w-8 text-right font-mono">
        {rate}%
      </span>
    </div>
  )
}

function ActionMenu({
  trainingId,
  onEdit,
  onArchive,
  onDuplicate,
  onAnalytics,
}: {
  trainingId: string
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
  onDuplicate?: (id: string) => void
  onAnalytics?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const items = [
    { label: 'Edit', icon: Pencil, action: () => onEdit?.(trainingId) },
    { label: 'Duplicate', icon: Copy, action: () => onDuplicate?.(trainingId) },
    { label: 'Analytics', icon: BarChart3, action: () => onAnalytics?.(trainingId) },
    { label: 'Archive', icon: Archive, action: () => onArchive?.(trainingId) },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={(e) => { e.stopPropagation(); item.action(); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

function formatRecurrence(training: Training): string {
  if (!training.recurrence.enabled) return 'One-time'
  const { intervalType, intervalValue } = training.recurrence
  if (!intervalType || !intervalValue) return 'Recurring'
  if (intervalValue === 1) return `Every ${intervalType.slice(0, -1)}`
  return `Every ${intervalValue} ${intervalType}`
}

export function TrainingList({
  trainings,
  departments,
  onCreateTraining,
  onEditTraining,
  onArchiveTraining,
  onDuplicateTraining,
  onViewAnalytics,
}: TrainingListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TrainingStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('lastUpdated')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  const deptMap = Object.fromEntries(departments.map((d) => [d.id, d.name]))

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir(field === 'title' ? 'asc' : 'desc')
    }
  }

  const filtered = trainings
    .filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortField) {
        case 'title':
          return dir * a.title.localeCompare(b.title)
        case 'status':
          return dir * a.status.localeCompare(b.status)
        case 'assignedCount':
          return dir * (a.assignedCount - b.assignedCount)
        case 'completionRate':
          return dir * (a.completionRate - b.completionRate)
        case 'lastUpdated':
          return dir * (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
        default:
          return 0
      }
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-50" strokeWidth={1.5} />
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-indigo-500" strokeWidth={2} />
      : <ArrowDown className="w-3 h-3 text-indigo-500" strokeWidth={2} />
  }

  const statusCounts = {
    all: trainings.length,
    published: trainings.filter((t) => t.status === 'published').length,
    draft: trainings.filter((t) => t.status === 'draft').length,
    archived: trainings.filter((t) => t.status === 'archived').length,
  }

  return (
    <div className="h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Trainings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {trainings.length} training{trainings.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => onCreateTraining?.()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Create Training
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search trainings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Status filter */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                statusFilter !== 'all'
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
              {statusFilter === 'all' ? 'Status' : statusConfig[statusFilter].label}
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            {filterOpen && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30">
                {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setFilterOpen(false) }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-sm transition-colors ${
                      statusFilter === s
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{s === 'all' ? 'All statuses' : statusConfig[s].label}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{statusCounts[s]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {[
                  { field: 'title' as SortField, label: 'Training', align: 'text-left' },
                  { field: 'status' as SortField, label: 'Status', align: 'text-left' },
                  { field: 'assignedCount' as SortField, label: 'Assigned', align: 'text-right' },
                  { field: 'completionRate' as SortField, label: 'Completion', align: 'text-left' },
                  { field: null, label: 'Recurrence', align: 'text-left' },
                  { field: 'lastUpdated' as SortField, label: 'Updated', align: 'text-right' },
                  { field: null, label: '', align: 'text-right' },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.align} ${col.field ? 'cursor-pointer select-none group/th' : ''}`}
                    onClick={col.field ? () => handleSort(col.field!) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {search || statusFilter !== 'all' ? 'No trainings match your filters.' : 'No trainings yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((training) => (
                  <tr
                    key={training.id}
                    onClick={() => onEditTraining?.(training.id)}
                    className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  >
                    {/* Title + meta */}
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {training.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">{training.category}</span>
                        {training.departmentId && deptMap[training.departmentId] && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">&middot;</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {deptMap[training.departmentId]}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={training.status} />
                    </td>

                    {/* Assigned count */}
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                        {training.assignedCount}
                      </span>
                    </td>

                    {/* Completion rate */}
                    <td className="px-4 py-3 min-w-[140px]">
                      <CompletionBar rate={training.completionRate} />
                    </td>

                    {/* Recurrence */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        training.recurrence.enabled
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {training.recurrence.enabled && (
                          <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                        )}
                        {formatRecurrence(training)}
                      </span>
                    </td>

                    {/* Last updated */}
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        {formatRelativeDate(training.lastUpdated)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <ActionMenu
                        trainingId={training.id}
                        onEdit={onEditTraining}
                        onArchive={onArchiveTraining}
                        onDuplicate={onDuplicateTraining}
                        onAnalytics={onViewAnalytics}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Showing {filtered.length} of {trainings.length} training{trainings.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
