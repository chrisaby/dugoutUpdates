import { createClient } from '@/lib/supabase/server'
import { FixtureCard } from '@/components/features/fixture-card'
import { FixtureFilters } from '@/components/features/fixture-filters'
import { Suspense } from 'react'
import type { MatchWithTeams, Team } from '@/lib/types'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ phase?: string; team?: string }>
}

export default async function FixturesPage({ searchParams }: Props) {
  const { phase, team } = await searchParams
  const supabase = await createClient()

  const [{ data: teamsData }, { data: matchesData }] = await Promise.all([
    supabase.from('teams').select('*').order('name'),
    supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(id, name, colour, badge_url, created_at),
        team2:teams!matches_team2_id_fkey(id, name, colour, badge_url, created_at)
      `)
      .order('date', { ascending: true }),
  ])

  const teams = teamsData as Team[] ?? []
  let matches = matchesData as MatchWithTeams[] ?? []

  // Apply filters
  if (phase) matches = matches.filter((m) => m.phase === phase)
  if (team) matches = matches.filter((m) => m.team1_id === team || m.team2_id === team)

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-1">Fixtures</h1>
      <p className="text-[var(--muted)] text-sm mb-6">{matches.length} match{matches.length !== 1 ? 'es' : ''}</p>

      <Suspense>
        <FixtureFilters teams={teams} />
      </Suspense>

      {matches.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-12">No matches found.</p>
      ) : (
        <div className="grid gap-3">
          {matches.map((match) => (
            <FixtureCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
