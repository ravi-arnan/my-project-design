import type { QuizQuestion, AnswerOption } from '@/../product/sections/training-builder/types'
import {
  ListChecks,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Award,
  GripVertical,
} from 'lucide-react'
import { useState } from 'react'

interface QuizEditorProps {
  quizQuestions: QuizQuestion[]
  onUpdateQuizQuestion?: (questionId: string, updates: Partial<QuizQuestion>) => void
  onDeleteQuizQuestion?: (questionId: string) => void
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: QuizQuestion
  index: number
  onUpdate?: (questionId: string, updates: Partial<QuizQuestion>) => void
  onDelete?: (questionId: string) => void
}) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 overflow-hidden transition-all">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
      >
        <GripVertical
          size={12}
          className="text-slate-300 dark:text-slate-600 flex-shrink-0 cursor-grab"
        />
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 text-xs font-bold flex-shrink-0">
          {index + 1}
        </span>
        <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          {question.questionText}
        </p>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 font-mono">
          {question.pointValue}pts
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/40 space-y-3">
          {/* Question text */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Question
            </label>
            <textarea
              value={question.questionText}
              rows={2}
              onChange={() => {}}
              className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Options
            </label>
            <div className="space-y-1">
              {question.options.map((opt: AnswerOption, i: number) => (
                <div
                  key={opt.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                    opt.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/20'
                      : 'border-slate-150 bg-slate-50/50 dark:border-slate-700/40 dark:bg-slate-900/30'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-3">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.isCorrect ? (
                    <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle size={13} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-xs text-slate-700 dark:text-slate-300">{opt.text}</span>
                  {opt.isCorrect && (
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
              <Lightbulb size={13} className="text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Award size={12} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {question.pointValue} points
              </span>
            </div>
            <button
              onClick={() => onDelete?.(question.id)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function QuizEditor({
  quizQuestions,
  onUpdateQuizQuestion,
  onDeleteQuizQuestion,
}: QuizEditorProps) {
  const sorted = [...quizQuestions].sort((a, b) => a.order - b.order)
  const totalPoints = quizQuestions.reduce((sum, q) => sum + q.pointValue, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <ListChecks size={15} className="text-amber-500 dark:text-amber-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Quiz Questions
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            {quizQuestions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Total: <span className="font-semibold text-amber-600 dark:text-amber-400">{totalPoints}pts</span>
          </span>
        </div>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {sorted.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            onUpdate={onUpdateQuizQuestion}
            onDelete={onDeleteQuizQuestion}
          />
        ))}

        {quizQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ListChecks size={32} className="text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">
              No quiz questions yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Add questions or import from CSV
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
