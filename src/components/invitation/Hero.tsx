import type { WeddingConfig } from '@/types'
import { formatPrettyDate } from '@/lib/time'

export default function Hero({ config }: { config: WeddingConfig }) {
  return (
    <section className="hero" id="inicio">
      {config.cover_photo_url ? (
        <img className="hero-img" src={config.cover_photo_url} alt="" />
      ) : (
        <div className="hero-img hero-img--empty" />
      )}
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="hero-phrase">{config.hero_phrase || 'Nos casamos'}</p>
        <h1 className="hero-names">
          <span>{config.groom_name}</span>
          <span className="amp">&amp;</span>
          <span>{config.bride_name}</span>
        </h1>
        {config.wedding_date && <p className="hero-date">{formatPrettyDate(config.wedding_date)}</p>}
      </div>
      <a href="#cuenta" className="hero-scroll" aria-label="Seguir bajando">
        <span />
      </a>
    </section>
  )
}
