import { describe, it, expect, vi, afterEach } from 'vitest'

import { getTimeLeft } from './countdown-timer'

describe('getTimeLeft', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null for a past date', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-10T12:00:00Z').getTime())
    expect(getTimeLeft('2026-01-09T12:00:00Z')).toBeNull()
  })

  it('returns null for the current moment', () => {
    const now = new Date('2026-01-10T12:00:00Z').getTime()
    vi.spyOn(Date, 'now').mockReturnValue(now)
    expect(getTimeLeft('2026-01-10T12:00:00Z')).toBeNull()
  })

  it('returns correct days/hours/minutes/seconds for a future date', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-10T12:00:00Z').getTime())
    const result = getTimeLeft('2026-01-11T13:30:45Z')
    expect(result).not.toBeNull()
    expect(result!.days).toBe(1)
    expect(result!.hours).toBe(1)
    expect(result!.minutes).toBe(30)
    expect(result!.seconds).toBe(45)
  })
})
