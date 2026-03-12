import data from '@/../product/sections/question-bank-and-import/data.json'
import { QuestionBankPicker } from './components/QuestionBankPicker'

export default function QuestionBankPickerPreview() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <QuestionBankPicker
        categories={data.categories}
        bankQuestions={data.bankQuestions as any}
        onAddToTraining={(ids) => console.log('Add to training:', ids)}
        onClose={() => console.log('Close picker')}
      />
    </div>
  )
}
