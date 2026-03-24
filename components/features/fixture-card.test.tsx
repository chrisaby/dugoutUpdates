import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FixtureCard } from './fixture-card'
import type { MatchWithTeams } from '@/lib/types'

function makeMatch(overrides: Partial<MatchWithTeams> = {}): MatchWithTeams {
  return {
    id: 'm1',
    team1_id: 't1',
    team2_id: 't2',
    date: '2026-04-05T15:00:00Z',
    venue: 'Main Arena',
    phase: 'group',
    status: 'upcoming',
    score1: null,
    score2: null,
    team1: { id: 't1', name: 'Thunder FC', colour: '#3b82f6', badge_url: null, created_at: '' },
    team2: { id: 't2', name: 'Phoenix United', colour: '#ef4444', badge_url: null, created_at: '' },
    ...overrides,
  }
}

describe('FixtureCard', () => {
  it('renders both team names', () => {
    render(<FixtureCard match={makeMatch()} />)
    expect(screen.getByText('Thunder FC')).toBeInTheDocument()
    expect(screen.getByText('Phoenix United')).toBeInTheDocument()
  })

  it('shows Upcoming badge for upcoming matches', () => {
    render(<FixtureCard match={makeMatch({ status: 'upcoming' })} />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })

  it('shows Live badge for live matches', () => {
    render(<FixtureCard match={makeMatch({ status: 'live' })} />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('shows Completed badge for completed matches', () => {
    render(<FixtureCard match={makeMatch({ status: 'completed', score1: 2, score2: 1 })} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('shows score for completed matches', () => {
    render(<FixtureCard match={makeMatch({ status: 'completed', score1: 2, score2: 1 })} />)
    expect(screen.getByText('2 – 1')).toBeInTheDocument()
  })

  it('shows vs for non-completed matches', () => {
    render(<FixtureCard match={makeMatch({ status: 'upcoming' })} />)
    expect(screen.getByText('vs')).toBeInTheDocument()
  })

  it('renders venue', () => {
    render(<FixtureCard match={makeMatch()} />)
    expect(screen.getByText('Main Arena')).toBeInTheDocument()
  })
})
