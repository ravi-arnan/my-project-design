import type { AssignedTraining } from '@/../product/sections/training-player/types'

interface TrainingCardProps {
  training: AssignedTraining
  onOpen?: () => void
}

function formatDueDate(dateStr: string, status: string): string {
  const due = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays <= 7) return `Due in ${diffDays}d`
  return `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

const statusConfig = {
  overdue: {
    label: 'OVERDUE',
    badge: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
  },
  in_progress: {
    label: 'IN PROGRESS',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
  },
  pending: {
    label: 'PENDING',
    dot: 'bg-amber-500 dark:bg-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
  },
} as const

const categoryLabels: Record<string, string> = {
  skills: 'SKILLS',
  compliance: 'COMPLIANCE',
  onboarding: 'ONBOARDING',
  safety: 'SAFETY',
  general: 'GENERAL',
}

export function TrainingCard({ training, onOpen }: TrainingCardProps) {
  const status = statusConfig[training.status]
  const progressPct = training.currentSlideIndex !== null
    ? Math.round((training.currentSlideIndex / training.slideCount) * 100)
    : 0

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
      {/* Top row: status badge + category */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md ${status.badge}`}>
          {('dot' in status) && <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />}
          {status.label}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          {categoryLabels[training.category] || training.category?.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
        {training.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {training.description}
      </p>

      {/* Progress bar (only for in-progress) */}
      {training.status === 'in_progress' && training.currentSlideIndex !== null && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-violet-400">
              Slide {training.currentSlideIndex} of {training.slideCount}
            </span>
            <span className="text-xs font-medium text-violet-400">
              {progressPct}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta row: duration + slides (left), due date (right) */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {training.estimatedDuration} min
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {training.slideCount} slides
          </span>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${
          training.status === 'overdue' ? 'text-red-400' : 'text-slate-500'
        }`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
          </svg>
          {formatDueDate(training.dueDate, training.status)}
        </span>
      </div>

      {/* Action button */}
      {training.status === 'in_progress' ? (
        <button
          onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Resume Training
        </button>
      ) : (
        <button
          onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium py-2 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          Start Training
        </button>
      )}
    </div>
  )
}
