# Federal Premier League — Design Spec

**Date:** 2026-03-24
**Status:** Approved

---

## Overview

A public-facing web app to manage and display a 6-team internal organisation football tournament. All match data is publicly readable. An admin with a magic-link login can enter results and manage data.

---

## Tournament Format

- 6 teams, round-robin group stage (15 matches, each pair plays once)
- Top 4 qualify for knockouts: Points → Goal Difference → Goals Scored → Head-to-Head (H2H applied only when all three prior criteria are tied between two teams)
- Semi-finals: 1st vs 4th, 2nd vs 3rd
- Final: winners of both semis
- Total: 18 matches (15 group + 2 semis + 1 final)
- Scoring: Win = 3pts, Draw = 1pt, Loss = 0pts
- All matches played at neutral venues (no home/away distinction)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Auth | Supabase magic link (passwordless email) |
| Hosting | Vercel (frontend) + Supabase cloud |

---

## Architecture

### Approach
Next.js App Router with Server Components for all public pages (server-side rendering for SEO and performance). Admin panel uses a protected route group with server-side session checks. All admin mutations use Next.js Server Actions. No separate API routes.

### Project Structure

```
federalPremierLeague/
├── app/
│   ├── (public)/               # Public route group
│   │   ├── page.tsx            # Home /
│   │   ├── standings/
│   │   ├── fixtures/
│   │   ├── results/
│   │   ├── teams/[id]/
│   │   ├── stats/
│   │   └── bracket/
│   ├── (admin)/                # Protected route group
│   │   ├── layout.tsx          # Auth guard — server-side redirect if no session
│   │   └── admin/
│   │       ├── page.tsx        # Dashboard
│   │       ├── matches/        # Enter / edit results
│   │       ├── teams/          # Manage rosters
│   │       └── fixtures/       # Set dates / venues
│   └── auth/
│       ├── login/              # Magic link request form
│       └── callback/           # Supabase auth callback handler
├── components/
│   ├── ui/                     # Reusable primitives (Badge, Card, Table, etc.)
│   └── features/               # Domain components (StandingsTable, MatchCard, etc.)
├── lib/
│   ├── supabase/               # Server + browser Supabase client setup
│   └── standings.ts            # Standings calculation logic (mirrors DB view)
├── supabase/
│   ├── migrations/             # SQL schema migrations
│   └── seed.sql                # Mock data seed
└── middleware.ts               # Supabase auth session refresh; matcher protects /admin/* routes
```

---

## Database Schema

### Tables

```sql
teams (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  badge_url text,
  colour text,           -- hex colour for UI accents
  created_at timestamptz DEFAULT now()
)

players (
  id uuid PRIMARY KEY,
  team_id uuid REFERENCES teams(id),
  name text NOT NULL,
  position text NOT NULL  -- 'GK' | 'DEF' | 'MID' | 'FWD'
)

matches (
  id uuid PRIMARY KEY,
  team1_id uuid REFERENCES teams(id),
  team2_id uuid REFERENCES teams(id),
  date timestamptz,
  venue text,
  phase text NOT NULL,    -- 'group' | 'semi' | 'final'
  status text NOT NULL,   -- 'upcoming' | 'live' | 'completed'
  score1 int,             -- team1 score (null until completed)
  score2 int              -- team2 score (null until completed)
)

goals (
  id uuid PRIMARY KEY,
  match_id uuid REFERENCES matches(id),
  player_id uuid REFERENCES players(id),
  minute int,
  is_own_goal boolean DEFAULT false
)

cards (
  id uuid PRIMARY KEY,
  match_id uuid REFERENCES matches(id),
  player_id uuid REFERENCES players(id),
  type text NOT NULL,     -- 'yellow' | 'red'
  minute int
)

match_motm (                  -- one Man of the Match record per match
  id uuid PRIMARY KEY,
  match_id uuid REFERENCES matches(id) UNIQUE,
  motm_player_id uuid REFERENCES players(id)
)

tournament_settings (
  id uuid PRIMARY KEY,
  group_stage_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)
```

### SQL Views

```sql
-- standings_view: live, ordered by tiebreakers
-- Aggregates: played, won, drawn, lost, GF, GA, GD, points per team
-- Order: points DESC, GD DESC, GF DESC, (head-to-head handled in app layer)

-- top_scorers_view: goals per player excluding own goals, with team name
```

### Security
- Row Level Security enabled on all tables
- Public: SELECT on all tables/views
- Writes: require authenticated admin session (Supabase Auth)

### Mock Seed Data
- 6 teams with names and colours
- ~30 players distributed across teams (5 per team)
- 15 group stage fixtures with dates and venues
- A handful of completed results with goals, cards, MOTM

---

## Pages

### 1. Home (`/`)
- Countdown to next upcoming match
- Latest completed result card
- Mini standings table (top 4 gold-highlighted)
- Top scorer widget

### 2. Standings (`/standings`)
- Full points table: Played, Won, Drawn, Lost, GF, GA, GD, Points
- Top 4 rows visually highlighted as "Qualified"
- Tiebreaker rules shown below table

### 3. Fixtures (`/fixtures`)
- All 18 matches listed with date, time, venue
- Filter chips: All / Group / Semi / Final / by team
- Status badge: Upcoming / Live / Completed

### 4. Results (`/results`)
- Completed match cards: score, goal scorers with minutes, card icons, MOTM badge

### 5. Teams (`/teams/[id]`)
- Team colour accent header with name and badge
- Squad roster grid with position badges
- Match history with results
- Upcoming fixtures

### 6. Player Stats (`/stats`)
- Golden Boot leaderboard (goals, excl. own goals)
- Most cards (yellow/red)

> **v1 scope note:** Assists and clean sheets are not tracked in v1 — they require lineup/appearances data not in the schema. These can be added in a future iteration.

### 7. Knockout Bracket (`/bracket`)
- Visual bracket: semi-finals + final
- Slots show "TBD" until group stage is locked
- Auto-fills as results are entered

---

## Admin Panel (`/admin`)

Protected by Supabase magic link auth. Server-side session check in `(admin)/layout.tsx`.

### Features
- **Match results:** Enter/edit score, goal scorers (player + minute), cards, MOTM
- **Rosters:** Add/edit/remove players per team
- **Fixtures:** Set date, time, venue per match
- **Lock group stage:** Toggle `group_stage_locked` in `tournament_settings` to generate knockout draw
- Standings auto-recalculate on every result entry (live SQL view)

### Auth Flow
1. Admin visits `/admin` → server checks session → redirects to `/auth/login` if none
2. Admin enters email → Supabase sends magic link
3. Click link → `/auth/callback` exchanges code for session → redirect to `/admin`
   - `callback/` is a Next.js **Route Handler** (`route.ts`), not a page — implemented using `@supabase/ssr`
4. Session stored in cookie (managed by `@supabase/ssr`)
5. Server Actions validate session before any write

---

## Visual Design

- **Theme:** Dark (`#0a0a0f` background, `#13131a` card surfaces)
- **Accents:** Electric blue (`#3b82f6`) primary, gold (`#f59e0b`) for highlights (top 4, top scorer)
- **Typography:** Inter, bold headings
- **Components:** shadcn/ui primitives + custom feature components
- **Layout:** Fixed top navbar (logo + nav links + Admin link), minimal footer
- **Responsive:** Mobile-first, fully responsive

---

## Data Flow

### Public pages
- Server Components fetch from Supabase on the server (anon key)
- HTML rendered server-side, sent to browser
- Live score updates via Supabase Realtime client subscription (matches where `status = 'live'`) — the live score widget must be a `'use client'` Client Component using the Supabase browser client; it is composed inside an otherwise Server Component page

### Admin mutations
- Server Actions validate session, then write to Supabase
- No separate API routes needed
- Standings view auto-updates after each write (live SQL view)

---

## Priorities

| Priority | Features |
|---|---|
| Must have | Points table, fixtures, match results, team pages, admin result entry |
| Should have | Player stats leaderboards, knockout bracket, admin dashboard |
| Nice to have | Countdown timers |
