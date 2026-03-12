import data from '@/../product/sections/training-player/data.json'
import { TrainingRulesPage } from './components/TrainingRulesPage'

export default function TrainingRulesPagePreview() {
  return (
    <TrainingRulesPage
      rules={data.trainingRules}
      attemptsUsed={0}
      onStartTraining={(id) => console.log('Start training:', id)}
      onBack={() => console.log('Back to dashboard')}
    />
  )
}
