'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/results', label: 'Results' },
  { href: '/teams', label: 'Teams' },
  { href: '/stats', label: 'Stats' },
  { href: '/bracket', label: 'Bracket' },
]

export function Navbar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="flex items-center justify-center w-8 h-8 rounded"
              style={{ backgroundColor: 'var(--primary)', color: '#050c05' }}
            >
              <span
                className="font-display text-lg leading-none"
                style={{ fontFamily: 'var(--font-display, Bebas Neue)', fontSize: '18px', lineHeight: 1 }}
              >
                FPL
              </span>
            </div>
            <span
              className="hidden sm:block text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--muted-light)', letterSpacing: '0.15em' }}
            >
              Federal Premier League
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative px-3 py-4 text-xs font-semibold tracking-widest uppercase transition-colors',
                    active
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  )}
                  style={{ letterSpacing: '0.1em' }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Admin link */}
          <Link
            href="/admin"
            className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded team-card"
            style={{
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              letterSpacing: '0.1em',
              ['--team-color' as string]: 'var(--border-hover)',
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
