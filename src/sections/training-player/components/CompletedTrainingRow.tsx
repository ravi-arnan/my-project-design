import type { CompletedTraining } from '@/../product/sections/training-player/types'

interface CompletedTrainingRowProps {
  training: CompletedTraining
}

export function CompletedTrainingRow({ training }: CompletedTrainingRowProps) {
  const formattedDate = new Date(training.completedDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 py-3.5 px-1 group">
      {/* Pass/fail indicator */}
      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
        training.passed
          ? 'bg-emerald-50 dark:bg-emerald-950'
          : 'bg-red-50 dark:bg-red-950'
      }`}>
        {training.passed ? (
          <svg className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-4.5 h-4.5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Title + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {training.title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {formattedDate}
          {training.attemptCount > 1 && (
            <span className="ml-1.5 text-slate-300 dark:text-slate-600">
              &middot; {training.attemptCount} attempts
            </span>
          )}
        </p>
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        <span className={`text-sm font-semibold tabular-nums ${
          training.passed
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-500 dark:text-red-400'
        }`}>
          {training.score}%
        </span>
      </div>
    </div>
  )
}
