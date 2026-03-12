import { useState } from 'react'
import type { TrainingRules } from '@/../product/sections/training-player/types'

interface TrainingRulesPageProps {
  rules: TrainingRules
  attemptsUsed?: number
  onStartTraining?: (trainingId: string) => void
  onBack?: () => void
}

interface RuleItem {
  icon: React.ReactNode
  label: string
  emphasis?: boolean
}

function buildRuleItems(rules: TrainingRules, attemptsUsed: number): RuleItem[] {
  const items: RuleItem[] = []

  if (rules.mustCompleteInOneSitting) {
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
      label: 'Must be completed in one sitting — you cannot leave and return',
      emphasis: true,
    })
  }

  if (!rules.allowPause) {
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      label: 'Pausing is not allowed — the timer runs continuously',
      emphasis: true,
    })
  }

  if (rules.requireMinimumVideoWatch) {
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
      label: 'Video segments must be watched in full before proceeding',
    })
  }

  if (rules.maxAttempts !== null) {
    const remaining = rules.maxAttempts - attemptsUsed
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
      ),
      label: `${remaining} attempt${remaining !== 1 ? 's' : ''} remaining out of ${rules.maxAttempts} total`,
      emphasis: remaining <= 1,
    })
  }

  if (rules.exitBehavior === 'fail') {
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
      label: 'Leaving the training mid-attempt will count as a failed attempt',
      emphasis: true,
    })
  } else if (rules.exitBehavior === 'abandon') {
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
      ),
      label: 'Leaving mid-attempt will abandon your progress',
    })
  }

  return items
}

export function TrainingRulesPage({
  rules,
  attemptsUsed = 0,
  onStartTraining,
  onBack,
}: TrainingRulesPageProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false)

  const ruleItems = buildRuleItems(rules, attemptsUsed)

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        {/* Left cluster */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Info toggle - mobile only */}
          <button
            onClick={() => setMobileInfoOpen(v => !v)}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors md:hidden"
            title="Training Info"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>

          <button
            onClick={() => onBack?.()}
            className="p-1.5 -ml-1 md:ml-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400 truncate">Training Player</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Training Rules</span>
          </div>
        </div>
      </header>

      {/* =========== MOBILE INFO OVERLAY =========== */}
      {mobileInfoOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileInfoOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col animate-slide-in-left shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between h-12 px-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Training Info</span>
              <button
                onClick={() => setMobileInfoOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent rules={rules} attemptsUsed={attemptsUsed} />
          </aside>
        </div>
      )}

      {/* =========== BODY: SIDEBAR + CONTENT =========== */}
      <div className="flex flex-1 min-h-0">

        {/* -------- LEFT SIDEBAR (desktop) -------- */}
        <aside className="hidden md:flex flex-col w-[220px] bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          <SidebarContent rules={rules} attemptsUsed={attemptsUsed} />
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10">

            {/* Training header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {rules.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Review the rules below before starting
                </p>
              </div>
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                About this Training
              </h2>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rules.description}
                </p>
              </div>
            </section>

            {/* Rules section */}
            <section className="mb-8">
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                Training Rules ({ruleItems.length})
              </h2>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ruleItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5 px-5 py-4">
                      <div className={`shrink-0 mt-0.5 ${
                        item.emphasis
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.icon}
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        item.emphasis
                          ? 'text-slate-900 dark:text-white font-medium'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Custom instructions */}
            {rules.customInstructions && (
              <section className="mb-8">
                <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  Additional Instructions
                </h2>
                <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-xl px-5 py-4">
                  <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed italic">
                    "{rules.customInstructions}"
                  </p>
                </div>
              </section>
            )}

            {/* Acknowledgement + Start */}
            <section>
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-5">
                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group mb-5">
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-150 flex items-center justify-center ${
                      acknowledged
                        ? 'bg-violet-600 border-violet-600 dark:bg-violet-500 dark:border-violet-500'
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                    }`}>
                      {acknowledged && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed select-none">
                    I have read and understand the rules for this training. I am ready to begin.
                  </span>
                </label>

                {/* Start button */}
                <button
                  onClick={() => onStartTraining?.(rules.trainingId)}
                  disabled={!acknowledged}
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    acknowledged
                      ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Start Training
                </button>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                  The timer begins when you click Start Training
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

/* =========== SIDEBAR CONTENT (shared between desktop aside & mobile overlay) =========== */

function SidebarContent({ rules, attemptsUsed }: { rules: TrainingRules; attemptsUsed: number }) {
  const remaining = rules.maxAttempts !== null ? rules.maxAttempts - attemptsUsed : null

  return (
    <div className="flex flex-col h-full">
      {/* Training icon + title */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {rules.title}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              Training Rules
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          {rules.showEstimatedDuration && (
            <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{rules.estimatedDuration}</p>
              <p className="text-[10px] text-slate-500 mt-1">Minutes</p>
            </div>
          )}
          {rules.showQuestionCount && (
            <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{rules.questionCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Questions</p>
            </div>
          )}
        </div>
      </div>

      {/* Details list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
          Details
        </p>

        {rules.showPassingScore && (
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Passing Score</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">{rules.passingScore}%</span>
          </div>
        )}

        <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
          <span className="text-sm text-slate-500 dark:text-slate-400">Pause Allowed</span>
          <span className={`text-sm font-semibold ${rules.allowPause ? 'text-emerald-500' : 'text-red-400'}`}>
            {rules.allowPause ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
          <span className="text-sm text-slate-500 dark:text-slate-400">One Sitting</span>
          <span className={`text-sm font-semibold ${rules.mustCompleteInOneSitting ? 'text-amber-500' : 'text-emerald-500'}`}>
            {rules.mustCompleteInOneSitting ? 'Required' : 'No'}
          </span>
        </div>

        {rules.maxAttempts !== null && (
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Attempts Left</span>
            <span className={`text-sm font-semibold tabular-nums ${
              remaining !== null && remaining <= 1 ? 'text-red-400' : 'text-slate-900 dark:text-white'
            }`}>
              {remaining} / {rules.maxAttempts}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between px-2.5 py-2 rounded-lg">
          <span className="text-sm text-slate-500 dark:text-slate-400">Exit Penalty</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
            {rules.exitBehavior}
          </span>
        </div>
      </nav>

      {/* Readiness indicator */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[11px] text-slate-500 font-medium">Ready to start</span>
        </div>
      </div>
    </div>
  )
}
