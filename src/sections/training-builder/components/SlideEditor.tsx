import type {
  Slide,
  VideoSlideContent,
  TextSlideContent,
  QuestionSlideContent,
  AnswerOption,
} from '@/../product/sections/training-builder/types'
import {
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Link,
  Eye,
  Type,
  MessageSquare,
  Award,
  Lightbulb,
} from 'lucide-react'

interface SlideEditorProps {
  slide: Slide
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void
  onDeleteSlide?: (slideId: string) => void
  onDuplicateSlide?: (slideId: string) => void
}

function TextSlideEditor({
  slide,
  onUpdateSlide,
}: {
  slide: Slide & { content: TextSlideContent }
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Slide Title
        </label>
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdateSlide?.(slide.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Body content preview */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Content
        </label>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {/* Toolbar mock */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/80">
            {['B', 'I', 'U'].map((btn) => (
              <button
                key={btn}
                className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {btn}
              </button>
            ))}
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Link size={12} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Type size={12} />
            </button>
          </div>
          {/* Rich text preview */}
          <div
            className="px-4 py-3 min-h-[200px] text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 max-w-none"
            dangerouslySetInnerHTML={{ __html: slide.content.body }}
          />
        </div>
      </div>
    </div>
  )
}

function VideoSlideEditor({
  slide,
  onUpdateSlide,
}: {
  slide: Slide & { content: VideoSlideContent }
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void
}) {
  const content = slide.content
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Slide Title
        </label>
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdateSlide?.(slide.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Video preview / embed area */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Video
        </label>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 overflow-hidden">
          {content.embedUrl ? (
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Video size={24} className="text-white/80 ml-0.5" />
                </div>
              </div>
              <p className="absolute bottom-3 left-3 text-xs text-white/50 font-mono">
                {content.embedUrl}
              </p>
            </div>
          ) : content.videoUrl ? (
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Video size={24} className="text-white/80 ml-0.5" />
                </div>
              </div>
              <p className="absolute bottom-3 left-3 text-xs text-white/50 font-mono">
                {content.videoUrl}
              </p>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/60">
              <Video size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400 dark:text-slate-500">No video added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Video URL */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Video URL
          </label>
          <input
            type="text"
            value={content.videoUrl || ''}
            placeholder="https://example.com/video.mp4"
            onChange={() => {}}
            className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Embed URL
          </label>
          <input
            type="text"
            value={content.embedUrl || ''}
            placeholder="https://youtube.com/embed/..."
            onChange={() => {}}
            className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Video title & body */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Video Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={() => {}}
          className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        />
      </div>

      {content.body && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={content.body}
            rows={3}
            onChange={() => {}}
            className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none"
          />
        </div>
      )}

      {/* Required watch toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-slate-400 dark:text-slate-500" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Require full video watch
          </span>
        </div>
        <button
          className={`relative w-9 h-5 rounded-full transition-colors ${
            slide.settings.requiredWatch
              ? 'bg-indigo-500 dark:bg-indigo-600'
              : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              slide.settings.requiredWatch ? 'translate-x-4' : ''
            }`}
          />
        </button>
      </div>
    </div>
  )
}

function QuestionSlideEditor({
  slide,
  onUpdateSlide,
}: {
  slide: Slide & { content: QuestionSlideContent }
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void
}) {
  const content = slide.content
  return (
    <div className="space-y-4">
      {/* Slide title */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Slide Title
        </label>
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdateSlide?.(slide.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Question text */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          <span className="flex items-center gap-1.5">
            <MessageSquare size={11} />
            Question
          </span>
        </label>
        <textarea
          value={content.questionText}
          rows={3}
          onChange={() => {}}
          className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Answer options */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Answer Options
        </label>
        <div className="space-y-1.5">
          {content.options.map((opt: AnswerOption, i: number) => (
            <div
              key={opt.id}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors ${
                opt.isCorrect
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-4">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.isCorrect ? (
                <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle size={15} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
              )}
              <input
                type="text"
                value={opt.text}
                onChange={() => {}}
                className="flex-1 text-sm text-slate-700 dark:text-slate-300 bg-transparent border-none focus:outline-none"
              />
              {opt.isCorrect && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                  Correct
                </span>
              )}
            </div>
          ))}
        </div>
        {content.options.length < 6 && (
          <button className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Plus size={12} />
            Add option
          </button>
        )}
      </div>

      {/* Explanation */}
      {content.explanation && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1.5">
              <Lightbulb size={11} />
              Explanation
            </span>
          </label>
          <div className="px-3 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/20 text-sm text-amber-800 dark:text-amber-300">
            {content.explanation}
          </div>
        </div>
      )}

      {/* Point value */}
      <div className="flex items-center gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1.5">
              <Award size={11} />
              Point Value
            </span>
          </label>
          <input
            type="number"
            value={content.pointValue}
            onChange={() => {}}
            className="w-24 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}

export function SlideEditor({ slide, onUpdateSlide, onDeleteSlide, onDuplicateSlide }: SlideEditorProps) {
  const typeConfig = {
    text: { icon: FileText, label: 'Text Slide', color: 'text-blue-500 dark:text-blue-400' },
    video: { icon: Video, label: 'Video Slide', color: 'text-purple-500 dark:text-purple-400' },
    question: { icon: HelpCircle, label: 'Question Slide', color: 'text-amber-500 dark:text-amber-400' },
  }

  const config = typeConfig[slide.type]
  const TypeIcon = config.icon

  return (
    <div className="h-full flex flex-col">
      {/* Slide header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <TypeIcon size={15} className={config.color} />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {config.label}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            #{slide.order}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateSlide?.(slide.id)}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Duplicate slide"
          >
            Duplicate
          </button>
          <button
            onClick={() => onDeleteSlide?.(slide.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
            title="Delete slide"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Slide content editor */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {slide.type === 'text' && (
          <TextSlideEditor
            slide={slide as Slide & { content: TextSlideContent }}
            onUpdateSlide={onUpdateSlide}
          />
        )}
        {slide.type === 'video' && (
          <VideoSlideEditor
            slide={slide as Slide & { content: VideoSlideContent }}
            onUpdateSlide={onUpdateSlide}
          />
        )}
        {slide.type === 'question' && (
          <QuestionSlideEditor
            slide={slide as Slide & { content: QuestionSlideContent }}
            onUpdateSlide={onUpdateSlide}
          />
        )}
      </div>
    </div>
  )
}
