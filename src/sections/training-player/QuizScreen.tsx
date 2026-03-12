import data from '@/../product/sections/training-player/data.json'
import { QuizScreen } from './components/QuizScreen'

export default function QuizScreenPreview() {
  return (
    <QuizScreen
      questions={data.quizQuestions}
      quizLayout={data.playerState.quizLayout as 'one_at_a_time' | 'all_on_one_page'}
      trainingId={data.playerState.trainingId}
      trainingTitle={data.trainingRules.title}
      elapsedSeconds={data.playerState.elapsedSeconds}
      onSubmitQuizAnswer={(qId, idx) => console.log('Answer:', qId, idx)}
      onSubmitQuiz={(id) => console.log('Submit quiz:', id)}
      onExitAttempt={(id) => console.log('Exit attempt:', id)}
    />
  )
}
