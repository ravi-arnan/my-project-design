import { useState, useMemo } from 'react'
import type {
  TrainingDetail,
  TrainingDetailMetrics,
  UserCompletion,
  UserCompletionStatus,
  QuestionPerformance,
} from '@/../product/sections/analytics-and-tracking/types'

/* ────────────────────────────────────────────
   Types & Helpers
   ──────────────────────────────────────────── */

interface TrainingAnalyticsProps {
  trainingDetail: TrainingDetail
  onViewUser?: (employeeId: string) => void
  onViewAttempt?: (attemptId: string) => void
  onNavigateBack?: () => void
  onExportCsv?: (tableId: string) => void
}

type UserSortKey = 'employeeName' | 'department' | 'status' | 'score' | 'attempts' | 'completionTimeMinutes'
type QuestionSortKey = 'questionText' | 'correctRate' | 'incorrectRate' | 'averageTimeSeconds'
type SortDir = 'asc' | 'desc'

const STATUS_STYLES: Record<UserCompletionStatus, { label: string; bg: string; text: string }> = {
  completed: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400' },
  failed: { label: 'Failed', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
  in_progress: { label: 'In Progress', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400' },
  overdue: { label: 'Overdue', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
  not_started: { label: 'Not Started', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400' },
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */

function MetricCard({
  label,
  value,
  suffix,
  bar,
  danger,
}: {
  label: string
  value: number
  suffix?: string
  bar?: number
  danger?: boolean
}) {
  const formatted =
    suffix === '%'
      ? `${value.toFixed(1)}%`
      : suffix === 'min'
        ? `${value.toFixed(0)}m`
        : suffix === 'hr'
          ? `${value.toFixed(1)}h`
          : value.toLocaleString()

  return (
    <div
      className={`rounded border px-3 py-2.5 ${
        danger && value > 0
          ? 'border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/30'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1.5">
        {label}
      </p>
      <p
        className={`text-xl font-semibold font-mono tabular-nums leading-none ${
          danger && value > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {formatted}
      </p>
      {bar !== undefined && (
        <div className="mt-1.5 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all"
            style={{ width: `${Math.min(100, Math.max(0, bar))}%` }}
          />
        </div>
      )}
    </div>
  )
}

/* ── Sort Arrow Icon ── */

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

/* ── Funnel Chart — Assigned → Started → Completed ── */

function FunnelChart({ metrics }: { metrics: TrainingDetailMetrics }) {
  const steps = [
    { label: 'Assigned', value: metrics.assigned, color: 'bg-slate-400 dark:bg-slate-500' },
    { label: 'Started', value: metrics.started, color: 'bg-indigo-400 dark:bg-indigo-500' },
    { label: 'Completed', value: metrics.completed, color: 'bg-emerald-500 dark:bg-emerald-400' },
    { label: 'Failed', value: metrics.failed, color: 'bg-red-500 dark:bg-red-400' },
    { label: 'Abandoned', value: metrics.abandoned, color: 'bg-amber-500 dark:bg-amber-400' },
  ]
  const maxVal = Math.max(...steps.map((s) => s.value), 1)

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        Assignment Funnel
      </p>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2">
            <span className="w-20 text-xs text-slate-600 dark:text-slate-400 text-right shrink-0">{step.label}</span>
            <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700/50 rounded overflow-hidden relative">
              <div
                className={`h-full rounded ${step.color} transition-all`}
                style={{ width: `${(step.value / maxVal) * 100}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                {step.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Question Performance Bar Chart (horizontal) ── */

function QuestionPerformanceChart({ data }: { data: QuestionPerformance[] }) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => a.correctRate - b.correctRate),
    [data],
  )

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        Question Accuracy — Most Missed First
      </p>
      <div className="space-y-1.5">
        {sorted.map((q) => (
          <div key={q.questionId} className="group">
            <div className="flex items-center gap-2">
              <span className="w-6 text-right text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                {q.correctRate.toFixed(0)}%
              </span>
              <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700/50 rounded overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500/70 dark:bg-emerald-400/70"
                  style={{ width: `${q.correctRate}%` }}
                />
                <div
                  className="h-full bg-red-500/50 dark:bg-red-400/50"
                  style={{ width: `${q.incorrectRate}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate pl-8 leading-tight mt-0.5">
              {q.questionText}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-3 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/70 dark:bg-emerald-400/70" />
          Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500/50 dark:bg-red-400/50" />
          Incorrect
        </span>
      </div>
    </div>
  )
}

/* ── User Completion Table ── */

function UserCompletionTable({
  data,
  onViewUser,
  onExportCsv,
}: {
  data: UserCompletion[]
  onViewUser?: (employeeId: string) => void
  onExportCsv?: (tableId: string) => void
}) {
  const [sortKey, setSortKey] = useState<UserSortKey>('status')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [statusFilter, setStatusFilter] = useState<UserCompletionStatus | 'all'>('all')

  const toggleSort = (key: UserSortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let items = [...data]
    if (statusFilter !== 'all') items = items.filter((u) => u.status === statusFilter)
    return items
  }, [data, statusFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === null && bv === null) return 0
      if (av === null) return 1
      if (bv === null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return copy
  }, [filtered, sortKey, sortDir])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.length }
    data.forEach((u) => { counts[u.status] = (counts[u.status] || 0) + 1 })
    return counts
  }, [data])

  const columns: { key: UserSortKey; label: string; align?: string }[] = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'department', label: 'Dept.' },
    { key: 'status', label: 'Status' },
    { key: 'score', label: 'Score', align: 'text-right' },
    { key: 'attempts', label: 'Attempts', align: 'text-right' },
    { key: 'completionTimeMinutes', label: 'Time', align: 'text-right' },
  ]

  const statusOptions: { key: UserCompletionStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'failed', label: 'Failed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'not_started', label: 'Not Started' },
  ]

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            User Completions
          </p>
          <div className="flex gap-1">
            {statusOptions.filter((s) => s.key === 'all' || (statusCounts[s.key] ?? 0) > 0).map((s) => (
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
        </div>
        <button
          onClick={() => onExportCsv?.('user-completions')}
          className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Export CSV
        </button>
      </div>

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
              <th className="px-3 py-2 text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400 text-left">
                Completed At
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((user) => {
              const style = STATUS_STYLES[user.status]
              return (
                <tr
                  key={user.employeeId}
                  onClick={() => onViewUser?.(user.employeeId)}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium">
                    {user.employeeName}
                  </td>
                  <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">
                    {user.department}
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {user.score !== null ? `${user.score}%` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {user.attempts}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {user.completionTimeMinutes !== null ? `${user.completionTimeMinutes}m` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-xs font-mono tabular-nums whitespace-nowrap">
                    {formatDateTime(user.completedAt)}
                  </td>
                </tr>
              )
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No users match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Question Performance Table ── */

function QuestionPerformanceTable({
  data,
  onExportCsv,
}: {
  data: QuestionPerformance[]
  onExportCsv?: (tableId: string) => void
}) {
  const [sortKey, setSortKey] = useState<QuestionSortKey>('incorrectRate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toggleSort = (key: QuestionSortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    const copy = [...data]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return copy
  }, [data, sortKey, sortDir])

  const columns: { key: QuestionSortKey; label: string; align?: string }[] = [
    { key: 'questionText', label: 'Question' },
    { key: 'correctRate', label: 'Correct %', align: 'text-right' },
    { key: 'incorrectRate', label: 'Incorrect %', align: 'text-right' },
    { key: 'averageTimeSeconds', label: 'Avg Time', align: 'text-right' },
  ]

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question Performance
        </p>
        <button
          onClick={() => onExportCsv?.('question-performance')}
          className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Export CSV
        </button>
      </div>

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
            {sorted.map((q) => {
              const isHighMiss = q.incorrectRate > 30
              return (
                <tr
                  key={q.questionId}
                  className={`border-b border-slate-100 dark:border-slate-700/50 transition-colors ${
                    isHighMiss ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                  }`}
                >
                  <td className="px-3 py-1.5 text-slate-800 dark:text-slate-200 max-w-[400px]">
                    <span className="line-clamp-2">{q.questionText}</span>
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                          style={{ width: `${q.correctRate}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {q.correctRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <span className={`font-mono tabular-nums ${
                      isHighMiss
                        ? 'text-red-600 dark:text-red-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {q.incorrectRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {q.averageTimeSeconds}s
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export function TrainingAnalytics({
  trainingDetail,
  onViewUser,
  onViewAttempt,
  onNavigateBack,
  onExportCsv,
}: TrainingAnalyticsProps) {
  const { metrics, userCompletions, questionPerformance } = trainingDetail

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4">
        {/* ── Breadcrumb + Back ── */}
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
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[300px]">
            {trainingDetail.trainingTitle}
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {trainingDetail.category}
          </span>
        </div>

        {/* ── Page Title ── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none">
            {trainingDetail.trainingTitle}
          </h1>
          {metrics.overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
              {metrics.overdueCount} overdue
            </span>
          )}
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <MetricCard label="Assigned" value={metrics.assigned} />
          <MetricCard label="Completion Rate" value={metrics.completionRate} suffix="%" bar={metrics.completionRate} />
          <MetricCard label="Pass Rate" value={metrics.passRate} suffix="%" />
          <MetricCard label="Fail Rate" value={metrics.failRate} suffix="%" danger />
          <MetricCard label="Avg. Score" value={metrics.averageScore} />
          <MetricCard label="Avg. Time" value={metrics.averageCompletionTimeMinutes} suffix="min" />
          <MetricCard label="Overdue" value={metrics.overdueCount} danger />
        </div>

        {/* ── Secondary Metrics Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MetricCard label="Started" value={metrics.started} />
          <MetricCard label="Completed" value={metrics.completed} />
          <MetricCard label="Abandoned" value={metrics.abandoned} />
          <MetricCard label="Avg. Time to Start" value={metrics.averageTimeToStartHours} suffix="hr" />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <FunnelChart metrics={metrics} />
          <QuestionPerformanceChart data={questionPerformance} />
        </div>

        {/* ── User Completion Table ── */}
        <UserCompletionTable
          data={userCompletions}
          onViewUser={onViewUser}
          onExportCsv={onExportCsv}
        />

        {/* ── Question Performance Table ── */}
        <QuestionPerformanceTable
          data={questionPerformance}
          onExportCsv={onExportCsv}
        />
      </div>
    </div>
  )
}
