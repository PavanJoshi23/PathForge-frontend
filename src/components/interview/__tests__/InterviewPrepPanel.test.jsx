import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import InterviewPrepPanel from '../InterviewPrepPanel'
import * as interviewService from '@/services/interview'

vi.mock('@/services/interview')

const mockPrepResult = {
  id: 1,
  application_id: 10,
  technical_topics: [
    { topic: 'FastAPI', priority: 'high', why: 'Core framework used in the role' },
    { topic: 'Docker', priority: 'medium', why: 'Containerization required' },
  ],
  behavioral_questions: [
    'Tell me about a challenging project.',
    'How do you handle tight deadlines?',
  ],
  coding_topics: ['async/await', 'REST API design'],
  study_roadmap: [
    { week: 1, focus: 'AWS basics', resources: ['docs.aws.amazon.com'] },
  ],
  from_cache: false,
  created_at: '2026-01-01T00:00:00Z',
}

const mockCachedResult = { ...mockPrepResult, from_cache: true }

function renderPanel(props = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const defaults = { applicationId: 10, hasJD: true }
  return render(
    <QueryClientProvider client={qc}>
      <InterviewPrepPanel {...defaults} {...props} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('InterviewPrepPanel — disabled state', () => {
  it('disables generate button when no JD', () => {
    interviewService.fetchInterviewPrep.mockRejectedValue({ response: { status: 404 } })
    renderPanel({ hasJD: false })
    const btn = screen.queryByRole('button', { name: /generate interview prep/i })
    expect(btn).toBeDisabled()
  })
})

describe('InterviewPrepPanel — no results yet', () => {
  it('shows Generate Interview Prep button', async () => {
    interviewService.fetchInterviewPrep.mockRejectedValue({ response: { status: 404 } })
    renderPanel()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate interview prep/i })).toBeInTheDocument()
    })
  })
})

describe('InterviewPrepPanel — with results', () => {
  beforeEach(() => {
    interviewService.fetchInterviewPrep.mockResolvedValue(mockPrepResult)
  })

  it('renders Technical Topics tab content', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText('FastAPI')).toBeInTheDocument()
      expect(screen.getByText('Docker')).toBeInTheDocument()
    })
  })

  it('renders priority badge for technical topics', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument()
    })
  })

  it('shows Regenerate button when results exist', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument()
    })
  })

  it('calls generateInterviewPrep on Regenerate click', async () => {
    interviewService.generateInterviewPrep.mockResolvedValue(mockPrepResult)
    renderPanel()
    const btn = await screen.findByRole('button', { name: /regenerate/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(interviewService.generateInterviewPrep).toHaveBeenCalled()
    })
    const call = interviewService.generateInterviewPrep.mock.calls[0][0]
    expect(call).toMatchObject({ application_id: 10 })
  })
})

describe('InterviewPrepPanel — cached result', () => {
  it('shows From cache label when result is from cache', async () => {
    interviewService.fetchInterviewPrep.mockResolvedValue(mockCachedResult)
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText(/from cache/i)).toBeInTheDocument()
    })
  })
})

describe('InterviewPrepPanel — generate button behavior', () => {
  it('calls generateInterviewPrep with correct args on click', async () => {
    interviewService.fetchInterviewPrep.mockRejectedValue({ response: { status: 404 } })
    interviewService.generateInterviewPrep.mockResolvedValue(mockPrepResult)

    renderPanel()
    const btn = await screen.findByRole('button', { name: /generate interview prep/i })
    fireEvent.click(btn)

    await waitFor(() => {
      expect(interviewService.generateInterviewPrep).toHaveBeenCalled()
    })
    const call = interviewService.generateInterviewPrep.mock.calls[0][0]
    expect(call).toMatchObject({ application_id: 10 })
  })
})
