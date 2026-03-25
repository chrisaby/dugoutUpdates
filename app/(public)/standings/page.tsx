import { createClient } from '@/lib/supabase/server'
import { sortStandings } from '@/lib/standings'
import { StandingsTable } from '@/components/features/standings-table'
import type { StandingsRow, Match } from '@/lib/types'

export const revalidate = 60

export default async function StandingsPage() {
  const supabase = await createClient()

  const [{ data: standingsData, error: standingsError }, { data: groupMatches, error: matchesError }] = await Promise.all([
    supabase.from('standings_view').select('*'),
    supabase
      .from('matches')
      .select('*')
      .eq('phase', 'group')
      .eq('status', 'completed'),
  ])

  if (standingsError) console.error('[standings] standings_view query failed:', standingsError.message)
  if (matchesError) console.error('[standings] matches query failed:', matchesError.message)

  const rows = standingsData as StandingsRow[] ?? []
  const matches = groupMatches as Match[] ?? []
  const sorted = sortStandings(rows, matches)

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Group Stage
        </p>
        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: 'clamp(40px, 8vw, 72px)',
            color: 'var(--foreground)',
            letterSpacing: '0.03em',
          }}
        >
          Standings
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          Top 4 qualify for the knockout stage
        </p>
      </div>

      <StandingsTable rows={sorted} mini={false} />

      {/* Tiebreaker rules */}
      <div
        className="mt-6 p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-0.5 h-4 rounded-full"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          <p
            className="text-xs font-bold uppercase"
            style={{ color: 'var(--muted-light)', letterSpacing: '0.1em' }}
          >
            Tiebreakers
          </p>
        </div>
        <div
          className="space-y-1 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          {[
            '1. Points',
            '2. Goal difference',
            '3. Goals scored',
            '4. Head-to-head result (only when all above are equal)',
          ].map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
