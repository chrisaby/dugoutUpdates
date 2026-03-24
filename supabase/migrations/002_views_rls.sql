-- ============================================================
-- VIEWS
-- ============================================================

-- standings_view: aggregates group-stage stats per team.
-- Head-to-head tiebreaking is handled in the app layer (lib/standings.ts).
CREATE OR REPLACE VIEW standings_view AS
SELECT
  t.id,
  t.name,
  t.colour,
  t.badge_url,
  COUNT(m.id)::int                                                          AS played,
  SUM(CASE
    WHEN (m.team1_id = t.id AND m.score1 > m.score2)
      OR (m.team2_id = t.id AND m.score2 > m.score1) THEN 1 ELSE 0
  END)::int                                                                 AS won,
  SUM(CASE WHEN m.score1 = m.score2 THEN 1 ELSE 0 END)::int               AS drawn,
  SUM(CASE
    WHEN (m.team1_id = t.id AND m.score1 < m.score2)
      OR (m.team2_id = t.id AND m.score2 < m.score1) THEN 1 ELSE 0
  END)::int                                                                 AS lost,
  SUM(CASE WHEN m.team1_id = t.id THEN m.score1
           WHEN m.team2_id = t.id THEN m.score2 ELSE 0 END)::int          AS gf,
  SUM(CASE WHEN m.team1_id = t.id THEN m.score2
           WHEN m.team2_id = t.id THEN m.score1 ELSE 0 END)::int          AS ga,
  SUM(CASE WHEN m.team1_id = t.id THEN m.score1 - m.score2
           WHEN m.team2_id = t.id THEN m.score2 - m.score1 ELSE 0 END)::int AS gd,
  SUM(CASE
    WHEN (m.team1_id = t.id AND m.score1 > m.score2)
      OR (m.team2_id = t.id AND m.score2 > m.score1) THEN 3
    WHEN m.score1 = m.score2 THEN 1
    ELSE 0
  END)::int                                                                 AS points
FROM teams t
LEFT JOIN matches m
  ON (m.team1_id = t.id OR m.team2_id = t.id)
  AND m.status = 'completed'
  AND m.phase = 'group'
GROUP BY t.id, t.name, t.colour, t.badge_url;

-- top_scorers_view: goals per player excluding own goals, with team info
CREATE OR REPLACE VIEW top_scorers_view AS
SELECT
  p.id,
  p.name,
  t.id       AS team_id,
  t.name     AS team_name,
  t.colour   AS team_colour,
  COUNT(g.id)::int AS goals
FROM players p
JOIN teams t ON p.team_id = t.id
JOIN goals g ON g.player_id = p.id AND g.is_own_goal = false
GROUP BY p.id, p.name, t.id, t.name, t.colour
ORDER BY goals DESC;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE teams              ENABLE ROW LEVEL SECURITY;
ALTER TABLE players            ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_motm         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

-- Public read (anon key)
CREATE POLICY "public_read_teams"               ON teams               FOR SELECT USING (true);
CREATE POLICY "public_read_players"             ON players             FOR SELECT USING (true);
CREATE POLICY "public_read_matches"             ON matches             FOR SELECT USING (true);
CREATE POLICY "public_read_goals"               ON goals               FOR SELECT USING (true);
CREATE POLICY "public_read_cards"               ON cards               FOR SELECT USING (true);
CREATE POLICY "public_read_match_motm"          ON match_motm          FOR SELECT USING (true);
CREATE POLICY "public_read_tournament_settings" ON tournament_settings FOR SELECT USING (true);

-- Admin write (authenticated session only)
CREATE POLICY "admin_all_teams"               ON teams               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_players"             ON players             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_matches"             ON matches             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_goals"               ON goals               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_cards"               ON cards               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_match_motm"          ON match_motm          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_tournament_settings" ON tournament_settings FOR ALL USING (auth.role() = 'authenticated');
