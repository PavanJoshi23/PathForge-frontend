import { NavLink, Outlet } from 'react-router-dom'
import { Briefcase, FileText, BarChart2, MessageSquare, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/applications', label: 'Applications', icon: Briefcase },
  { to: '/resumes', label: 'Resumes', icon: FileText },
  { to: '/analysis', label: 'Analysis', icon: BarChart2 },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex w-56 flex-col border-r bg-card">
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-lg font-bold tracking-tight">PathForge</span>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
