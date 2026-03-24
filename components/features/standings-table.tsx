import { cn } from '@/lib/utils'
import type { StandingsRow } from '@/lib/types'

interface Props {
  rows: StandingsRow[]
  mini?: boolean
}

export function StandingsTable({ rows, mini = true }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--muted)] text-xs uppercase tracking-wide border-b border-[var(--border)]"
            style={{ backgroundColor: 'var(--surface)' }}>
            <th className="text-left py-3 px-4">#</th>
            <th className="text-left py-3 px-4">Team</th>
            <th className="py-3 px-3 text-center">P</th>
            {!mini && (
              <>
                <th className="py-3 px-3 text-center">W</th>
                <th className="py-3 px-3 text-center">D</th>
                <th className="py-3 px-3 text-center">L</th>
                <th className="py-3 px-3 text-center">GF</th>
                <th className="py-3 px-3 text-center">GA</th>
              </>
            )}
            <th className="py-3 px-3 text-center">GD</th>
            <th className="py-3 px-4 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isQualified = index < 4
            return (
              <tr
                key={row.id}
                data-qualified={isQualified}
                className={cn(
                  'border-b border-[var(--border)] last:border-0 transition-colors',
                  isQualified
                    ? 'border-l-2 border-l-[var(--gold)] hover:bg-amber-950/20'
                    : 'hover:bg-[var(--surface-hover)]'
                )}
              >
                <td className={cn(
                  'py-3 px-4 font-bold text-sm',
                  isQualified ? 'text-[var(--gold)]' : 'text-[var(--muted)]'
                )}>
                  {index + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {row.colour && (
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.colour }}
                      />
                    )}
                    <span className="font-semibold text-white">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-[var(--muted)]">{row.played}</td>
                {!mini && (
                  <>
                    <td className="py-3 px-3 text-center text-[var(--muted)]">{row.won}</td>
                    <td className="py-3 px-3 text-center text-[var(--muted)]">{row.drawn}</td>
                    <td className="py-3 px-3 text-center text-[var(--muted)]">{row.lost}</td>
                    <td className="py-3 px-3 text-center text-[var(--muted)]">{row.gf}</td>
                    <td className="py-3 px-3 text-center text-[var(--muted)]">{row.ga}</td>
                  </>
                )}
                <td className="py-3 px-3 text-center text-[var(--muted)]">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="py-3 px-4 text-center font-black text-white">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
