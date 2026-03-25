import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { addPlayer, deletePlayer } from '@/lib/actions/admin-actions'
import type { Team, Player, Position } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

const POSITIONS: Position[] = ['GK', 'DEF', 'MID', 'FWD']
const POSITION_ORDER: Record<Position, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 }
const POSITION_COLOURS: Record<Position, string> = {
  GK: '#f59e0b',
  DEF: '#3b82f6',
  MID: '#22c55e',
  FWD: '#ef4444',
}

export default async function AdminTeamDetailPage({ params }: Props) {
  const { id: teamId } = await params
  const supabase = await createClient()

  const [{ data: teamData, error: teamError }, { data: playersData, error: playersError }] = await Promise.all([
    supabase.from('teams').select('*').eq('id', teamId).single(),
    supabase.from('players').select('*').eq('team_id', teamId),
  ])

  if (teamError || !teamData) notFound()
  if (playersError) throw new Error(playersError.message)

  const team = teamData as Team
  const players = ((playersData ?? []) as Player[]).sort(
    (a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position]
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          {team.colour && <span className="w-4 h-4 rounded-full" style={{ backgroundColor: team.colour }} />}
          <h1 className="text-3xl font-black text-white">{team.name}</h1>
        </div>
        <p className="text-[var(--muted)] text-sm">{players.length} players</p>
      </div>

      {/* Player list */}
      <div className="rounded-lg border border-[var(--border)] overflow-hidden"
        style={{ backgroundColor: 'var(--surface)' }}>
        {players.length === 0 ? (
          <p className="px-4 py-6 text-[var(--muted)] text-sm text-center">No players yet</p>
        ) : (
          players.map((player) => (
            <div key={player.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                style={{ backgroundColor: POSITION_COLOURS[player.position] }}
              >
                {player.position}
              </span>
              <span className="text-white text-sm flex-1">{player.name}</span>
              <form action={deletePlayer}>
                <input type="hidden" name="playerId" value={player.id} />
                <input type="hidden" name="teamId" value={teamId} />
                <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Remove
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Add player form */}
      <div className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Add player</h2>
        <form action={addPlayer} className="flex flex-wrap gap-3 items-end">
          <input type="hidden" name="teamId" value={teamId} />
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Player name"
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)] w-48"
              style={{ backgroundColor: 'var(--surface-hover)' }}
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Position</label>
            <select name="position" required
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}>
              {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
          <button type="submit"
            className="px-4 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}>
            Add player
          </button>
        </form>
      </div>
    </div>
  )
}
