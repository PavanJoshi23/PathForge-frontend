import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppLayout from '../AppLayout'

function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('AppLayout', () => {
  it('renders all 5 nav links', () => {
    renderWithRouter(<AppLayout />)
    expect(screen.getByRole('link', { name: /applications/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resumes/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analysis/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /interview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the PathForge brand name', () => {
    renderWithRouter(<AppLayout />)
    expect(screen.getByText(/pathforge/i)).toBeInTheDocument()
  })

  it('highlights the active route', () => {
    renderWithRouter(<AppLayout />, { initialEntries: ['/applications'] })
    const link = screen.getByRole('link', { name: /applications/i })
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})
