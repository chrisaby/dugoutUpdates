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
  const maxValue = rows[0]?.value ?? 1

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span role="img" aria-hidden="true" style={{ fontSize: '16px' }}>
          {icon}
        </span>
        <h2
          className="font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: '20px',
            letterSpacing: '0.08em',
            color: 'var(--foreground)',
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>

      {rows.length === 0 ? (
        <div
          className="px-5 py-8 text-center text-sm"
          style={{ color: 'var(--muted)', backgroundColor: 'var(--surface)' }}
        >
          No data yet
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--surface)' }}>
          {rows.map((row, index) => {
            const isFirst = index === 0
            const barWidth = maxValue > 0 ? (row.value / maxValue) * 100 : 0

            return (
              <div
                key={row.id}
                className="px-5 py-3.5 hover-surface"
                style={{
                  borderBottom: index < rows.length - 1 ? '1px solid var(--border)' : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <span
                    style={{
                      fontFamily: 'var(--font-display, Bebas Neue)',
                      fontSize: isFirst ? '24px' : '18px',
                      lineHeight: 1,
                      color: isFirst ? 'var(--gold)' : 'var(--muted)',
                      width: '24px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>

                  {/* Team colour dot */}
                  {row.teamColour && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.teamColour }}
                    />
                  )}

                  {/* Name + team */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {row.name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--muted)' }}
                    >
                      {row.teamName}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="text-right flex-shrink-0">
                    <span
                      style={{
                        fontFamily: 'var(--font-display, Bebas Neue)',
                        fontSize: isFirst ? '28px' : '22px',
                        lineHeight: 1,
                        color: isFirst ? 'var(--primary)' : 'var(--foreground)',
                      }}
                    >
                      {row.value}
                    </span>
                    <span
                      className="text-xs ml-1"
                      style={{ color: 'var(--muted)' }}
                    >
                      {row.valueLabel}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="mt-2 h-0.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isFirst ? 'var(--primary)' : 'var(--border-hover)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
