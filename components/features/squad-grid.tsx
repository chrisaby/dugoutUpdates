import { cn } from '@/lib/utils'
import type { Player } from '@/lib/types'

const POSITION_CONFIG = {
  GK: { label: 'GK', className: 'bg-amber-900/40 text-amber-400 border-amber-800' },
  DEF: { label: 'DEF', className: 'bg-blue-900/40 text-blue-400 border-blue-800' },
  MID: { label: 'MID', className: 'bg-green-900/40 text-green-400 border-green-800' },
  FWD: { label: 'FWD', className: 'bg-red-900/40 text-red-400 border-red-800' },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {sorted.map((player) => {
        const pos = POSITION_CONFIG[player.position]
        return (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-slate-600 transition-colors"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <span
              className={cn(
                'text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0',
                pos.className
              )}
            >
              {pos.label}
            </span>
            <span className="text-white font-medium text-sm">{player.name}</span>
          </div>
        )
      })}
    </div>
  )
}
