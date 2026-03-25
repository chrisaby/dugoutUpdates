'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { MatchWithTeams } from '@/lib/types'

interface Props {
  initialMatches: MatchWithTeams[]
}

export function LiveScoreWidget({ initialMatches }: Props) {
  const [matches, setMatches] = useState<MatchWithTeams[]>(initialMatches)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('live-scores')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const updated = payload.new as { id: string; score1: number | null; score2: number | null; status: string }
          if (!updated?.id) return
          setMatches((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? { ...m, score1: updated.score1, score2: updated.score2, status: updated.status as MatchWithTeams['status'] }
                : m
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const liveMatches = matches.filter((m) => m.status === 'live')
  if (liveMatches.length === 0) return null

  return (
    <div
      className="rounded-lg p-4 mb-2"
      style={{
        background: 'var(--live-dim)',
        border: '1px solid rgba(255,59,59,0.35)',
      }}
    >
      {/* Live header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
          style={{ backgroundColor: 'var(--live)' }}
        />
        <span
          className="font-bold uppercase"
          style={{
            fontFamily: 'var(--font-display, Bebas Neue)',
            fontSize: '16px',
            letterSpacing: '0.2em',
            color: 'var(--live)',
            lineHeight: 1,
          }}
        >
          Live Now
        </span>
      </div>

      <div className="space-y-3">
        {liveMatches.map((match) => (
          <div key={match.id} className="flex items-center gap-4">
            {/* Team 1 */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span
                className="font-semibold text-sm"
                style={{ color: 'var(--foreground)' }}
              >
                {match.team1.name}
              </span>
              <span
                className="w-1.5 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: match.team1.colour ?? 'var(--border-hover)' }}
              />
            </div>

            {/* Score */}
            <div
              className="flex-shrink-0 tabular-nums"
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '32px',
                lineHeight: 1,
                color: 'var(--foreground)',
                letterSpacing: '0.05em',
              }}
            >
              {match.score1 ?? 0} – {match.score2 ?? 0}
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-2 flex-1">
              <span
                className="w-1.5 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: match.team2.colour ?? 'var(--border-hover)' }}
              />
              <span
                className="font-semibold text-sm"
                style={{ color: 'var(--foreground)' }}
              >
                {match.team2.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
