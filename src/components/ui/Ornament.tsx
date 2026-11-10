/** Separador sobrio: una línea fina con un punto al centro. */
export default function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className={`ornament ${light ? 'ornament--light' : ''}`} aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-dot" />
      <span className="ornament-line" />
    </div>
  )
}
