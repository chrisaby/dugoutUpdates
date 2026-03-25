import { createClient } from '@/lib/supabase/server'
import { sortStandings } from '@/lib/standings'
import { StandingsTable } from '@/components/features/standings-table'
import { FixtureCard } from '@/components/features/fixture-card'
import { CountdownTimer } from '@/components/features/countdown-timer'
import { LiveScoreWidget } from '@/components/features/live-score-widget'
import Link from 'next/link'
import type { StandingsRow, Match, MatchWithTeams, TopScorer } from '@/lib/types'

export const revalidate = 30

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: standingsData },
    { data: groupMatchData },
    { data: nextMatchData },
    { data: lastResultData },
    { data: topScorerData },
    { data: liveMatchData },
  ] = await Promise.all([
    supabase.from('standings_view').select('*'),
    supabase.from('matches').select('*').eq('phase', 'group').eq('status', 'completed'),
    supabase
      .from('matches')
      .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
      .eq('status', 'upcoming')
      .order('date', { ascending: true })
      .limit(1),
    supabase
      .from('matches')
      .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(1),
    supabase.from('top_scorers_view').select('*').limit(1),
    supabase
      .from('matches')
      .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
      .eq('status', 'live'),
  ])

  const rows = sortStandings(standingsData as StandingsRow[] ?? [], groupMatchData as Match[] ?? [])
  const top4 = rows.slice(0, 4)
  const nextMatch = (nextMatchData as MatchWithTeams[] ?? [])[0] ?? null
  const lastResult = (lastResultData as MatchWithTeams[] ?? [])[0] ?? null
  const topScorer = (topScorerData as TopScorer[] ?? [])[0] ?? null
  const liveMatches = liveMatchData as MatchWithTeams[] ?? []

  return (
    <div className="space-y-8">
      {/* Live scores widget */}
      {liveMatches.length > 0 && <LiveScoreWidget initialMatches={liveMatches} />}

      {/* Hero */}
      <div>
        <h1 className="text-4xl font-black text-white">Federal Premier League</h1>
        <p className="text-[var(--muted)] mt-1">6-team internal organisation football tournament</p>
      </div>

      {/* Next match + countdown */}
      {nextMatch && (
        <section className="rounded-xl border border-[var(--border)] p-5" style={{ backgroundColor: 'var(--surface)' }}>
          <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Next Match</h2>
          <FixtureCard match={nextMatch} />
          {nextMatch.date && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted)] mb-2">Kicks off in</p>
              <CountdownTimer targetDate={nextMatch.date} />
            </div>
          )}
        </section>
      )}

      {/* Latest result */}
      {lastResult && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide">Latest Result</h2>
            <Link href="/results" className="text-xs text-[var(--primary)] hover:underline">All results →</Link>
          </div>
          <FixtureCard match={lastResult} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mini standings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide">Standings (Top 4)</h2>
            <Link href="/standings" className="text-xs text-[var(--primary)] hover:underline">Full table →</Link>
          </div>
          <StandingsTable rows={top4} mini />
        </section>

        {/* Top scorer widget */}
        {topScorer && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide">Golden Boot</h2>
              <Link href="/stats" className="text-xs text-[var(--primary)] hover:underline">All stats →</Link>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-5 flex items-center gap-4"
              style={{ backgroundColor: 'var(--surface)' }}>
              <span className="text-4xl">⚽</span>
              <div>
                <p className="text-xl font-black text-white">{topScorer.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {topScorer.team_colour && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: topScorer.team_colour }} />
                  )}
                  <p className="text-[var(--muted)] text-sm">{topScorer.team_name}</p>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-4xl font-black text-[var(--gold)]">{topScorer.goals}</p>
                <p className="text-xs text-[var(--muted)]">goals</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
