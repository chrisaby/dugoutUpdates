import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlayoffsView } from './playoffs-view'
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

describe('PlayoffsView', () => {
  it('shows TBD when group stage not locked', () => {
    render(<PlayoffsView locked={false} semi1={null} semi2={null} final={null} />)
    const tbds = screen.getAllByText('TBD')
    expect(tbds.length).toBe(6)
  })

  it('shows TBD for a null semi when locked is true', () => {
    render(<PlayoffsView locked={true} semi1={null} semi2={null} final={null} />)
    const tbds = screen.getAllByText('TBD')
    expect(tbds.length).toBe(6)
  })

  it('shows semi-final labels', () => {
    render(<PlayoffsView locked={false} semi1={null} semi2={null} final={null} />)
    expect(screen.getByText('Semi-final 1')).toBeInTheDocument()
    expect(screen.getByText('Semi-final 2')).toBeInTheDocument()
  })

  it('shows Final label', () => {
    render(<PlayoffsView locked={false} semi1={null} semi2={null} final={null} />)
    expect(screen.getByText('Final')).toBeInTheDocument()
  })

  it('shows team names when playoffs is populated', () => {
    render(
      <PlayoffsView
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
    render(<PlayoffsView locked={true} semi1={completed} semi2={null} final={null} />)
    expect(screen.getByText('2 – 0')).toBeInTheDocument()
  })
})
