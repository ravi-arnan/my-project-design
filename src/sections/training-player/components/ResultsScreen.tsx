import type { AttemptResult, QuizQuestion, AttemptAnswer } from '@/../product/sections/training-player/types'

interface ResultsScreenProps {
  result: AttemptResult
  questions: QuizQuestion[]
  trainingTitle?: string
  maxAttempts?: number | null
  onReturnToDashboard?: () => void
  onRetryQuiz?: (trainingId: string) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function ResultsScreen({
  result,
  questions,
  trainingTitle = 'Training',
  maxAttempts = null,
  onReturnToDashboard,
  onRetryQuiz,
}: ResultsScreenProps) {
  const canRetry = maxAttempts === null || result.attemptNumber < maxAttempts
  const questionsMap = new Map(questions.map(q => [q.id, q]))

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 ml-1" />
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400 truncate">Training Player</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Results</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
            result.passed
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
          }`}>
            {result.passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>
      </header>

      {/* =========== BODY =========== */}
      <div className="flex flex-1 min-h-0">

        {/* -------- LEFT SIDEBAR (desktop) -------- */}
        <aside className="hidden md:flex flex-col w-[220px] bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          <ResultsSidebar
            result={result}
            trainingTitle={trainingTitle}
            maxAttempts={maxAttempts}
          />
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-6 sm:px-10 lg:px-12 py-8 sm:py-10">

            {/* Pass/Fail hero */}
            <div className="flex items-center gap-4 mb-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                result.passed
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25'
              }`}>
                {result.passed ? (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {result.passed ? 'You Passed!' : 'Not Quite'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {result.passed
                    ? `Great work on ${trainingTitle}`
                    : canRetry
                      ? 'Review your answers and try again'
                      : 'No more attempts remaining'
                  }
                </p>
              </div>
            </div>

            {/* Score + Stats cards (mobile - these are in sidebar on desktop) */}
            <div className="grid grid-cols-3 gap-3 mb-8 md:hidden">
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-center">
                <p className={`text-2xl font-bold leading-none tabular-nums ${
                  result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                }`}>{result.score}%</p>
                <p className="text-[10px] text-slate-500 mt-1.5">Score</p>
              </div>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">
                  {result.questionsCorrect}/{result.questionsTotal}
                </p>
                <p className="text-[10px] text-slate-500 mt-1.5">Correct</p>
              </div>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">
                  {formatDuration(result.totalTimeSeconds)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1.5">Time</p>
              </div>
            </div>

            {/* Answer review section */}
            {result.showDetailedResults && (
              <section>
                <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Answer Review ({result.questionsCorrect} of {result.questionsTotal} correct)
                </h2>
                <div className="space-y-3">
                  {result.answers.map((answer, i) => {
                    const question = questionsMap.get(answer.questionId)
                    if (!question) return null
                    return (
                      <AnswerReviewCard
                        key={answer.questionId}
                        index={i}
                        question={question}
                        answer={answer}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {/* If results are hidden, show minimal summary */}
            {!result.showDetailedResults && (
              <section>
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Detailed results are not available for this training.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    You scored <span className="font-semibold text-slate-900 dark:text-white">{result.score}%</span> and{' '}
                    <span className={`font-semibold ${result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {result.passed ? 'passed' : 'did not pass'}
                    </span>.
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* -------- BOTTOM ACTION BAR -------- */}
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-10 lg:px-12 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Attempt {result.attemptNumber}
                {maxAttempts !== null && ` of ${maxAttempts}`}
              </p>
              <div className="flex items-center gap-3">
                {!result.passed && canRetry && (
                  <button
                    onClick={() => onRetryQuiz?.(result.trainingId)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                    </svg>
                    Try Again
                  </button>
                )}
                <button
                  onClick={() => onReturnToDashboard?.()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    result.passed || !canRetry
                      ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Back to Dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* =========== ANSWER REVIEW CARD =========== */

function AnswerReviewCard({
  index,
  question,
  answer,
}: {
  index: number
  question: QuizQuestion
  answer: AttemptAnswer
}) {
  return (
    <div className={`bg-white dark:bg-slate-900/80 border rounded-xl px-5 py-4 ${
      answer.correct
        ? 'border-emerald-200 dark:border-emerald-800/50'
        : 'border-red-200 dark:border-red-800/50'
    }`}>
      {/* Question header */}
      <div className="flex items-start gap-3 mb-3">
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
          answer.correct
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
        }`}>
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
            {question.text}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 tabular-nums">
            {formatTime(answer.timeSeconds)} spent
          </p>
        </div>
        {/* Result icon */}
        {answer.correct ? (
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Answer options */}
      <div className="space-y-1.5 pl-10">
        {question.options.map((option, optIdx) => {
          const isSelected = answer.selectedIndex === optIdx
          const isCorrectAnswer = question.correctIndex === optIdx

          let style = 'text-slate-400 dark:text-slate-500'
          if (isCorrectAnswer) style = 'text-emerald-600 dark:text-emerald-400 font-medium'
          if (isSelected && !answer.correct) style = 'text-red-500 dark:text-red-400 line-through'

          return (
            <div key={optIdx} className="flex items-center gap-2">
              <span className={`text-[10px] font-bold w-4 text-center ${
                isCorrectAnswer
                  ? 'text-emerald-500'
                  : isSelected && !answer.correct
                    ? 'text-red-400'
                    : 'text-slate-300 dark:text-slate-600'
              }`}>
                {String.fromCharCode(65 + optIdx)}
              </span>
              <p className={`text-xs leading-relaxed ${style}`}>
                {option}
                {isCorrectAnswer && !isSelected && (
                  <span className="ml-1.5 text-emerald-500 text-[10px] font-medium">(correct)</span>
                )}
                {isSelected && isCorrectAnswer && (
                  <span className="ml-1.5 text-emerald-500 text-[10px] font-medium">(your answer)</span>
                )}
                {isSelected && !isCorrectAnswer && (
                  <span className="ml-1.5 text-red-400 text-[10px] font-medium">(your answer)</span>
                )}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* =========== RESULTS SIDEBAR =========== */

function ResultsSidebar({
  result,
  trainingTitle,
  maxAttempts,
}: {
  result: AttemptResult
  trainingTitle: string
  maxAttempts: number | null
}) {
  const scorePct = result.score

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            result.passed
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}>
            {result.passed ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{trainingTitle}</p>
            <p className="text-[11px] text-slate-500 truncate">
              {result.passed ? 'Passed' : 'Failed'} — Attempt {result.attemptNumber}
            </p>
          </div>
        </div>

        {/* Score display */}
        <div className="bg-slate-100 dark:bg-slate-800/60 rounded-xl px-4 py-4 text-center">
          <p className={`text-4xl font-bold leading-none tabular-nums ${
            result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {scorePct}%
          </p>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wider font-medium">Final Score</p>
        </div>
      </div>

      {/* Stats */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
          Summary
        </p>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Correct</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {result.questionsCorrect}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Incorrect</span>
            <span className="text-sm font-semibold text-red-500 dark:text-red-400 tabular-nums">
              {result.questionsTotal - result.questionsCorrect}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Questions</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
              {result.questionsTotal}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />

          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Time</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
              {formatDuration(result.totalTimeSeconds)}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Attempt</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
              {result.attemptNumber}{maxAttempts !== null ? ` / ${maxAttempts}` : ''}
            </span>
          </div>
        </div>
      </nav>

      {/* Score bar footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-medium">Score</span>
          <span className={`text-[10px] font-semibold tabular-nums ${
            result.passed ? 'text-emerald-500' : 'text-red-400'
          }`}>
            {scorePct}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              result.passed
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
            style={{ width: `${scorePct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
