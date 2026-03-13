import data from '@/../product/sections/analytics-and-tracking/data.json'
import { TrainingAnalytics } from './components/TrainingAnalytics'

export default function TrainingAnalyticsPreview() {
  return (
    <TrainingAnalytics
      trainingDetail={data.trainingDetail as any}
      onViewUser={(id) => console.log('View user:', id)}
      onViewAttempt={(id) => console.log('View attempt:', id)}
      onNavigateBack={() => console.log('Navigate back')}
      onExportCsv={(tableId) => console.log('Export CSV:', tableId)}
    />
  )
}
