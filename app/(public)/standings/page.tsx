import { createClient } from '@/lib/supabase/server'
import { sortStandings } from '@/lib/standings'
import { StandingsTable } from '@/components/features/standings-table'
import type { StandingsRow, Match } from '@/lib/types'

export const revalidate = 60

export default async function StandingsPage() {
  const supabase = await createClient()

  const [{ data: standingsData }, { data: groupMatches }] = await Promise.all([
    supabase.from('standings_view').select('*'),
    supabase
      .from('matches')
      .select('*')
      .eq('phase', 'group')
      .eq('status', 'completed'),
  ])

  const rows = standingsData as StandingsRow[] ?? []
  const matches = groupMatches as Match[] ?? []
  const sorted = sortStandings(rows, matches)

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-1">Standings</h1>
      <p className="text-[var(--muted)] text-sm mb-8">Group Stage — Top 4 qualify for knockouts</p>

      <StandingsTable rows={sorted} mini={false} />

      <div className="mt-6 p-4 rounded-lg border border-[var(--border)] text-xs text-[var(--muted)] space-y-1"
        style={{ backgroundColor: 'var(--surface)' }}>
        <p className="font-semibold text-slate-400 mb-2">Tiebreaker rules</p>
        <p>1. Points</p>
        <p>2. Goal difference</p>
        <p>3. Goals scored</p>
        <p>4. Head-to-head result (only when all above are equal)</p>
      </div>
    </div>
  )
}
