import { cn } from '@/lib/utils'

interface LeaderboardRow {
  id: string
  name: string
  teamName: string
  teamColour: string | null
  value: number
  valueLabel: string
}

interface Props {
  title: string
  icon: string
  rows: LeaderboardRow[]
}

export function StatsLeaderboard({ title, icon, rows }: Props) {
  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden"
      style={{ backgroundColor: 'var(--surface)' }}>
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <span role="img" aria-hidden="true">{icon}</span>
        <h2 className="font-bold text-white text-sm">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-[var(--muted)] text-sm text-center">No data yet</p>
      ) : (
        <div>
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <span
                data-rank={index + 1}
                className={cn(
                  'text-sm font-black w-6 text-center flex-shrink-0',
                  index === 0 ? 'text-[var(--gold)]' : 'text-[var(--muted)]'
                )}
              >
                {index + 1}
              </span>
              {row.teamColour && (
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: row.teamColour }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{row.name}</p>
                <p className="text-[var(--muted)] text-xs">{row.teamName}</p>
              </div>
              <div className="flex items-baseline gap-1 flex-shrink-0">
                <span className="text-xl font-black text-white">{row.value}</span>
                <span className="text-[var(--muted)] text-xs">{row.valueLabel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
