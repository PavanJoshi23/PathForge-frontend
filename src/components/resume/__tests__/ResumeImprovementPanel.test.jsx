import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ResumeImprovementPanel from '../ResumeImprovementPanel'
import * as analysisService from '@/services/analysis'

vi.mock('@/services/analysis')

const mockSuggestion = {
  original: 'Built REST APIs using Python',
  suggestion: 'Designed and implemented high-performance REST APIs in Python serving 50K daily requests',
  changes: ['added quantification', 'added "Designed and implemented"'],
}

function renderPanel(props = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const defaults = { resumeId: 5, applicationId: 10 }
  return render(
    <QueryClientProvider client={qc}>
      <ResumeImprovementPanel {...defaults} {...props} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ResumeImprovementPanel — initial state', () => {
  it('renders bullet textarea', () => {
    renderPanel()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has Improve Wording button', () => {
    renderPanel()
    expect(screen.getByRole('button', { name: /improve wording/i })).toBeInTheDocument()
  })

  it('disables Improve Wording button when textarea is empty', () => {
    renderPanel()
    const btn = screen.getByRole('button', { name: /improve wording/i })
    expect(btn).toBeDisabled()
  })

  it('enables button when text is entered', () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs' } })
    expect(screen.getByRole('button', { name: /improve wording/i })).not.toBeDisabled()
  })
})

describe('ResumeImprovementPanel — suggestion result', () => {
  beforeEach(() => {
    analysisService.improveResume.mockResolvedValue(mockSuggestion)
  })

  it('shows suggestion after clicking Improve Wording', async () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs using Python' } })
    fireEvent.click(screen.getByRole('button', { name: /improve wording/i }))

    await waitFor(() => {
      expect(screen.getByText('Designed and implemented high-performance REST APIs in Python serving 50K daily requests')).toBeInTheDocument()
    })
  })

  it('shows original bullet in side-by-side view', async () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs using Python' } })
    fireEvent.click(screen.getByRole('button', { name: /improve wording/i }))

    await waitFor(() => {
      expect(screen.getByText('Built REST APIs using Python')).toBeInTheDocument()
    })
  })

  it('shows Apply and Skip buttons after suggestion', async () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs using Python' } })
    fireEvent.click(screen.getByRole('button', { name: /improve wording/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })
  })

  it('shows changes list', async () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs using Python' } })
    fireEvent.click(screen.getByRole('button', { name: /improve wording/i }))

    await waitFor(() => {
      expect(screen.getByText(/added quantification/i)).toBeInTheDocument()
    })
  })
})

describe('ResumeImprovementPanel — Apply and Skip', () => {
  beforeEach(() => {
    analysisService.improveResume.mockResolvedValue(mockSuggestion)
  })

  it('dismisses suggestion on Skip click', async () => {
    renderPanel()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Built REST APIs using Python' } })
    fireEvent.click(screen.getByRole('button', { name: /improve wording/i }))

    const skipBtn = await screen.findByRole('button', { name: /skip/i })
    fireEvent.click(skipBtn)

    await waitFor(() => {
      expect(screen.queryByText(/designed and implemented/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
    })
  })
})
