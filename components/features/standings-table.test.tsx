import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StandingsTable } from './standings-table'
import type { StandingsRow } from '@/lib/types'

function makeRow(id: string, name: string, points: number, overrides: Partial<StandingsRow> = {}): StandingsRow {
  return {
    id,
    name,
    points,
    colour: null,
    badge_url: null,
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    gf: 2,
    ga: 4,
    gd: -2,
    ...overrides,
  }
}

describe('StandingsTable', () => {
  it('renders all team names', () => {
    const rows = [makeRow('1', 'Thunder FC', 6), makeRow('2', 'Phoenix United', 3)]
    render(<StandingsTable rows={rows} />)
    expect(screen.getByText('Thunder FC')).toBeInTheDocument()
    expect(screen.getByText('Phoenix United')).toBeInTheDocument()
  })

  it('marks exactly top 4 rows as qualified', () => {
    const rows = [0, 1, 2, 3, 4, 5].map((i) =>
      makeRow(String(i), `Team ${i}`, 10 - i)
    )
    const { container } = render(<StandingsTable rows={rows} />)
    const qualifiedRows = container.querySelectorAll('[data-qualified="true"]')
    expect(qualifiedRows).toHaveLength(4)
  })

  it('shows points for each team', () => {
    const rows = [makeRow('1', 'Alpha', 9), makeRow('2', 'Beta', 4)]
    render(<StandingsTable rows={rows} />)
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows position numbers starting from 1', () => {
    const rows = [makeRow('1', 'First', 6), makeRow('2', 'Second', 3)]
    render(<StandingsTable rows={rows} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows GD with + prefix for positive values in full mode', () => {
    const rows = [makeRow('1', 'Alpha', 6, { gd: 3 })]
    render(<StandingsTable rows={rows} />)
    expect(screen.getByText('+3')).toBeInTheDocument()
  })
})
