import { signInWithEmail } from '@/lib/actions/auth-actions'

interface Props {
  searchParams: Promise<{ sent?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { sent } = await searchParams

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
          <p className="text-[var(--muted)]">
            A magic link has been sent. Click it to access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-[var(--primary)] font-black text-3xl">FPL</span>
          <h1 className="text-xl font-bold text-white mt-2">Admin Login</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Enter your email to receive a magic link</p>
        </div>

        <form action={signInWithEmail} className="space-y-4">
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
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Send magic link
          </button>
        </form>
      </div>
    </div>
  )
}
