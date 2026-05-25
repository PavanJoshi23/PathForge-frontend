import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnalysisPanel from '../AnalysisPanel'
import * as analysisService from '@/services/analysis'

vi.mock('@/services/analysis')

const mockResults = {
  id: 1,
  application_id: 10,
  resume_id: 5,
  match_score: 75,
  matching_keywords: ['python', 'docker', 'aws'],
  missing_keywords: ['react', 'kubernetes'],
  score_breakdown: {
    skills: 80,
    experience: 90,
    keyword_coverage: 60,
    education: 70,
  },
  created_at: '2026-01-01T00:00:00Z',
}

function renderPanel(props = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const defaults = { applicationId: 10, resumeId: 5, hasJD: true }
  return render(
    <QueryClientProvider client={qc}>
      <AnalysisPanel {...defaults} {...props} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AnalysisPanel — disabled states', () => {
  it('shows message when no job description', async () => {
    analysisService.fetchResults.mockRejectedValue({ response: { status: 404 } })
    renderPanel({ hasJD: false, resumeId: null })
    expect(screen.getByText(/add a job description/i)).toBeInTheDocument()
  })

  it('shows message when no resume linked', async () => {
    analysisService.fetchResults.mockRejectedValue({ response: { status: 404 } })
    renderPanel({ resumeId: null })
    expect(screen.getByText(/link a resume/i)).toBeInTheDocument()
  })

  it('hides Run Analysis button when no JD', () => {
    analysisService.fetchResults.mockRejectedValue({ response: { status: 404 } })
    renderPanel({ hasJD: false })
    expect(screen.queryByRole('button', { name: /run analysis/i })).not.toBeInTheDocument()
  })
})

describe('AnalysisPanel — no results yet', () => {
  it('shows Run Analysis button when ready', async () => {
    analysisService.fetchResults.mockRejectedValue({ response: { status: 404 } })
    renderPanel()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /run analysis/i })).toBeInTheDocument()
    })
  })
})

describe('AnalysisPanel — with results', () => {
  beforeEach(() => {
    analysisService.fetchResults.mockResolvedValue(mockResults)
  })

  it('renders ATS score gauge', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByLabelText(/ats score: 75/i)).toBeInTheDocument()
    })
  })

  it('renders matched keywords as green chips', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText('python')).toBeInTheDocument()
      expect(screen.getByText('docker')).toBeInTheDocument()
    })
  })

  it('renders missing keywords', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('kubernetes')).toBeInTheDocument()
    })
  })

  it('shows per-category score bars', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByText(/skills match/i)).toBeInTheDocument()
      expect(screen.getByText(/experience match/i)).toBeInTheDocument()
      expect(screen.getByText(/keyword coverage/i)).toBeInTheDocument()
      expect(screen.getByText(/education match/i)).toBeInTheDocument()
    })
  })

  it('shows Re-run Analysis button when results exist', async () => {
    renderPanel()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /re-run analysis/i })).toBeInTheDocument()
    })
  })

  it('calls runMatch on button click', async () => {
    analysisService.runMatch.mockResolvedValue(mockResults)
    renderPanel()
    const btn = await screen.findByRole('button', { name: /re-run/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(analysisService.runMatch).toHaveBeenCalled()
    })
    const callArg = analysisService.runMatch.mock.calls[0][0]
    expect(callArg).toMatchObject({ application_id: 10, resume_id: 5 })
  })
})
