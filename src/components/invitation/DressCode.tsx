import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function DressCode({ config }: { config: WeddingConfig }) {
  const photos = config.dress_code_photos ?? []
  if (!config.dress_code_title && !config.dress_code_text && !photos.length) return null

  return (
    <section className="section section--sand" id="etiqueta">
      <div className="section-inner section-inner--wide">
        <div className="reveal">
          <p className="eyebrow">Código de vestimenta</p>
          <h2 className="section-title">{config.dress_code_title || 'Etiqueta'}</h2>
          <Ornament />
          {config.dress_code_text && <p className="section-text">{config.dress_code_text}</p>}
        </div>
        {photos.length > 0 && (
          <div className={`dress-grid dress-grid--${Math.min(photos.length, 4)}`}>
            {photos.map((src, i) => (
              <figure className="arch-frame reveal" key={src} style={{ transitionDelay: `${i * 120}ms` }}>
                <img src={src} alt="Inspiración de vestimenta" loading="lazy" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
