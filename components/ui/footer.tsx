export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16 py-8" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--muted)]">
        Federal Premier League · {new Date().getFullYear()}
      </div>
    </footer>
  )
}
