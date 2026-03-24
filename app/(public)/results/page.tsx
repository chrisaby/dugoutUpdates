import { createClient } from '@/lib/supabase/server'
import { ResultCard } from '@/components/features/result-card'
import type { MatchWithTeams, GoalWithPlayer, CardWithPlayer, Player, Team } from '@/lib/types'

export const revalidate = 60

export default async function ResultsPage() {
  const supabase = await createClient()

  const [
    { data: matchesData },
    { data: goalsData },
    { data: cardsData },
    { data: motmData },
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

  const matches = matchesData as MatchWithTeams[] ?? []
  const goals = goalsData as GoalWithPlayer[] ?? []
  const cards = cardsData as CardWithPlayer[] ?? []

  // Build MOTM lookup
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
      <h1 className="text-3xl font-black text-white mb-1">Results</h1>
      <p className="text-[var(--muted)] text-sm mb-8">{matches.length} completed match{matches.length !== 1 ? 'es' : ''}</p>

      {matches.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-12">No results yet — check back after the first match.</p>
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
