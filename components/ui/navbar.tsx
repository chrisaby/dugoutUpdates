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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]"
      style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[var(--primary)] font-black text-xl tracking-tight">FPL</span>
            <span className="text-[var(--muted)] text-sm hidden sm:block">Federal Premier League</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-[var(--surface-hover)] text-white'
                    : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface-hover)]'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Admin link */}
          <Link
            href="/admin"
            className="text-xs text-[var(--muted)] hover:text-white transition-colors px-3 py-1.5 rounded border border-[var(--border)] hover:border-slate-500"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
