import data from '@/../product/sections/training-player/data.json'
import { EmployeeDashboard } from './components/EmployeeDashboard'

export default function EmployeeDashboardPreview() {
  return (
    <EmployeeDashboard
      employee={data.employee}
      assignedTrainings={data.assignedTrainings}
      completedTrainings={data.completedTrainings}
      onOpenTraining={(id) => console.log('Open training:', id)}
      onBack={() => console.log('Back')}
    />
  )
}
