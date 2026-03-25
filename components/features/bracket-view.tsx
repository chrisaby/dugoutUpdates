import type { MatchWithTeams } from '@/lib/types'

interface Props {
  locked: boolean
  semi1: MatchWithTeams | null
  semi2: MatchWithTeams | null
  final: MatchWithTeams | null
}

export function BracketView({ locked, semi1, semi2, final: finalMatch }: Props) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-0 max-w-3xl mx-auto">
      {/* Semi-finals */}
      <div className="flex flex-col justify-around gap-6 lg:w-64">
        <BracketSlot label="Semi-final 1" match={locked ? semi1 : null} />
        <BracketSlot label="Semi-final 2" match={locked ? semi2 : null} />
      </div>

      {/* Connector lines */}
      <div className="hidden lg:flex flex-col items-center justify-center w-12">
        <div
          className="flex-1 w-6"
          style={{
            borderRight: '2px solid var(--border)',
            borderTop: '2px solid var(--border)',
          }}
        />
        <div className="w-6 h-0.5" style={{ backgroundColor: 'var(--border)' }} />
        <div
          className="flex-1 w-6"
          style={{
            borderRight: '2px solid var(--border)',
            borderBottom: '2px solid var(--border)',
          }}
        />
      </div>

      {/* Final */}
      <div className="flex flex-col justify-center lg:w-64 mt-4 lg:mt-0">
        <BracketSlot label="Final" match={locked ? finalMatch : null} isFinal />
      </div>
    </div>
  )
}

function BracketSlot({
  label,
  match,
  isFinal = false,
}: {
  label: string
  match: MatchWithTeams | null
  isFinal?: boolean
}) {
  const team1Name = match?.team1.name ?? 'TBD'
  const team2Name = match?.team2.name ?? 'TBD'
  const isCompleted = match?.status === 'completed'

  return (
    <div
      className={`rounded-lg overflow-hidden max-w-full${isFinal ? '' : ' flex-1'}`}
      style={{
        backgroundColor: 'var(--surface)',
        border: `1px solid ${isFinal ? 'var(--primary)' : 'var(--border)'}`,
        boxShadow: isFinal ? '0 0 20px var(--primary-glow)' : undefined,
      }}
    >
      {/* Label */}
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{
          backgroundColor: isFinal ? 'var(--primary-glow)' : 'var(--surface-elevated)',
          borderBottom: `1px solid ${isFinal ? 'var(--primary)' : 'var(--border)'}`,
        }}
      >
        {isFinal && (
          <span style={{ color: 'var(--gold)', fontSize: '12px' }}>★</span>
        )}
        <span
          className="font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: '14px',
            letterSpacing: '0.1em',
            color: isFinal ? 'var(--primary)' : 'var(--muted-light)',
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        <TeamSlotRow
          name={team1Name}
          colour={match?.team1.colour ?? null}
          score={isCompleted ? match?.score1 : undefined}
          won={isCompleted ? (match?.score1 ?? 0) > (match?.score2 ?? 0) : false}
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: '12px',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}
          >
            VS
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        </div>
        <TeamSlotRow
          name={team2Name}
          colour={match?.team2.colour ?? null}
          score={isCompleted ? match?.score2 : undefined}
          won={isCompleted ? (match?.score2 ?? 0) > (match?.score1 ?? 0) : false}
        />
      </div>
    </div>
  )
}

function TeamSlotRow({
  name,
  colour,
  score,
  won,
}: {
  name: string
  colour: string | null
  score?: number | null
  won: boolean
}) {
  const isTbd = name === 'TBD'
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: colour ?? 'var(--border-hover)' }}
        />
        <span
          className="text-sm font-semibold truncate"
          style={{
            color: isTbd ? 'var(--muted)' : won ? 'var(--primary)' : 'var(--foreground)',
            fontStyle: isTbd ? 'italic' : undefined,
          }}
        >
          {name}
        </span>
      </div>
      {score !== undefined && score !== null && (
        <span
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: '20px',
            lineHeight: 1,
            color: won ? 'var(--primary)' : 'var(--foreground)',
          }}
        >
          {score}
        </span>
      )}
    </div>
  )
}
