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

  if (timeLeft === undefined) return null  // SSR / before first tick — render nothing

  if (timeLeft === null) {
    return <p className="text-[var(--primary)] font-semibold text-sm">Match day! 🏆</p>
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div className="flex items-end gap-3">
      {units.map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="text-3xl font-black text-white tabular-nums leading-none">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-[var(--muted)] uppercase tracking-wide mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
