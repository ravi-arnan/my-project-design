import { useState } from 'react'
import type {
  Training,
  Department,
  Recurrence,
  LinkVisibility,
} from '@/../product/sections/training-builder/types'
import {
  Settings2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Target,
  RefreshCw,
  Shield,
  Link2,
  Eye,
  Building2,
  Tag,
  Lock,
  Repeat,
  Share2,
} from 'lucide-react'

interface TrainingSettingsProps {
  training: Training
  departments: Department[]
  onUpdateSettings?: (updates: Partial<Training>) => void
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange?: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${enabled
          ? 'bg-indigo-500 dark:bg-indigo-600'
          : 'bg-slate-300 dark:bg-slate-600'
        }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : ''
          }`}
      />
    </button>
  )
}

function Section({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string
  icon: typeof Settings2
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/40 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-slate-400 dark:text-slate-500" />
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp size={13} className="text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronDown size={13} className="text-slate-400 dark:text-slate-500" />
        )}
      </button>
      {open && <div className="px-4 pb-3 space-y-3">{children}</div>}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClasses =
  'w-full px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors'

const selectClasses =
  'w-full px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors appearance-none'

export function TrainingSettings({
  training,
  departments,
  onUpdateSettings,
}: TrainingSettingsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700/60">
        <Settings2 size={13} className="text-slate-400 dark:text-slate-500" />
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Training Settings
        </h3>
      </div>

      {/* General */}
      <Section title="General" icon={FileText} defaultOpen>
        <Field label="Title">
          <input
            type="text"
            value={training.title}
            onChange={(e) => onUpdateSettings?.({ title: e.target.value })}
            className={inputClasses}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={training.description}
            rows={2}
            onChange={(e) => onUpdateSettings?.({ description: e.target.value })}
            className={`${inputClasses} resize-none`}
          />
        </Field>
        <Field label="Category">
          <input
            type="text"
            value={training.category}
            onChange={(e) => onUpdateSettings?.({ category: e.target.value })}
            className={inputClasses}
          />
        </Field>
        <Field label="Department">
          <select
            value={training.departmentId || ''}
            onChange={(e) => onUpdateSettings?.({ departmentId: e.target.value || null })}
            className={selectClasses}
          >
            <option value="">None</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Scoring & Duration */}
      <Section title="Scoring" icon={Target}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Duration (min)">
            <input
              type="number"
              value={training.estimatedDurationMinutes}
              onChange={(e) =>
                onUpdateSettings?.({ estimatedDurationMinutes: parseInt(e.target.value) || 0 })
              }
              className={inputClasses}
            />
          </Field>
          <Field label="Passing Score (%)">
            <input
              type="number"
              value={training.passingScore}
              onChange={(e) => onUpdateSettings?.({ passingScore: parseInt(e.target.value) || 0 })}
              className={inputClasses}
            />
          </Field>
        </div>
        <Field label="Time Limit (min)">
          <input
            type="number"
            value={training.timeLimitMinutes || ''}
            placeholder="No limit"
            onChange={(e) =>
              onUpdateSettings?.({ timeLimitMinutes: parseInt(e.target.value) || null })
            }
            className={inputClasses}
          />
        </Field>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-600 dark:text-slate-400">Show Results</span>
          <Toggle
            enabled={training.showResults}
            onChange={() => onUpdateSettings?.({ showResults: !training.showResults })}
          />
        </div>
      </Section>

      {/* Retakes */}
      <Section title="Retakes" icon={RefreshCw}>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-600 dark:text-slate-400">Allow Retakes</span>
          <Toggle
            enabled={training.allowRetakes}
            onChange={() => onUpdateSettings?.({ allowRetakes: !training.allowRetakes })}
          />
        </div>
        {training.allowRetakes && (
          <Field label="Max Attempts">
            <input
              type="number"
              value={training.maxAttempts || ''}
              placeholder="Unlimited"
              onChange={(e) =>
                onUpdateSettings?.({ maxAttempts: parseInt(e.target.value) || null })
              }
              className={inputClasses}
            />
          </Field>
        )}
      </Section>

      {/* Recurrence */}
      <Section title="Recurrence" icon={Repeat}>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-600 dark:text-slate-400">Enable Recurrence</span>
          <Toggle
            enabled={training.recurrence.enabled}
            onChange={() =>
              onUpdateSettings?.({
                recurrence: {
                  ...training.recurrence,
                  enabled: !training.recurrence.enabled,
                },
              })
            }
          />
        </div>
        {training.recurrence.enabled && (
          <div className="grid grid-cols-2 gap-2">
            <Field label="Interval">
              <input
                type="number"
                value={training.recurrence.intervalValue || ''}
                onChange={() => { }}
                className={inputClasses}
              />
            </Field>
            <Field label="Period">
              <select
                value={training.recurrence.intervalType || ''}
                onChange={() => { }}
                className={selectClasses}
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </Field>
          </div>
        )}
      </Section>

      {/* Access & Sharing */}
      <Section title="Access" icon={Shield}>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-600 dark:text-slate-400">Password Protected</span>
          <Toggle
            enabled={training.passwordProtected}
            onChange={() =>
              onUpdateSettings?.({ passwordProtected: !training.passwordProtected })
            }
          />
        </div>
        {training.passwordProtected && (
          <Field label="Access Password">
            <input
              type="text"
              value={training.accessPassword || ''}
              onChange={(e) => onUpdateSettings?.({ accessPassword: e.target.value || null })}
              className={`${inputClasses} font-mono`}
            />
          </Field>
        )}
        <Field label="Link Visibility">
          <select
            value={training.linkVisibility}
            onChange={(e) =>
              onUpdateSettings?.({ linkVisibility: e.target.value as LinkVisibility })
            }
            className={selectClasses}
          >
            <option value="private">Private</option>
            <option value="link-only">Link Only</option>
            <option value="public">Public</option>
          </select>
        </Field>
        {training.shareableLinkToken && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <Link2 size={11} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {training.shareableLinkToken}
            </span>
          </div>
        )}
      </Section>
    </div>
  )
}
