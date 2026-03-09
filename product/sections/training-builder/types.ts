// Training Builder — TypeScript types

export type TrainingStatus = 'draft' | 'published' | 'archived'
export type SlideType = 'video' | 'text' | 'question'
export type ExitBehavior = 'abandon' | 'fail' | 'flag'
export type LinkVisibility = 'private' | 'link-only' | 'public'

export interface Department {
  id: string
  name: string
}

export interface Recurrence {
  enabled: boolean
  intervalType: 'days' | 'weeks' | 'months' | null
  intervalValue: number | null
}

export interface RulesPage {
  title: string
  description: string
  customInstructions: string | null
  allowPause: boolean
  mustCompleteInOneSitting: boolean
  exitBehavior: ExitBehavior
  lockQuizUntilSlidesComplete: boolean
  requireMinimumVideoWatch: boolean
  showEstimatedDuration: boolean
  showPassingScore: boolean
  showQuestionCount: boolean
}

export interface Training {
  id: string
  title: string
  description: string
  status: TrainingStatus
  category: string
  departmentId: string | null
  thumbnailUrl: string | null
  estimatedDurationMinutes: number
  passingScore: number
  allowRetakes: boolean
  maxAttempts: number | null
  timeLimitMinutes: number | null
  showResults: boolean
  recurrence: Recurrence
  passwordProtected: boolean
  accessPassword: string | null
  shareableLinkToken: string | null
  linkVisibility: LinkVisibility
  rulesPage: RulesPage
  assignedCount: number
  completionRate: number
  lastUpdated: string
  createdAt: string
}

export interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface VideoSlideContent {
  videoUrl: string | null
  embedUrl: string | null
  title: string | null
  body: string | null
}

export interface TextSlideContent {
  body: string
}

export interface QuestionSlideContent {
  questionText: string
  options: AnswerOption[]
  explanation: string | null
  pointValue: number
}

export interface SlideSettings {
  requiredCompletion: boolean
  requiredWatch?: boolean
  shuffleAnswers?: boolean
}

export interface Slide {
  id: string
  type: SlideType
  order: number
  title: string
  content: VideoSlideContent | TextSlideContent | QuestionSlideContent
  settings: SlideSettings
}

export interface QuizQuestion {
  id: string
  order: number
  questionText: string
  options: AnswerOption[]
  explanation: string | null
  pointValue: number
}

export interface ActiveTraining {
  id: string
  title: string
  status: TrainingStatus
  lastSaved: string
  slides: Slide[]
  quizQuestions: QuizQuestion[]
}

export interface TrainingBuilderProps {
  departments: Department[]
  trainings: Training[]
  activeTraining: ActiveTraining

  // Training list actions
  /** Create a new training and open the builder */
  onCreateTraining?: () => void
  /** Open an existing training in the builder */
  onEditTraining?: (trainingId: string) => void
  /** Archive a training */
  onArchiveTraining?: (trainingId: string) => void
  /** Duplicate a training */
  onDuplicateTraining?: (trainingId: string) => void
  /** Navigate to analytics for a training */
  onViewAnalytics?: (trainingId: string) => void

  // Builder top bar actions
  /** Update the training title inline */
  onUpdateTitle?: (title: string) => void
  /** Preview the training as an employee */
  onPreview?: () => void
  /** Publish the training */
  onPublish?: () => void
  /** Navigate back to the training list */
  onBack?: () => void

  // Slide actions
  /** Add a new slide of the given type */
  onAddSlide?: (type: SlideType) => void
  /** Select a slide for editing */
  onSelectSlide?: (slideId: string) => void
  /** Reorder slides via drag-and-drop */
  onReorderSlides?: (slideIds: string[]) => void
  /** Duplicate a slide */
  onDuplicateSlide?: (slideId: string) => void
  /** Delete a slide */
  onDeleteSlide?: (slideId: string) => void
  /** Update slide content */
  onUpdateSlide?: (slideId: string, updates: Partial<Slide>) => void

  // Quiz actions
  /** Add a new quiz question */
  onAddQuizQuestion?: () => void
  /** Update an existing quiz question */
  onUpdateQuizQuestion?: (questionId: string, updates: Partial<QuizQuestion>) => void
  /** Reorder quiz questions */
  onReorderQuizQuestions?: (questionIds: string[]) => void
  /** Delete a quiz question */
  onDeleteQuizQuestion?: (questionId: string) => void
  /** Open the CSV import modal */
  onImportQuestions?: () => void

  // Settings actions
  /** Update training settings */
  onUpdateSettings?: (updates: Partial<Training>) => void
  /** Update rules page settings */
  onUpdateRulesPage?: (updates: Partial<RulesPage>) => void
}
