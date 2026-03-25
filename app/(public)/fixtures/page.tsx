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

  const [{ data: teamsData, error: teamsError }, { data: matchesData, error: matchesError }] = await Promise.all([
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

  if (teamsError) console.error('[fixtures] teams query failed:', teamsError.message)
  if (matchesError) console.error('[fixtures] matches query failed:', matchesError.message)

  const teams = teamsData as Team[] ?? []
  let matches = matchesData as MatchWithTeams[] ?? []

  if (phase) matches = matches.filter((m) => m.phase === phase)
  if (team) matches = matches.filter((m) => m.team1_id === team || m.team2_id === team)

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Schedule
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
            Fixtures
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
            {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      <Suspense>
        <FixtureFilters teams={teams} />
      </Suspense>

      {matches.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: 'var(--muted)' }}
        >
          <p
            className="text-sm"
            style={{ letterSpacing: '0.05em' }}
          >
            No matches found.
          </p>
        </div>
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
