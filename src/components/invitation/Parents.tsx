import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function Parents({ config }: { config: WeddingConfig }) {
  // Primero la mamá y después el papá
  const groom = [config.groom_mother, config.groom_father].filter(Boolean) as string[]
  const bride = [config.bride_mother, config.bride_father].filter(Boolean) as string[]
  if (!bride.length && !groom.length) return null

  const sides = [
    { label: 'Padres del novio', names: groom },
    { label: 'Padres de la novia', names: bride },
  ].filter((s) => s.names.length)

  return (
    <section className="section section--cream" id="padres">
      <div className="section-inner section-inner--parents">
        <p className="section-phrase">{config.parents_phrase}</p>
        <Ornament />
        <div className={`parents ${sides.length === 2 ? 'parents--two' : ''}`}>
          {sides.map((s) => (
            <div className="parents-col" key={s.label}>
              <p className="eyebrow">{s.label}</p>
              {/* Siempre los mismos renglones para que ambas columnas queden a la misma altura */}
              <p className="parents-name">{s.names[0]}</p>
              <p className="parents-and">{s.names.length > 1 ? 'y' : '\u00a0'}</p>
              <p className="parents-name">{s.names[1] ?? '\u00a0'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
