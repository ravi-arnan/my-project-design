import type { RulesPage, ExitBehavior } from '@/../product/sections/training-builder/types'
import {
  ScrollText,
  Shield,
  Clock,
  LogOut,
  Lock,
  Video,
  BarChart3,
  Target,
  HelpCircle,
} from 'lucide-react'

interface RulesPageEditorProps {
  rulesPage: RulesPage
  onUpdateRulesPage?: (updates: Partial<RulesPage>) => void
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
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
        enabled
          ? 'bg-indigo-500 dark:bg-indigo-600'
          : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-4' : ''
        }`}
      />
    </button>
  )
}

export function RulesPageEditor({ rulesPage, onUpdateRulesPage }: RulesPageEditorProps) {
  const exitBehaviorOptions: { value: ExitBehavior; label: string; desc: string }[] = [
    { value: 'abandon', label: 'Abandon', desc: 'Progress is lost on exit' },
    { value: 'fail', label: 'Fail', desc: 'Counts as a failed attempt' },
    { value: 'flag', label: 'Flag', desc: 'Exit is flagged for review' },
  ]

  const toggleSettings: {
    key: keyof RulesPage
    label: string
    icon: typeof Shield
    desc: string
  }[] = [
    {
      key: 'allowPause',
      label: 'Allow Pause',
      icon: Clock,
      desc: 'Trainees can pause and resume later',
    },
    {
      key: 'mustCompleteInOneSitting',
      label: 'Must Complete in One Sitting',
      icon: Shield,
      desc: 'Cannot leave and return',
    },
    {
      key: 'lockQuizUntilSlidesComplete',
      label: 'Lock Quiz Until Slides Complete',
      icon: Lock,
      desc: 'All slides must be viewed first',
    },
    {
      key: 'requireMinimumVideoWatch',
      label: 'Require Minimum Video Watch',
      icon: Video,
      desc: 'Videos must be watched to required percentage',
    },
    {
      key: 'showEstimatedDuration',
      label: 'Show Estimated Duration',
      icon: Clock,
      desc: 'Display time estimate to trainees',
    },
    {
      key: 'showPassingScore',
      label: 'Show Passing Score',
      icon: Target,
      desc: 'Show required passing score up front',
    },
    {
      key: 'showQuestionCount',
      label: 'Show Question Count',
      icon: HelpCircle,
      desc: 'Display total number of questions',
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <ScrollText size={15} className="text-indigo-500 dark:text-indigo-400" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Rules Page Configuration
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={rulesPage.title}
            onChange={(e) => onUpdateRulesPage?.({ title: e.target.value })}
            className="w-full px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={rulesPage.description}
            rows={3}
            onChange={(e) => onUpdateRulesPage?.({ description: e.target.value })}
            className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Custom Instructions
          </label>
          <textarea
            value={rulesPage.customInstructions || ''}
            rows={2}
            placeholder="Optional instructions shown to trainees before starting..."
            onChange={(e) => onUpdateRulesPage?.({ customInstructions: e.target.value || null })}
            className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700/60" />

        {/* Boolean toggles */}
        <div>
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Completion Rules
          </h3>
          <div className="space-y-1">
            {toggleSettings.map((setting) => {
              const Icon = setting.icon
              const value = rulesPage[setting.key] as boolean
              return (
                <div
                  key={setting.key}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {setting.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {setting.desc}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={value}
                    onChange={() =>
                      onUpdateRulesPage?.({ [setting.key]: !value })
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700/60" />

        {/* Exit Behavior */}
        <div>
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <LogOut size={11} />
              Exit Behavior
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
            What happens when a trainee exits before completing the training
          </p>
          <div className="grid grid-cols-3 gap-2">
            {exitBehaviorOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdateRulesPage?.({ exitBehavior: opt.value })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  rulesPage.exitBehavior === opt.value
                    ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40 ring-1 ring-indigo-200 dark:ring-indigo-800'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-0.5 ${
                    rulesPage.exitBehavior === opt.value
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
