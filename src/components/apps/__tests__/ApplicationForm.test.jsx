import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationForm from '../ApplicationForm'
import * as applicationsService from '@/services/applications'
import * as resumeService from '@/services/resumes'

vi.mock('@/services/applications')
vi.mock('@/services/resumes')

const mockResumes = [
  { id: 1, name: 'Software Engineer Resume', original_filename: 'resume.pdf', version: 'v1', tags: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Full Stack Resume', original_filename: 'resume2.pdf', version: 'v2', tags: null, created_at: '2026-02-01T00:00:00Z' },
]

function renderForm(props = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ApplicationForm open={true} onClose={vi.fn()} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  applicationsService.createApplication.mockResolvedValue({})
  resumeService.fetchResumes.mockResolvedValue({ items: mockResumes, total: 2 })
})

describe('ApplicationForm — resume linking', () => {
  it('shows a Resume label in the form', () => {
    renderForm()
    expect(screen.getByText('Resume')).toBeInTheDocument()
  })

  it('fetches resumes to populate the dropdown', async () => {
    renderForm()
    await waitFor(() => {
      expect(resumeService.fetchResumes).toHaveBeenCalled()
    })
  })

  it('renders resume options in the hidden native select', async () => {
    renderForm()
    await waitFor(() => {
      // Radix Select always renders a hidden <select> with <option> elements
      const allOptions = Array.from(document.querySelectorAll('select option'))
      const optionTexts = allOptions.map(o => o.textContent)
      expect(optionTexts.some(t => t.includes('Software Engineer Resume'))).toBe(true)
    })
  })

  it('displays selected resume name in trigger when editing', async () => {
    const app = {
      id: 1, company_name: 'Acme', job_title: 'Engineer', status: 'applied',
      resume_id: 1,
      job_description: null, job_link: null, application_date: null,
      follow_up_date: null, notes: null, salary_min: null, salary_max: null,
      created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
    }
    renderForm({ application: app })
    await waitFor(() => {
      // The SelectValue shows the selected item text in the trigger
      const matches = screen.getAllByText('Software Engineer Resume (v1)')
      expect(matches.length).toBeGreaterThan(0)
    })
  })
})
