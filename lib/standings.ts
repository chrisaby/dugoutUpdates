import type { StandingsRow, Match } from './types'

/**
 * Sorts standings rows by: Points → GD → GF → H2H (only when all three are tied).
 * Does not mutate the input array.
 */
export function sortStandings(rows: StandingsRow[], completedGroupMatches: Match[]): StandingsRow[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return getH2HPoints(b.id, a.id, completedGroupMatches) - getH2HPoints(a.id, b.id, completedGroupMatches)
  })
}

/**
 * Returns the points team earned against opponent in their direct meeting.
 * 3 = win, 1 = draw, 0 = loss or no match found.
 */
function getH2HPoints(teamId: string, opponentId: string, matches: Match[]): number {
  const match = matches.find(
    m =>
      (m.team1_id === teamId && m.team2_id === opponentId) ||
      (m.team1_id === opponentId && m.team2_id === teamId)
  )
  if (!match || match.score1 === null || match.score2 === null) return 0

  const teamScore = match.team1_id === teamId ? match.score1 : match.score2
  const opponentScore = match.team1_id === teamId ? match.score2 : match.score1

  if (teamScore > opponentScore) return 3
  if (teamScore === opponentScore) return 1
  return 0
}
