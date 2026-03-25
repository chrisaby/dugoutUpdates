export function Footer() {
  return (
    <footer
      className="mt-24 py-8 relative"
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Lime accent line */}
      <div
        className="absolute top-0 left-0 w-24 h-px"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-6 h-6 rounded"
            style={{ backgroundColor: 'var(--primary)', color: '#050c05' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display, Bebas Neue)',
                fontSize: '11px',
                lineHeight: 1,
              }}
            >
              FPL
            </span>
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--muted)', letterSpacing: '0.12em' }}
          >
            Federal Premier League
          </span>
        </div>
        <span
          className="text-xs"
          style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}
        >
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
