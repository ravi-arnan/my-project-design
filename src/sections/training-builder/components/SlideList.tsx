import { useState } from 'react'
import type {
  Slide,
  SlideType,
  QuizQuestion,
  RulesPage,
} from '@/../product/sections/training-builder/types'
import {
  FileText,
  Video,
  HelpCircle,
  GripVertical,
  Plus,
  ChevronDown,
  Import,
  ScrollText,
  ListChecks,
  Layers,
} from 'lucide-react'

type LeftTab = 'slides' | 'rules' | 'quiz'

interface SlideListProps {
  slides: Slide[]
  quizQuestions: QuizQuestion[]
  rulesPage: RulesPage
  selectedSlideId: string | null
  activeTab: LeftTab
  onTabChange: (tab: LeftTab) => void
  onSelectSlide?: (slideId: string) => void
  onAddSlide?: (type: SlideType) => void
  onAddQuizQuestion?: () => void
  onImportQuestions?: () => void
  onSelectRules: () => void
  onSelectQuiz: () => void
}

const slideTypeIcons: Record<SlideType, typeof FileText> = {
  text: FileText,
  video: Video,
  question: HelpCircle,
}

const slideTypeLabels: Record<SlideType, string> = {
  text: 'Text',
  video: 'Video',
  question: 'Question',
}

export function SlideList({
  slides,
  quizQuestions,
  selectedSlideId,
  activeTab,
  onTabChange,
  onSelectSlide,
  onAddSlide,
  onAddQuizQuestion,
  onImportQuestions,
  onSelectRules,
  onSelectQuiz,
}: SlideListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
  const sortedQuestions = [...quizQuestions].sort((a, b) => a.order - b.order)

  const tabs: { id: LeftTab; label: string; icon: typeof Layers; count?: number }[] = [
    { id: 'slides', label: 'Slides', icon: Layers, count: slides.length },
    { id: 'rules', label: 'Rules', icon: ScrollText },
    { id: 'quiz', label: 'Quiz', icon: ListChecks, count: quizQuestions.length },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/60 px-1 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id)
                if (tab.id === 'rules') onSelectRules()
                if (tab.id === 'quiz') onSelectQuiz()
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wide transition-colors relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={13} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'slides' && (
          <div className="py-1">
            {sortedSlides.map((slide) => {
              const Icon = slideTypeIcons[slide.type]
              const isSelected = selectedSlideId === slide.id
              return (
                <button
                  key={slide.id}
                  onClick={() => onSelectSlide?.(slide.id)}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-l-2 border-indigo-500 dark:border-indigo-400'
                      : 'border-l-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <GripVertical
                    size={12}
                    className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab"
                  />
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded flex-shrink-0 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {slide.order}
                  </span>
                  <Icon
                    size={13}
                    className={
                      isSelected
                        ? 'text-indigo-500 dark:text-indigo-400 flex-shrink-0'
                        : 'text-slate-400 dark:text-slate-500 flex-shrink-0'
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-medium truncate ${
                        isSelected
                          ? 'text-indigo-900 dark:text-indigo-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {slide.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {slideTypeLabels[slide.type]}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="py-1">
            {sortedQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => onSelectQuiz()}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 truncate min-w-0 flex-1 font-medium">
                  {q.questionText}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {q.pointValue}pts
                </span>
              </button>
            ))}
            {quizQuestions.length === 0 && (
              <div className="px-3 py-6 text-center">
                <HelpCircle size={20} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">No quiz questions yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="px-3 py-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 p-3">
              <ScrollText size={16} className="text-indigo-500 dark:text-indigo-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rules Page
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                Configure what trainees see before starting. Set completion rules, exit behavior, and display options.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {activeTab === 'slides' && (
        <div className="border-t border-slate-200 dark:border-slate-700/60 p-2 relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Slide
            <ChevronDown size={11} className={`transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
          </button>
          {showAddMenu && (
            <div className="absolute bottom-full left-2 right-2 mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-10">
              {(['text', 'video', 'question'] as SlideType[]).map((type) => {
                const Icon = slideTypeIcons[type]
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onAddSlide?.(type)
                      setShowAddMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Icon size={13} className="text-slate-400 dark:text-slate-500" />
                    {slideTypeLabels[type]} Slide
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="border-t border-slate-200 dark:border-slate-700/60 p-2 flex gap-1.5">
          <button
            onClick={() => onAddQuizQuestion?.()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Question
          </button>
          <button
            onClick={() => onImportQuestions?.()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Import size={13} />
            Import
          </button>
        </div>
      )}
    </div>
  )
}
