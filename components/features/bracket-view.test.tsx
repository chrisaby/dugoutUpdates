import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BracketView } from './bracket-view'
import type { MatchWithTeams } from '@/lib/types'

const tbd: MatchWithTeams = {
  id: 's1', team1_id: '', team2_id: '', date: null, venue: null,
  phase: 'semi', status: 'upcoming', score1: null, score2: null,
  team1: { id: '', name: 'TBD', colour: null, badge_url: null, created_at: '' },
  team2: { id: '', name: 'TBD', colour: null, badge_url: null, created_at: '' },
}

const withTeams = (id: string, t1: string, t2: string): MatchWithTeams => ({
  ...tbd,
  id,
  phase: id === 'f1' ? 'final' : 'semi',
  team1: { ...tbd.team1, id: `t${id}1`, name: t1 },
  team2: { ...tbd.team2, id: `t${id}2`, name: t2 },
})

describe('BracketView', () => {
  it('shows TBD when group stage not locked', () => {
    render(<BracketView locked={false} semi1={null} semi2={null} final={null} />)
    const tbds = screen.getAllByText('TBD')
    expect(tbds.length).toBeGreaterThan(0)
  })

  it('shows semi-final labels', () => {
    render(<BracketView locked={false} semi1={null} semi2={null} final={null} />)
    expect(screen.getByText('Semi-final 1')).toBeInTheDocument()
    expect(screen.getByText('Semi-final 2')).toBeInTheDocument()
  })

  it('shows Final label', () => {
    render(<BracketView locked={false} semi1={null} semi2={null} final={null} />)
    expect(screen.getByText('Final')).toBeInTheDocument()
  })

  it('shows team names when bracket is populated', () => {
    render(
      <BracketView
        locked={true}
        semi1={withTeams('s1', 'Thunder FC', 'Phoenix United')}
        semi2={withTeams('s2', 'Storm City', 'Blaze SC')}
        final={null}
      />
    )
    expect(screen.getByText('Thunder FC')).toBeInTheDocument()
    expect(screen.getByText('Phoenix United')).toBeInTheDocument()
  })

  it('shows score for completed matches', () => {
    const completed = { ...withTeams('s1', 'Thunder FC', 'Phoenix United'), status: 'completed' as const, score1: 2, score2: 0 }
    render(<BracketView locked={true} semi1={completed} semi2={null} final={null} />)
    expect(screen.getByText('2 – 0')).toBeInTheDocument()
  })
})
