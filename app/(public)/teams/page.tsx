import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Team } from '@/lib/types'

export const revalidate = 60

export default async function TeamsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('teams').select('*').order('name')
  const teams = data as Team[] ?? []

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-slate-500 transition-colors group"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <span
              className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white/20"
              style={{ backgroundColor: team.colour ?? '#334155' }}
            />
            <span className="font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
              {team.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
