import { useState, useRef, useEffect } from 'react'
import type {
  TrainingBuilderProps,
  TrainingStatus,
  Slide,
  Training,
} from '@/../product/sections/training-builder/types'
import {
  ArrowLeft,
  Eye,
  Rocket,
  Clock,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
  Menu,
  X,
} from 'lucide-react'
import { SlideList } from './SlideList'
import { SlideEditor } from './SlideEditor'
import { RulesPageEditor } from './RulesPageEditor'
import { QuizEditor } from './QuizEditor'
import { SlideSettings } from './SlideSettings'
import { TrainingSettings } from './TrainingSettings'

type LeftTab = 'slides' | 'rules' | 'quiz'
type CenterView = 'slide' | 'rules' | 'quiz'

const statusConfig: Record<TrainingStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: {
    label: 'Draft',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  published: {
    label: 'Published',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
}

function formatLastSaved(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function TrainingBuilder({
  departments,
  trainings,
  activeTraining,
  onBack,
  onPreview,
  onPublish,
  onUpdateTitle,
  onAddSlide,
  onSelectSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onUpdateSlide,
  onReorderSlides,
  onAddQuizQuestion,
  onUpdateQuizQuestion,
  onDeleteQuizQuestion,
  onReorderQuizQuestions,
  onImportQuestions,
  onUpdateSettings,
  onUpdateRulesPage,
}: TrainingBuilderProps) {
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    activeTraining.slides[0]?.id ?? null
  )
  const [leftTab, setLeftTab] = useState<LeftTab>('slides')
  const [centerView, setCenterView] = useState<CenterView>('slide')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(activeTraining.title)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const selectedSlide = activeTraining.slides.find((s) => s.id === selectedSlideId) ?? null

  // Find the full training object for settings
  const currentTraining = trainings.find((t) => t.id === activeTraining.id) ?? trainings[0]

  const status = statusConfig[activeTraining.status]

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [isEditingTitle])

  const handleSlideSelect = (slideId: string) => {
    setSelectedSlideId(slideId)
    setCenterView('slide')
    onSelectSlide?.(slideId)
    setMobileMenuOpen(false)
  }

  const handleSelectRules = () => {
    setCenterView('rules')
    setSelectedSlideId(null)
  }

  const handleSelectQuiz = () => {
    setCenterView('quiz')
    setSelectedSlideId(null)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (titleValue !== activeTraining.title) {
      onUpdateTitle?.(titleValue)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur()
    }
    if (e.key === 'Escape') {
      setTitleValue(activeTraining.title)
      setIsEditingTitle(false)
    }
  }

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        {/* Left cluster */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => onBack?.()}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Back to list"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Divider */}
          <span className="hidden md:block w-px h-5 bg-slate-200 dark:bg-slate-700" />

          {/* Title */}
          {isEditingTitle ? (
            <input
              ref={titleRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-indigo-400 dark:border-indigo-500 focus:outline-none px-0.5 py-0 min-w-0 max-w-[260px]"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-[180px] md:max-w-[260px] transition-colors"
              title="Click to edit title"
            >
              {activeTraining.title}
            </button>
          )}

          {/* Status badge */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          {/* Last saved */}
          <span className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mr-2">
            <Clock size={10} />
            Auto-saved {formatLastSaved(activeTraining.lastSaved)}
          </span>

          {/* Panel toggles - desktop */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title={leftPanelOpen ? 'Hide left panel' : 'Show left panel'}
          >
            {leftPanelOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
          </button>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title={rightPanelOpen ? 'Hide right panel' : 'Show right panel'}
          >
            {rightPanelOpen ? <PanelRightClose size={15} /> : <PanelRight size={15} />}
          </button>

          <span className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Preview */}
          <button
            onClick={() => onPreview?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Publish */}
          <button
            onClick={() => onPublish?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-md transition-colors shadow-sm"
          >
            <Rocket size={12} />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* =========== MAIN CONTENT =========== */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile overlay for left panel */}
        {mobileMenuOpen && (
          <div
            className="absolute inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* -------- LEFT PANEL -------- */}
        <aside
          className={`
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            ${leftPanelOpen ? 'md:w-[280px]' : 'md:w-0 md:overflow-hidden'}
            absolute md:relative z-40 md:z-auto
            w-[280px] h-full
            bg-slate-50 dark:bg-slate-900/80
            border-r border-slate-200 dark:border-slate-800
            flex-shrink-0
            transition-all duration-200 ease-in-out
          `}
        >
          <SlideList
            slides={activeTraining.slides}
            quizQuestions={activeTraining.quizQuestions}
            rulesPage={currentTraining?.rulesPage ?? {
              title: '',
              description: '',
              customInstructions: null,
              allowPause: false,
              mustCompleteInOneSitting: false,
              exitBehavior: 'abandon' as const,
              lockQuizUntilSlidesComplete: false,
              requireMinimumVideoWatch: false,
              showEstimatedDuration: false,
              showPassingScore: false,
              showQuestionCount: false,
            }}
            selectedSlideId={selectedSlideId}
            activeTab={leftTab}
            onTabChange={setLeftTab}
            onSelectSlide={handleSlideSelect}
            onAddSlide={onAddSlide}
            onAddQuizQuestion={onAddQuizQuestion}
            onImportQuestions={onImportQuestions}
            onSelectRules={handleSelectRules}
            onSelectQuiz={handleSelectQuiz}
          />
        </aside>

        {/* -------- CENTER PANEL -------- */}
        <main className="flex-1 min-w-0 bg-white dark:bg-slate-900/40 overflow-hidden">
          {centerView === 'slide' && selectedSlide && (
            <SlideEditor
              slide={selectedSlide}
              onUpdateSlide={onUpdateSlide}
              onDeleteSlide={onDeleteSlide}
              onDuplicateSlide={onDuplicateSlide}
            />
          )}
          {centerView === 'slide' && !selectedSlide && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Eye size={24} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">
                No slide selected
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600">
                Select a slide from the left panel to start editing
              </p>
            </div>
          )}
          {centerView === 'rules' && currentTraining && (
            <RulesPageEditor
              rulesPage={currentTraining.rulesPage}
              onUpdateRulesPage={onUpdateRulesPage}
            />
          )}
          {centerView === 'quiz' && (
            <QuizEditor
              quizQuestions={activeTraining.quizQuestions}
              onUpdateQuizQuestion={onUpdateQuizQuestion}
              onDeleteQuizQuestion={onDeleteQuizQuestion}
            />
          )}
        </main>

        {/* -------- RIGHT PANEL -------- */}
        <aside
          className={`
            ${rightPanelOpen ? 'w-[336px]' : 'w-0 overflow-hidden'}
            hidden md:block
            h-full
            bg-white dark:bg-slate-900
            border-l border-slate-200 dark:border-slate-800
            flex-shrink-0
            transition-all duration-200 ease-in-out
            overflow-y-auto overflow-x-hidden
          `}
        >
          <div className="w-[320px] pr-2">
            {/* Contextual slide settings */}
            {selectedSlide && centerView === 'slide' && (
              <SlideSettings
                slide={selectedSlide}
                onUpdateSlide={onUpdateSlide}
              />
            )}

            {/* Training settings - always shown */}
            {currentTraining && (
              <TrainingSettings
                training={currentTraining}
                departments={departments}
                onUpdateSettings={onUpdateSettings}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
