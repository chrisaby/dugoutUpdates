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
      .order('id', { ascending: false })
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
    <div className="space-y-10">
      {/* Live widget */}
      {liveMatches.length > 0 && <LiveScoreWidget initialMatches={liveMatches} />}

      {/* Hero */}
      <div className="border-b pb-8" style={{ borderColor: 'var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Season 2026
        </p>
        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: 'clamp(48px, 10vw, 96px)',
            color: 'var(--foreground)',
            letterSpacing: '0.02em',
          }}
        >
          Federal Premier
          <br />
          <span style={{ color: 'var(--primary)' }}>League</span>
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          6-team internal organisation football tournament
        </p>
      </div>

      {/* Next match + Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {nextMatch && (
          <section>
            <SectionHeading label="Next Match" href="/fixtures" linkLabel="All fixtures" />
            <FixtureCard match={nextMatch} />
            {nextMatch.date && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-bold uppercase mb-3"
                  style={{ color: 'var(--muted)', letterSpacing: '0.12em' }}
                >
                  Kicks off in
                </p>
                <CountdownTimer targetDate={nextMatch.date} />
              </div>
            )}
          </section>
        )}

        {/* Mini standings */}
        <section>
          <SectionHeading label="Standings" href="/standings" linkLabel="Full table" />
          <StandingsTable rows={top4} mini />
        </section>
      </div>

      {/* Latest result + Golden boot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {lastResult && (
          <section>
            <SectionHeading label="Latest Result" href="/results" linkLabel="All results" />
            <FixtureCard match={lastResult} />
          </section>
        )}

        {/* Golden boot */}
        {topScorer && (
          <section>
            <SectionHeading label="Golden Boot" href="/stats" linkLabel="All stats" />
            <div
              className="rounded-lg p-5 flex items-center gap-5"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                background: `linear-gradient(135deg, var(--primary-glow) 0%, var(--surface) 60%)`,
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--primary-glow)',
                  border: '1px solid rgba(190,240,67,0.3)',
                  fontSize: '28px',
                }}
              >
                ⚽
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold leading-tight truncate"
                  style={{
                    fontFamily: 'var(--font-display, Bebas Neue)',
                    fontSize: '24px',
                    letterSpacing: '0.04em',
                    color: 'var(--foreground)',
                  }}
                >
                  {topScorer.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {topScorer.team_colour && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topScorer.team_colour }}
                    />
                  )}
                  <p
                    className="text-xs font-semibold uppercase"
                    style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}
                  >
                    {topScorer.team_name}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="tabular-nums leading-none"
                  style={{
                    fontFamily: 'var(--font-display, Bebas Neue)',
                    fontSize: '52px',
                    color: 'var(--primary)',
                    lineHeight: 1,
                  }}
                >
                  {topScorer.goals}
                </p>
                <p
                  className="text-xs uppercase mt-1"
                  style={{ color: 'var(--muted)', letterSpacing: '0.1em' }}
                >
                  goals
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function SectionHeading({
  label,
  href,
  linkLabel,
}: {
  label: string
  href: string
  linkLabel: string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span
          className="w-0.5 h-5 rounded-full"
          style={{ backgroundColor: 'var(--primary)' }}
        />
        <h2
          className="font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: '18px',
            letterSpacing: '0.1em',
            color: 'var(--muted-light)',
            lineHeight: 1,
          }}
        >
          {label}
        </h2>
      </div>
      <Link
        href={href}
        className="text-xs font-semibold uppercase transition-colors"
        style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}
      >
        {linkLabel} →
      </Link>
    </div>
  )
}
