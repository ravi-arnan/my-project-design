import { useState } from 'react'
import type { QuizQuestion, QuizLayout } from '@/../product/sections/training-player/types'

interface QuizScreenProps {
  questions: QuizQuestion[]
  quizLayout: QuizLayout
  trainingId: string
  trainingTitle?: string
  elapsedSeconds?: number
  onSubmitQuizAnswer?: (questionId: string, selectedIndex: number) => void
  onSubmitQuiz?: (trainingId: string) => void
  onExitAttempt?: (trainingId: string) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function QuizScreen({
  questions,
  quizLayout,
  trainingId,
  trainingTitle = 'Quiz',
  elapsedSeconds = 0,
  onSubmitQuizAnswer,
  onSubmitQuiz,
  onExitAttempt,
}: QuizScreenProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length
  const currentQuestion = questions[currentQuestionIndex]

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
    onSubmitQuizAnswer?.(questionId, optionIndex)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setMobileNavOpen(false)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    if (!confirmSubmit) {
      setConfirmSubmit(true)
      return
    }
    onSubmitQuiz?.(trainingId)
  }

  /* ====== Render a single question card ====== */
  const renderQuestion = (question: QuizQuestion, index: number) => {
    const selected = answers[question.id]

    return (
      <div key={question.id} className="mb-6 last:mb-0">
        {/* Question header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-xs font-bold tabular-nums shrink-0">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2 pl-9">
          {question.options.map((option, optIdx) => {
            const isSelected = selected === optIdx

            return (
              <button
                key={optIdx}
                onClick={() => selectAnswer(question.id, optIdx)}
                className={`w-full flex items-center gap-3.5 border rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-400 dark:border-violet-600 ring-1 ring-violet-400/30'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 cursor-pointer'
                }`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className={`text-sm ${
                  isSelected ? 'text-violet-700 dark:text-violet-300 font-medium' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {option}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          {/* Question nav toggle - mobile */}
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors md:hidden"
            title="Question Navigation"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
          </button>

          <button
            onClick={() => onExitAttempt?.(trainingId)}
            className="p-1.5 -ml-1 md:ml-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Exit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Quiz
            </span>
            {quizLayout === 'one_at_a_time' && (
              <>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  Q{currentQuestionIndex + 1} of {questions.length}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Answered counter */}
          <span className={`text-xs font-medium tabular-nums px-2.5 py-1 rounded-md ${
            allAnswered
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {answeredCount}/{questions.length}
          </span>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </header>

      {/* =========== MOBILE NAV OVERLAY =========== */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col animate-slide-in-left shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between h-12 px-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Questions</span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <QuestionNav
              questions={questions}
              answers={answers}
              currentIndex={currentQuestionIndex}
              trainingTitle={trainingTitle}
              onSelect={goToQuestion}
              layout={quizLayout}
            />
          </aside>
        </div>
      )}

      {/* =========== BODY =========== */}
      <div className="flex flex-1 min-h-0">

        {/* -------- LEFT SIDEBAR (desktop) -------- */}
        <aside className="hidden md:flex flex-col w-[220px] bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          <QuestionNav
            questions={questions}
            answers={answers}
            currentIndex={currentQuestionIndex}
            trainingTitle={trainingTitle}
            onSelect={goToQuestion}
            layout={quizLayout}
          />
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-6 sm:px-10 lg:px-12 py-8 sm:py-10">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {quizLayout === 'one_at_a_time'
                    ? `Question ${currentQuestionIndex + 1}`
                    : `${trainingTitle} — Quiz`
                  }
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {quizLayout === 'one_at_a_time'
                    ? `${questions.length - answeredCount} questions remaining`
                    : `${answeredCount} of ${questions.length} answered`
                  }
                </p>
              </div>
            </div>

            {/* === ONE AT A TIME === */}
            {quizLayout === 'one_at_a_time' && currentQuestion && (
              <div>
                {renderQuestion(currentQuestion, currentQuestionIndex)}
              </div>
            )}

            {/* === ALL ON ONE PAGE === */}
            {quizLayout === 'all_on_one_page' && (
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-5 sm:px-6 sm:py-6"
                  >
                    {renderQuestion(q, i)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -------- BOTTOM ACTION BAR -------- */}
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-10 lg:px-12 py-4">
            <div className="flex items-center justify-between">
              {/* Left: nav or info */}
              <div className="flex items-center gap-2">
                {quizLayout === 'one_at_a_time' && (
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentQuestionIndex === 0
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Previous
                  </button>
                )}
                {quizLayout === 'all_on_one_page' && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {allAnswered ? 'All questions answered' : `${questions.length - answeredCount} unanswered`}
                  </p>
                )}
              </div>

              {/* Right: Next / Submit */}
              <div className="flex items-center gap-3">
                {quizLayout === 'one_at_a_time' && currentQuestionIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-200"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                )}

                {(quizLayout === 'all_on_one_page' || currentQuestionIndex === questions.length - 1) && (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      allAnswered
                        ? confirmSubmit
                          ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/25'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {confirmSubmit ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        Confirm Submit
                      </>
                    ) : (
                      <>
                        Submit Quiz
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* =========== QUESTION NAV SIDEBAR =========== */

function QuestionNav({
  questions,
  answers,
  currentIndex,
  trainingTitle,
  onSelect,
  layout,
}: {
  questions: QuizQuestion[]
  answers: Record<string, number>
  currentIndex: number
  trainingTitle: string
  onSelect: (index: number) => void
  layout: QuizLayout
}) {
  const answeredCount = Object.keys(answers).length
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{trainingTitle}</p>
            <p className="text-[11px] text-slate-500 truncate">Quiz</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400 leading-none">{answeredCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Answered</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{questions.length - answeredCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Remaining</p>
          </div>
        </div>
      </div>

      {/* Question list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
          Questions
        </p>
        {questions.map((q, i) => {
          const isAnswered = q.id in answers
          const isCurrent = layout === 'one_at_a_time' && i === currentIndex

          return (
            <button
              key={q.id}
              onClick={() => onSelect(i)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 relative group text-left ${
                isCurrent
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {isCurrent && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-500" />
              )}

              {/* Status indicator */}
              <span className="shrink-0">
                {isAnswered ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : isCurrent ? (
                  <span className="w-4 h-4 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  </span>
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-[10px] font-semibold text-slate-400 dark:text-slate-600 tabular-nums">
                    {i + 1}
                  </span>
                )}
              </span>

              <span className="truncate flex-1">Question {i + 1}</span>

              {isAnswered && (
                <span className="text-[10px] font-medium text-emerald-500 shrink-0">
                  {String.fromCharCode(65 + answers[q.id])}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Progress footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-medium">Completion</span>
          <span className="text-[10px] text-violet-400 font-semibold tabular-nums">{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
