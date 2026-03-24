import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { MatchWithTeams } from '@/lib/types'

interface Props {
  match: MatchWithTeams
}

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', className: 'bg-slate-700 text-slate-300' },
  live:     { label: 'Live',     className: 'bg-red-600 text-white' },
  completed: { label: 'Completed', className: 'bg-slate-600 text-slate-400' },
} as const

export function FixtureCard({ match }: Props) {
  const isCompleted = match.status === 'completed'
  const status = STATUS_CONFIG[match.status]

  return (
    <div className="rounded-lg border border-[var(--border)] p-4 flex flex-col gap-3 hover:border-slate-600 transition-colors"
      style={{ backgroundColor: 'var(--surface)' }}>
      {/* Date + venue row */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>
          {match.date
            ? format(new Date(match.date), 'EEE, d MMM yyyy · HH:mm')
            : 'Date TBD'}
        </span>
        <span>{match.venue ?? ''}</span>
      </div>

      {/* Teams + score row */}
      <div className="flex items-center gap-3">
        <TeamName team={match.team1} />
        <div className="flex-shrink-0 text-center min-w-[5rem]">
          {isCompleted && match.score1 !== null && match.score2 !== null ? (
            <span className="text-xl font-black text-white tabular-nums">
              {match.score1} – {match.score2}
            </span>
          ) : (
            <span className="text-[var(--muted)] text-sm font-medium">vs</span>
          )}
        </div>
        <TeamName team={match.team2} align="right" />
      </div>

      {/* Status badge */}
      <div className="flex justify-end">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', status.className)}>
          {status.label}
        </span>
      </div>
    </div>
  )
}

function TeamName({
  team,
  align = 'left',
}: {
  team: { name: string; colour: string | null }
  align?: 'left' | 'right'
}) {
  return (
    <div className={cn('flex items-center gap-2 flex-1', align === 'right' && 'flex-row-reverse')}>
      {team.colour && (
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: team.colour }}
        />
      )}
      <span className={cn('font-semibold text-white text-sm leading-tight', align === 'right' && 'text-right')}>
        {team.name}
      </span>
    </div>
  )
}
