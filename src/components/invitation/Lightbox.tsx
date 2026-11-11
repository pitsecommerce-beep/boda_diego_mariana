import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { pauseSmoothScroll } from '@/lib/smoothScroll'

interface Props {
  src: string
  origin: HTMLImageElement
  onClose: () => void
}

const EASE = 'cubic-bezier(0.3, 0.7, 0.2, 1)'

/** Amplía una foto desde su lugar (efecto zoom). Cualquier toque la regresa. */
export default function Lightbox({ src, origin, onClose }: Props) {
  const img = useRef<HTMLImageElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  // Transformación que lleva la foto ampliada al tamaño y lugar de la original
  const fromOrigin = () => {
    const a = origin.getBoundingClientRect()
    const b = img.current!.getBoundingClientRect()
    const scale = a.width / b.width
    const dx = a.left + a.width / 2 - (b.left + b.width / 2)
    const dy = a.top + a.height / 2 - (b.top + b.height / 2)
    return `translate(${dx}px, ${dy}px) scale(${scale})`
  }

  useLayoutEffect(() => {
    origin.style.visibility = 'hidden'
    img.current!.animate([{ transform: fromOrigin() }, { transform: 'none' }], { duration: 480, easing: EASE })
    backdrop.current!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease' })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll(true)
    return () => {
      pauseSmoothScroll(false)
      origin.style.visibility = ''
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (closing) return
    setClosing(true)
    backdrop.current!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease', fill: 'forwards' })
    img.current!
      .animate([{ transform: 'none' }, { transform: fromOrigin() }], { duration: 420, easing: EASE, fill: 'forwards' })
      .finished.then(onClose)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return createPortal(
    <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Foto ampliada. Toca para cerrar.">
      <div ref={backdrop} className="lightbox-backdrop" />
      <img ref={img} className="lightbox-img" src={src} alt="" />
    </div>,
    document.body,
  )
}
