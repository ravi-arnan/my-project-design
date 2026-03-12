import { useState, useRef, useEffect, useMemo } from 'react'
import type {
  QuestionBankImportProps,
  BankQuestion,
  Category,
  QuestionUsage,
  QuestionType,
} from '@/../product/sections/question-bank-and-import/types'
import {
  Search,
  Plus,
  Upload,
  Trash2,
  Tag,
  FolderOpen,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Pencil,
  Eye,
  X,
  Check,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  CheckSquare,
  Square,
  Minus,
  Filter,
  LayoutGrid,
  ExternalLink,
  Clock,
  Hash,
  FileQuestion,
  Library,
} from 'lucide-react'

type SortField = 'questionText' | 'type' | 'category' | 'usageCount' | 'createdAt'
type SortDir = 'asc' | 'desc'

// ── Helpers ──────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

function typeLabel(type: QuestionType): string {
  return type === 'multiple_choice' ? 'Multiple Choice' : 'True / False'
}

// ── Sub-components ───────────────────────────────────────

function TypeBadge({ type }: { type: QuestionType }) {
  const isMultiple = type === 'multiple_choice'
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
        isMultiple
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
      }`}
    >
      {isMultiple ? (
        <LayoutGrid className="w-3 h-3" strokeWidth={1.5} />
      ) : (
        <CheckSquare className="w-3 h-3" strokeWidth={1.5} />
      )}
      {typeLabel(type)}
    </span>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {label}
    </span>
  )
}

function UsageCount({
  count,
  onClick,
}: {
  count: number
  onClick?: () => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={`inline-flex items-center gap-1 text-xs tabular-nums transition-colors ${
        count > 0
          ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer'
          : 'text-slate-400 dark:text-slate-500 cursor-default'
      }`}
    >
      <BookOpen className="w-3 h-3" strokeWidth={1.5} />
      {count}
    </button>
  )
}

// ── Usage Drawer ─────────────────────────────────────────

function UsageDrawer({
  question,
  usages,
  onClose,
}: {
  question: BankQuestion
  usages: QuestionUsage[]
  onClose: () => void
}) {
  const statusStyles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    archived: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Usage Details</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{question.questionText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {usages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Not used in any trainings</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                This question hasn't been added to any training yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                {usages.length} training{usages.length !== 1 ? 's' : ''} using this question
              </p>
              {usages.map((u) => (
                <div
                  key={u.trainingId}
                  className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {u.trainingTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Copied {formatRelativeDate(u.copiedAt)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      statusStyles[u.trainingStatus] || statusStyles.draft
                    }`}
                  >
                    {u.trainingStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation Dialog ───────────────────────────

function DeleteDialog({
  questions,
  usages,
  onConfirm,
  onCancel,
}: {
  questions: BankQuestion[]
  usages: Record<string, QuestionUsage[]>
  onConfirm: () => void
  onCancel: () => void
}) {
  const affectedTrainings = useMemo(() => {
    const map = new Map<string, { title: string; status: string }>()
    for (const q of questions) {
      const qUsages = usages[q.id] || []
      for (const u of qUsages) {
        map.set(u.trainingId, { title: u.trainingTitle, status: u.trainingStatus })
      }
    }
    return Array.from(map.values())
  }, [questions, usages])

  const activeTrainings = affectedTrainings.filter((t) => t.status === 'active')
  const hasActiveUsage = activeTrainings.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                hasActiveUsage
                  ? 'bg-amber-50 dark:bg-amber-950/40'
                  : 'bg-red-50 dark:bg-red-950/40'
              }`}
            >
              {hasActiveUsage ? (
                <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
              ) : (
                <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Delete {questions.length === 1 ? 'question' : `${questions.length} questions`}?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {questions.length === 1
                  ? 'This will permanently remove this question from the bank.'
                  : `This will permanently remove ${questions.length} questions from the bank.`}
                {' '}Existing copies in trainings will not be affected.
              </p>
            </div>
          </div>
        </div>

        {/* Affected trainings */}
        {affectedTrainings.length > 0 && (
          <div className="mx-5 mb-4 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-amber-200/60 dark:border-amber-800/40">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Used in {affectedTrainings.length} training{affectedTrainings.length !== 1 ? 's' : ''}
                {activeTrainings.length > 0 && (
                  <span className="font-normal text-amber-600 dark:text-amber-500">
                    {' '}({activeTrainings.length} active)
                  </span>
                )}
              </p>
            </div>
            <div className="max-h-32 overflow-y-auto">
              {affectedTrainings.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3.5 py-2 border-b border-amber-100 dark:border-amber-900/30 last:border-0"
                >
                  <span className="text-xs text-amber-800 dark:text-amber-300 truncate">{t.title}</span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      t.status === 'active'
                        ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40'
                        : t.status === 'draft'
                          ? 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800'
                          : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onCancel}
            className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3.5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg transition-colors shadow-sm"
          >
            Delete {questions.length === 1 ? 'Question' : `${questions.length} Questions`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Bulk Action Bar ──────────────────────────────────────

function BulkActionBar({
  count,
  onDelete,
  onTag,
  onCategorize,
  onClear,
}: {
  count: number
  onDelete: () => void
  onTag: () => void
  onCategorize: () => void
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-lg">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {count} selected
      </span>
      <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-800" />
      <div className="flex items-center gap-1">
        <button
          onClick={onTag}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-md transition-colors"
        >
          <Tag className="w-3 h-3" strokeWidth={1.5} />
          Tag
        </button>
        <button
          onClick={onCategorize}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-md transition-colors"
        >
          <FolderOpen className="w-3 h-3" strokeWidth={1.5} />
          Categorize
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
        >
          <Trash2 className="w-3 h-3" strokeWidth={1.5} />
          Delete
        </button>
      </div>
      <div className="flex-1" />
      <button
        onClick={onClear}
        className="p-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}

// ── Row Action Menu ──────────────────────────────────────

function RowActionMenu({
  questionId,
  onEdit,
  onDelete,
  onViewUsage,
}: {
  questionId: string
  onEdit?: (id: string) => void
  onDelete?: (ids: string[]) => void
  onViewUsage?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30">
          {[
            { label: 'Edit', icon: Pencil, action: () => onEdit?.(questionId) },
            { label: 'View Usage', icon: Eye, action: () => onViewUsage?.(questionId) },
            { label: 'Delete', icon: Trash2, action: () => onDelete?.([questionId]), danger: true },
          ].map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation()
                item.action()
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors ${
                'danger' in item && item.danger
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────

export function QuestionLibrary({
  categories,
  bankQuestions,
  questionUsages,
  bankStats,
  onCreateQuestion,
  onEditQuestion,
  onDeleteQuestions,
  onCategorizeQuestions,
  onTagQuestions,
  onViewUsage,
  onStartImport,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
}: QuestionBankImportProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [usageDrawerQuestion, setUsageDrawerQuestion] = useState<BankQuestion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BankQuestion[] | null>(null)
  const [typeFilterOpen, setTypeFilterOpen] = useState(false)
  const typeFilterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!typeFilterOpen) return
    const handleClick = (e: MouseEvent) => {
      if (typeFilterRef.current && !typeFilterRef.current.contains(e.target as Node)) setTypeFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [typeFilterOpen])

  // Collect all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>()
    bankQuestions.forEach((q) => q.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [bankQuestions])

  // Filtered + sorted questions
  const filtered = useMemo(() => {
    return bankQuestions
      .filter((q) => {
        if (categoryFilter !== 'all' && q.categoryId !== categoryFilter) return false
        if (typeFilter !== 'all' && q.type !== typeFilter) return false
        if (tagFilter && !q.tags.includes(tagFilter)) return false
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
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        switch (sortField) {
          case 'questionText':
            return dir * a.questionText.localeCompare(b.questionText)
          case 'type':
            return dir * a.type.localeCompare(b.type)
          case 'category':
            return dir * a.category.localeCompare(b.category)
          case 'usageCount':
            return dir * (a.usageCount - b.usageCount)
          case 'createdAt':
            return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          default:
            return 0
        }
      })
  }, [bankQuestions, categoryFilter, typeFilter, tagFilter, search, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir(field === 'questionText' ? 'asc' : 'desc')
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((q) => q.id)))
    }
  }

  const handleDeleteSelected = () => {
    const questions = bankQuestions.filter((q) => selected.has(q.id))
    setDeleteTarget(questions)
  }

  const handleDeleteSingle = (ids: string[]) => {
    const questions = bankQuestions.filter((q) => ids.includes(q.id))
    setDeleteTarget(questions)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteQuestions?.(deleteTarget.map((q) => q.id))
      setSelected((prev) => {
        const next = new Set(prev)
        deleteTarget.forEach((q) => next.delete(q.id))
        return next
      })
      setDeleteTarget(null)
    }
  }

  const handleViewUsage = (questionId: string) => {
    const q = bankQuestions.find((bq) => bq.id === questionId)
    if (q) setUsageDrawerQuestion(q)
    onViewUsage?.(questionId)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-50" strokeWidth={1.5} />
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-500" strokeWidth={2} />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-500" strokeWidth={2} />
    )
  }

  const isAllSelected = filtered.length > 0 && selected.size === filtered.length
  const isSomeSelected = selected.size > 0 && selected.size < filtered.length

  return (
    <div className="h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex h-full">
        {/* ── Category Sidebar ─────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Categories
              </span>
              <button
                onClick={() => onCreateCategory?.('New Category')}
                className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="space-y-0.5">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Library className="w-3.5 h-3.5" strokeWidth={1.5} />
                  All Questions
                </span>
                <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500 font-mono">
                  {bankStats.totalQuestions}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    categoryFilter === cat.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500 font-mono">
                    {cat.questionCount}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar footer — tags */}
          <div className="mt-auto border-t border-slate-100 dark:border-slate-800 px-4 py-4">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Filter by tag
            </span>
            <div className="flex flex-wrap gap-1 mt-2.5">
              {tagFilter && (
                <button
                  onClick={() => setTagFilter(null)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 transition-colors"
                >
                  {tagFilter}
                  <X className="w-2.5 h-2.5" strokeWidth={2} />
                </button>
              )}
              {allTags
                .filter((t) => t !== tagFilter)
                .slice(0, 12)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col flex-1">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Question Bank</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {bankStats.totalQuestions} questions &middot; {bankStats.questionsUsedInTrainings} used in trainings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartImport?.()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Import CSV
                </button>
                <button
                  onClick={() =>
                    onCreateQuestion?.({
                      questionText: '',
                      type: 'multiple_choice',
                      options: [],
                      correctAnswerIndex: 0,
                      explanation: '',
                      categoryId: '',
                      category: '',
                      tags: [],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  New Question
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              {/* Search */}
              <div className="relative flex-1 max-w-sm w-full">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  placeholder="Search questions, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                />
              </div>

              {/* Mobile category filter */}
              <div className="lg:hidden">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.questionCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div ref={typeFilterRef} className="relative">
                <button
                  onClick={() => setTypeFilterOpen(!typeFilterOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    typeFilter !== 'all'
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {typeFilter === 'all' ? 'Type' : typeLabel(typeFilter)}
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                {typeFilterOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30">
                    {[
                      { value: 'all' as const, label: 'All types' },
                      { value: 'multiple_choice' as const, label: 'Multiple Choice' },
                      { value: 'true_false' as const, label: 'True / False' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTypeFilter(opt.value)
                          setTypeFilterOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm transition-colors ${
                          typeFilter === opt.value
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active tag filter chip (mobile) */}
              {tagFilter && (
                <button
                  onClick={() => setTagFilter(null)}
                  className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                >
                  tag: {tagFilter}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
              <div className="mb-4">
                <BulkActionBar
                  count={selected.size}
                  onDelete={handleDeleteSelected}
                  onTag={() => onTagQuestions?.(Array.from(selected), [])}
                  onCategorize={() => onCategorizeQuestions?.(Array.from(selected), '')}
                  onClear={() => setSelected(new Set())}
                />
              </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
              <div className="overflow-x-auto flex-1">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {/* Checkbox */}
                      <th className="w-10 px-3 py-2.5">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          {isAllSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                          ) : isSomeSelected ? (
                            <Minus className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                          ) : (
                            <Square className="w-4 h-4" strokeWidth={1.5} />
                          )}
                        </button>
                      </th>
                      {[
                        { field: 'questionText' as SortField, label: 'Question', align: 'text-left', grow: true },
                        { field: 'type' as SortField, label: 'Type', align: 'text-left', grow: false },
                        { field: 'category' as SortField, label: 'Category', align: 'text-left', grow: false },
                        { field: null, label: 'Tags', align: 'text-left', grow: false },
                        { field: 'usageCount' as SortField, label: 'Used', align: 'text-center', grow: false },
                        { field: 'createdAt' as SortField, label: 'Created', align: 'text-right', grow: false },
                        { field: null, label: '', align: 'text-right', grow: false },
                      ].map((col, i) => (
                        <th
                          key={i}
                          className={`px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.align} ${col.field ? 'cursor-pointer select-none group/th' : ''} ${col.grow ? '' : 'whitespace-nowrap'}`}
                          onClick={col.field ? () => handleSort(col.field!) : undefined}
                        >
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            {col.field && <SortIcon field={col.field} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          {bankQuestions.length === 0 ? (
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                <FileQuestion
                                  className="w-6 h-6 text-slate-400 dark:text-slate-500"
                                  strokeWidth={1.5}
                                />
                              </div>
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                No questions yet
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 max-w-xs">
                                Create your first question or import a batch from CSV to get started.
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onStartImport?.()}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                                  Import CSV
                                </button>
                                <button
                                  onClick={() =>
                                    onCreateQuestion?.({
                                      questionText: '',
                                      type: 'multiple_choice',
                                      options: [],
                                      correctAnswerIndex: 0,
                                      explanation: '',
                                      categoryId: '',
                                      category: '',
                                      tags: [],
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                                  Create Question
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Search
                                className="w-5 h-5 text-slate-300 dark:text-slate-600 mb-2"
                                strokeWidth={1.5}
                              />
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                No questions match your filters.
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((question) => {
                        const isSelected = selected.has(question.id)
                        return (
                          <tr
                            key={question.id}
                            onClick={() => onEditQuestion?.(question.id)}
                            className={`border-b border-slate-50 dark:border-slate-800/50 last:border-0 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                                : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="w-10 px-3 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSelect(question.id)
                                }}
                                className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                                ) : (
                                  <Square className="w-4 h-4" strokeWidth={1.5} />
                                )}
                              </button>
                            </td>

                            {/* Question text */}
                            <td className="px-3 py-3 max-w-[320px]">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                                {question.questionText}
                              </p>
                            </td>

                            {/* Type */}
                            <td className="px-3 py-3">
                              <TypeBadge type={question.type} />
                            </td>

                            {/* Category */}
                            <td className="px-3 py-3">
                              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                {question.category}
                              </span>
                            </td>

                            {/* Tags */}
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                {question.tags.slice(0, 2).map((tag) => (
                                  <TagChip key={tag} label={tag} />
                                ))}
                                {question.tags.length > 2 && (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                    +{question.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Usage count */}
                            <td className="px-3 py-3 text-center">
                              <UsageCount
                                count={question.usageCount}
                                onClick={() => handleViewUsage(question.id)}
                              />
                            </td>

                            {/* Created date */}
                            <td className="px-3 py-3 text-right">
                              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {formatDate(question.createdAt)}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-3 text-right">
                              <RowActionMenu
                                questionId={question.id}
                                onEdit={onEditQuestion}
                                onDelete={handleDeleteSingle}
                                onViewUsage={handleViewUsage}
                              />
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Showing {filtered.length} of {bankStats.totalQuestions} question
                    {bankStats.totalQuestions !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <LayoutGrid className="w-3 h-3" strokeWidth={1.5} />
                      {bankStats.multipleChoice} MC
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" strokeWidth={1.5} />
                      {bankStats.trueFalse} T/F
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Usage Drawer ─────────────────────────────── */}
      {usageDrawerQuestion && (
        <UsageDrawer
          question={usageDrawerQuestion}
          usages={questionUsages[usageDrawerQuestion.id] || []}
          onClose={() => setUsageDrawerQuestion(null)}
        />
      )}

      {/* ── Delete Confirmation Dialog ────────────────── */}
      {deleteTarget && (
        <DeleteDialog
          questions={deleteTarget}
          usages={questionUsages}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
