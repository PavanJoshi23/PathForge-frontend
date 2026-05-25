import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../DashboardPage'
import * as dashboardService from '@/services/dashboard'

vi.mock('@/services/dashboard')

// Recharts uses ResizeObserver + SVG layout — mock it to avoid jsdom issues
vi.mock('recharts', () => {
  const Passthrough = ({ children }) => children ?? null
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: Passthrough,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    PieChart: Passthrough,
    Pie: () => null,
    Cell: () => null,
    BarChart: Passthrough,
    Bar: () => null,
  }
})

const mockSummary = {
  totals: {
    total: 12,
    applied: 10,
    interviewing: 3,
    offers: 1,
    rejected: 4,
    pending_followups: 2,
  },
  rates: {
    interview_rate: 0.30,
    offer_rate: 0.10,
    rejection_rate: 0.40,
  },
  monthly_trend: [
    { month: '2025-12', count: 2 },
    { month: '2026-01', count: 3 },
    { month: '2026-02', count: 1 },
    { month: '2026-03', count: 4 },
    { month: '2026-04', count: 1 },
    { month: '2026-05', count: 1 },
  ],
  status_distribution: [
    { status: 'applied', count: 4 },
    { status: 'interview', count: 3 },
    { status: 'rejected', count: 4 },
    { status: 'offer', count: 1 },
  ],
  skill_demand: [
    { skill: 'Python', count: 8 },
    { skill: 'Docker', count: 5 },
    { skill: 'React', count: 3 },
  ],
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <DashboardPage />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('DashboardPage — empty state', () => {
  it('shows empty state message when total < 3', async () => {
    dashboardService.fetchDashboardSummary.mockResolvedValue({
      ...mockSummary,
      totals: { ...mockSummary.totals, total: 2 },
    })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/add more applications/i)).toBeInTheDocument()
    })
  })
})

describe('DashboardPage — with data', () => {
  beforeEach(() => {
    dashboardService.fetchDashboardSummary.mockResolvedValue(mockSummary)
  })

  it('renders the Dashboard heading', async () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('shows Total Applications KPI card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/total applications/i)).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })

  it('shows Interview Rate KPI card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/interview rate/i)).toBeInTheDocument()
    })
  })

  it('shows Offer Rate KPI card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/offer rate/i)).toBeInTheDocument()
    })
  })

  it('shows Pending Follow-ups KPI card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/pending follow.?ups/i)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('renders monthly trend chart section', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/monthly applications/i)).toBeInTheDocument()
    })
  })

  it('renders status distribution chart section', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/status distribution/i)).toBeInTheDocument()
    })
  })

  it('renders top skills chart section', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/top skills in demand/i)).toBeInTheDocument()
    })
  })
})

describe('DashboardPage — loading state', () => {
  it('shows loading skeleton while fetching', () => {
    dashboardService.fetchDashboardSummary.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
