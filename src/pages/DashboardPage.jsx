import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDashboardSummary } from '@/hooks/useDashboard'

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316']

function KpiCard({ label, value, sub }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </div>
  )
}

function pct(rate) {
  return `${Math.round(rate * 100)}%`
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Loading analytics…</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-destructive">Failed to load analytics. Is the backend running?</p>
      </div>
    )
  }

  if (data.totals.total < 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No analytics yet</p>
          <p className="mt-2 text-muted-foreground">
            Add more applications to see analytics — you need at least 3 to get started.
          </p>
        </div>
      </div>
    )
  }

  const { totals, rates, monthly_trend, status_distribution, skill_demand } = data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total Applications" value={totals.total} />
        <KpiCard
          label="Interview Rate"
          value={pct(rates.interview_rate)}
          sub={`${totals.interviewing} of ${totals.applied} submitted`}
        />
        <KpiCard
          label="Offer Rate"
          value={pct(rates.offer_rate)}
          sub={`${totals.offers} offer${totals.offers !== 1 ? 's' : ''}`}
        />
        <KpiCard
          label="Pending Follow-ups"
          value={totals.pending_followups}
          sub="past due date"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line chart — monthly trend */}
        <SectionCard title="Monthly Applications (last 6 months)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly_trend} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Pie chart — status distribution */}
        <SectionCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={status_distribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status, percent }) =>
                  `${status} ${Math.round(percent * 100)}%`
                }
              >
                {status_distribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name) => [val, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bar chart — top skills */}
      <SectionCard title="Top Skills in Demand">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={skill_demand}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 60, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="skill" tick={{ fontSize: 12 }} width={56} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  )
}
