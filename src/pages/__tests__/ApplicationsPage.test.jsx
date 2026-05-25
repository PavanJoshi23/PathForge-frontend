import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationsPage from '../ApplicationsPage'
import * as applicationsService from '@/services/applications'

vi.mock('@/services/applications')

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
  {
    id: 2,
    company_name: 'Beta Inc',
    job_title: 'Backend Developer',
    status: 'interview',
    application_date: '2026-02-01',
    salary_min: null,
    salary_max: null,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  applicationsService.fetchApplications.mockResolvedValue({ items: mockApps, total: 2 })
})

describe('ApplicationsPage', () => {
  it('renders the page heading', async () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /applications/i })).toBeInTheDocument()
  })

  it('shows loaded applications in the table', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
      expect(screen.getByText('Beta Inc')).toBeInTheDocument()
    })
  })

  it('shows empty state when no applications', async () => {
    applicationsService.fetchApplications.mockResolvedValue({ items: [], total: 0 })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no applications yet/i)).toBeInTheDocument()
    })
  })

  it('shows Add Application button', async () => {
    renderPage()
    expect(screen.getByRole('button', { name: /add application/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
