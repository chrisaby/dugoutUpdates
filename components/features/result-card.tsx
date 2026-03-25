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

  const score1 = match.score1 ?? 0
  const score2 = match.score2 ?? 0
  const team1Won = score1 > score2
  const team2Won = score2 > score1

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Score header */}
      <div
        className="relative px-5 pt-4 pb-5"
        style={{
          background: `linear-gradient(135deg,
            ${match.team1.colour ?? '#173017'}18 0%,
            var(--surface-elevated) 50%,
            ${match.team2.colour ?? '#173017'}18 100%)`,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Date + venue */}
        {match.date && (
          <p
            className="text-xs mb-4"
            style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}
          >
            {format(new Date(match.date), 'EEE, d MMM yyyy')}
            {match.venue && ` · ${match.venue}`}
          </p>
        )}

        {/* Score row */}
        <div className="flex items-center gap-3">
          {/* Team 1 */}
          <div className="flex items-center gap-2 flex-1">
            <span
              className="w-1.5 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: match.team1.colour ?? 'var(--border-hover)' }}
            />
            <span
              className="font-bold text-sm leading-tight"
              style={{ color: team1Won ? 'var(--foreground)' : 'var(--muted-light)' }}
            >
              {match.team1.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex-shrink-0 text-center">
            <span
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '42px',
                lineHeight: 1,
                color: 'var(--foreground)',
                letterSpacing: '0.05em',
              }}
            >
              {match.score1} – {match.score2}
            </span>
            <p
              className="text-xs text-center mt-0.5"
              style={{ color: 'var(--muted)', letterSpacing: '0.12em' }}
            >
              FT
            </p>
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-2 flex-1 flex-row-reverse">
            <span
              className="w-1.5 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: match.team2.colour ?? 'var(--border-hover)' }}
            />
            <span
              className="font-bold text-sm leading-tight text-right"
              style={{ color: team2Won ? 'var(--foreground)' : 'var(--muted-light)' }}
            >
              {match.team2.name}
            </span>
          </div>
        </div>
      </div>

      {/* Scorers */}
      {(allTeam1Goals.length > 0 || allTeam2Goals.length > 0) && (
        <div
          className="px-5 py-3 grid grid-cols-2 gap-4 text-xs"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="space-y-1.5">
            {allTeam1Goals.map((g) => (
              <div key={g.id} className="flex items-baseline gap-1.5" style={{ color: 'var(--muted-light)' }}>
                <span style={{ color: 'var(--primary)' }}>⚽</span>
                <span>{g.player.name}{g.is_own_goal && ' (og)'}</span>
                {g.minute && (
                  <span style={{ color: 'var(--muted)' }}>{g.minute}&apos;</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-right">
            {allTeam2Goals.map((g) => (
              <div key={g.id} className="flex items-baseline justify-end gap-1.5" style={{ color: 'var(--muted-light)' }}>
                {g.minute && (
                  <span style={{ color: 'var(--muted)' }}>{g.minute}&apos;</span>
                )}
                <span>{g.player.name}{g.is_own_goal && ' (og)'}</span>
                <span style={{ color: 'var(--primary)' }}>⚽</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <div
          className="px-5 py-2.5 flex flex-wrap gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {cards.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--muted)' }}
            >
              <span
                className="w-2.5 h-3.5 rounded-sm inline-block flex-shrink-0"
                style={{ backgroundColor: c.type === 'yellow' ? '#eab308' : '#ef4444' }}
              />
              <span>{c.player.name}</span>
              {c.minute && (
                <span style={{ color: 'var(--muted)', opacity: 0.7 }}>{c.minute}&apos;</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* MOTM */}
      {motmPlayer && (
        <div className="px-5 py-2.5 flex items-center gap-2">
          <span style={{ color: 'var(--gold)', fontSize: '14px' }}>★</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>MOTM</span>
          <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
            {motmPlayer.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            · {motmPlayer.team.name}
          </span>
        </div>
      )}
    </div>
  )
}
