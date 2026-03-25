import type { Player } from '@/lib/types'

const POSITION_CONFIG = {
  GK:  { label: 'GK',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)' },
  DEF: { label: 'DEF', color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.30)' },
  MID: { label: 'MID', color: '#bef043', bg: 'rgba(190,240,67,0.10)',  border: 'rgba(190,240,67,0.30)' },
  FWD: { label: 'FWD', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.30)' },
} as const

interface Props {
  players: Player[]
}

export function SquadGrid({ players }: Props) {
  const order = ['GK', 'DEF', 'MID', 'FWD']
  const sorted = [...players].sort(
    (a, b) => order.indexOf(a.position) - order.indexOf(b.position)
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
      {sorted.map((player) => {
        const pos = POSITION_CONFIG[player.position]
        return (
          <div
            key={player.id}
            className="squad-card flex items-center gap-3 p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              /* CSS variable for hover border color */
              ['--pos-border' as string]: pos.border,
            }}
          >
            <span
              className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
              style={{
                color: pos.color,
                backgroundColor: pos.bg,
                border: `1px solid ${pos.border}`,
                letterSpacing: '0.06em',
              }}
            >
              {pos.label}
            </span>
            <span
              className="font-medium text-sm"
              style={{ color: 'var(--foreground)' }}
            >
              {player.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
