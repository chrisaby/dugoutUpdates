import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { MatchWithTeams } from '@/lib/types'

interface Props {
  match: MatchWithTeams
}

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', color: 'var(--muted)', bg: 'var(--surface-elevated)' },
  live:     { label: 'Live',     color: 'var(--live)',  bg: 'var(--live-dim)' },
  completed: { label: 'FT',     color: 'var(--muted-light)', bg: 'transparent' },
} as const

export function FixtureCard({ match }: Props) {
  const isCompleted = match.status === 'completed'
  const isLive = match.status === 'live'
  const status = STATUS_CONFIG[match.status]

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden transition-all',
        isLive && 'ring-1 ring-[var(--live)]'
      )}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Live indicator bar */}
      {isLive && (
        <div
          className="h-0.5 w-full animate-lime-pulse"
          style={{ backgroundColor: 'var(--live)' }}
        />
      )}

      <div className="p-4">
        {/* Meta row */}
        <div
          className="flex items-center justify-between text-xs mb-3"
          style={{ color: 'var(--muted)' }}
        >
          <span style={{ letterSpacing: '0.05em' }}>
            {match.date
              ? format(new Date(match.date), 'EEE d MMM · HH:mm')
              : 'Date TBD'}
          </span>
          <div className="flex items-center gap-2">
            {match.venue && (
              <span className="truncate max-w-[120px]">{match.venue}</span>
            )}
            {isLive ? (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  backgroundColor: 'var(--live-dim)',
                  color: 'var(--live)',
                  border: '1px solid var(--live)',
                  letterSpacing: '0.1em',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--live)' }} />
                Live
              </span>
            ) : (
              <span
                className="px-2 py-0.5 rounded text-xs font-semibold uppercase"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  color: status.color,
                  letterSpacing: '0.08em',
                }}
              >
                {status.label}
              </span>
            )}
          </div>
        </div>

        {/* Teams + score */}
        <div className="flex items-center gap-4">
          <TeamBlock team={match.team1} align="left" />

          {/* Score / vs */}
          <div className="flex-shrink-0 text-center w-20">
            {(isCompleted || isLive) && match.score1 !== null && match.score2 !== null ? (
              <span
                className="tabular-nums"
                style={{
                  fontFamily: 'var(--font-display, Bebas Neue)',
                  fontSize: '28px',
                  lineHeight: 1,
                  color: 'var(--foreground)',
                  letterSpacing: '0.05em',
                }}
              >
                {match.score1} – {match.score2}
              </span>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-display, Bebas Neue)',
                  fontSize: '18px',
                  color: 'var(--muted)',
                  letterSpacing: '0.15em',
                }}
              >
                VS
              </span>
            )}
          </div>

          <TeamBlock team={match.team2} align="right" />
        </div>
      </div>
    </div>
  )
}

function TeamBlock({
  team,
  align,
}: {
  team: { name: string; colour: string | null }
  align: 'left' | 'right'
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 flex-1',
        align === 'right' && 'flex-row-reverse'
      )}
    >
      {/* Team colour swatch */}
      <span
        className="w-1 h-8 rounded-full flex-shrink-0"
        style={{ backgroundColor: team.colour ?? 'var(--border-hover)' }}
      />
      <span
        className={cn(
          'font-semibold text-sm leading-tight',
          align === 'right' && 'text-right'
        )}
        style={{ color: 'var(--foreground)' }}
      >
        {team.name}
      </span>
    </div>
  )
}
