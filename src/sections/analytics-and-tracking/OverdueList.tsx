import data from '@/../product/sections/analytics-and-tracking/data.json'
import { OverdueList } from './components/OverdueList'

export default function OverdueListPreview() {
  return (
    <OverdueList
      overdueUsers={data.overdueUsers as any}
      onViewUser={(id) => console.log('View user:', id)}
      onViewTraining={(id) => console.log('View training:', id)}
      onNavigateBack={() => console.log('Navigate back')}
      onExportCsv={(tableId) => console.log('Export CSV:', tableId)}
    />
  )
}
