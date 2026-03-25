'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/matches', label: 'Matches' },
  { href: '/admin/fixtures', label: 'Fixtures' },
  { href: '/admin/teams', label: 'Teams' },
]

export function AdminNavbar() {
  const pathname = usePathname()
  return (
    <nav className="border-b border-[var(--border)]" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <span className="text-[var(--primary)] font-black text-lg">FPL Admin</span>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href
                  ? 'px-3 py-1.5 rounded-md text-sm font-medium text-white bg-[var(--surface-hover)]'
                  : 'px-3 py-1.5 rounded-md text-sm font-medium text-[var(--muted)] hover:text-white hover:bg-[var(--surface-hover)] transition-colors'
              }
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto">
          <Link href="/" className="text-xs text-[var(--muted)] hover:text-white transition-colors">
            ← Public site
          </Link>
        </div>
      </div>
    </nav>
  )
}
