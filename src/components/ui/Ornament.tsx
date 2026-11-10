/** Ramita de olivo con línea fina: el adorno recurrente de la invitación. */
export default function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className={`ornament ${light ? 'ornament--light' : ''}`} aria-hidden="true">
      <span className="ornament-line" />
      <svg viewBox="0 0 80 24" width="80" height="24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M4 12h72" opacity=".5" />
        <path d="M40 12c-4-5-9-7-14-6 3 4 8 6 14 6zM40 12c4-5 9-7 14-6-3 4-8 6-14 6z" />
        <path d="M28 12c-3 3-7 4-11 3 2-3 6-4 11-3zM52 12c3 3 7 4 11 3-2-3-6-4-11-3z" />
        <circle cx="40" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="ornament-line" />
    </div>
  )
}
