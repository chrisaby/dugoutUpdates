'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return supabase
}

// --- Fixtures ---

export async function updateFixture(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string
  const date = (formData.get('date') as string) || null
  const venue = (formData.get('venue') as string) || null

  const { error } = await supabase.from('matches').update({ date, venue }).eq('id', matchId)
  if (error) {
    console.error('[admin:updateFixture]', error.message)
    throw new Error(error.message)
  }
  revalidatePath('/admin/fixtures')
  revalidatePath('/fixtures')
  revalidatePath('/')
}

// --- Match result ---

export async function updateMatchResult(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string
  const score1 = parseInt(formData.get('score1') as string)
  const score2 = parseInt(formData.get('score2') as string)
  if (isNaN(score1) || isNaN(score2)) throw new Error('Invalid score values')
  const status = formData.get('status') as string

  const { error } = await supabase.from('matches').update({ score1, score2, status }).eq('id', matchId)
  if (error) {
    console.error('[admin:updateMatchResult]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/admin/matches')
  revalidatePath('/results')
  revalidatePath('/standings')
  revalidatePath('/fixtures')
  revalidatePath('/')
}

// --- Goals ---

export async function addGoal(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string
  const playerId = formData.get('playerId') as string
  const minuteRaw = formData.get('minute') as string
  const minute = minuteRaw ? parseInt(minuteRaw) : null
  const isOwnGoal = formData.get('isOwnGoal') === 'on'

  const { error } = await supabase.from('goals').insert({
    match_id: matchId,
    player_id: playerId,
    minute,
    is_own_goal: isOwnGoal,
  })
  if (error) {
    console.error('[admin:addGoal]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
  revalidatePath('/stats')
  revalidatePath('/')
}

export async function deleteGoal(formData: FormData) {
  const supabase = await requireAuth()
  const goalId = formData.get('goalId') as string
  const matchId = formData.get('matchId') as string

  const { error } = await supabase.from('goals').delete().eq('id', goalId)
  if (error) {
    console.error('[admin:deleteGoal]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
  revalidatePath('/stats')
  revalidatePath('/')
}

// --- Cards ---

export async function addCard(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string
  const playerId = formData.get('playerId') as string
  const type = formData.get('type') as string
  const minuteRaw = formData.get('minute') as string
  const minute = minuteRaw ? parseInt(minuteRaw) : null

  const { error } = await supabase.from('cards').insert({ match_id: matchId, player_id: playerId, type, minute })
  if (error) {
    console.error('[admin:addCard]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
  revalidatePath('/stats')
  revalidatePath('/')
}

export async function deleteCard(formData: FormData) {
  const supabase = await requireAuth()
  const cardId = formData.get('cardId') as string
  const matchId = formData.get('matchId') as string

  const { error } = await supabase.from('cards').delete().eq('id', cardId)
  if (error) {
    console.error('[admin:deleteCard]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
  revalidatePath('/stats')
  revalidatePath('/')
}

// --- MOTM ---

export async function setMotm(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string
  const playerId = formData.get('playerId') as string

  const { error } = await supabase
    .from('match_motm')
    .upsert({ match_id: matchId, motm_player_id: playerId }, { onConflict: 'match_id' })
  if (error) {
    console.error('[admin:setMotm]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
}

export async function clearMotm(formData: FormData) {
  const supabase = await requireAuth()
  const matchId = formData.get('matchId') as string

  const { error } = await supabase.from('match_motm').delete().eq('match_id', matchId)
  if (error) {
    console.error('[admin:clearMotm]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath('/results')
}

// --- Roster ---

export async function addPlayer(formData: FormData) {
  const supabase = await requireAuth()
  const teamId = formData.get('teamId') as string
  const name = (formData.get('name') as string).trim()
  const position = formData.get('position') as string

  if (!name || !position) throw new Error('Name and position are required')
  const { error } = await supabase.from('players').insert({ team_id: teamId, name, position })
  if (error) {
    console.error('[admin:addPlayer]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/teams/${teamId}`)
  revalidatePath(`/teams/${teamId}`)
}

export async function deletePlayer(formData: FormData) {
  const supabase = await requireAuth()
  const playerId = formData.get('playerId') as string
  const teamId = formData.get('teamId') as string

  const { error } = await supabase.from('players').delete().eq('id', playerId)
  if (error) {
    console.error('[admin:deletePlayer]', error.message)
    throw new Error(error.message)
  }
  revalidatePath(`/admin/teams/${teamId}`)
  revalidatePath(`/teams/${teamId}`)
  revalidatePath('/stats')
}

// --- Tournament settings ---

export async function toggleGroupStageLock(formData: FormData) {
  const supabase = await requireAuth()
  const locked = formData.get('locked') === 'true'

  // tournament_settings always has exactly one row (seeded in 001_schema.sql)
  const { error } = await supabase.from('tournament_settings').update({ group_stage_locked: locked }).not('id', 'is', null)
  if (error) {
    console.error('[admin:toggleGroupStageLock]', error.message)
    throw new Error(error.message)
  }
  revalidatePath('/admin')
  revalidatePath('/bracket')
}
