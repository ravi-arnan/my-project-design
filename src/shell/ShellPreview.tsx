import AppShell from './components/AppShell'
import { defaultNavItems } from './components/MainNav'
import {
  BarChart3,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'

const navigationItems = defaultNavItems.map((item, i) => ({
  ...item,
  isActive: i === 0,
}))

const user = {
  name: 'Alex Morgan',
  avatarUrl: undefined,
}

/** Stat card for the dashboard preview */
function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string
  value: string
  change: string
  icon: typeof BarChart3
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mb-1">
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </span>
      </div>
    </div>
  )
}

/** Placeholder table row */
function TableRow({ name, status, score }: { name: string; status: string; score: string }) {
  const statusColor =
    status === 'Completed'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
      : status === 'In Progress'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <td className="py-2.5 pr-4 text-sm text-slate-900 dark:text-slate-100 font-medium">{name}</td>
      <td className="py-2.5 pr-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="py-2.5 text-sm text-slate-600 dark:text-slate-400 text-right font-mono">{score}</td>
    </tr>
  )
}

export default function ShellPreview() {
  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Training overview and recent activity
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Active Trainings" value="12" change="+2 this week" icon={BookOpen} />
          <StatCard label="Employees" value="148" change="+5 this month" icon={Users} />
          <StatCard label="Completion Rate" value="87%" change="+3.2%" icon={TrendingUp} />
          <StatCard label="Avg. Duration" value="24m" change="-2m" icon={Clock} />
        </div>

        {/* Recent activity table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Attempts</h2>
          </div>
          <div className="px-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 pr-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Employee</th>
                  <th className="py-2.5 pr-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</th>
                </tr>
              </thead>
              <tbody>
                <TableRow name="Sarah Chen" status="Completed" score="92%" />
                <TableRow name="Marcus Johnson" status="In Progress" score="—" />
                <TableRow name="Emily Davis" status="Completed" score="88%" />
                <TableRow name="James Wilson" status="Not Started" score="—" />
                <TableRow name="Priya Patel" status="Completed" score="95%" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
