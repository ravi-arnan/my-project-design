import { useRef, useEffect, useState } from 'react'
import type {
  Employee,
  AssignedTraining,
  CompletedTraining,
} from '@/../product/sections/training-player/types'
import { TrainingCard } from './TrainingCard'

interface EmployeeDashboardProps {
  employee: Employee
  assignedTrainings: AssignedTraining[]
  completedTrainings: CompletedTraining[]
  onOpenTraining?: (trainingId: string) => void
  onBack?: () => void
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

type SectionKey = 'overdue' | 'in_progress' | 'upcoming' | 'completed'

interface SectionDef {
  key: SectionKey
  label: string
  icon: React.ReactNode
  dotColor: string
  count: number
}

export function EmployeeDashboard({
  employee,
  assignedTrainings,
  completedTrainings,
  onOpenTraining,
  onBack,
}: EmployeeDashboardProps) {
  const overdue = assignedTrainings.filter(t => t.status === 'overdue')
  const inProgress = assignedTrainings.filter(t => t.status === 'in_progress')
  const upcoming = assignedTrainings.filter(t => t.status === 'pending')

  const mainRef = useRef<HTMLElement>(null)
  const sectionRefs = useRef<Record<SectionKey, HTMLElement | null>>({
    overdue: null,
    in_progress: null,
    upcoming: null,
    completed: null,
  })

  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // IntersectionObserver to track which section is in view
  useEffect(() => {
    const scrollContainer = mainRef.current
    if (!scrollContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let bestEntry: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry
            }
          }
        }
        if (bestEntry) {
          const key = bestEntry.target.getAttribute('data-section') as SectionKey
          if (key) setActiveSection(key)
        }
      },
      {
        root: scrollContainer,
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [overdue.length, inProgress.length, upcoming.length, completedTrainings.length])

  const scrollToSection = (key: SectionKey) => {
    const el = sectionRefs.current[key]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Build section definitions (only sections that have items)
  const sections: SectionDef[] = []
  if (overdue.length > 0) {
    sections.push({
      key: 'overdue',
      label: 'Overdue',
      dotColor: 'bg-red-500',
      count: overdue.length,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
    })
  }
  if (inProgress.length > 0) {
    sections.push({
      key: 'in_progress',
      label: 'In Progress',
      dotColor: 'bg-violet-500',
      count: inProgress.length,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      ),
    })
  }
  if (upcoming.length > 0) {
    sections.push({
      key: 'upcoming',
      label: 'Upcoming',
      dotColor: 'bg-amber-500',
      count: upcoming.length,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    })
  }
  if (completedTrainings.length > 0) {
    sections.push({
      key: 'completed',
      label: 'Completed',
      dotColor: 'bg-emerald-500',
      count: completedTrainings.length,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ),
    })
  }

  const totalAssigned = assignedTrainings.length

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* =========== TOP BAR =========== */}
      <header className="flex items-center justify-between h-12 px-3 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        {/* Left cluster */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors md:hidden"
            title="Menu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <button
            onClick={() => onBack?.()}
            className="p-1.5 -ml-1 md:ml-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>

          {/* Divider */}
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400 truncate">Training Player</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">EmployeeDashboard</span>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">100%</span>
          <a
            href="#"
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Fullscreen
          </a>
        </div>
      </header>

      {/* =========== MOBILE SIDEBAR OVERLAY =========== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-in sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col animate-slide-in-left shadow-2xl shadow-black/40">
            {/* Close button */}
            <div className="flex items-center justify-between h-12 px-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Employee profile */}
            <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-3 mb-3">
                {employee.avatarUrl ? (
                  <img src={employee.avatarUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">{getInitials(employee.firstName, employee.lastName)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{employee.firstName} {employee.lastName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{employee.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{totalAssigned}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Assigned</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-none">{completedTrainings.length}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Completed</p>
                </div>
              </div>
            </div>
            {/* Section navigator */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
              <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">Sections</p>
              {sections.map((section) => {
                const isActive = activeSection === section.key
                return (
                  <button
                    key={section.key}
                    onClick={() => scrollToSection(section.key)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative group
                      ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
                    `}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-500" />}
                    <span className={`w-2 h-2 rounded-full shrink-0 ${section.dotColor} ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                    <span className="truncate">{section.label}</span>
                    <span className={`ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md shrink-0
                      ${isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'}
                    `}>{section.count}</span>
                  </button>
                )
              })}
            </nav>
            {/* Progress */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 font-medium">Overall Progress</span>
                <span className="text-[10px] text-violet-400 font-semibold tabular-nums">
                  {totalAssigned > 0 ? Math.round((completedTrainings.length / (completedTrainings.length + totalAssigned)) * 100) : 100}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalAssigned > 0 ? Math.round((completedTrainings.length / (completedTrainings.length + totalAssigned)) * 100) : 100}%` }}
                />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =========== BODY: SIDEBAR + CONTENT =========== */}
      <div className="flex flex-1 min-h-0">

        {/* -------- LEFT SIDEBAR (desktop) -------- */}
        <aside className="hidden md:flex flex-col w-[220px] bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          {/* Employee profile */}
          <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center gap-3 mb-3">
              {employee.avatarUrl ? (
                <img
                  src={employee.avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white">
                    {getInitials(employee.firstName, employee.lastName)}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {employee.role}
                </p>
              </div>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{totalAssigned}</p>
                <p className="text-[10px] text-slate-500 mt-1">Assigned</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2.5 py-2 text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-none">{completedTrainings.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Completed</p>
              </div>
            </div>
          </div>

          {/* Section navigator */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
              Sections
            </p>
            {sections.map((section) => {
              const isActive = activeSection === section.key
              return (
                <button
                  key={section.key}
                  onClick={() => scrollToSection(section.key)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative group
                    ${isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-500" />
                  )}
                  {/* Dot */}
                  <span className={`w-2 h-2 rounded-full shrink-0 ${section.dotColor} ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                  {/* Label */}
                  <span className="truncate">{section.label}</span>
                  {/* Count badge */}
                  <span className={`ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md shrink-0
                    ${isActive
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                    }
                  `}>
                    {section.count}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Sidebar footer - overall progress */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-500 font-medium">Overall Progress</span>
              <span className="text-[10px] text-violet-400 font-semibold tabular-nums">
                {totalAssigned > 0
                  ? Math.round((completedTrainings.length / (completedTrainings.length + totalAssigned)) * 100)
                  : 100}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                style={{
                  width: `${totalAssigned > 0
                    ? Math.round((completedTrainings.length / (completedTrainings.length + totalAssigned)) * 100)
                    : 100}%`
                }}
              />
            </div>
          </div>
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10">

          {/* Welcome header */}
          <div className="flex items-center gap-4 mb-10">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt=""
              className="w-11 h-11 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {getInitials(employee.firstName, employee.lastName)}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {employee.firstName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {employee.role} &middot; {employee.department}
            </p>
          </div>
        </div>

        {/* OVERDUE section */}
        {overdue.length > 0 && (
          <section
            ref={el => { sectionRefs.current.overdue = el }}
            data-section="overdue"
            className="mb-8 scroll-mt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Overdue ({overdue.length})
              </h2>
            </div>
            <div className="space-y-4">
              {overdue.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onOpen={() => onOpenTraining?.(training.trainingId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* IN PROGRESS section */}
        {inProgress.length > 0 && (
          <section
            ref={el => { sectionRefs.current.in_progress = el }}
            data-section="in_progress"
            className="mb-8 scroll-mt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
              </svg>
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                In Progress ({inProgress.length})
              </h2>
            </div>
            <div className="space-y-4">
              {inProgress.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onOpen={() => onOpenTraining?.(training.trainingId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING section */}
        {upcoming.length > 0 && (
          <section
            ref={el => { sectionRefs.current.upcoming = el }}
            data-section="upcoming"
            className="mb-8 scroll-mt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Upcoming ({upcoming.length})
              </h2>
            </div>
            <div className="space-y-4">
              {upcoming.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onOpen={() => onOpenTraining?.(training.trainingId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* COMPLETED section */}
        {completedTrainings.length > 0 && (
          <section
            ref={el => { sectionRefs.current.completed = el }}
            data-section="completed"
            className="mb-8 scroll-mt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <h2 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Completed ({completedTrainings.length})
              </h2>
            </div>
            <div className="space-y-2">
              {completedTrainings.map(training => (
                <div
                  key={training.id}
                  className="flex items-center gap-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4"
                >
                  {/* Pass/fail icon */}
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    training.passed
                      ? 'bg-emerald-500/15'
                      : 'bg-red-500/15'
                  }`}>
                    {training.passed ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  {/* Title + date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{training.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(training.completedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {training.attemptCount > 1 && (
                        <span className="ml-1.5 text-slate-600">&middot; {training.attemptCount} attempts</span>
                      )}
                    </p>
                  </div>
                  {/* Score */}
                  <span className={`text-sm font-semibold tabular-nums shrink-0 ${
                    training.passed ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {training.score}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

          </div>
        </main>
      </div>
    </div>
  )
}
