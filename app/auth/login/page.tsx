import Link from 'next/link'
import { signInWithPassword } from '@/lib/actions/auth-actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="fixed top-4 left-4">
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
      </div>
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-[var(--primary)] font-black text-3xl">FPL</span>
          <h1 className="text-xl font-bold text-white mt-2">Admin Login</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Enter your email and password</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800/60 px-4 py-3 mb-4"
            style={{ backgroundColor: 'rgba(239,68,68,0.07)' }}>
            <p className="text-red-400 text-sm">
              {error === 'invalid_credentials'
                ? 'Invalid email or password. Please try again.'
                : 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        <form action={signInWithPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--muted)] mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              style={{ backgroundColor: 'var(--surface)' }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--muted)] mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              style={{ backgroundColor: 'var(--surface)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
