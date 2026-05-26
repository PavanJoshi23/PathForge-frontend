import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationsPage from '../ApplicationsPage'
import * as applicationsService from '@/services/applications'

vi.mock('@/services/applications')

const mockApps = [
  {
    id: 1,
    company_name: 'Acme Corp',
    job_title: 'Frontend Engineer',
    status: 'applied',
    application_date: '2026-01-15',
    salary_min: 80000,
    salary_max: 100000,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
]

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ApplicationsPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  applicationsService.fetchApplications.mockResolvedValue({ items: mockApps, total: 1 })
})

describe('ApplicationsPage mobile card list', () => {
  it('renders mobile card list (md:hidden block)', async () => {
    renderPage()
    await waitFor(() => {
      // Mobile cards use data-testid or aria-label
      const cards = screen.getAllByTestId('app-card')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  it('mobile card shows company name', async () => {
    renderPage()
    await waitFor(() => {
      const cards = screen.getAllByTestId('app-card')
      expect(cards[0]).toHaveTextContent('Acme Corp')
    })
  })

  it('mobile card shows job title', async () => {
    renderPage()
    await waitFor(() => {
      const cards = screen.getAllByTestId('app-card')
      expect(cards[0]).toHaveTextContent('Frontend Engineer')
    })
  })

  it('shows CSV and JSON export links', async () => {
    renderPage()
    expect(screen.getByRole('link', { name: /export csv/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /export json/i })).toBeInTheDocument()
  })
})
