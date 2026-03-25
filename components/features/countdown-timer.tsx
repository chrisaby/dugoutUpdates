'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

interface Props {
  targetDate: string
}

export function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft === undefined) return null

  if (timeLeft === null) {
    return (
      <p
        className="font-bold text-sm uppercase"
        style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}
      >
        Match Day
      </p>
    )
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div className="flex items-end gap-4">
      {units.map(({ value, label }, i) => (
        <div key={label} className="text-center">
          <div
            className="tabular-nums leading-none"
            style={{
              fontFamily: 'var(--font-display, Bebas Neue)',
              fontSize: '36px',
              color: i === 3 ? 'var(--muted-light)' : 'var(--foreground)',
              letterSpacing: '0.02em',
            }}
          >
            {String(value).padStart(2, '0')}
          </div>
          <div
            className="mt-1 uppercase"
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--muted)',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
