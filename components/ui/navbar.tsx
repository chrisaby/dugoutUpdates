'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      ref={headerRef}
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

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            {/* Admin link - always visible */}
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

            {/* Hamburger toggle - MOBILE ONLY */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded transition-colors"
              style={{ color: 'var(--muted)' }}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <line x1="3" y1="3" x2="17" y2="17" />
                  <line x1="17" y1="3" x2="3" y2="17" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <line x1="3" y1="5" x2="17" y2="5" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="15" x2="17" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center w-full px-3 py-3 text-xs font-semibold tracking-widest uppercase transition-colors border-l-2',
                    active
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                  )}
                  style={{
                    letterSpacing: '0.1em',
                    borderLeftColor: active ? 'var(--primary)' : 'transparent',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
