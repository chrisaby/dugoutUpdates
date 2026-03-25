import { createClient } from '@/lib/supabase/server'
import { ResultCard } from '@/components/features/result-card'
import type { MatchWithTeams, GoalWithPlayer, CardWithPlayer, Player, Team } from '@/lib/types'

export const revalidate = 60

export default async function ResultsPage() {
  const supabase = await createClient()

  const [
    { data: matchesData, error: matchesError },
    { data: goalsData, error: goalsError },
    { data: cardsData, error: cardsError },
    { data: motmData, error: motmError },
  ] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(id, name, colour, badge_url, created_at),
        team2:teams!matches_team2_id_fkey(id, name, colour, badge_url, created_at)
      `)
      .eq('status', 'completed')
      .order('date', { ascending: false }),
    supabase
      .from('goals')
      .select(`
        *,
        player:players(*, team:teams(*))
      `),
    supabase
      .from('cards')
      .select(`
        *,
        player:players(*, team:teams(*))
      `),
    supabase
      .from('match_motm')
      .select(`
        match_id,
        motm_player:players!match_motm_motm_player_id_fkey(*, team:teams(*))
      `),
  ])

  if (matchesError) console.error('[results] matches query failed:', matchesError.message)
  if (goalsError) console.error('[results] goals query failed:', goalsError.message)
  if (cardsError) console.error('[results] cards query failed:', cardsError.message)
  if (motmError) console.error('[results] match_motm query failed:', motmError.message)

  const matches = matchesData as MatchWithTeams[] ?? []
  const goals = goalsData as GoalWithPlayer[] ?? []
  const cards = cardsData as CardWithPlayer[] ?? []

  const motmByMatch: Record<string, Player & { team: Team }> = {}
  if (motmData) {
    for (const row of motmData) {
      if (row.motm_player) {
        motmByMatch[row.match_id] = row.motm_player as unknown as Player & { team: Team }
      }
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Match Reports
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1
            className="leading-none"
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: 'clamp(40px, 8vw, 72px)',
              color: 'var(--foreground)',
              letterSpacing: '0.03em',
            }}
          >
            Results
          </h1>
          <span
            className="font-bold mb-1"
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: '24px',
              color: 'var(--muted)',
              letterSpacing: '0.05em',
            }}
          >
            {matches.length} played
          </span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: 'var(--muted)' }}
        >
          <p
            className="text-sm"
            style={{ letterSpacing: '0.05em' }}
          >
            No results yet — check back after the first match.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <ResultCard
              key={match.id}
              match={match}
              goals={goals.filter((g) => g.match_id === match.id)}
              cards={cards.filter((c) => c.match_id === match.id)}
              motmPlayer={motmByMatch[match.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
