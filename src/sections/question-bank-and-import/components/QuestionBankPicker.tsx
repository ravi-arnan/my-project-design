import { useState, useMemo } from 'react'
import type {
  BankQuestion,
  Category,
  QuestionType,
} from '@/../product/sections/question-bank-and-import/types'
import {
  Search,
  X,
  Check,
  Plus,
  LayoutGrid,
  CheckSquare,
  Square,
  ChevronDown,
  BookOpen,
  Lightbulb,
  Library,
  Filter,
  CheckCircle2,
  Circle,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────

interface QuestionBankPickerProps {
  categories: Category[]
  bankQuestions: BankQuestion[]
  onAddToTraining?: (questionIds: string[]) => void
  onClose?: () => void
}

// ── Helpers ──────────────────────────────────────────────

function typeLabel(type: QuestionType): string {
  return type === 'multiple_choice' ? 'Multiple Choice' : 'True / False'
}

// ── Question Preview Card ────────────────────────────────

function QuestionPreview({ question }: { question: BankQuestion }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
          Preview
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          {question.questionText}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              question.type === 'multiple_choice'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
            }`}
          >
            {question.type === 'multiple_choice' ? (
              <LayoutGrid className="w-2.5 h-2.5" strokeWidth={1.5} />
            ) : (
              <CheckSquare className="w-2.5 h-2.5" strokeWidth={1.5} />
            )}
            {typeLabel(question.type)}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{question.category}</span>
        </div>
      </div>

      {/* Options */}
      <div className="px-5 py-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
          Answer Options
        </p>
        <div className="space-y-1.5">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctAnswerIndex
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                    : 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-3 flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {isCorrect ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" strokeWidth={1.5} />
                )}
                <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{opt}</span>
                {isCorrect && (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex-shrink-0">
                    Correct
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
              Tags
            </p>
            <div className="flex flex-wrap gap-1">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────

export function QuestionBankPicker({
  categories,
  bankQuestions,
  onAddToTraining,
  onClose,
}: QuestionBankPickerProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    return bankQuestions.filter((q) => {
      if (categoryFilter !== 'all' && q.categoryId !== categoryFilter) return false
      if (typeFilter !== 'all' && q.type !== typeFilter) return false
      if (search) {
        const s = search.toLowerCase()
        return (
          q.questionText.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s)) ||
          q.category.toLowerCase().includes(s)
        )
      }
      return true
    })
  }, [bankQuestions, categoryFilter, typeFilter, search])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const previewQuestion = previewId ? bankQuestions.find((q) => q.id === previewId) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[80vh] max-h-[680px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
              <Library className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add from Question Bank</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Select questions to add as snapshot copies to this training
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.questionCount})
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Types</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
          </select>

          {/* Selected count */}
          {selected.size > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold ml-auto">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              {selected.size} selected
            </div>
          )}
        </div>

        {/* Body — split: question list + preview */}
        <div className="flex flex-1 min-h-0">
          {/* Question List */}
          <div className="flex-1 min-w-0 overflow-y-auto border-r border-slate-100 dark:border-slate-800">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Search className="w-5 h-5 text-slate-300 dark:text-slate-600 mb-2" strokeWidth={1.5} />
                <p className="text-sm text-slate-500 dark:text-slate-400">No questions match your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filtered.map((question) => {
                  const isSelected = selected.has(question.id)
                  const isPreviewing = previewId === question.id

                  return (
                    <div
                      key={question.id}
                      className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors ${
                        isPreviewing
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                      }`}
                      onClick={() => setPreviewId(question.id)}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSelect(question.id)
                        }}
                        className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                        ) : (
                          <Square className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                          {question.questionText}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              question.type === 'multiple_choice'
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}
                          >
                            {question.type === 'multiple_choice' ? (
                              <LayoutGrid className="w-2.5 h-2.5" strokeWidth={1.5} />
                            ) : (
                              <CheckSquare className="w-2.5 h-2.5" strokeWidth={1.5} />
                            )}
                            {question.type === 'multiple_choice' ? 'MC' : 'T/F'}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {question.category}
                          </span>
                          {question.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {question.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              +{question.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Usage indicator */}
                      {question.usageCount > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5">
                          <BookOpen className="w-3 h-3" strokeWidth={1.5} />
                          {question.usageCount}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="hidden md:flex w-80 lg:w-96 flex-col bg-slate-50/50 dark:bg-slate-950/50 flex-shrink-0">
            {previewQuestion ? (
              <QuestionPreview question={previewQuestion} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  Click a question to preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  See answer options and explanation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {filtered.length} question{filtered.length !== 1 ? 's' : ''} available
            {selected.size > 0 && (
              <>
                <span className="mx-1.5">&middot;</span>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Clear selection
                </button>
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onAddToTraining?.(Array.from(selected))}
              disabled={selected.size === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                selected.size > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Add {selected.size > 0 ? `${selected.size} Question${selected.size !== 1 ? 's' : ''}` : 'Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
