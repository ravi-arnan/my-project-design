import { useState, useMemo } from 'react'
import type {
  UserAnalytics,
  UserTrainingHistory,
  UserCompletionStatus,
  ScoreHistoryPoint,
} from '@/../product/sections/analytics-and-tracking/types'

/* ────────────────────────────────────────────
   Types & Helpers
   ──────────────────────────────────────────── */

interface UserAnalyticsDrawerProps {
  userAnalytics: UserAnalytics
  open: boolean
  onClose?: () => void
  onViewTraining?: (trainingId: string) => void
  onViewAttempt?: (attemptId: string) => void
  onExportCsv?: (tableId: string) => void
}

type SortKey = 'trainingTitle' | 'status' | 'score' | 'attempts' | 'dueDate'
type SortDir = 'asc' | 'desc'

const STATUS_STYLES: Record<UserCompletionStatus, { label: string; bg: string; text: string }> = {
  completed: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400' },
  failed: { label: 'Failed', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
  in_progress: { label: 'In Progress', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400' },
  overdue: { label: 'Overdue', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
  not_started: { label: 'Not Started', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400' },
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatHireDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000))
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
  const parts: string[] = []
  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}mo`)
  return parts.length > 0 ? parts.join(' ') : '<1mo'
}

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  suffix,
  danger,
}: {
  label: string
  value: number
  suffix?: string
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
    <div className="text-center">
      <p
        className={`text-lg font-semibold font-mono tabular-nums leading-none ${
          danger && value > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {formatted}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </p>
    </div>
  )
}

/* ── Scores Over Time Sparkline ── */

function ScoresSparkline({ data }: { data: ScoreHistoryPoint[] }) {
  if (data.length < 2) return null

  const W = 320
  const H = 80
  const PAD = { top: 8, right: 8, bottom: 20, left: 28 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const minScore = Math.min(...data.map((d) => d.score))
  const maxScore = Math.max(...data.map((d) => d.score))
  const yMin = Math.max(0, minScore - 10)
  const yMax = Math.min(100, maxScore + 10)
  const yRange = yMax - yMin || 1

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW
  const y = (v: number) => PAD.top + innerH - ((v - yMin) / yRange) * innerH

  const linePoints = data.map((d, i) => `${x(i)},${y(d.score)}`).join(' ')
  const fillPath = `M${x(0)},${y(yMin)} ${data.map((d, i) => `L${x(i)},${y(d.score)}`).join(' ')} L${x(data.length - 1)},${y(yMin)} Z`

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
        Scores Over Time
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Y grid */}
        {[yMin, Math.round((yMin + yMax) / 2), yMax].map((val, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={y(val)}
              x2={W - PAD.right}
              y2={y(val)}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth={0.5}
            />
            <text
              x={PAD.left - 4}
              y={y(val) + 3}
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {val}
            </text>
          </g>
        ))}

        {/* Fill */}
        <path d={fillPath} className="fill-indigo-500/10 dark:fill-indigo-400/10" />

        {/* Line */}
        <polyline
          points={linePoints}
          fill="none"
          className="stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Dots + labels */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(d.score)}
              r={3}
              className="fill-white dark:fill-slate-900 stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth={1.5}
            />
            <text
              x={x(i)}
              y={H - 4}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: 7, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </text>
          </g>
        ))}
      </svg>
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

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export function UserAnalyticsDrawer({
  userAnalytics,
  open,
  onClose,
  onViewTraining,
  onViewAttempt,
  onExportCsv,
}: UserAnalyticsDrawerProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dueDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const { summary, scoreHistory, trainingHistory } = userAnalytics

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    const copy = [...trainingHistory]
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
  }, [trainingHistory, sortKey, sortDir])

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: 'trainingTitle', label: 'Training' },
    { key: 'status', label: 'Status' },
    { key: 'score', label: 'Score', align: 'text-right' },
    { key: 'attempts', label: 'Att.', align: 'text-right' },
    { key: 'dueDate', label: 'Due' },
  ]

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {userAnalytics.employeeName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {userAnalytics.employeeName}
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {userAnalytics.role} · {userAnalytics.department} · Hired {formatDate(userAnalytics.hireDate)} ({formatHireDate(userAnalytics.hireDate)})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {/* ── Compliance Summary ── */}
            <div className="rounded border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Compliance Summary
              </p>
              <div className="grid grid-cols-4 gap-2">
                <SummaryCard label="Assigned" value={summary.totalAssigned} />
                <SummaryCard label="Completed" value={summary.completed} />
                <SummaryCard label="In Progress" value={summary.inProgress} />
                <SummaryCard label="Overdue" value={summary.overdue} danger />
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 mt-3 pt-3 grid grid-cols-4 gap-2">
                <SummaryCard label="Avg. Score" value={summary.averageScore} suffix="%" />
                <SummaryCard label="Avg. Time" value={summary.averageCompletionTimeMinutes} suffix="min" />
                <SummaryCard label="Time to Start" value={summary.averageTimeToStartHours} suffix="hr" />
                <SummaryCard label="Compliance" value={summary.recurringComplianceRate} suffix="%" />
              </div>
            </div>

            {/* ── Scores Sparkline ── */}
            {scoreHistory.length >= 2 && (
              <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 px-3 py-3">
                <ScoresSparkline data={scoreHistory} />
              </div>
            )}

            {/* ── Training History Table ── */}
            <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Training History ({trainingHistory.length})
                </p>
                <button
                  onClick={() => onExportCsv?.('user-training-history')}
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
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none whitespace-nowrap ${col.align ?? 'text-left'}`}
                        >
                          {col.label}
                          <SortIcon dir={sortDir} active={sortKey === col.key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((row) => {
                      const style = STATUS_STYLES[row.status]
                      const isOverdue = row.status === 'overdue'
                      return (
                        <tr
                          key={row.trainingId}
                          onClick={() => onViewTraining?.(row.trainingId)}
                          className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors ${
                            isOverdue ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                          }`}
                        >
                          <td className="px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium max-w-[160px]">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{row.trainingTitle}</span>
                              {row.isRecurring && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-slate-400 dark:text-slate-500" title="Recurring">
                                  <path d="M1.5 6.5A4.5 4.5 0 018.36 2.87M10.5 5.5A4.5 4.5 0 013.64 9.13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                  <path d="M8 1.5L8.5 3L7 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M4 10.5L3.5 9L5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {row.score !== null ? `${row.score}%` : '—'}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            {row.attempts}
                          </td>
                          <td className="px-3 py-1.5 font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                            {formatDate(row.dueDate)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
