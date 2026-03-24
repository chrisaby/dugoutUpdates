import { createClient } from '@/lib/supabase/server'
import { SquadGrid } from '@/components/features/squad-grid'
import { FixtureCard } from '@/components/features/fixture-card'
import { notFound } from 'next/navigation'
import type { Team, Player, MatchWithTeams } from '@/lib/types'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: teamData }, { data: playersData }, { data: matchesData }] = await Promise.all([
    supabase.from('teams').select('*').eq('id', id).single(),
    supabase.from('players').select('*').eq('team_id', id),
    supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(id, name, colour, badge_url, created_at),
        team2:teams!matches_team2_id_fkey(id, name, colour, badge_url, created_at)
      `)
      .or(`team1_id.eq.${id},team2_id.eq.${id}`)
      .order('date', { ascending: true }),
  ])

  if (!teamData) notFound()

  const team = teamData as Team
  const players = playersData as Player[] ?? []
  const matches = matchesData as MatchWithTeams[] ?? []

  const completedMatches = matches.filter((m) => m.status === 'completed')
  const upcomingMatches = matches.filter((m) => m.status !== 'completed')

  return (
    <div>
      {/* Team header */}
      <div
        className="rounded-xl p-6 mb-8 border border-[var(--border)]"
        style={{
          background: team.colour
            ? `linear-gradient(135deg, ${team.colour}22 0%, var(--surface) 60%)`
            : 'var(--surface)',
          borderColor: team.colour ?? 'var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          {team.colour && (
            <span
              className="w-14 h-14 rounded-full flex-shrink-0 border-4 border-white/20"
              style={{ backgroundColor: team.colour }}
            />
          )}
          <div>
            <h1 className="text-3xl font-black text-white">{team.name}</h1>
            <p className="text-[var(--muted)] text-sm mt-1">{players.length} players</p>
          </div>
        </div>
      </div>

      {/* Squad */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Squad</h2>
        <SquadGrid players={players} />
      </section>

      {/* Match history */}
      {completedMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Results</h2>
          <div className="grid gap-3">
            {completedMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming fixtures */}
      {upcomingMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Fixtures</h2>
          <div className="grid gap-3">
            {upcomingMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
