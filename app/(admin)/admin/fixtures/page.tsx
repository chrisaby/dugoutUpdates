import { createClient } from '@/lib/supabase/server'
import { updateFixture } from '@/lib/actions/admin-actions'
import { format } from 'date-fns'
import type { MatchWithTeams } from '@/lib/types'

export default async function AdminFixturesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('matches')
    .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
    .order('date', { ascending: true, nullsFirst: false })
  if (error) throw new Error(error.message)

  const matches = (data as MatchWithTeams[] ?? [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Fixtures</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Set date, time, and venue for each match</p>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="rounded-lg border border-[var(--border)] p-4"
            style={{ backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-white">
                {match.team1.name} vs {match.team2.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: match.status === 'completed' ? '#374151' : match.status === 'live' ? '#991b1b' : '#1e3a5f',
                  color: match.status === 'completed' ? '#9ca3af' : match.status === 'live' ? '#fca5a5' : '#93c5fd',
                }}>
                {match.status}
              </span>
              <span className="text-xs text-[var(--muted)] ml-auto capitalize">{match.phase}</span>
            </div>
            <form action={updateFixture} className="flex flex-wrap gap-3 items-end">
              <input type="hidden" name="matchId" value={match.id} />
              <div>
                <label className="block text-xs text-[var(--muted)] mb-1">Date & time</label>
                <input
                  type="datetime-local"
                  name="date"
                  defaultValue={match.date ? format(new Date(match.date), "yyyy-MM-dd'T'HH:mm") : ''}
                  className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted)] mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  defaultValue={match.venue ?? ''}
                  placeholder="e.g. Pitch A"
                  className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)] w-48"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Save
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
