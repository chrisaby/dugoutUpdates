import { describe, it, expect } from 'vitest'
import { sortStandings } from './standings'
import type { StandingsRow, Match } from './types'

function makeRow(overrides: Partial<StandingsRow> & { id: string; name: string }): StandingsRow {
  return {
    colour: null,
    badge_url: null,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    ...overrides,
  }
}

function makeMatch(overrides: Partial<Match> & { id: string; team1_id: string; team2_id: string; score1: number; score2: number }): Match {
  return {
    date: null,
    venue: null,
    phase: 'group',
    status: 'completed',
    ...overrides,
  }
}

describe('sortStandings', () => {
  it('sorts by points descending', () => {
    const rows = [
      makeRow({ id: 'b', name: 'B', points: 3 }),
      makeRow({ id: 'a', name: 'A', points: 6 }),
    ]
    const result = sortStandings(rows, [])
    expect(result[0].id).toBe('a')
    expect(result[1].id).toBe('b')
  })

  it('sorts by goal difference when points are tied', () => {
    const rows = [
      makeRow({ id: 'a', name: 'A', points: 4, gd: 1 }),
      makeRow({ id: 'b', name: 'B', points: 4, gd: 3 }),
    ]
    const result = sortStandings(rows, [])
    expect(result[0].id).toBe('b')
  })

  it('sorts by goals scored when points and GD are tied', () => {
    const rows = [
      makeRow({ id: 'a', name: 'A', points: 4, gd: 2, gf: 3 }),
      makeRow({ id: 'b', name: 'B', points: 4, gd: 2, gf: 5 }),
    ]
    const result = sortStandings(rows, [])
    expect(result[0].id).toBe('b')
  })

  it('applies H2H only when points, GD, and GF are all tied', () => {
    const rows = [
      makeRow({ id: 'a', name: 'A', points: 4, gd: 2, gf: 4 }),
      makeRow({ id: 'b', name: 'B', points: 4, gd: 2, gf: 4 }),
    ]
    const matches = [
      makeMatch({ id: 'm1', team1_id: 'b', team2_id: 'a', score1: 2, score2: 1 }),
    ]
    const result = sortStandings(rows, matches)
    expect(result[0].id).toBe('b') // b beat a in H2H
  })

  it('does NOT apply H2H if GD differs', () => {
    const rows = [
      makeRow({ id: 'a', name: 'A', points: 4, gd: 3, gf: 4 }),
      makeRow({ id: 'b', name: 'B', points: 4, gd: 2, gf: 4 }),
    ]
    // b beat a in H2H but GD should decide
    const matches = [
      makeMatch({ id: 'm1', team1_id: 'b', team2_id: 'a', score1: 2, score2: 1 }),
    ]
    const result = sortStandings(rows, matches)
    expect(result[0].id).toBe('a') // GD wins, H2H ignored
  })

  it('does not mutate the original array', () => {
    const rows = [
      makeRow({ id: 'b', name: 'B', points: 3 }),
      makeRow({ id: 'a', name: 'A', points: 6 }),
    ]
    sortStandings(rows, [])
    expect(rows[0].id).toBe('b') // original unchanged
  })

  it('handles H2H when team is team2 in the match record', () => {
    const rows = [
      makeRow({ id: 'a', name: 'A', points: 4, gd: 2, gf: 4 }),
      makeRow({ id: 'b', name: 'B', points: 4, gd: 2, gf: 4 }),
    ]
    // match stored as a vs b (team1=a, team2=b), a won
    const matches = [
      makeMatch({ id: 'm1', team1_id: 'a', team2_id: 'b', score1: 3, score2: 1 }),
    ]
    const result = sortStandings(rows, matches)
    expect(result[0].id).toBe('a')
  })
})
