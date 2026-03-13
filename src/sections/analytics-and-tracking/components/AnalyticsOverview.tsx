import { useState, useMemo } from 'react'
import type {
  AnalyticsTrackingProps,
  CompletionTrendPoint,
  ScoreDistributionBucket,
  RecentActivity,
  TrainingPerformance,
  DateRange,
  DateRangePreset,
  ActivityType,
} from '@/../product/sections/analytics-and-tracking/types'

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

type SortKey = keyof TrainingPerformance
type SortDir = 'asc' | 'desc'

const PRESETS: { key: DateRangePreset; label: string }[] = [
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
  { key: 'ytd', label: 'YTD' },
  { key: 'all', label: 'All time' },
]

function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateAxis(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function relativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDateAxis(iso)
}

function presetToDateRange(preset: DateRangePreset): DateRange {
  const to = new Date()
  const from = new Date()
  switch (preset) {
    case '7d':
      from.setDate(to.getDate() - 7)
      break
    case '30d':
      from.setDate(to.getDate() - 30)
      break
    case '90d':
      from.setDate(to.getDate() - 90)
      break
    case 'ytd':
      from.setMonth(0, 1)
      break
    case 'all':
      from.setFullYear(2020, 0, 1)
      break
    default:
      from.setDate(to.getDate() - 30)
  }
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
}

const ACTIVITY_COLORS: Record<ActivityType, { dot: string; bg: string }> = {
  completed: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { dot: 'bg-red-500', bg: 'bg-red-500/10' },
  assigned: { dot: 'bg-indigo-500', bg: 'bg-indigo-500/10' },
}

const BAR_COLORS = [
  'fill-red-500/80 dark:fill-red-400/80',
  'fill-orange-500/80 dark:fill-orange-400/80',
  'fill-amber-500/80 dark:fill-amber-400/80',
  'fill-lime-500/80 dark:fill-lime-400/80',
  'fill-emerald-500/80 dark:fill-emerald-400/80',
]

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */

function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: DateRange
  onDateRangeChange?: (range: DateRange) => void
}) {
  const [activePreset, setActivePreset] = useState<DateRangePreset>('30d')

  const handlePreset = (preset: DateRangePreset) => {
    setActivePreset(preset)
    const range = presetToDateRange(preset)
    onDateRangeChange?.(range)
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PRESETS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handlePreset(key)}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            activePreset === key
              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          {label}
        </button>
      ))}
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
        {formatDateShort(dateRange.from)} – {formatDateShort(dateRange.to)}
      </span>
    </div>
  )
}

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

/* ── Completion Trend Line Chart ── */

function CompletionTrendChart({ data }: { data: CompletionTrendPoint[] }) {
  if (!data.length) return null

  const W = 440
  const H = 160
  const PAD = { top: 12, right: 12, bottom: 28, left: 36 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const maxY = Math.max(...data.map((d) => Math.max(d.completed, d.assigned)), 1)
  const yTicks = 4
  const yStep = Math.ceil(maxY / yTicks)

  const x = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * innerW
  const y = (v: number) => PAD.top + innerH - (v / (yStep * yTicks)) * innerH

  const completedPoints = data.map((d, i) => `${x(i)},${y(d.completed)}`).join(' ')
  const assignedPoints = data.map((d, i) => `${x(i)},${y(d.assigned)}`).join(' ')

  const fillPath = `M${x(0)},${y(0)} ${data.map((d, i) => `L${x(i)},${y(d.completed)}`).join(' ')} L${x(data.length - 1)},${y(0)} Z`

  // Show roughly 5-6 date labels
  const labelInterval = Math.max(1, Math.floor(data.length / 5))

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Completion Trend
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Y grid lines & labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = i * yStep
          const yPos = y(val)
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                y1={yPos}
                x2={W - PAD.right}
                y2={yPos}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth={0.5}
              />
              <text
                x={PAD.left - 4}
                y={yPos + 3}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Assigned line (muted) */}
        <polyline
          points={assignedPoints}
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-600"
          strokeWidth={1}
          strokeDasharray="3 2"
        />

        {/* Completed area fill */}
        <path d={fillPath} className="fill-indigo-500/10 dark:fill-indigo-400/10" />

        {/* Completed line */}
        <polyline
          points={completedPoints}
          fill="none"
          className="stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Completed dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(d.completed)}
            r={2}
            className="fill-indigo-600 dark:fill-indigo-400"
          />
        ))}

        {/* X-axis date labels */}
        {data.map((d, i) =>
          i % labelInterval === 0 || i === data.length - 1 ? (
            <text
              key={i}
              x={x(i)}
              y={H - 4}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {formatDateAxis(d.date)}
            </text>
          ) : null,
        )}
      </svg>
      <div className="flex gap-4 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded" />
          Completed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-slate-300 dark:bg-slate-600 rounded border-dashed" />
          Assigned
        </span>
      </div>
    </div>
  )
}

/* ── Score Distribution Bar Chart ── */

function ScoreDistributionChart({ data }: { data: ScoreDistributionBucket[] }) {
  if (!data.length) return null

  const W = 280
  const H = 160
  const PAD = { top: 12, right: 8, bottom: 32, left: 32 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const barW = innerW / data.length
  const barGap = 4

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Score Distribution
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Y grid hints */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const yPos = PAD.top + innerH * (1 - frac)
          return (
            <line
              key={i}
              x1={PAD.left}
              y1={yPos}
              x2={W - PAD.right}
              y2={yPos}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth={0.5}
            />
          )
        })}

        {/* Y axis labels */}
        {[0, 0.5, 1].map((frac, i) => {
          const val = Math.round(maxCount * frac)
          const yPos = PAD.top + innerH * (1 - frac)
          return (
            <text
              key={i}
              x={PAD.left - 4}
              y={yPos + 3}
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {val}
            </text>
          )
        })}

        {data.map((bucket, i) => {
          const barH = (bucket.count / maxCount) * innerH
          const bx = PAD.left + i * barW + barGap / 2
          const bw = barW - barGap
          const by = PAD.top + innerH - barH

          return (
            <g key={i}>
              <rect
                x={bx}
                y={by}
                width={bw}
                height={barH}
                rx={2}
                className={BAR_COLORS[i] ?? BAR_COLORS[BAR_COLORS.length - 1]}
              />
              {/* Count label on top of bar */}
              <text
                x={bx + bw / 2}
                y={by - 3}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400"
                style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {bucket.count}
              </text>
              {/* Range label */}
              <text
                x={bx + bw / 2}
                y={H - 8}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400"
                style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {bucket.range}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ── Recent Activity Feed ── */

function ActivityFeed({ data }: { data: RecentActivity[] }) {
  const items = data.slice(0, 8)

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Recent Activity
      </p>
      <div className="space-y-0">
        {items.map((item) => {
          const colors = ACTIVITY_COLORS[item.type]
          return (
            <div
              key={item.id}
              className="flex items-center gap-2 py-1.5 border-b border-slate-100 dark:border-slate-700/60 last:border-0"
            >
              <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate max-w-[110px]">
                {item.employeeName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 min-w-0">
                {item.trainingTitle}
              </span>
              {item.score !== null && (
                <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
                  {item.score}%
                </span>
              )}
              <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500 shrink-0 ml-auto">
                {relativeTime(item.timestamp)}
              </span>
            </div>
          )
        })}
      </div>
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

/* ── Training Performance Table ── */

function PerformanceTable({
  data,
  onViewTraining,
  onExportCsv,
}: {
  data: TrainingPerformance[]
  onViewTraining?: (id: string) => void
  onExportCsv?: (tableId: string) => void
}) {
  const [sortKey, setSortKey] = useState<SortKey>('completionRate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = useMemo(() => {
    const copy = [...data]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return copy
  }, [data, sortKey, sortDir])

  // Totals
  const totals = useMemo(() => {
    const t = {
      assigned: 0,
      completed: 0,
      failed: 0,
      overdue: 0,
      scoreSum: 0,
      timeSum: 0,
      passRateSum: 0,
    }
    data.forEach((r) => {
      t.assigned += r.assigned
      t.completed += r.completed
      t.failed += r.failed
      t.overdue += r.overdueCount
      t.scoreSum += r.averageScore
      t.timeSum += r.averageCompletionTimeMinutes
      t.passRateSum += r.passRate
    })
    const n = data.length || 1
    return {
      assigned: t.assigned,
      completed: t.completed,
      completionRate: t.assigned > 0 ? (t.completed / t.assigned) * 100 : 0,
      passRate: t.passRateSum / n,
      avgScore: t.scoreSum / n,
      avgTime: t.timeSum / n,
      overdue: t.overdue,
    }
  }, [data])

  type Col = { key: SortKey; label: string; align?: string; w?: string }
  const columns: Col[] = [
    { key: 'trainingTitle', label: 'Training', w: 'min-w-[180px]' },
    { key: 'category', label: 'Category', w: 'min-w-[90px]' },
    { key: 'assigned', label: 'Assigned', align: 'text-right' },
    { key: 'completed', label: 'Completed', align: 'text-right' },
    { key: 'completionRate', label: 'Compl. %', align: 'text-right' },
    { key: 'passRate', label: 'Pass %', align: 'text-right' },
    { key: 'averageScore', label: 'Avg Score', align: 'text-right' },
    { key: 'averageCompletionTimeMinutes', label: 'Avg Time', align: 'text-right' },
    { key: 'overdueCount', label: 'Overdue', align: 'text-right' },
  ]

  return (
    <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Training Performance
        </p>
        <button
          onClick={() => onExportCsv?.('training-performance')}
          className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Export CSV
        </button>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none whitespace-nowrap ${col.align ?? 'text-left'} ${col.w ?? ''}`}
                >
                  {col.label}
                  <SortIcon dir={sortDir} active={sortKey === col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.trainingId}
                onClick={() => onViewTraining?.(row.trainingId)}
                className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
              >
                <td className="px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium truncate max-w-[220px]">
                  {row.trainingTitle}
                </td>
                <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">
                  {row.category}
                </td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {row.assigned}
                </td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {row.completed}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400"
                        style={{ width: `${Math.min(100, row.completionRate)}%` }}
                      />
                    </div>
                    <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {row.completionRate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {row.passRate.toFixed(1)}%
                </td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {row.averageScore.toFixed(1)}
                </td>
                <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {row.averageCompletionTimeMinutes}m
                </td>
                <td
                  className={`px-3 py-1.5 text-right font-mono tabular-nums ${
                    row.overdueCount > 0
                      ? 'text-red-600 dark:text-red-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {row.overdueCount}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80">
              <td className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Totals
              </td>
              <td className="px-3 py-1.5" />
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                {totals.assigned}
              </td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                {totals.completed}
              </td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                {totals.completionRate.toFixed(1)}%
              </td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                {totals.passRate.toFixed(1)}%
              </td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                {totals.avgScore.toFixed(1)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400 font-semibold">
                {totals.avgTime.toFixed(0)}m
              </td>
              <td
                className={`px-3 py-1.5 text-right font-mono tabular-nums font-semibold ${
                  totals.overdue > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {totals.overdue}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export function AnalyticsOverview({
  overviewMetrics,
  completionTrend,
  scoreDistribution,
  recentActivity,
  trainingPerformance,
  overdueUsers,
  onViewTraining,
  onDateRangeChange,
  onExportCsv,
}: AnalyticsTrackingProps) {
  const overdueCount = overdueUsers?.length ?? 0

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4">
        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none">
              Analytics
            </h1>
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                {overdueCount} overdue
              </span>
            )}
          </div>
          <DateRangePicker
            dateRange={overviewMetrics.dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <MetricCard
            label="Active Trainings"
            value={overviewMetrics.activeTrainings}
          />
          <MetricCard
            label="Completion Rate"
            value={overviewMetrics.completionRate}
            suffix="%"
            bar={overviewMetrics.completionRate}
          />
          <MetricCard
            label="Pass Rate"
            value={overviewMetrics.passRate}
            suffix="%"
          />
          <MetricCard
            label="Avg. Score"
            value={overviewMetrics.averageScore}
          />
          <MetricCard
            label="Overdue Users"
            value={overviewMetrics.overdueUsers}
            danger
          />
          <MetricCard
            label="Avg. Compl. Time"
            value={overviewMetrics.averageCompletionTimeMinutes}
            suffix="min"
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-2">
          <CompletionTrendChart data={completionTrend} />
          <ScoreDistributionChart data={scoreDistribution} />
        </div>

        {/* ── Activity Feed ── */}
        <ActivityFeed data={recentActivity} />

        {/* ── Performance Table ── */}
        <PerformanceTable
          data={trainingPerformance}
          onViewTraining={onViewTraining}
          onExportCsv={onExportCsv}
        />
      </div>
    </div>
  )
}
