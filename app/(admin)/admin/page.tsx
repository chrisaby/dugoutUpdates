import { createClient } from '@/lib/supabase/server'
import { sortStandings } from '@/lib/standings'
import { StandingsTable } from '@/components/features/standings-table'
import { toggleGroupStageLock } from '@/lib/actions/admin-actions'
import Link from 'next/link'
import type { Match, StandingsRow, TournamentSettings } from '@/lib/types'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { data: settingsData },
    { data: standingsData },
    { data: groupMatchData },
    { data: matchCountData },
  ] = await Promise.all([
    supabase.from('tournament_settings').select('*').single(),
    supabase.from('standings_view').select('*'),
    supabase.from('matches').select('team1_id, team2_id, score1, score2, phase, status').eq('phase', 'group').eq('status', 'completed'),
    supabase.from('matches').select('id, status, phase').eq('phase', 'group'),
  ])

  const settings = settingsData as TournamentSettings | null
  const locked = settings?.group_stage_locked ?? false
  const rows = sortStandings((standingsData ?? []) as StandingsRow[], (groupMatchData ?? []) as Match[])
  const groupMatches = matchCountData ?? []
  const played = groupMatches.filter((m) => m.status === 'completed').length
  const upcoming = groupMatches.filter((m) => m.status === 'upcoming').length
  const live = groupMatches.filter((m) => m.status === 'live').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Tournament overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Played', value: played },
          { label: 'Upcoming', value: upcoming },
          { label: 'Live', value: live },
          { label: 'Total group', value: 15 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-[var(--border)] p-4"
            style={{ backgroundColor: 'var(--surface)' }}>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/matches', label: 'Enter results', desc: 'Score, goals, cards, MOTM' },
          { href: '/admin/fixtures', label: 'Set fixtures', desc: 'Date, time, venue' },
          { href: '/admin/teams', label: 'Manage rosters', desc: 'Add or remove players' },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--surface-hover)] transition-colors block"
            style={{ backgroundColor: 'var(--surface)' }}>
            <p className="font-bold text-white text-sm">{label}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Lock group stage */}
      <div className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="font-bold text-white mb-1">Group stage lock</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          {locked
            ? 'Group stage is locked. Knockout bracket is active.'
            : 'Lock when all 15 group matches are complete. This reveals the knockout bracket.'}
        </p>
        <form action={toggleGroupStageLock}>
          <input type="hidden" name="locked" value={locked ? 'false' : 'true'} />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: locked ? '#6b7280' : 'var(--primary)' }}
          >
            {locked ? 'Unlock group stage' : 'Lock group stage'}
          </button>
        </form>
      </div>

      {/* Current standings */}
      <div>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-3">Current standings</h2>
        <StandingsTable rows={rows} mini={false} />
      </div>
    </div>
  )
}
