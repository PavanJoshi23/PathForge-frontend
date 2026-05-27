import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppLayout from '../AppLayout'

function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('AppLayout', () => {
  it('renders all 5 nav links (at least one each)', () => {
    renderWithRouter(<AppLayout />)
    // Each nav item appears in both sidebar and mobile nav — use getAllByRole
    expect(screen.getAllByRole('link', { name: /applications/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /resumes/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /analysis/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /interview/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the Vocra brand name', () => {
    renderWithRouter(<AppLayout />)
    expect(screen.getByText(/vocra/i)).toBeInTheDocument()
  })

  it('highlights the active route', () => {
    renderWithRouter(<AppLayout />, { initialEntries: ['/applications'] })
    const links = screen.getAllByRole('link', { name: /applications/i })
    // At least one link should have aria-current="page"
    const active = links.find((l) => l.getAttribute('aria-current') === 'page')
    expect(active).toBeTruthy()
  })
})
