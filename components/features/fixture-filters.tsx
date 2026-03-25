'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Team } from '@/lib/types'

interface Props {
  teams: Team[]
}

const PHASE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'group', label: 'Group' },
  { value: 'semi', label: 'Semis' },
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
    <div className="flex flex-col gap-3 mb-8">
      {/* Phase chips */}
      <div className="flex flex-wrap gap-2">
        {PHASE_OPTIONS.map(({ value, label }) => {
          const isActive = activePhase === value
          return (
            <button
              key={value}
              onClick={() => setParam('phase', value)}
              className="px-3 py-1.5 rounded text-xs font-bold uppercase transition-all"
              style={{
                letterSpacing: '0.1em',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#050c05' : 'var(--muted)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--foreground)'
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Team chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam('team', '')}
          className="px-3 py-1.5 rounded text-xs font-bold uppercase transition-all"
          style={{
            letterSpacing: '0.1em',
            backgroundColor: activeTeam === '' ? 'var(--primary)' : 'var(--surface)',
            color: activeTeam === '' ? '#050c05' : 'var(--muted)',
            border: `1px solid ${activeTeam === '' ? 'var(--primary)' : 'var(--border)'}`,
          }}
        >
          All Teams
        </button>
        {teams.map((team) => {
          const isActive = activeTeam === team.id
          return (
            <button
              key={team.id}
              onClick={() => setParam('team', team.id)}
              className="px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1.5"
              style={{
                letterSpacing: '0.08em',
                backgroundColor: isActive && team.colour ? `${team.colour}22` : 'var(--surface)',
                color: isActive ? 'var(--foreground)' : 'var(--muted)',
                border: `1px solid ${isActive && team.colour ? team.colour : 'var(--border)'}`,
              }}
            >
              {team.colour && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.colour }}
                />
              )}
              {team.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
