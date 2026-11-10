import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function Parents({ config }: { config: WeddingConfig }) {
  const bride = [config.bride_father, config.bride_mother].filter(Boolean) as string[]
  const groom = [config.groom_father, config.groom_mother].filter(Boolean) as string[]
  if (!bride.length && !groom.length) return null

  return (
    <section className="section section--cream" id="padres">
      <div className="section-inner reveal">
        <p className="section-phrase">{config.parents_phrase}</p>
        <Ornament />
        <div className="parents">
          {groom.length > 0 && (
            <div className="parents-col">
              <p className="eyebrow">Padres del novio</p>
              {groom.map((n) => <p className="parents-name" key={n}>{n}</p>)}
            </div>
          )}
          {bride.length > 0 && groom.length > 0 && <span className="parents-divider" aria-hidden="true" />}
          {bride.length > 0 && (
            <div className="parents-col">
              <p className="eyebrow">Padres de la novia</p>
              {bride.map((n) => <p className="parents-name" key={n}>{n}</p>)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
