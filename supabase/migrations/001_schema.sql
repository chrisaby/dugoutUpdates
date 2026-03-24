-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  badge_url text,
  colour text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  position text NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD'))
);

CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team1_id uuid NOT NULL REFERENCES teams(id),
  team2_id uuid NOT NULL REFERENCES teams(id),
  date timestamptz,
  venue text,
  phase text NOT NULL CHECK (phase IN ('group', 'semi', 'final')),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  score1 int CHECK (score1 >= 0),
  score2 int CHECK (score2 >= 0),
  CONSTRAINT different_teams CHECK (team1_id != team2_id)
);

CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id),
  minute int CHECK (minute BETWEEN 1 AND 120),
  is_own_goal boolean NOT NULL DEFAULT false
);

CREATE TABLE cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id),
  type text NOT NULL CHECK (type IN ('yellow', 'red')),
  minute int CHECK (minute BETWEEN 1 AND 120)
);

CREATE TABLE match_motm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
  motm_player_id uuid NOT NULL REFERENCES players(id)
);

CREATE TABLE tournament_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_stage_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Seed one settings row on first load
INSERT INTO tournament_settings (group_stage_locked) VALUES (false);
