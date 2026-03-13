import data from '@/../product/sections/analytics-and-tracking/data.json'
import { AnalyticsOverview } from './components/AnalyticsOverview'

export default function AnalyticsOverviewPreview() {
  return (
    <AnalyticsOverview
      overviewMetrics={data.overviewMetrics as any}
      completionTrend={data.completionTrend}
      scoreDistribution={data.scoreDistribution}
      recentActivity={data.recentActivity as any}
      trainingPerformance={data.trainingPerformance}
      trainingDetail={data.trainingDetail as any}
      userAnalytics={data.userAnalytics as any}
      attemptDetail={data.attemptDetail as any}
      overdueUsers={data.overdueUsers as any}
      onViewTraining={(id) => console.log('View training:', id)}
      onViewUser={(id) => console.log('View user:', id)}
      onViewAttempt={(id) => console.log('View attempt:', id)}
      onDateRangeChange={(range) => console.log('Date range:', range)}
      onExportCsv={(tableId) => console.log('Export CSV:', tableId)}
      onNavigateBack={() => console.log('Navigate back')}
    />
  )
}
