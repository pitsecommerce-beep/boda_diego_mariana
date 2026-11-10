import { useState } from 'react'
import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'
import Lightbox from './Lightbox'

export default function DressCode({ config }: { config: WeddingConfig }) {
  const photos = config.dress_code_photos ?? []
  const [zoom, setZoom] = useState<{ src: string; el: HTMLImageElement } | null>(null)
  if (!config.dress_code_title && !config.dress_code_text && !photos.length) return null

  return (
    <section className="section section--sand" id="etiqueta">
      <div className="section-inner section-inner--wide">
        <div>
          <p className="eyebrow">Código de vestimenta</p>
          <h2 className="section-title">{config.dress_code_title || 'Etiqueta'}</h2>
          <Ornament />
          {config.dress_code_text && <p className="section-text">{config.dress_code_text}</p>}
        </div>
        {photos.length > 0 && (
          <div className={`dress-grid dress-grid--${Math.min(photos.length, 4)}`}>
            {photos.map((src) => (
              <figure className="arch-frame" key={src}>
                <img
                  src={src}
                  alt="Inspiración de vestimenta"
                  loading="lazy"
                  onClick={(e) => setZoom({ src, el: e.currentTarget })}
                />
              </figure>
            ))}
          </div>
        )}
      </div>
      {zoom && <Lightbox src={zoom.src} origin={zoom.el} onClose={() => setZoom(null)} />}
    </section>
  )
}
