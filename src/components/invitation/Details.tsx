import type { WeddingConfig } from '@/types'

const ChurchIcon = () => (
  <svg viewBox="0 0 48 48" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
    <path d="M24 3v8M21 6h6" />
    <path d="M15 22l9-11 9 11" />
    <path d="M15 22v22h18V22" />
    <path d="M7 44V30l8-6M41 44V30l-8-6" />
    <path d="M20 44v-8a4 4 0 0 1 8 0v8" />
    <circle cx="24" cy="26" r="2.5" />
  </svg>
)

const HaciendaIcon = () => (
  <svg viewBox="0 0 48 48" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 18h42M5 18l4-6h30l4 6" />
    <path d="M6 18v26h36V18" />
    <path d="M11 44V32a4 4 0 0 1 8 0v12M21 44V32a3 3 0 0 1 6 0v12M29 44V32a4 4 0 0 1 8 0v12" />
    <path d="M10 24h4M22 24h4M34 24h4" />
  </svg>
)

interface Place {
  title: string
  icon: React.ReactNode
  name: string | null
  time: string | null
  address: string | null
  maps: string | null
}

export default function Details({ config }: { config: WeddingConfig }) {
  const places: Place[] = [
    { title: 'Ceremonia', icon: <ChurchIcon />, name: config.ceremony_name, time: config.ceremony_time, address: config.ceremony_address, maps: config.ceremony_maps_url },
    { title: 'Recepción', icon: <HaciendaIcon />, name: config.reception_name, time: config.reception_time, address: config.reception_address, maps: config.reception_maps_url },
  ].filter((p) => p.name || p.address)

  if (!places.length) return null

  return (
    <section className="section section--paper" id="detalles">
      <div className="section-inner section-inner--wide">
        <h2 className="section-title">Cuándo y dónde</h2>
        <div className={`venues ${places.length === 2 ? 'venues--two' : ''}`}>
          {places.map((p) => (
            <article className="venue" key={p.title}>
              <div className="venue-medal">{p.icon}</div>
              <h3 className="venue-title">{p.title}</h3>
              <p className="venue-time">{p.time}</p>
              <p className="venue-name">{p.name}</p>
              <p className="venue-address">{p.address}</p>
              <div className="venue-action">
                {p.maps && (
                  <a className="pill pill--auto venue-btn" href={p.maps} target="_blank" rel="noreferrer">
                    Cómo llegar
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
