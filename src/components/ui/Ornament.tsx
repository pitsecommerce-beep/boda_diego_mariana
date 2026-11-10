/** Ramita de olivo de trazo fino, como dibujada a mano con pluma. */
export default function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className={`ornament ${light ? 'ornament--light' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 120 34" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22c18-4 40-6 62-4 16 1.4 30 4.6 46 2.4" />
        <path d="M22 19.6c-1.5-5.5 2-9.6 7.2-10.4-.4 5.6-3 9-7.2 10.4z" />
        <path d="M30 18.6c4.6 3.6 10 3.4 13.6.2-4.6-3.2-9.6-3.2-13.6-.2z" />
        <path d="M44 17.8c-.4-6 3.8-9.6 9.2-9.4-1.2 5.4-4.4 8.6-9.2 9.4z" />
        <path d="M54 17.8c4 4.2 9.4 4.8 13.4 2.2-4-3.8-9-4.6-13.4-2.2z" />
        <path d="M68 18.2c.6-5.8 5-8.6 10.2-7.8-1.8 5-5.4 7.6-10.2 7.8z" />
        <path d="M80 19.4c3.6 3.8 8.4 4.4 12 2.2-3.6-3.4-8-4.2-12-2.2z" />
        <circle cx="96.5" cy="15.6" r="2.1" />
      </svg>
    </div>
  )
}
