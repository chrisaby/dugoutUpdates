import { cn } from '@/lib/utils'
import type { StandingsRow } from '@/lib/types'

interface Props {
  rows: StandingsRow[]
  mini?: boolean
}

export function StandingsTable({ rows, mini = true }: Props) {
  return (
    <div
      className="overflow-x-auto rounded-lg"
      style={{ border: '1px solid var(--border)' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['#', 'Club', 'P', ...(!mini ? ['W', 'D', 'L', 'GF', 'GA'] : []), 'GD', 'Pts'].map((col, i) => (
              <th
                key={col + i}
                className={cn(
                  'py-3',
                  col === '#' || col === 'Club' ? 'px-4 text-left' : 'px-3 text-center'
                )}
                style={{
                  color: col === 'Pts' ? 'var(--primary)' : 'var(--muted)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isQualified = index < 4
            return (
              <tr
                key={row.id}
                className="hover-surface"
                style={{
                  borderBottom: index < rows.length - 1 ? '1px solid var(--border)' : undefined,
                  backgroundColor: 'var(--surface)',
                }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {isQualified && (
                      <span
                        className="w-0.5 h-4 rounded-full"
                        style={{ backgroundColor: 'var(--primary)' }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-display, Bebas Neue)',
                        fontSize: '16px',
                        color: isQualified ? 'var(--primary)' : 'var(--muted)',
                        lineHeight: 1,
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.colour ?? 'var(--border-hover)' }}
                    />
                    <span
                      className="font-semibold"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {row.name}
                    </span>
                  </div>
                </td>
                <td
                  className="py-3 px-3 text-center"
                  style={{ color: 'var(--muted-light)' }}
                >
                  {row.played}
                </td>
                {!mini && (
                  <>
                    <td className="py-3 px-3 text-center" style={{ color: 'var(--muted-light)' }}>{row.won}</td>
                    <td className="py-3 px-3 text-center" style={{ color: 'var(--muted-light)' }}>{row.drawn}</td>
                    <td className="py-3 px-3 text-center" style={{ color: 'var(--muted-light)' }}>{row.lost}</td>
                    <td className="py-3 px-3 text-center" style={{ color: 'var(--muted-light)' }}>{row.gf}</td>
                    <td className="py-3 px-3 text-center" style={{ color: 'var(--muted-light)' }}>{row.ga}</td>
                  </>
                )}
                <td
                  className="py-3 px-3 text-center"
                  style={{ color: row.gd > 0 ? 'var(--muted-light)' : 'var(--muted)' }}
                >
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    style={{
                      fontFamily: 'var(--font-display, Bebas Neue)',
                      fontSize: '20px',
                      lineHeight: 1,
                      color: isQualified ? 'var(--primary)' : 'var(--foreground)',
                    }}
                  >
                    {row.points}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
