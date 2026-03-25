-- Allow 'third_place' as a valid phase for the 3rd place / loser final match
ALTER TABLE matches DROP CONSTRAINT matches_phase_check;
ALTER TABLE matches ADD CONSTRAINT matches_phase_check
  CHECK (phase IN ('group', 'semi', 'final', 'third_place'));
