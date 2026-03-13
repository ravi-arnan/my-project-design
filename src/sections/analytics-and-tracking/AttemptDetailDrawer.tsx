import data from '@/../product/sections/analytics-and-tracking/data.json'
import { AttemptDetailDrawer } from './components/AttemptDetailDrawer'

export default function AttemptDetailDrawerPreview() {
  return (
    <AttemptDetailDrawer
      attemptDetail={data.attemptDetail as any}
      open={true}
      onClose={() => console.log('Close drawer')}
      onViewUser={(id) => console.log('View user:', id)}
      onViewTraining={(id) => console.log('View training:', id)}
    />
  )
}
