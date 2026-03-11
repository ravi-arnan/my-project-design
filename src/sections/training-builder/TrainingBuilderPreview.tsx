import data from '@/../product/sections/training-builder/data.json'
import { TrainingBuilder } from './components/TrainingBuilder'

export default function TrainingBuilderPreview() {
  return (
    <TrainingBuilder
      departments={data.departments}
      trainings={data.trainings as any}
      activeTraining={data.activeTraining as any}
      onBack={() => console.log('Back to list')}
      onPreview={() => console.log('Preview training')}
      onPublish={() => console.log('Publish training')}
      onUpdateTitle={(title) => console.log('Update title:', title)}
      onAddSlide={(type) => console.log('Add slide:', type)}
      onSelectSlide={(id) => console.log('Select slide:', id)}
      onDeleteSlide={(id) => console.log('Delete slide:', id)}
      onDuplicateSlide={(id) => console.log('Duplicate slide:', id)}
      onUpdateSlide={(id, updates) => console.log('Update slide:', id, updates)}
      onReorderSlides={(ids) => console.log('Reorder slides:', ids)}
      onAddQuizQuestion={() => console.log('Add quiz question')}
      onUpdateQuizQuestion={(id, updates) => console.log('Update quiz question:', id, updates)}
      onDeleteQuizQuestion={(id) => console.log('Delete quiz question:', id)}
      onReorderQuizQuestions={(ids) => console.log('Reorder quiz questions:', ids)}
      onImportQuestions={() => console.log('Import questions')}
      onUpdateSettings={(updates) => console.log('Update settings:', updates)}
      onUpdateRulesPage={(updates) => console.log('Update rules page:', updates)}
    />
  )
}
