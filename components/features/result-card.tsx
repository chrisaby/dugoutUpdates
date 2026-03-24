import type { MatchWithTeams, GoalWithPlayer, CardWithPlayer, Player, Team } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  match: MatchWithTeams
  goals: GoalWithPlayer[]
  cards: CardWithPlayer[]
  motmPlayer: (Player & { team: Team }) | null
}

export function ResultCard({ match, goals, cards, motmPlayer }: Props) {
  const team1Goals = goals.filter(
    (g) => g.player.team.id === match.team1_id && !g.is_own_goal
  )
  const team2Goals = goals.filter(
    (g) => g.player.team.id === match.team2_id && !g.is_own_goal
  )
  const ownGoalsForTeam1 = goals.filter(
    (g) => g.player.team.id === match.team2_id && g.is_own_goal
  )
  const ownGoalsForTeam2 = goals.filter(
    (g) => g.player.team.id === match.team1_id && g.is_own_goal
  )

  const allTeam1Goals = [...team1Goals, ...ownGoalsForTeam1].sort(
    (a, b) => (a.minute ?? 0) - (b.minute ?? 0)
  )
  const allTeam2Goals = [...team2Goals, ...ownGoalsForTeam2].sort(
    (a, b) => (a.minute ?? 0) - (b.minute ?? 0)
  )

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden"
      style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
        {match.date && (
          <p className="text-xs text-[var(--muted)] mb-3">
            {format(new Date(match.date), 'EEE, d MMM yyyy')} · {match.venue}
          </p>
        )}
        {/* Score row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            {match.team1.colour && (
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: match.team1.colour }} />
            )}
            <span className="font-bold text-white">{match.team1.name}</span>
          </div>
          <span className="text-3xl font-black text-white tabular-nums flex-shrink-0">
            {match.score1} – {match.score2}
          </span>
          <div className="flex items-center gap-2 flex-1 flex-row-reverse">
            {match.team2.colour && (
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: match.team2.colour }} />
            )}
            <span className="font-bold text-white text-right">{match.team2.name}</span>
          </div>
        </div>
      </div>

      {/* Scorers */}
      {(allTeam1Goals.length > 0 || allTeam2Goals.length > 0) && (
        <div className="px-4 py-3 border-b border-[var(--border)] grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            {allTeam1Goals.map((g) => (
              <div key={g.id} className="text-[var(--muted)]">
                ⚽ {g.player.name}
                {g.is_own_goal && ' (og)'}
                {g.minute && <span className="text-xs ml-1">{g.minute}&apos;</span>}
              </div>
            ))}
          </div>
          <div className="space-y-1 text-right">
            {allTeam2Goals.map((g) => (
              <div key={g.id} className="text-[var(--muted)]">
                {g.minute && <span className="text-xs mr-1">{g.minute}&apos;</span>}
                {g.player.name}
                {g.is_own_goal && ' (og)'} ⚽
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <div className="px-4 py-2 border-b border-[var(--border)] flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          {cards.map((c) => (
            <span key={c.id} className="flex items-center gap-1">
              <span
                className="w-3 h-4 rounded-sm inline-block"
                style={{ backgroundColor: c.type === 'yellow' ? '#eab308' : '#ef4444' }}
              />
              {c.player.name}
              {c.minute && ` ${c.minute}'`}
            </span>
          ))}
        </div>
      )}

      {/* MOTM */}
      {motmPlayer && (
        <div className="px-4 py-2 flex items-center gap-2 text-sm">
          <span className="text-[var(--gold)]">★</span>
          <span className="text-[var(--muted)]">Man of the Match:</span>
          <span className="font-semibold text-white">{motmPlayer.name}</span>
          <span className="text-[var(--muted)] text-xs">({motmPlayer.team.name})</span>
        </div>
      )}
    </div>
  )
}
