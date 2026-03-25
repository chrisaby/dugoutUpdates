import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Team } from '@/lib/types'

export const revalidate = 60

export default async function TeamsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('teams').select('*').order('name')
  if (error) console.error('[teams] teams query failed:', error.message)
  const teams = data as Team[] ?? []

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          {teams.length} Clubs
        </p>
        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: 'clamp(40px, 8vw, 72px)',
            color: 'var(--foreground)',
            letterSpacing: '0.03em',
          }}
        >
          Teams
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="team-card group rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              /* CSS variable referenced by .team-card:hover */
              ['--team-color' as string]: team.colour ?? 'var(--border-hover)',
            }}
          >
            {/* Colour bar */}
            <div
              className="h-1 w-full"
              style={{ backgroundColor: team.colour ?? 'var(--border-hover)' }}
            />
            <div className="p-5 flex items-center gap-4">
              {/* Monogram badge */}
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: team.colour ? `${team.colour}22` : 'var(--surface-elevated)',
                  border: `2px solid ${team.colour ?? 'var(--border-hover)'}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display, Bebas Neue)',
                    fontSize: '16px',
                    color: team.colour ?? 'var(--muted-light)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {team.name.slice(0, 3).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0">
                <p
                  className="font-bold leading-tight truncate"
                  style={{ color: 'var(--foreground)', fontSize: '15px' }}
                >
                  {team.name}
                </p>
                <p
                  className="text-xs mt-0.5 uppercase"
                  style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}
                >
                  View squad →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
