import data from '@/../product/sections/analytics-and-tracking/data.json'
import { UserAnalyticsDrawer } from './components/UserAnalyticsDrawer'

export default function UserAnalyticsDrawerPreview() {
  return (
    <UserAnalyticsDrawer
      userAnalytics={data.userAnalytics as any}
      open={true}
      onClose={() => console.log('Close drawer')}
      onViewTraining={(id) => console.log('View training:', id)}
      onViewAttempt={(id) => console.log('View attempt:', id)}
      onExportCsv={(tableId) => console.log('Export CSV:', tableId)}
    />
  )
}
