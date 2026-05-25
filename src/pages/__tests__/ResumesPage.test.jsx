import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ResumesPage from '../ResumesPage'
import * as resumeService from '@/services/resumes'

vi.mock('@/services/resumes')

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ResumesPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const mockResumes = [
  {
    id: 1,
    name: 'Software Engineer Resume',
    original_filename: 'resume_v1.pdf',
    tags: null,
    version: 'v1',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Full Stack Resume',
    original_filename: 'resume_v2.docx',
    tags: null,
    version: 'v2',
    created_at: '2026-02-01T12:00:00Z',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  resumeService.fetchResumes.mockResolvedValue({ items: mockResumes, total: 2 })
  resumeService.deleteResume.mockResolvedValue(undefined)
})

describe('ResumesPage', () => {
  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /resumes/i })).toBeInTheDocument()
  })

  it('shows uploaded resumes in the list', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument()
      expect(screen.getByText('Full Stack Resume')).toBeInTheDocument()
    })
  })

  it('shows version badges on resume cards', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('v1')).toBeInTheDocument()
      expect(screen.getByText('v2')).toBeInTheDocument()
    })
  })

  it('shows empty state when no resumes', async () => {
    resumeService.fetchResumes.mockResolvedValue({ items: [], total: 0 })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument()
    })
  })

  it('renders file input for upload', () => {
    renderPage()
    const input = document.querySelector('input[type="file"]')
    expect(input).toBeInTheDocument()
  })

  it('shows delete buttons for each resume', async () => {
    renderPage()
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons.length).toBe(2)
    })
  })
})
