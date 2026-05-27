import { NavLink, Outlet } from 'react-router-dom'
import { Briefcase, FileText, BarChart2, MessageSquare, LayoutDashboard, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/themeStore'
import vocraIcon from '@/assets/vocra-icon.svg'

const navItems = [
  { to: '/applications', label: 'Applications', icon: Briefcase },
  { to: '/resumes', label: 'Resumes', icon: FileText },
  { to: '/analysis', label: 'Analysis', icon: BarChart2 },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function AppLayout() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-card">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <img src={vocraIcon} alt="Vocra icon" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-foreground">vocra</span>
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
        <div className="border-t p-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-card md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-muted-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
    </div>
  )
}
