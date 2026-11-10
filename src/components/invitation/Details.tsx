import type { WeddingConfig } from '@/types'
import { formatLongDate } from '@/lib/time'

const ChurchIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
    <path d="M24 3v8M21 6h6" />
    <path d="M15 22l9-11 9 11" />
    <path d="M15 22v22h18V22" />
    <path d="M7 44V30l8-6M41 44V30l-8-6" />
    <path d="M20 44v-8a4 4 0 0 1 8 0v8" />
    <circle cx="24" cy="26" r="2.5" />
  </svg>
)

const HaciendaIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
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
    { title: 'Ceremonia religiosa', icon: <ChurchIcon />, name: config.ceremony_name, time: config.ceremony_time, address: config.ceremony_address, maps: config.ceremony_maps_url },
    { title: 'Recepción', icon: <HaciendaIcon />, name: config.reception_name, time: config.reception_time, address: config.reception_address, maps: config.reception_maps_url },
  ].filter((p) => p.name || p.address)

  if (!places.length) return null

  return (
    <section className="section section--paper" id="detalles">
      <div className="section-inner section-inner--wide">
        <div className="reveal">
          <p className="eyebrow">El gran día</p>
          <h2 className="section-title">Detalles</h2>
          {config.wedding_date && <p className="section-sub">{formatLongDate(config.wedding_date)}</p>}
        </div>
        <div className="places">
          {places.map((p) => (
            <article className="place reveal" key={p.title}>
              <div className="place-icon">{p.icon}</div>
              <p className="eyebrow">{p.title}</p>
              {p.name && <h3 className="place-name">{p.name}</h3>}
              {p.time && <p className="place-time">{p.time}</p>}
              {p.address && <p className="place-address">{p.address}</p>}
              {p.maps && (
                <a className="pill pill--auto place-btn" href={p.maps} target="_blank" rel="noreferrer">
                  Ver ubicación
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
