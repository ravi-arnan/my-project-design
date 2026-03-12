// Question Bank & Import — TypeScript Interfaces

export type QuestionType = 'multiple_choice' | 'true_false'

export type TrainingStatus = 'active' | 'draft' | 'archived'

export type ImportRowStatus = 'valid' | 'error'

export type ImportStep = 'upload' | 'review' | 'confirm' | 'complete'

export interface Category {
  id: string
  name: string
  questionCount: number
}

export interface BankQuestion {
  id: string
  questionText: string
  type: QuestionType
  options: string[]
  correctAnswerIndex: number
  explanation: string
  categoryId: string
  category: string
  tags: string[]
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface QuestionUsage {
  trainingId: string
  trainingTitle: string
  copiedAt: string
  trainingStatus: TrainingStatus
}

export interface ImportRow {
  rowNumber: number
  questionText: string
  type: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  tags: string
  status: ImportRowStatus
  errors: string[]
}

export interface ImportSession {
  id: string
  fileName: string
  fileSize: string
  uploadedAt: string
  totalRows: number
  validRows: number
  errorRows: number
  step: ImportStep
  rows: ImportRow[]
}

export interface BankStats {
  totalQuestions: number
  multipleChoice: number
  trueFalse: number
  totalCategories: number
  questionsUsedInTrainings: number
  unusedQuestions: number
  lastImportDate: string
}

export interface QuestionBankImportProps {
  categories: Category[]
  bankQuestions: BankQuestion[]
  questionUsages: Record<string, QuestionUsage[]>
  importSession: ImportSession
  bankStats: BankStats

  /** Create a new question in the bank */
  onCreateQuestion?: (question: Omit<BankQuestion, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => void
  /** Edit an existing bank question */
  onEditQuestion?: (questionId: string) => void
  /** Delete one or more questions from the bank */
  onDeleteQuestions?: (questionIds: string[]) => void
  /** Assign a category to one or more questions */
  onCategorizeQuestions?: (questionIds: string[], categoryId: string) => void
  /** Add or remove tags on one or more questions */
  onTagQuestions?: (questionIds: string[], tags: string[]) => void
  /** View usage details for a question */
  onViewUsage?: (questionId: string) => void
  /** Start a new CSV import — triggers upload step */
  onStartImport?: () => void
  /** Upload a CSV file for import */
  onUploadFile?: (file: File) => void
  /** Fix a validation error inline during import review */
  onFixImportRow?: (rowNumber: number, updatedRow: Partial<ImportRow>) => void
  /** Re-upload a corrected CSV file during review */
  onReUploadFile?: (file: File) => void
  /** Confirm and finalize the import */
  onConfirmImport?: (sessionId: string) => void
  /** Cancel an in-progress import */
  onCancelImport?: (sessionId: string) => void
  /** Add selected bank questions as snapshot copies to a training */
  onAddToTraining?: (questionIds: string[]) => void
  /** Create a new category */
  onCreateCategory?: (name: string) => void
  /** Rename a category */
  onRenameCategory?: (categoryId: string, newName: string) => void
  /** Delete a category (questions are uncategorized, not deleted) */
  onDeleteCategory?: (categoryId: string) => void
}
