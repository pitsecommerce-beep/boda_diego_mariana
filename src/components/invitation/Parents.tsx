import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function Parents({ config }: { config: WeddingConfig }) {
  const groom = [config.groom_father, config.groom_mother].filter(Boolean) as string[]
  const bride = [config.bride_father, config.bride_mother].filter(Boolean) as string[]
  if (!bride.length && !groom.length) return null

  const sides = [
    { label: 'Padres del novio', names: groom },
    { label: 'Padres de la novia', names: bride },
  ].filter((s) => s.names.length)

  return (
    <section className="section section--cream" id="padres">
      <div className="section-inner section-inner--parents reveal">
        <p className="section-phrase">{config.parents_phrase}</p>
        <Ornament />
        <div className={`parents ${sides.length === 2 ? 'parents--two' : ''}`}>
          {sides.map((s) => (
            <div className="parents-col" key={s.label}>
              <p className="eyebrow">{s.label}</p>
              {/* Siempre dos renglones para que ambas columnas queden a la misma altura */}
              {[0, 1].map((i) => (
                <p className="parents-name" key={i}>{s.names[i] ?? ' '}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
