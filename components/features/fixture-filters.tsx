'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Team } from '@/lib/types'

interface Props {
  teams: Team[]
}

const PHASE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'group', label: 'Group' },
  { value: 'semi', label: 'Semi-finals' },
  { value: 'final', label: 'Final' },
]

export function FixtureFilters({ teams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activePhase = searchParams.get('phase') ?? ''
  const activeTeam = searchParams.get('team') ?? ''

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Phase chips */}
      <div className="flex flex-wrap gap-2">
        {PHASE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setParam('phase', value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              activePhase === value
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'text-[var(--muted)] border-[var(--border)] hover:border-slate-500 hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Team chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam('team', '')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
            activeTeam === ''
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'text-[var(--muted)] border-[var(--border)] hover:border-slate-500 hover:text-white'
          )}
        >
          All Teams
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setParam('team', team.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border flex items-center gap-1.5',
              activeTeam === team.id
                ? 'text-white border-transparent'
                : 'text-[var(--muted)] border-[var(--border)] hover:border-slate-500 hover:text-white'
            )}
            style={activeTeam === team.id && team.colour
              ? { backgroundColor: team.colour, borderColor: team.colour }
              : undefined}
          >
            {team.colour && (
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: team.colour }} />
            )}
            {team.name}
          </button>
        ))}
      </div>
    </div>
  )
}
