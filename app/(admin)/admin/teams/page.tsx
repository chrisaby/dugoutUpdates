import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Team } from '@/lib/types'

export default async function AdminTeamsPage() {
  const supabase = await createClient()

  const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*').order('name')
  const { data: playersData, error: playersError } = await supabase.from('players').select('id, team_id')

  if (teamsError || playersError) throw new Error('Failed to load teams data')

  const teams = (teamsData ?? []) as Team[]
  const playersByTeam: Record<string, number> = {}
  for (const p of (playersData ?? [])) {
    playersByTeam[p.team_id] = (playersByTeam[p.team_id] ?? 0) + 1
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Teams</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Manage player rosters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Link key={team.id} href={`/admin/teams/${team.id}`}
            className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--surface-hover)] transition-colors block"
            style={{ backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-3">
              {team.colour && (
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: team.colour }} />
              )}
              <span className="font-bold text-white">{team.name}</span>
              <span className="ml-auto text-sm text-[var(--muted)]">
                {playersByTeam[team.id] ?? 0} players
              </span>
              <span className="text-xs text-[var(--primary)]">Edit →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
