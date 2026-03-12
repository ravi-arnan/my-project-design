import { useState } from 'react'
import type { Slide, PlayerState } from '@/../product/sections/training-player/types'

interface SlidePlayerProps {
  slides: Slide[]
  playerState: PlayerState
  trainingTitle?: string
  onNextSlide?: (trainingId: string, slideIndex: number) => void
  onAnswerInlineQuestion?: (questionId: string, selectedIndex: number) => void
  onPause?: (trainingId: string) => void
  onResume?: (trainingId: string) => void
  onExitAttempt?: (trainingId: string) => void
  onBack?: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

const slideTypeConfig = {
  text: {
    label: 'TEXT',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  video: {
    label: 'VIDEO',
    color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-500 dark:text-violet-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  inline_question: {
    label: 'QUESTION',
    color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
} as const

export function SlidePlayer({
  slides,
  playerState,
  trainingTitle = 'Training',
  onNextSlide,
  onAnswerInlineQuestion,
  onPause,
  onResume,
  onExitAttempt,
  onBack,
}: SlidePlayerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false)

  const currentIndex = playerState.currentSlideIndex
  const currentSlide = slides[currentIndex]
  const progressPct = Math.round(((currentIndex + 1) / slides.length) * 100)
  const isLastSlide = currentIndex === slides.length - 1

  const canAdvance = () => {
    if (!currentSlide) return false
    if (currentSlide.type === 'inline_question' && !answerSubmitted) return false
    return true
  }

  const handleNext = () => {
    if (!canAdvance()) return
    setSelectedAnswer(null)
    setAnswerSubmitted(false)
    onNextSlide?.(playerState.trainingId, currentIndex + 1)
  }

  const handleAnswerSelect = (index: number) => {
    if (answerSubmitted) return
    setSelectedAnswer(index)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentSlide?.question) return
    setAnswerSubmitted(true)
    onAnswerInlineQuestion?.(currentSlide.question.id, selectedAnswer)
  }

  if (!currentSlide) return null

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          {/* Outline toggle - mobile */}
          <button
            onClick={() => setMobileOutlineOpen(v => !v)}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors md:hidden"
            title="Slide Outline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>

          <button
            onClick={() => onExitAttempt?.(playerState.trainingId)}
            className="p-1.5 -ml-1 md:ml-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Exit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

          {/* Progress inline */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
              Slide {currentIndex + 1}
              <span className="text-slate-400 dark:text-slate-500 font-normal"> / {slides.length}</span>
            </span>
            <div className="hidden sm:block w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="hidden sm:block text-[10px] text-violet-500 dark:text-violet-400 font-semibold tabular-nums">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Right cluster: timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {formatTime(playerState.elapsedSeconds)}
          </div>

          {playerState.allowPause && (
            <button
              onClick={() => playerState.isPaused
                ? onResume?.(playerState.trainingId)
                : onPause?.(playerState.trainingId)
              }
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              title={playerState.isPaused ? 'Resume' : 'Pause'}
            >
              {playerState.isPaused ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {/* =========== MOBILE OUTLINE OVERLAY =========== */}
      {mobileOutlineOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOutlineOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col animate-slide-in-left shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between h-12 px-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Outline</span>
              <button
                onClick={() => setMobileOutlineOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SlideOutline slides={slides} currentIndex={currentIndex} trainingTitle={trainingTitle} />
          </aside>
        </div>
      )}

      {/* =========== BODY: SIDEBAR + CONTENT =========== */}
      <div className="flex flex-1 min-h-0">

        {/* -------- LEFT SIDEBAR: Slide Outline (desktop) -------- */}
        <aside className="hidden md:flex flex-col w-[220px] bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          <SlideOutline slides={slides} currentIndex={currentIndex} trainingTitle={trainingTitle} />
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-6 sm:px-10 lg:px-12 py-8 sm:py-10">

            {/* Slide type badge + title */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${slideTypeConfig[currentSlide.type].color}`}>
                {slideTypeConfig[currentSlide.type].icon}
                {slideTypeConfig[currentSlide.type].label}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                {currentIndex + 1} / {slides.length}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {currentSlide.title}
            </h2>

            {/* === TEXT SLIDE === */}
            {currentSlide.type === 'text' && currentSlide.content && (
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-6 sm:px-8 sm:py-8">
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {currentSlide.content}
                </p>
              </div>
            )}

            {/* === VIDEO SLIDE === */}
            {currentSlide.type === 'video' && (
              <div className="bg-slate-900 dark:bg-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
                {/* Video placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/80">{currentSlide.title}</p>
                    {currentSlide.videoDurationSeconds && (
                      <p className="text-xs text-white/50 mt-1">
                        {formatDuration(currentSlide.videoDurationSeconds)}
                      </p>
                    )}
                  </div>
                </div>
                {/* Progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <div className="h-full w-1/3 bg-violet-500 rounded-r-full" />
                </div>
              </div>
            )}

            {/* === INLINE QUESTION SLIDE === */}
            {currentSlide.type === 'inline_question' && currentSlide.question && (
              <div className="space-y-4">
                {/* Question */}
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-5">
                  <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                    {currentSlide.question.text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentSlide.question.options.map((option, i) => {
                    const isSelected = selectedAnswer === i
                    const isCorrect = i === currentSlide.question!.correctIndex
                    const showResult = answerSubmitted

                    let optionStyle = 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 cursor-pointer'
                    if (isSelected && !showResult) {
                      optionStyle = 'bg-violet-50 dark:bg-violet-950/30 border-violet-400 dark:border-violet-600 ring-1 ring-violet-400/30'
                    }
                    if (showResult && isCorrect) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600'
                    }
                    if (showResult && isSelected && !isCorrect) {
                      optionStyle = 'bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-600'
                    }
                    if (showResult && !isSelected && !isCorrect) {
                      optionStyle = 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 opacity-50'
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(i)}
                        disabled={answerSubmitted}
                        className={`w-full flex items-center gap-4 border rounded-xl px-5 py-4 text-left transition-all duration-150 ${optionStyle}`}
                      >
                        {/* Letter badge */}
                        <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          showResult && isCorrect
                            ? 'bg-emerald-500 text-white'
                            : showResult && isSelected && !isCorrect
                              ? 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-violet-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className={`text-sm ${
                          showResult && isCorrect
                            ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                            : showResult && isSelected && !isCorrect
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {option}
                        </span>
                        {/* Result indicator */}
                        {showResult && isCorrect && (
                          <svg className="w-5 h-5 text-emerald-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <svg className="w-5 h-5 text-red-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Submit answer button (before submission) */}
                {!answerSubmitted && selectedAnswer !== null && (
                  <button
                    onClick={handleAnswerSubmit}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
                  >
                    Check Answer
                  </button>
                )}

                {/* Explanation (after submission) */}
                {answerSubmitted && currentSlide.question.explanation && (
                  <div className={`rounded-xl px-5 py-4 border ${
                    selectedAnswer === currentSlide.question.correctIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 mt-0.5 ${
                        selectedAnswer === currentSlide.question.correctIndex
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        selectedAnswer === currentSlide.question.correctIndex
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        {currentSlide.question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* -------- BOTTOM ACTION BAR -------- */}
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-10 lg:px-12 py-4">
            <div className="flex items-center justify-between">
              {/* Left: slide counter (mobile) */}
              <div className="flex items-center gap-2 sm:hidden">
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-violet-500 font-semibold tabular-nums">{progressPct}%</span>
              </div>

              {/* Left: previous context (desktop) */}
              <div className="hidden sm:block">
                {currentIndex > 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Previous: {slides[currentIndex - 1].title}
                  </p>
                )}
              </div>

              {/* Right: Next / Finish button */}
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  canAdvance()
                    ? isLastSlide
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLastSlide ? 'Start Quiz' : 'Next'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* =========== SLIDE OUTLINE (shared sidebar content) =========== */

function SlideOutline({
  slides,
  currentIndex,
  trainingTitle,
}: {
  slides: Slide[]
  currentIndex: number
  trainingTitle: string
}) {
  const completedCount = currentIndex
  const progressPct = Math.round(((currentIndex + 1) / slides.length) * 100)

  return (
    <div className="flex flex-col h-full">
      {/* Training title */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {trainingTitle}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              Slide {currentIndex + 1} of {slides.length}
            </p>
          </div>
        </div>

        {/* Progress stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{completedCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Done</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{slides.length - completedCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Remaining</p>
          </div>
        </div>
      </div>

      {/* Slide list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
          Slides
        </p>
        {slides.map((slide, i) => {
          const isCurrent = i === currentIndex
          const isCompleted = i < currentIndex
          const config = slideTypeConfig[slide.type]

          return (
            <div
              key={slide.id}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 relative ${
                isCurrent
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : isCompleted
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {isCurrent && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-500" />
              )}

              {/* Status indicator */}
              <span className="shrink-0">
                {isCompleted ? (
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

              {/* Title */}
              <span className="truncate flex-1">{slide.title}</span>

              {/* Type indicator */}
              <span className={`shrink-0 ${isCurrent || isCompleted ? '' : 'opacity-50'}`}>
                {config.icon}
              </span>
            </div>
          )
        })}
      </nav>

      {/* Progress bar footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-medium">Progress</span>
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
