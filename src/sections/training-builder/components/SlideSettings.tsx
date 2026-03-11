import type { Slide } from '@/../product/sections/training-builder/types'
import {
  Settings,
  CheckSquare,
  Eye,
  Shuffle,
} from 'lucide-react'

interface SlideSettingsProps {
  slide: Slide
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void
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

export function SlideSettings({ slide, onUpdateSlide }: SlideSettingsProps) {
  const settings = slide.settings

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700/60">
        <Settings size={13} className="text-slate-400 dark:text-slate-500" />
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Slide Settings
        </h3>
      </div>

      <div className="p-4 space-y-1">
        {/* Required completion */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2">
            <CheckSquare size={13} className="text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Required Completion
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Must be completed to progress
              </p>
            </div>
          </div>
          <Toggle
            enabled={settings.requiredCompletion}
            onChange={() =>
              onUpdateSlide?.(slide.id, {
                settings: { ...settings, requiredCompletion: !settings.requiredCompletion },
              })
            }
          />
        </div>

        {/* Required watch (video only) */}
        {slide.type === 'video' && (
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-slate-400 dark:text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Required Watch
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Must watch full video
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.requiredWatch ?? false}
              onChange={() =>
                onUpdateSlide?.(slide.id, {
                  settings: { ...settings, requiredWatch: !(settings.requiredWatch ?? false) },
                })
              }
            />
          </div>
        )}

        {/* Shuffle answers (question only) */}
        {slide.type === 'question' && (
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <Shuffle size={13} className="text-slate-400 dark:text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Shuffle Answers
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Randomize option order
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.shuffleAnswers ?? false}
              onChange={() =>
                onUpdateSlide?.(slide.id, {
                  settings: { ...settings, shuffleAnswers: !(settings.shuffleAnswers ?? false) },
                })
              }
            />
          </div>
        )}

        {/* Slide info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/40">
          <div className="space-y-2 px-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Type</span>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 capitalize">
                {slide.type}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Order</span>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 font-mono">
                {slide.order}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">ID</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-500 font-mono">
                {slide.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
