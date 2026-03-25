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
          setMatches((prev) =>
            prev.map((m) =>
              m.id === payload.new.id
                ? { ...m, score1: payload.new.score1, score2: payload.new.score2, status: payload.new.status }
                : m
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const liveMatches = matches.filter((m) => m.status === 'live')
  if (liveMatches.length === 0) return null

  return (
    <div className="rounded-xl border border-red-800/60 p-4 mb-2"
      style={{ background: 'rgba(239,68,68,0.07)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live Now</span>
      </div>
      <div className="space-y-2">
        {liveMatches.map((match) => (
          <div key={match.id} className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-white flex-1 text-right">{match.team1.name}</span>
            <span className="text-xl font-black text-white tabular-nums">
              {match.score1 ?? 0} – {match.score2 ?? 0}
            </span>
            <span className="font-semibold text-white flex-1">{match.team2.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
