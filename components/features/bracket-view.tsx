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
      {/* Semi-finals column */}
      <div className="flex flex-col justify-around gap-6 lg:w-64">
        <BracketSlot label="Semi-final 1" match={locked ? semi1 : null} />
        <BracketSlot label="Semi-final 2" match={locked ? semi2 : null} />
      </div>

      {/* Connector */}
      <div className="hidden lg:flex flex-col items-center justify-center w-12">
        <div className="flex-1 border-r-2 border-t-2 border-[var(--border)] w-6" />
        <div className="w-6 h-0.5 bg-[var(--border)]" />
        <div className="flex-1 border-r-2 border-b-2 border-[var(--border)] w-6" />
      </div>

      {/* Final column */}
      <div className="flex items-center lg:w-64 mt-4 lg:mt-0">
        <BracketSlot label="Final" match={locked ? finalMatch : null} />
      </div>
    </div>
  )
}

function BracketSlot({
  label,
  match,
}: {
  label: string
  match: MatchWithTeams | null
}) {
  const team1Name = match?.team1.name ?? 'TBD'
  const team2Name = match?.team2.name ?? 'TBD'
  const isCompleted = match?.status === 'completed'

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden flex-1 max-w-full"
      style={{ backgroundColor: 'var(--surface)' }}>
      <div className="px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface-hover)]">
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{label}</span>
      </div>
      <div className="p-3 space-y-2">
        <TeamRow name={team1Name} colour={match?.team1.colour ?? null} />
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-[var(--border)]" />
          {isCompleted && match.score1 !== null && match.score2 !== null ? (
            <span className="text-sm font-black text-white tabular-nums">
              {match.score1} – {match.score2}
            </span>
          ) : (
            <span className="text-xs text-[var(--muted)]">vs</span>
          )}
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <TeamRow name={team2Name} colour={match?.team2.colour ?? null} />
      </div>
    </div>
  )
}

function TeamRow({ name, colour }: { name: string; colour: string | null }) {
  const isTbd = name === 'TBD'
  return (
    <div className="flex items-center gap-2">
      {colour ? (
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colour }} />
      ) : (
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-slate-700" />
      )}
      <span className={isTbd ? 'text-[var(--muted)] text-sm italic' : 'text-white font-semibold text-sm'}>
        {name}
      </span>
    </div>
  )
}
