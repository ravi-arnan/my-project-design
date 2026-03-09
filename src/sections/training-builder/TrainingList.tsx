import data from '@/../product/sections/training-builder/data.json'
import { TrainingList } from './components/TrainingList'

export default function TrainingListPreview() {
  return (
    <TrainingList
      trainings={data.trainings as any}
      departments={data.departments}
      onCreateTraining={() => console.log('Create new training')}
      onEditTraining={(id) => console.log('Edit training:', id)}
      onArchiveTraining={(id) => console.log('Archive training:', id)}
      onDuplicateTraining={(id) => console.log('Duplicate training:', id)}
      onViewAnalytics={(id) => console.log('View analytics:', id)}
    />
  )
}
