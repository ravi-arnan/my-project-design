import data from '@/../product/sections/question-bank-and-import/data.json'
import { QuestionLibrary } from './components/QuestionLibrary'

export default function QuestionLibraryPreview() {
  return (
    <QuestionLibrary
      categories={data.categories}
      bankQuestions={data.bankQuestions as any}
      questionUsages={data.questionUsages as any}
      importSession={data.importSession as any}
      bankStats={data.bankStats}
      onCreateQuestion={(q) => console.log('Create question:', q)}
      onEditQuestion={(id) => console.log('Edit question:', id)}
      onDeleteQuestions={(ids) => console.log('Delete questions:', ids)}
      onCategorizeQuestions={(ids, catId) => console.log('Categorize:', ids, catId)}
      onTagQuestions={(ids, tags) => console.log('Tag:', ids, tags)}
      onViewUsage={(id) => console.log('View usage:', id)}
      onStartImport={() => console.log('Start import')}
      onUploadFile={(file) => console.log('Upload file:', file)}
      onFixImportRow={(row, updates) => console.log('Fix row:', row, updates)}
      onReUploadFile={(file) => console.log('Re-upload:', file)}
      onConfirmImport={(id) => console.log('Confirm import:', id)}
      onCancelImport={(id) => console.log('Cancel import:', id)}
      onAddToTraining={(ids) => console.log('Add to training:', ids)}
      onCreateCategory={(name) => console.log('Create category:', name)}
      onRenameCategory={(id, name) => console.log('Rename category:', id, name)}
      onDeleteCategory={(id) => console.log('Delete category:', id)}
    />
  )
}
