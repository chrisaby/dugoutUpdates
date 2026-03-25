import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import type { MatchWithTeams } from '@/lib/types'

export default async function AdminMatchesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('matches')
    .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
    .order('date', { ascending: true, nullsFirst: false })

  const matches = (data as MatchWithTeams[] ?? [])
  const groups = {
    live: matches.filter((m) => m.status === 'live'),
    upcoming: matches.filter((m) => m.status === 'upcoming'),
    completed: matches.filter((m) => m.status === 'completed'),
  }

  function MatchRow({ match }: { match: MatchWithTeams }) {
    return (
      <Link href={`/admin/matches/${match.id}`}
        className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {match.team1.name} vs {match.team2.name}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {match.date ? format(new Date(match.date), 'dd MMM yyyy, HH:mm') : 'No date set'}
            {match.venue ? ` · ${match.venue}` : ''}
          </p>
        </div>
        {match.status === 'completed' && match.score1 !== null && (
          <span className="text-sm font-black text-white tabular-nums">
            {match.score1} – {match.score2}
          </span>
        )}
        <span className="text-xs text-[var(--primary)]">Edit →</span>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Matches</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Click a match to enter or edit results</p>
      </div>

      {groups.live.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">Live</h2>
          <div className="rounded-lg border border-[var(--border)] overflow-hidden"
            style={{ backgroundColor: 'var(--surface)' }}>
            {groups.live.map((m) => <MatchRow key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {groups.upcoming.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-2">Upcoming</h2>
          <div className="rounded-lg border border-[var(--border)] overflow-hidden"
            style={{ backgroundColor: 'var(--surface)' }}>
            {groups.upcoming.map((m) => <MatchRow key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {groups.completed.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-2">Completed</h2>
          <div className="rounded-lg border border-[var(--border)] overflow-hidden"
            style={{ backgroundColor: 'var(--surface)' }}>
            {groups.completed.map((m) => <MatchRow key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
