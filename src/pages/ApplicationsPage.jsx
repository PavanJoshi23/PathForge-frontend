import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download } from 'lucide-react'
import { useApplications } from '@/hooks/useApplications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import StatusBadge from '@/components/apps/StatusBadge'
import ApplicationForm from '@/components/apps/ApplicationForm'
import { APPLICATION_STATUSES } from '@/types/application'
import useDebounce from '@/hooks/useDebounce'

export default function ApplicationsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const params = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  }

  const { data, isLoading } = useApplications(params)
  const applications = data?.items ?? []

  const handleRowClick = useCallback(
    (id) => navigate(`/applications/${id}`),
    [navigate]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex gap-2">
          <a
            href="http://localhost:8000/api/applications/export?format=csv"
            download="applications.csv"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Export CSV"
          >
            <Download className="h-4 w-4" />
            CSV
          </a>
          <a
            href="http://localhost:8000/api/applications/export?format=json"
            download="applications.json"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Export JSON"
          >
            <Download className="h-4 w-4" />
            JSON
          </a>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search company, title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No applications yet.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFormOpen(true)}>
            Add your first application
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table — hidden on mobile */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(app.id)}
                  >
                    <TableCell className="font-medium">{app.company_name}</TableCell>
                    <TableCell>{app.job_title}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.application_date ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.salary_min || app.salary_max
                        ? `${app.salary_min ?? '?'} – ${app.salary_max ?? '?'}`
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list — hidden on desktop */}
          <div className="space-y-3 md:hidden">
            {applications.map((app) => (
              <div
                key={app.id}
                data-testid="app-card"
                role="button"
                tabIndex={0}
                onClick={() => handleRowClick(app.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleRowClick(app.id)}
                className="flex cursor-pointer flex-col gap-1.5 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{app.company_name}</p>
                    <p className="text-sm text-muted-foreground">{app.job_title}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  {app.application_date && <span>Applied {app.application_date}</span>}
                  {(app.salary_min || app.salary_max) && (
                    <span>${app.salary_min ?? '?'} – ${app.salary_max ?? '?'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ApplicationForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
