import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatsLeaderboard } from './stats-leaderboard'

const makeRow = (id: string, name: string, value: number) => ({
  id,
  name,
  teamName: 'Thunder FC',
  teamColour: '#3b82f6',
  value,
  valueLabel: 'goals',
})

describe('StatsLeaderboard', () => {
  it('renders the title', () => {
    render(<StatsLeaderboard title="Golden Boot" icon="⚽" rows={[]} />)
    expect(screen.getByText('Golden Boot')).toBeInTheDocument()
  })

  it('renders player names', () => {
    render(<StatsLeaderboard title="X" icon="⚽" rows={[makeRow('1', 'Mason Reed', 3)]} />)
    expect(screen.getByText('Mason Reed')).toBeInTheDocument()
  })

  it('renders value for each row', () => {
    render(<StatsLeaderboard title="X" icon="⚽" rows={[makeRow('1', 'Mason Reed', 5)]} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows empty state when no rows', () => {
    render(<StatsLeaderboard title="X" icon="⚽" rows={[]} />)
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('highlights rank 1 differently from others', () => {
    const rows = [makeRow('1', 'Alpha', 5), makeRow('2', 'Beta', 3)]
    const { container } = render(<StatsLeaderboard title="X" icon="⚽" rows={rows} />)
    const rankCells = container.querySelectorAll('[data-rank]')
    expect(rankCells[0].getAttribute('data-rank')).toBe('1')
    expect(rankCells[1].getAttribute('data-rank')).toBe('2')
  })
})
