import { createClient } from '@/lib/supabase/server'
import { PlayoffsView } from '@/components/features/playoffs-view'
import type { MatchWithTeams, TournamentSettings } from '@/lib/types'

export const revalidate = 60

export default async function PlayoffsPage() {
  const supabase = await createClient()

  const [{ data: settingsData, error: settingsError }, { data: knockoutData, error: knockoutError }] = await Promise.all([
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

  if (settingsError) console.error('[playoffs] tournament_settings query failed:', settingsError.message)
  if (knockoutError) console.error('[playoffs] matches query failed:', knockoutError.message)

  const settings = settingsData as TournamentSettings | null
  const locked = settings?.group_stage_locked ?? false
  const matches = knockoutData as MatchWithTeams[] ?? []

  const semis = matches.filter((m) => m.phase === 'semi')
  const semi1 = semis[0] ?? null
  const semi2 = semis[1] ?? null
  const finalMatch = matches.find((m) => m.phase === 'final') ?? null

  return (
    <div>
      {/* Page header */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="text-xs font-bold uppercase mb-2"
          style={{ color: 'var(--primary)', letterSpacing: '0.2em' }}
        >
          Knockout Stage
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
          Playoffs
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          {locked
            ? 'Group stage complete — knockout draw confirmed'
            : 'Playoffs reveals once the group stage is locked by the admin'}
        </p>
      </div>

      {!locked && (
        <div
          className="rounded-lg p-6 mb-8 text-center"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="text-4xl mb-3"
            style={{ filter: 'grayscale(0.5)' }}
          >
            🏆
          </div>
          <p
            className="font-bold uppercase mb-1"
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: '20px',
              color: 'var(--muted-light)',
              letterSpacing: '0.08em',
            }}
          >
            Standing by
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--muted)' }}
          >
            The knockout draw will be confirmed once the group stage concludes.
          </p>
        </div>
      )}

      <PlayoffsView locked={locked} semi1={semi1} semi2={semi2} final={finalMatch} />
    </div>
  )
}
