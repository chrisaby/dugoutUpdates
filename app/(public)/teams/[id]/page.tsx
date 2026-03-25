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

  const [{ data: teamData, error: teamError }, { data: playersData, error: playersError }, { data: matchesData, error: matchesError }] = await Promise.all([
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

  if (teamError) console.error(`[teams/${id}] team query failed:`, teamError.message)
  if (playersError) console.error(`[teams/${id}] players query failed:`, playersError.message)
  if (matchesError) console.error(`[teams/${id}] matches query failed:`, matchesError.message)

  if (!teamData) notFound()

  const team = teamData as Team
  const players = playersData as Player[] ?? []
  const matches = matchesData as MatchWithTeams[] ?? []

  const completedMatches = matches.filter((m) => m.status === 'completed')
  const upcomingMatches = matches.filter((m) => m.status !== 'completed')

  const won = completedMatches.filter((m) => {
    const isTeam1 = m.team1_id === id
    const s1 = m.score1 ?? 0
    const s2 = m.score2 ?? 0
    return isTeam1 ? s1 > s2 : s2 > s1
  }).length
  const drawn = completedMatches.filter((m) => (m.score1 ?? 0) === (m.score2 ?? 0)).length
  const lost = completedMatches.length - won - drawn

  return (
    <div>
      {/* Team header */}
      <div
        className="rounded-xl overflow-hidden mb-10"
        style={{
          background: team.colour
            ? `linear-gradient(135deg, ${team.colour}20 0%, var(--surface) 70%)`
            : 'var(--surface)',
          border: `1px solid ${team.colour ?? 'var(--border)'}`,
        }}
      >
        {/* Top colour bar */}
        <div
          className="h-1.5"
          style={{ backgroundColor: team.colour ?? 'var(--border-hover)' }}
        />
        <div className="p-6 flex items-start gap-6">
          {/* Team badge */}
          <div
            className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: team.colour ? `${team.colour}22` : 'var(--surface-elevated)',
              border: `2px solid ${team.colour ?? 'var(--border-hover)'}`,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '28px',
                lineHeight: 1,
                color: team.colour ?? 'var(--muted-light)',
                letterSpacing: '0.04em',
              }}
            >
              {team.name.slice(0, 3).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h1
              className="leading-none mb-1"
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: 'clamp(32px, 6vw, 56px)',
                color: 'var(--foreground)',
                letterSpacing: '0.03em',
              }}
            >
              {team.name}
            </h1>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--muted)' }}
            >
              {players.length} players registered
            </p>

            {/* Record */}
            {completedMatches.length > 0 && (
              <div className="flex items-center gap-4">
                {[
                  { label: 'W', value: won, color: 'var(--primary)' },
                  { label: 'D', value: drawn, color: 'var(--muted-light)' },
                  { label: 'L', value: lost, color: '#f87171' },
                  { label: 'P', value: completedMatches.length, color: 'var(--muted)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <p
                      className="leading-none"
                      style={{
                        fontFamily: 'var(--font-display, Bebas Neue)',
                        fontSize: '28px',
                        color,
                      }}
                    >
                      {value}
                    </p>
                    <p
                      className="text-xs font-bold uppercase mt-0.5"
                      style={{ color: 'var(--muted)', letterSpacing: '0.1em' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Squad */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="w-0.5 h-5 rounded-full"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          <h2
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: '22px',
              letterSpacing: '0.08em',
              color: 'var(--muted-light)',
              lineHeight: 1,
            }}
          >
            Squad
          </h2>
        </div>
        <SquadGrid players={players} />
      </section>

      {/* Results */}
      {completedMatches.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-0.5 h-5 rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '22px',
                letterSpacing: '0.08em',
                color: 'var(--muted-light)',
                lineHeight: 1,
              }}
            >
              Results
            </h2>
          </div>
          <div className="grid gap-3">
            {completedMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-0.5 h-5 rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '22px',
                letterSpacing: '0.08em',
                color: 'var(--muted-light)',
                lineHeight: 1,
              }}
            >
              Upcoming Fixtures
            </h2>
          </div>
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
