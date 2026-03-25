import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AdminNavbar } from './admin-navbar'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/admin'),
}))

describe('AdminNavbar', () => {
  it('renders the FPL Admin brand', () => {
    render(<AdminNavbar />)
    expect(screen.getByText('FPL Admin')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<AdminNavbar />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matches' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fixtures' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Teams' })).toBeInTheDocument()
  })

  it('renders public site link', () => {
    render(<AdminNavbar />)
    expect(screen.getByRole('link', { name: /public site/i })).toBeInTheDocument()
  })

  it('applies active styling to the current route link', () => {
    const { container } = render(<AdminNavbar />)
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboardLink.className).toContain('text-white')
    // Inactive links have text-[var(--muted)] styling
    const matchesLink = screen.getByRole('link', { name: 'Matches' })
    expect(matchesLink.className).toContain('text-[var(--muted)]')
  })
})
