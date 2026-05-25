import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationDetailPage from '../ApplicationDetailPage'
import * as applicationsService from '@/services/applications'
import * as resumeService from '@/services/resumes'

vi.mock('@/services/applications')
vi.mock('@/services/resumes')

const mockApp = {
  id: 1,
  company_name: 'Acme Corp',
  job_title: 'Frontend Engineer',
  status: 'applied',
  application_date: '2026-01-15',
  follow_up_date: null,
  job_description: 'Build cool things.',
  notes: 'Looks promising',
  salary_min: 80000,
  salary_max: 100000,
  job_link: 'https://jobs.acme.com/123',
  resume_id: null,
  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-01-15T00:00:00Z',
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/applications/1']}>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications" element={<div>Applications List</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  applicationsService.fetchApplication.mockResolvedValue(mockApp)
  applicationsService.updateApplication.mockResolvedValue(mockApp)
  applicationsService.deleteApplication.mockResolvedValue(undefined)
  resumeService.fetchResumes.mockResolvedValue({ items: [], total: 0 })
  resumeService.fetchResume.mockResolvedValue(null)
})

describe('ApplicationDetailPage', () => {
  it('displays company name and job title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    })
  })

  it('displays the job description', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Build cool things.')).toBeInTheDocument()
    })
  })

  it('shows a Back link', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument()
    })
  })

  it('shows a Delete button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })

  it('shows Edit button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })
  })

  it('shows linked resume name when application has resume_id', async () => {
    const linkedResume = {
      id: 1,
      name: 'My Resume',
      original_filename: 'resume.pdf',
      version: 'v1',
      tags: null,
      parsed_text: '',
      created_at: '2026-01-01T00:00:00Z',
    }
    resumeService.fetchResume.mockResolvedValue(linkedResume)
    applicationsService.fetchApplication.mockResolvedValue({ ...mockApp, resume_id: 1 })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('My Resume')).toBeInTheDocument()
    })
  })
})
