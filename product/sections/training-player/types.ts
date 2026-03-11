// Training Player Types

export type TrainingStatus = "pending" | "overdue" | "in_progress";
export type TrainingCategory = "skills" | "compliance" | "onboarding" | "safety" | "general";
export type SlideType = "text" | "video" | "inline_question";
export type ExitBehavior = "abandon" | "fail" | "flag";
export type QuizLayout = "one_at_a_time" | "all_on_one_page";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  avatarUrl: string | null;
}

export interface AssignedTraining {
  id: string;
  trainingId: string;
  title: string;
  description: string;
  category: TrainingCategory;
  status: TrainingStatus;
  dueDate: string;
  estimatedDuration: number;
  slideCount: number;
  questionCount: number;
  passingScore: number;
  currentSlideIndex: number | null;
  maxAttempts: number | null;
  attemptsUsed: number;
}

export interface CompletedTraining {
  id: string;
  trainingId: string;
  title: string;
  completedDate: string;
  score: number;
  passed: boolean;
  attemptCount: number;
}

export interface TrainingRules {
  trainingId: string;
  title: string;
  description: string;
  estimatedDuration: number;
  questionCount: number;
  passingScore: number;
  allowPause: boolean;
  mustCompleteInOneSitting: boolean;
  exitBehavior: ExitBehavior;
  requireMinimumVideoWatch: boolean;
  showEstimatedDuration: boolean;
  showPassingScore: boolean;
  showQuestionCount: boolean;
  customInstructions: string | null;
  maxAttempts: number | null;
  retryCooldownMinutes: number | null;
}

export interface InlineQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Slide {
  id: string;
  trainingId: string;
  order: number;
  type: SlideType;
  title: string;
  content: string | null;
  videoUrl: string | null;
  videoDurationSeconds: number | null;
  question: InlineQuestion | null;
}

export interface QuizQuestion {
  id: string;
  trainingId: string;
  order: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface AttemptAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timeSeconds: number;
}

export interface SlideTiming {
  slideId: string;
  timeSeconds: number;
}

export interface AttemptResult {
  id: string;
  trainingId: string;
  employeeId: string;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  totalTimeSeconds: number;
  score: number;
  passed: boolean;
  questionsCorrect: number;
  questionsTotal: number;
  exitedMidAttempt: boolean;
  showDetailedResults: boolean;
  answers: AttemptAnswer[];
  slideTimings: SlideTiming[];
}

export interface PlayerState {
  trainingId: string;
  currentSlideIndex: number;
  totalSlides: number;
  timerStartedAt: string;
  elapsedSeconds: number;
  isPaused: boolean;
  allowPause: boolean;
  quizUnlocked: boolean;
  quizLayout: QuizLayout;
}

export interface TrainingPlayerProps {
  employee: Employee;
  assignedTrainings: AssignedTraining[];
  completedTrainings: CompletedTraining[];
  trainingRules: TrainingRules;
  slides: Slide[];
  quizQuestions: QuizQuestion[];
  attemptResult: AttemptResult | null;
  playerState: PlayerState | null;

  /** Called when the employee opens a training from the dashboard */
  onOpenTraining?: (trainingId: string) => void;
  /** Called when the employee acknowledges rules and starts the training */
  onStartTraining?: (trainingId: string) => void;
  /** Called when the employee advances to the next slide */
  onNextSlide?: (trainingId: string, slideIndex: number) => void;
  /** Called when the employee answers an inline question */
  onAnswerInlineQuestion?: (questionId: string, selectedIndex: number) => void;
  /** Called when the employee submits a quiz answer */
  onSubmitQuizAnswer?: (questionId: string, selectedIndex: number) => void;
  /** Called when the employee submits the entire quiz */
  onSubmitQuiz?: (trainingId: string) => void;
  /** Called when the employee pauses the training (if allowed) */
  onPause?: (trainingId: string) => void;
  /** Called when the employee resumes a paused training */
  onResume?: (trainingId: string) => void;
  /** Called when the employee tries to navigate away mid-training */
  onExitAttempt?: (trainingId: string) => void;
  /** Called when the employee returns to the dashboard */
  onReturnToDashboard?: () => void;
  /** Called when the employee wants to retry a failed quiz */
  onRetryQuiz?: (trainingId: string) => void;
}
