'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/matches', label: 'Matches' },
  { href: '/admin/fixtures', label: 'Fixtures' },
  { href: '/admin/teams', label: 'Teams' },
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export function AdminNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  return (
    <nav ref={navRef} className="border-b border-[var(--border)]" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <span className="text-[var(--primary)] font-black text-lg">FPL Admin</span>

        {/* Nav links - DESKTOP ONLY */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive(href, pathname)
                  ? 'text-white bg-[var(--surface-hover)]'
                  : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface-hover)]'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded team-card"
            style={{
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              letterSpacing: '0.1em',
              ['--team-color' as string]: 'var(--border-hover)',
            }}
          >
            ← Public site
          </Link>

          {/* Hamburger toggle - MOBILE ONLY */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded transition-colors"
            style={{ color: 'var(--muted)' }}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
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

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          id="admin-mobile-nav"
          className="md:hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 py-2">
            {links.map(({ href, label }) => {
              const active = isActive(href, pathname)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center w-full px-3 py-3 rounded-md text-sm font-medium transition-colors border-l-2',
                    active
                      ? 'text-white bg-[var(--surface-hover)]'
                      : 'text-[var(--muted)] hover:text-white hover:bg-[var(--surface-hover)]'
                  )}
                  style={{ borderLeftColor: active ? 'var(--primary)' : 'transparent' }}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
