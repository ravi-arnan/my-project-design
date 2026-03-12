import data from '@/../product/sections/training-player/data.json'
import { ResultsScreen } from './components/ResultsScreen'

export default function ResultsScreenPreview() {
  return (
    <ResultsScreen
      result={data.attemptResult}
      questions={data.quizQuestions}
      trainingTitle={data.trainingRules.title}
      maxAttempts={data.trainingRules.maxAttempts}
      onReturnToDashboard={() => console.log('Return to dashboard')}
      onRetryQuiz={(id) => console.log('Retry quiz:', id)}
    />
  )
}
