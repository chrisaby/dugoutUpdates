# Football Tournament Website — PRD

## Overview
A web app to manage and display a 6-team internal organisation football tournament. All data is public (read-only). An admin login allows result entry and data management.

---

## Tournament Format
- **6 teams** play in a **round robin group stage** (15 matches total, each pair plays once)
- **Top 4 teams** qualify for the knockouts based on: Points → Goal Difference → Goals Scored → Head-to-Head
- **Semi-finals**: 1st vs 4th, 2nd vs 3rd
- **Final**: winners of both semis
- **Total matches**: 18 (15 group + 2 semis + 1 final)
- **Scoring**: Win = 3pts, Draw = 1pt, Loss = 0pts

---

## Pages & Features

### 1. Home (`/`)
- Next match countdown
- Latest result card
- Mini points table (top 4 highlighted)
- Top scorer widget

### 2. Standings (`/standings`)
- Full points table: Played, Won, Drawn, Lost, GF, GA, GD, Points
- Top 4 rows visually highlighted as "qualified"
- Tiebreaker rule shown below table

### 3. Fixtures (`/fixtures`)
- All 18 matches listed with date, time, venue
- Filter by team or phase (group / semi / final)
- Status badge: Upcoming / Live / Completed

### 4. Results (`/results`)
- Completed match cards showing score, goal scorers (with minute), yellow/red cards, Man of the Match

### 5. Teams (`/teams/:id`)
- Team name and badge/colour
- Squad roster with player names and positions
- Match history with results
- Upcoming fixtures

### 6. Player Stats (`/stats`)
- Top scorers leaderboard (golden boot)
- Most assists
- Most clean sheets (goalkeepers)
- Most cards (yellow/red)

### 7. Knockout Bracket (`/bracket`)
- Visual bracket showing semi-finals and final
- Slots show "TBD" until group stage is complete
- Auto-fills as results are entered

---

## Admin Panel (`/admin`)
- Password-protected (org email login)
- Enter / edit match results (score, scorers, cards, MOTM)
- Manage team rosters and player profiles
- Set fixture dates, times, venues
- Standings auto-recalculate on result entry
- Lock group stage and generate knockout draw

---

## Tech Stack
- **Frontend**: React / Next.js, fully responsive
- **Backend**: Supabase (database, auth, real-time)
- **Auth**: Public read access; admin login via Supabase Auth
- **Hosting**: Vercel (frontend) + Supabase cloud

---

## Data Models (simplified)

| Table | Key fields |
|---|---|
| `teams` | id, name, badge_url, colour |
| `players` | id, team_id, name, position |
| `matches` | id, home_team_id, away_team_id, date, venue, phase, status |
| `goals` | id, match_id, player_id, minute |
| `cards` | id, match_id, player_id, type (yellow/red), minute |
| `match_events` | id, match_id, motm_player_id |

Standings are derived (not stored) — calculated via a Supabase view or RPC on each page load.

---

## Priorities

| Priority | Features |
|---|---|
| Must have | Points table, fixtures, match results, team pages, admin result entry |
| Should have | Player stats leaderboards, knockout bracket, admin dashboard |
| Nice to have | Countdown timers, player of tournament voting, mobile-optimised layout |