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

  const [{ data: scorersData }, { data: cardsData }] = await Promise.all([
    supabase.from('top_scorers_view').select('*'),
    supabase
      .from('cards')
      .select('type, player:players(id, name, team:teams(id, name, colour))'),
  ])

  // Map top scorers
  const scorers = (scorersData as TopScorer[] ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    teamName: s.team_name,
    teamColour: s.team_colour,
    value: s.goals,
    valueLabel: 'goals',
  }))

  // Aggregate cards per player
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
      <h1 className="text-3xl font-black text-white mb-1">Player Stats</h1>
      <p className="text-[var(--muted)] text-sm mb-8">Group stage statistics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsLeaderboard title="Golden Boot" icon="⚽" rows={scorers} />
        <StatsLeaderboard title="Most Cards" icon="🟨" rows={cardStats} />
      </div>
    </div>
  )
}
