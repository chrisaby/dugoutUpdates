export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'
export type Phase = 'group' | 'semi' | 'final'
export type MatchStatus = 'upcoming' | 'live' | 'completed'
export type CardType = 'yellow' | 'red'

export interface Team {
  id: string
  name: string
  badge_url: string | null
  colour: string | null
  created_at: string
}

export interface Player {
  id: string
  team_id: string
  name: string
  position: Position
}

export interface Match {
  id: string
  team1_id: string
  team2_id: string
  date: string | null
  venue: string | null
  phase: Phase
  status: MatchStatus
  score1: number | null
  score2: number | null
}

export interface Goal {
  id: string
  match_id: string
  player_id: string
  minute: number | null
  is_own_goal: boolean
}

export interface Card {
  id: string
  match_id: string
  player_id: string
  type: CardType
  minute: number | null
}

export interface MatchMotm {
  id: string
  match_id: string
  motm_player_id: string
}

export interface TournamentSettings {
  id: string
  group_stage_locked: boolean
  created_at: string
}

// Derived / view types
export interface StandingsRow {
  id: string
  name: string
  colour: string | null
  badge_url: string | null
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}

export interface TopScorer {
  id: string
  name: string
  team_id: string
  team_name: string
  team_colour: string | null
  goals: number
}

// Enriched types used in UI (joins resolved)
export interface MatchWithTeams extends Match {
  team1: Team
  team2: Team
}

export interface GoalWithPlayer extends Goal {
  player: Player & { team: Team }
}

export interface CardWithPlayer extends Card {
  player: Player & { team: Team }
}
