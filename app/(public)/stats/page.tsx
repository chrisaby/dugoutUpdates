import { createClient } from '@/lib/supabase/server'
import { StatsLeaderboard } from '@/components/features/stats-leaderboard'
import type { TopScorer } from '@/lib/types'

export const revalidate = 60

interface CardRow {
  type: string
  player: { id: string; name: string; team: { id: string; name: string; colour: string | null } }
}

interface CardAgg {
  id: string
  name: string
  teamName: string
  teamColour: string | null
  yellow: number
  red: number
}

export default async function StatsPage() {
  const supabase = await createClient()

  const [{ data: scorersData, error: scorersError }, { data: cardsData, error: cardsError }] = await Promise.all([
    supabase.from('top_scorers_view').select('*'),
    supabase
      .from('cards')
      .select('type, player:players(id, name, team:teams(id, name, colour))'),
  ])

  if (scorersError) console.error('[stats] top_scorers_view query failed:', scorersError.message)
  if (cardsError) console.error('[stats] cards query failed:', cardsError.message)

  const scorers = (scorersData as TopScorer[] ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    teamName: s.team_name,
    teamColour: s.team_colour,
    value: s.goals,
    valueLabel: 'goals',
  }))

  const cardMap: Record<string, CardAgg> = {}
  for (const c of (cardsData ?? []) as unknown as CardRow[]) {
    const p = c.player
    if (!cardMap[p.id]) {
      cardMap[p.id] = { id: p.id, name: p.name, teamName: p.team.name, teamColour: p.team.colour, yellow: 0, red: 0 }
    }
    if (c.type === 'yellow') cardMap[p.id].yellow++
    else cardMap[p.id].red++
  }

  const cardStats = Object.values(cardMap)
    .sort((a, b) => (b.yellow * 1 + b.red * 2) - (a.yellow * 1 + a.red * 2))
    .map((s) => ({
      id: s.id,
      name: s.name,
      teamName: s.teamName,
      teamColour: s.teamColour,
      value: s.yellow + s.red,
      valueLabel: `(${s.yellow}Y ${s.red}R)`,
    }))

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Group Stage
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
          Player Stats
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsLeaderboard title="Golden Boot" icon="⚽" rows={scorers} />
        <StatsLeaderboard title="Most Cards" icon="🟨" rows={cardStats} />
      </div>
    </div>
  )
}
