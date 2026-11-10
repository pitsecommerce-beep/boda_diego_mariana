import { useCallback, useEffect, useRef, useState } from 'react'

export default function Gallery({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = photos.length

  const go = useCallback((n: number) => setIndex((n + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2) return
    const id = setTimeout(() => go(index + 1), 3000)
    return () => clearTimeout(id)
  }, [index, paused, count, go])

  if (!count) return null

  return (
    <section className="section section--paper section--flush" id="galeria">
      <div className="gallery-head">
        <p className="eyebrow">Nuestra historia</p>
        <h2 className="section-title">Momentos</h2>
      </div>
      <div
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true) }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
          touchX.current = null
          setPaused(false)
        }}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {photos.map((src, i) => (
            <div className="carousel-slide" key={src} aria-hidden={i !== index}>
              <img src={src} alt={`Foto ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} draggable={false} />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button type="button" className="carousel-arrow carousel-arrow--prev" onClick={() => go(index - 1)} aria-label="Foto anterior">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className="carousel-arrow carousel-arrow--next" onClick={() => go(index + 1)} aria-label="Foto siguiente">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="carousel-dots">
          {photos.map((src, i) => (
            <button
              type="button"
              key={src}
              className={i === index ? 'is-active' : ''}
              onClick={() => go(i)}
              aria-label={`Ir a la foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
