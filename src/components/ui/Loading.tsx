export default function Loading({ label = 'Cargando' }: { label?: string }) {
  return (
    <div className="loading">
      <div className="loading-arch" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
