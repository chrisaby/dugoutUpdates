import { createClient } from '@/lib/supabase/server'
import { BracketView } from '@/components/features/bracket-view'
import type { MatchWithTeams, TournamentSettings } from '@/lib/types'

export const revalidate = 60

export default async function BracketPage() {
  const supabase = await createClient()

  const [{ data: settingsData }, { data: knockoutData }] = await Promise.all([
    supabase.from('tournament_settings').select('*').single(),
    supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(id, name, colour, badge_url, created_at),
        team2:teams!matches_team2_id_fkey(id, name, colour, badge_url, created_at)
      `)
      .in('phase', ['semi', 'final'])
      .order('date', { ascending: true }),
  ])

  const settings = settingsData as TournamentSettings | null
  const locked = settings?.group_stage_locked ?? false
  const matches = knockoutData as MatchWithTeams[] ?? []

  const semis = matches.filter((m) => m.phase === 'semi')
  const semi1 = semis[0] ?? null
  const semi2 = semis[1] ?? null
  const finalMatch = matches.find((m) => m.phase === 'final') ?? null

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-1">Knockout Bracket</h1>
      <p className="text-[var(--muted)] text-sm mb-8">
        {locked
          ? 'Group stage complete — knockout draw confirmed'
          : 'Bracket reveals once the group stage is locked by the admin'}
      </p>

      <BracketView locked={locked} semi1={semi1} semi2={semi2} final={finalMatch} />
    </div>
  )
}
