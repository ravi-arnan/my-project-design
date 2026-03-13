// Analytics & Tracking — TypeScript Interfaces

export type UserCompletionStatus = 'completed' | 'failed' | 'in_progress' | 'overdue' | 'not_started'

export type ActivityType = 'completed' | 'failed' | 'assigned'

export type AttemptStatus = 'passed' | 'failed' | 'in_progress' | 'abandoned'

export type AttemptEventType = 'started' | 'paused' | 'resumed' | 'slide_completed' | 'quiz_started' | 'submitted'

export type DateRangePreset = '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom'

export interface DateRange {
  from: string
  to: string
}

export interface OverviewMetrics {
  activeTrainings: number
  totalAssigned: number
  totalCompleted: number
  totalInProgress: number
  completionRate: number
  passRate: number
  failRate: number
  averageScore: number
  overdueUsers: number
  averageCompletionTimeMinutes: number
  averageTimeToStartHours: number
  dateRange: DateRange
}

export interface CompletionTrendPoint {
  date: string
  completed: number
  assigned: number
}

export interface ScoreDistributionBucket {
  range: string
  count: number
}

export interface RecentActivity {
  id: string
  type: ActivityType
  employeeName: string
  trainingTitle: string
  score: number | null
  timestamp: string
}

export interface TrainingPerformance {
  trainingId: string
  trainingTitle: string
  category: string
  assigned: number
  started: number
  completed: number
  failed: number
  completionRate: number
  passRate: number
  averageScore: number
  averageCompletionTimeMinutes: number
  overdueCount: number
}

export interface TrainingDetailMetrics {
  assigned: number
  started: number
  completed: number
  failed: number
  abandoned: number
  completionRate: number
  passRate: number
  failRate: number
  averageScore: number
  averageCompletionTimeMinutes: number
  averageTimeToStartHours: number
  dropOffRate: number
  overdueCount: number
}

export interface UserCompletion {
  employeeId: string
  employeeName: string
  department: string
  status: UserCompletionStatus
  score: number | null
  attempts: number
  completedAt: string | null
  completionTimeMinutes: number | null
}

export interface QuestionPerformance {
  questionId: string
  questionText: string
  correctRate: number
  incorrectRate: number
  averageTimeSeconds: number
}

export interface TrainingDetail {
  trainingId: string
  trainingTitle: string
  category: string
  metrics: TrainingDetailMetrics
  userCompletions: UserCompletion[]
  questionPerformance: QuestionPerformance[]
}

export interface UserSummary {
  totalAssigned: number
  completed: number
  inProgress: number
  failed: number
  overdue: number
  averageScore: number
  averageCompletionTimeMinutes: number
  averageTimeToStartHours: number
  recurringComplianceRate: number
}

export interface UserTrainingHistory {
  trainingId: string
  trainingTitle: string
  status: UserCompletionStatus
  score: number | null
  attempts: number
  assignedAt: string
  completedAt: string | null
  dueDate: string
  isRecurring: boolean
}

export interface ScoreHistoryPoint {
  date: string
  score: number
  trainingTitle: string
}

export interface UserAnalytics {
  employeeId: string
  employeeName: string
  department: string
  role: string
  hireDate: string
  summary: UserSummary
  scoreHistory: ScoreHistoryPoint[]
  trainingHistory: UserTrainingHistory[]
}

export interface AttemptEvent {
  type: AttemptEventType
  timestamp: string
  detail?: string
}

export interface AttemptAnswer {
  questionId: string
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpentSeconds: number
}

export interface AttemptDetail {
  attemptId: string
  employeeId: string
  employeeName: string
  trainingId: string
  trainingTitle: string
  attemptNumber: number
  status: AttemptStatus
  score: number
  passingScore: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  startedAt: string
  completedAt: string
  durationMinutes: number
  events: AttemptEvent[]
  answers: AttemptAnswer[]
}

export interface OverdueUser {
  employeeId: string
  employeeName: string
  department: string
  trainingId: string
  trainingTitle: string
  dueDate: string
  daysOverdue: number
  status: 'not_started' | 'in_progress'
}

export interface AnalyticsTrackingProps {
  overviewMetrics: OverviewMetrics
  completionTrend: CompletionTrendPoint[]
  scoreDistribution: ScoreDistributionBucket[]
  recentActivity: RecentActivity[]
  trainingPerformance: TrainingPerformance[]
  trainingDetail: TrainingDetail
  userAnalytics: UserAnalytics
  attemptDetail: AttemptDetail
  overdueUsers: OverdueUser[]

  /** Navigate to an individual training's analytics page */
  onViewTraining?: (trainingId: string) => void
  /** Open user analytics drawer */
  onViewUser?: (employeeId: string) => void
  /** Open attempt detail drawer */
  onViewAttempt?: (attemptId: string) => void
  /** Change the date range for analytics data */
  onDateRangeChange?: (range: DateRange) => void
  /** Export a table's data as CSV */
  onExportCsv?: (tableId: string) => void
  /** Navigate back from a detail view */
  onNavigateBack?: () => void
}
