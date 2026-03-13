import type {
  AttemptDetail,
  AttemptEvent,
  AttemptEventType,
  AttemptAnswer,
} from '@/../product/sections/analytics-and-tracking/types'

/* ────────────────────────────────────────────
   Types & Helpers
   ──────────────────────────────────────────── */

interface AttemptDetailDrawerProps {
  attemptDetail: AttemptDetail
  open: boolean
  onClose?: () => void
  onViewUser?: (employeeId: string) => void
  onViewTraining?: (trainingId: string) => void
}

const EVENT_STYLES: Record<AttemptEventType, { icon: string; color: string; bg: string }> = {
  started: { icon: '▶', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  paused: { icon: '⏸', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  resumed: { icon: '▶', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  slide_completed: { icon: '✓', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  quiz_started: { icon: '?', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  submitted: { icon: '✓', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
}

const EVENT_LABELS: Record<AttemptEventType, string> = {
  started: 'Started',
  paused: 'Paused',
  resumed: 'Resumed',
  slide_completed: 'Slide Completed',
  quiz_started: 'Quiz Started',
  submitted: 'Submitted',
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function timeBetween(a: string, b: string): string {
  const diffMs = new Date(b).getTime() - new Date(a).getTime()
  const secs = Math.floor(diffMs / 1000)
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  const remSecs = secs % 60
  return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`
}

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */

/* ── Score Summary ── */

function ScoreSummary({ attempt }: { attempt: AttemptDetail }) {
  const passed = attempt.status === 'passed'
  const scorePercent = attempt.totalQuestions > 0
    ? (attempt.correctAnswers / attempt.totalQuestions) * 100
    : 0

  return (
    <div className={`rounded border px-4 py-3 ${
      passed
        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20'
        : 'border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
          passed
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
        }`}>
          {attempt.status}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          Attempt #{attempt.attemptNumber}
        </span>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              className={passed ? 'stroke-emerald-500 dark:stroke-emerald-400' : 'stroke-red-500 dark:stroke-red-400'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${scorePercent * 0.9738} 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold font-mono tabular-nums ${
              passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {attempt.score}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 flex-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Passing Score</span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">{attempt.passingScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Duration</span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">{attempt.durationMinutes}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Correct</span>
            <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{attempt.correctAnswers}/{attempt.totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Incorrect</span>
            <span className="font-mono tabular-nums text-red-600 dark:text-red-400">{attempt.incorrectAnswers}/{attempt.totalQuestions}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Event Timeline ── */

function EventTimeline({ events }: { events: AttemptEvent[] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Timeline
      </p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-0">
          {events.map((event, i) => {
            const style = EVENT_STYLES[event.type]
            const elapsed = i > 0 ? timeBetween(events[i - 1].timestamp, event.timestamp) : null

            return (
              <div key={i} className="relative flex items-start gap-2.5 py-1.5">
                {/* Dot */}
                <div className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] shrink-0 ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>

                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {EVENT_LABELS[event.type]}
                    </span>
                    {event.detail && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">
                        {event.detail}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {elapsed && (
                      <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                        +{elapsed}
                      </span>
                    )}
                    <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Answer Breakdown Table ── */

function AnswerBreakdown({ answers }: { answers: AttemptAnswer[] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Answer Breakdown
      </p>
      <div className="space-y-2">
        {answers.map((answer, i) => (
          <div
            key={answer.questionId}
            className={`rounded border px-3 py-2 ${
              answer.isCorrect
                ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60'
                : 'border-red-200 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20'
            }`}
          >
            {/* Question header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug flex-1">
                <span className="text-slate-400 dark:text-slate-500 font-mono mr-1">Q{i + 1}.</span>
                {answer.questionText}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                  {answer.timeSpentSeconds}s
                </span>
                {answer.isCorrect ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 3L7 7M7 3L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-600 dark:text-red-400" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Answers */}
            <div className="space-y-0.5">
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="text-slate-400 dark:text-slate-500 shrink-0 w-14 text-right">Selected:</span>
                <span className={answer.isCorrect
                  ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-red-700 dark:text-red-400 font-medium line-through decoration-red-300 dark:decoration-red-700'
                }>
                  {answer.selectedAnswer}
                </span>
              </div>
              {!answer.isCorrect && (
                <div className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500 shrink-0 w-14 text-right">Correct:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {answer.correctAnswer}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export function AttemptDetailDrawer({
  attemptDetail,
  open,
  onClose,
  onViewUser,
  onViewTraining,
}: AttemptDetailDrawerProps) {
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
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Attempt Detail
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                <button
                  onClick={() => onViewUser?.(attemptDetail.employeeId)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors font-medium"
                >
                  {attemptDetail.employeeName}
                </button>
                <span>·</span>
                <button
                  onClick={() => onViewTraining?.(attemptDetail.trainingId)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors font-medium truncate max-w-[200px]"
                >
                  {attemptDetail.trainingTitle}
                </button>
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
            {/* ── Score Summary ── */}
            <ScoreSummary attempt={attemptDetail} />

            {/* ── Time Info ── */}
            <div className="flex items-center justify-between text-xs px-1">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Started: </span>
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {formatDateTime(attemptDetail.startedAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Completed: </span>
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {formatDateTime(attemptDetail.completedAt)}
                </span>
              </div>
            </div>

            {/* ── Event Timeline ── */}
            <div className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60 px-3 py-3">
              <EventTimeline events={attemptDetail.events} />
            </div>

            {/* ── Answer Breakdown ── */}
            <AnswerBreakdown answers={attemptDetail.answers} />
          </div>
        </div>
      </div>
    </>
  )
}
