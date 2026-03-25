import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import {
  updateMatchResult,
  addGoal,
  deleteGoal,
  addCard,
  deleteCard,
  setMotm,
  clearMotm,
} from '@/lib/actions/admin-actions'
import type { MatchWithTeams, Player, MatchMotm, CardType } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminMatchDetailPage({ params }: Props) {
  const { id: matchId } = await params
  const supabase = await createClient()

  // Fetch match first (need team IDs for player queries)
  const { data: matchRaw, error: matchError } = await supabase
    .from('matches')
    .select('*, team1:teams!matches_team1_id_fkey(id,name,colour,badge_url,created_at), team2:teams!matches_team2_id_fkey(id,name,colour,badge_url,created_at)')
    .eq('id', matchId)
    .single()

  if (matchError || !matchRaw) notFound()

  const match = matchRaw as MatchWithTeams | null
  if (!match) notFound()

  const [
    { data: goalsData, error: goalsError },
    { data: cardsData, error: cardsError },
    { data: motmData },
    { data: team1PlayersData, error: t1Error },
    { data: team2PlayersData, error: t2Error },
  ] = await Promise.all([
    supabase.from('goals').select('*, player:players(id, name, team_id)').eq('match_id', matchId).order('minute'),
    supabase.from('cards').select('*, player:players(id, name, team_id)').eq('match_id', matchId).order('minute'),
    supabase.from('match_motm').select('*').eq('match_id', matchId).maybeSingle(),
    supabase.from('players').select('*').eq('team_id', match.team1_id).order('name'),
    supabase.from('players').select('*').eq('team_id', match.team2_id).order('name'),
  ])

  if (goalsError || cardsError || t1Error || t2Error) {
    throw new Error('Failed to load match data')
  }

  type GoalRow = { id: string; match_id: string; player_id: string; minute: number | null; is_own_goal: boolean; player: { id: string; name: string; team_id: string } }
  type CardRow = { id: string; match_id: string; player_id: string; type: CardType; minute: number | null; player: { id: string; name: string; team_id: string } }

  const goals = (goalsData ?? []) as GoalRow[]
  const cards = (cardsData ?? []) as CardRow[]
  const motm = motmData as MatchMotm | null
  const team1Players = (team1PlayersData ?? []) as Player[]
  const team2Players = (team2PlayersData ?? []) as Player[]
  const allPlayers = [...team1Players, ...team2Players]

  const getPlayerName = (id: string) => allPlayers.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[var(--muted)] text-sm mb-1">
          {match.date ? format(new Date(match.date), 'dd MMM yyyy, HH:mm') : 'No date set'}
          {match.venue ? ` · ${match.venue}` : ''}
        </p>
        <h1 className="text-3xl font-black text-white">
          {match.team1.name} vs {match.team2.name}
        </h1>
      </div>

      {/* Score + status */}
      <section className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Result</h2>
        <form action={updateMatchResult} className="flex flex-wrap gap-4 items-end">
          <input type="hidden" name="matchId" value={matchId} />
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">{match.team1.name}</label>
            <input
              type="number"
              name="score1"
              defaultValue={match.score1 ?? ''}
              min={0}
              className="w-16 px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-center text-lg font-black focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">{match.team2.name}</label>
            <input
              type="number"
              name="score2"
              defaultValue={match.score2 ?? ''}
              min={0}
              className="w-16 px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-center text-lg font-black focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Status</label>
            <select
              name="status"
              defaultValue={match.status}
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit"
            className="px-4 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}>
            Save result
          </button>
        </form>
      </section>

      {/* Goals */}
      <section className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Goals</h2>

        {/* Existing goals */}
        {goals.length > 0 && (
          <div className="mb-4 space-y-1">
            {goals.map((g) => (
              <div key={g.id} className="flex items-center gap-3 text-sm">
                <span className="text-[var(--muted)] w-8 text-right tabular-nums">{g.minute ?? '?'}&apos;</span>
                <span className="text-white flex-1">
                  {g.player.name}
                  {g.is_own_goal && <span className="text-red-400 ml-1">(OG)</span>}
                </span>
                <form action={deleteGoal}>
                  <input type="hidden" name="goalId" value={g.id} />
                  <input type="hidden" name="matchId" value={matchId} />
                  <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Add goal form */}
        <form action={addGoal} className="flex flex-wrap gap-3 items-end border-t border-[var(--border)] pt-4">
          <input type="hidden" name="matchId" value={matchId} />
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Player</label>
            <select name="playerId"
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}>
              <optgroup label={match.team1.name}>
                {team1Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
              <optgroup label={match.team2.name}>
                {team2Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Minute</label>
            <input type="number" name="minute" placeholder="e.g. 23" min={1} max={120}
              className="w-20 px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }} />
          </div>
          <div className="flex items-center gap-2 pb-1.5">
            <input type="checkbox" name="isOwnGoal" id="isOwnGoal" className="w-4 h-4" />
            <label htmlFor="isOwnGoal" className="text-sm text-[var(--muted)]">Own goal</label>
          </div>
          <button type="submit"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}>
            Add goal
          </button>
        </form>
      </section>

      {/* Cards */}
      <section className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Cards</h2>

        {cards.length > 0 && (
          <div className="mb-4 space-y-1">
            {cards.map((c) => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <span className="text-[var(--muted)] w-8 text-right tabular-nums">{c.minute ?? '?'}&apos;</span>
                <span className={`w-3 h-4 rounded-sm flex-shrink-0 ${c.type === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                <span className="text-white flex-1">{c.player.name}</span>
                <form action={deleteCard}>
                  <input type="hidden" name="cardId" value={c.id} />
                  <input type="hidden" name="matchId" value={matchId} />
                  <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={addCard} className="flex flex-wrap gap-3 items-end border-t border-[var(--border)] pt-4">
          <input type="hidden" name="matchId" value={matchId} />
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Player</label>
            <select name="playerId"
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}>
              <optgroup label={match.team1.name}>
                {team1Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
              <optgroup label={match.team2.name}>
                {team2Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Type</label>
            <select name="type"
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Minute</label>
            <input type="number" name="minute" placeholder="e.g. 45" min={1} max={120}
              className="w-20 px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }} />
          </div>
          <button type="submit"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}>
            Add card
          </button>
        </form>
      </section>

      {/* MOTM */}
      <section className="rounded-lg border border-[var(--border)] p-5"
        style={{ backgroundColor: 'var(--surface)' }}>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Man of the Match</h2>
        {motm && (
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="text-[var(--gold)]">★</span>
            <span className="text-white font-semibold">{getPlayerName(motm.motm_player_id)}</span>
            <form action={clearMotm}>
              <input type="hidden" name="matchId" value={matchId} />
              <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Clear
              </button>
            </form>
          </div>
        )}
        <form action={setMotm} className="flex gap-3 items-end">
          <input type="hidden" name="matchId" value={matchId} />
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Select player</label>
            <select name="playerId"
              className="px-2 py-1.5 rounded-md border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)]"
              style={{ backgroundColor: 'var(--surface-hover)' }}>
              <optgroup label={match.team1.name}>
                {team1Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
              <optgroup label={match.team2.name}>
                {team2Players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            </select>
          </div>
          <button type="submit"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white hover:opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}>
            Set MOTM
          </button>
        </form>
      </section>
    </div>
  )
}
