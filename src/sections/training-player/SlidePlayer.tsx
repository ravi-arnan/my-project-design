import data from '@/../product/sections/training-player/data.json'
import { SlidePlayer } from './components/SlidePlayer'

export default function SlidePlayerPreview() {
  return (
    <SlidePlayer
      slides={data.slides}
      playerState={data.playerState}
      trainingTitle={data.trainingRules.title}
      onNextSlide={(id, idx) => console.log('Next slide:', id, idx)}
      onAnswerInlineQuestion={(qId, idx) => console.log('Answer:', qId, idx)}
      onPause={(id) => console.log('Pause:', id)}
      onResume={(id) => console.log('Resume:', id)}
      onExitAttempt={(id) => console.log('Exit attempt:', id)}
      onBack={() => console.log('Back')}
    />
  )
}
