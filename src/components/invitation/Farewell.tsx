import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function Farewell({ config }: { config: WeddingConfig }) {
  const photo = config.farewell_photo_url || config.cover_photo_url
  return (
    <section className="farewell" id="despedida">
      {photo ? <img className="hero-img" src={photo} alt="" loading="lazy" /> : <div className="hero-img hero-img--empty" />}
      <div className="hero-shade hero-shade--strong" />
      <div className="farewell-content">
        <p className="farewell-text">
          {config.farewell_message || 'Gracias por ser parte de nuestra historia.\nNos hace muy felices celebrar contigo.'}
        </p>
        <Ornament light />
        <p className="farewell-names">
          {config.groom_name} y {config.bride_name}
        </p>
      </div>
    </section>
  )
}
