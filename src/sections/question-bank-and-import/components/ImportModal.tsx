import { useState, useRef, useMemo } from 'react'
import type {
  ImportSession,
  ImportRow,
  ImportStep,
} from '@/../product/sections/question-bank-and-import/types'
import {
  Upload,
  FileSpreadsheet,
  X,
  Check,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  CheckCircle2,
  FileUp,
  Pencil,
  Info,
  Sparkles,
  LayoutGrid,
  CheckSquare,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────

interface ImportModalProps {
  importSession: ImportSession
  onUploadFile?: (file: File) => void
  onFixImportRow?: (rowNumber: number, updatedRow: Partial<ImportRow>) => void
  onReUploadFile?: (file: File) => void
  onConfirmImport?: (sessionId: string) => void
  onCancelImport?: (sessionId: string) => void
}

// ── Step Indicator ───────────────────────────────────────

const steps: { key: ImportStep; label: string; number: number }[] = [
  { key: 'upload', label: 'Upload', number: 1 },
  { key: 'review', label: 'Review & Fix', number: 2 },
  { key: 'confirm', label: 'Confirm', number: 3 },
]

function StepIndicator({ currentStep }: { currentStep: ImportStep }) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentIdx
        const isCurrent = i === currentIdx
        const isUpcoming = i > currentIdx

        return (
          <div key={step.key} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className={`w-8 h-px transition-colors ${
                  isCompleted ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-indigo-500 text-white dark:bg-indigo-400 dark:text-slate-950'
                    : isCurrent
                      ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500/30 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-400/30'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors ${
                  isCurrent
                    ? 'text-slate-900 dark:text-slate-100'
                    : isCompleted
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Upload Step ──────────────────────────────────────────

function UploadStep({
  onUploadFile,
}: {
  onUploadFile?: (file: File) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onUploadFile?.(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUploadFile?.(file)
  }

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-lg border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all text-center ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:hover:border-slate-600 dark:bg-slate-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
            isDragOver
              ? 'bg-indigo-100 dark:bg-indigo-900/50'
              : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <FileUp
            className={`w-6 h-6 transition-colors ${
              isDragOver
                ? 'text-indigo-500 dark:text-indigo-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
            strokeWidth={1.5}
          />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {isDragOver ? 'Drop your file here' : 'Drop a CSV or Excel file here'}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          or click to browse from your computer
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" strokeWidth={2} />
          Choose File
        </button>
      </div>

      {/* Format help */}
      <div className="w-full max-w-lg mt-6 rounded-lg border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
          <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Expected CSV format
          </span>
        </div>
        <div className="px-4 py-3 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                {['question_text', 'type', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_answer', 'explanation', 'tags'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-2 py-1 text-left font-mono font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap bg-indigo-50/50 dark:bg-indigo-950/20"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  'What is...?',
                  'multiple_choice',
                  'Option A',
                  'Option B',
                  'Option C',
                  'Option D',
                  '2',
                  'Because...',
                  'safety, osha',
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-2 py-1 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono"
                  >
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Review Step ──────────────────────────────────────────

function ReviewStep({
  session,
  onFixImportRow,
  onReUploadFile,
}: {
  session: ImportSession
  onFixImportRow?: (rowNumber: number, updatedRow: Partial<ImportRow>) => void
  onReUploadFile?: (file: File) => void
}) {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<ImportRow>>({})
  const reUploadRef = useRef<HTMLInputElement>(null)

  const startEditing = (row: ImportRow) => {
    setEditingRow(row.rowNumber)
    setEditValues({
      questionText: row.questionText,
      type: row.type,
      tags: row.tags,
    })
  }

  const saveEdit = (rowNumber: number) => {
    onFixImportRow?.(rowNumber, editValues)
    setEditingRow(null)
    setEditValues({})
  }

  const cancelEdit = () => {
    setEditingRow(null)
    setEditValues({})
  }

  const handleReUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onReUploadFile?.(file)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {session.fileName}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({session.fileSize})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="font-semibold tabular-nums">{session.totalRows}</span> rows
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
              <span className="font-semibold tabular-nums">{session.validRows}</span> valid
            </span>
            {session.errorRows > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="w-3 h-3" strokeWidth={2} />
                <span className="font-semibold tabular-nums">{session.errorRows}</span> error{session.errorRows !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div>
          <input
            ref={reUploadRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleReUpload}
            className="hidden"
          />
          <button
            onClick={() => reUploadRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
            Re-upload corrected file
          </button>
        </div>
      </div>

      {/* Error banner */}
      {session.errorRows > 0 && (
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-800/40">
          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <span className="font-semibold">{session.errorRows} row{session.errorRows !== 1 ? 's' : ''}</span> ha{session.errorRows !== 1 ? 've' : 's'} validation errors.
            Fix them inline by clicking the edit icon, or re-upload a corrected file.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[800px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <th className="w-10 px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                #
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                Status
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                Question
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                Type
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                Options
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                Tags
              </th>
              <th className="w-16 px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {session.rows.map((row) => {
              const isError = row.status === 'error'
              const isEditing = editingRow === row.rowNumber

              return (
                <tr
                  key={row.rowNumber}
                  className={`border-b transition-colors ${
                    isError
                      ? 'bg-red-50/40 dark:bg-red-950/10 border-red-100 dark:border-red-900/30'
                      : 'border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {/* Row number */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                      {row.rowNumber}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    {isError ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                          <AlertCircle className="w-3 h-3 text-red-500 dark:text-red-400" strokeWidth={2} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" strokeWidth={2.5} />
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Question */}
                  <td className="px-3 py-3 max-w-[300px]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.questionText ?? row.questionText}
                        onChange={(e) => setEditValues({ ...editValues, questionText: e.target.value })}
                        className="w-full px-2 py-1 text-sm rounded border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p
                          className={`text-sm truncate ${
                            isError && !row.questionText
                              ? 'italic text-red-400 dark:text-red-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {row.questionText || 'Missing question text'}
                        </p>
                        {isError && row.errors.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {row.errors.map((err, i) => (
                              <p key={i} className="text-[11px] text-red-500 dark:text-red-400 flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                {err}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-3 py-3">
                    {isEditing ? (
                      <select
                        value={editValues.type ?? row.type}
                        onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                        className="px-2 py-1 text-xs rounded border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True / False</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          row.type === 'multiple_choice'
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                            : row.type === 'true_false'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                              : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                        }`}
                      >
                        {row.type === 'multiple_choice' ? (
                          <><LayoutGrid className="w-3 h-3" strokeWidth={1.5} />MC</>
                        ) : row.type === 'true_false' ? (
                          <><CheckSquare className="w-3 h-3" strokeWidth={1.5} />T/F</>
                        ) : (
                          <><AlertCircle className="w-3 h-3" strokeWidth={1.5} />{row.type}</>
                        )}
                      </span>
                    )}
                  </td>

                  {/* Options count */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`text-xs tabular-nums font-medium ${
                        isError && row.options.length < 4 && row.type === 'multiple_choice'
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {row.options.length}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="px-3 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={typeof editValues.tags === 'string' ? editValues.tags : row.tags}
                        onChange={(e) => setEditValues({ ...editValues, tags: e.target.value })}
                        className="w-full px-2 py-1 text-xs rounded border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {row.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => saveEdit(row.rowNumber)}
                          className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    ) : isError ? (
                      <button
                        onClick={() => startEditing(row)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.5} />
                        Fix
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Confirm Step ─────────────────────────────────────────

function ConfirmStep({
  session,
  onConfirm,
}: {
  session: ImportSession
  onConfirm?: () => void
}) {
  const validRows = session.rows.filter((r) => r.status === 'valid')
  const mcCount = validRows.filter((r) => r.type === 'multiple_choice').length
  const tfCount = validRows.filter((r) => r.type === 'true_false').length

  const allTags = useMemo(() => {
    const set = new Set<string>()
    validRows.forEach((r) =>
      r.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => set.add(t))
    )
    return Array.from(set)
  }, [validRows])

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-5">
        <Sparkles className="w-7 h-7 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
        Ready to import
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-sm">
        {session.validRows} question{session.validRows !== 1 ? 's' : ''} will be added to your question bank from{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{session.fileName}</span>.
        {session.errorRows > 0 && (
          <span className="text-amber-600 dark:text-amber-400">
            {' '}{session.errorRows} row{session.errorRows !== 1 ? 's' : ''} with errors will be skipped.
          </span>
        )}
      </p>

      {/* Summary card */}
      <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Import Summary
          </p>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-slate-600 dark:text-slate-400">Total questions</span>
            <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {session.validRows}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <LayoutGrid className="w-3 h-3" strokeWidth={1.5} />
              Multiple Choice
            </span>
            <span className="text-sm font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">{mcCount}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="w-3 h-3" strokeWidth={1.5} />
              True / False
            </span>
            <span className="text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-400">{tfCount}</span>
          </div>
          {session.errorRows > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                Skipped (errors)
              </span>
              <span className="text-sm font-semibold tabular-nums text-red-500 dark:text-red-400">
                {session.errorRows}
              </span>
            </div>
          )}
          {allTags.length > 0 && (
            <div className="px-4 py-2.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Tags</span>
              <div className="flex flex-wrap gap-1">
                {allTags.map((tag) => (
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

      <button
        onClick={onConfirm}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
      >
        <Check className="w-4 h-4" strokeWidth={2} />
        Import {session.validRows} Question{session.validRows !== 1 ? 's' : ''}
      </button>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────

export function ImportModal({
  importSession,
  onUploadFile,
  onFixImportRow,
  onReUploadFile,
  onConfirmImport,
  onCancelImport,
}: ImportModalProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>(importSession.step)

  // Navigate between steps for demo purposes
  const goToReview = () => setCurrentStep('review')
  const goToConfirm = () => setCurrentStep('confirm')
  const goBack = () => {
    if (currentStep === 'confirm') setCurrentStep('review')
    else if (currentStep === 'review') setCurrentStep('upload')
  }

  const handleUpload = (file: File) => {
    onUploadFile?.(file)
    goToReview()
  }

  const handleReUpload = (file: File) => {
    onReUploadFile?.(file)
  }

  const handleConfirm = () => {
    onConfirmImport?.(importSession.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={() => onCancelImport?.(importSession.id)} />

      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
              <Upload className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Import Questions</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Add questions from a CSV or Excel file</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StepIndicator currentStep={currentStep} />
            <button
              onClick={() => onCancelImport?.(importSession.id)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {currentStep === 'upload' && <UploadStep onUploadFile={handleUpload} />}
          {currentStep === 'review' && (
            <ReviewStep
              session={importSession}
              onFixImportRow={onFixImportRow}
              onReUploadFile={handleReUpload}
            />
          )}
          {currentStep === 'confirm' && (
            <ConfirmStep session={importSession} onConfirm={handleConfirm} />
          )}
        </div>

        {/* Footer */}
        {currentStep !== 'upload' && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Back
            </button>

            {currentStep === 'review' && (
              <button
                onClick={goToConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
