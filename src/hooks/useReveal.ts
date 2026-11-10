import { useEffect } from 'react'

/** Elementos que se van desbloqueando conforme el invitado avanza. */
const TARGETS = [
  '.section .eyebrow', '.section-title', '.section-text', '.section-phrase', '.section .ornament',
  '.countdown', '.countdown-date', '.countdown-time',
  '.parents-col', '.venue', '.arch-frame', '.carousel', '.carousel-dots',
  '.rsvp-deadline', '.rsvp-card', '.gift-links > *', '.gift-bank',
  '.farewell-content > *',
].join(', ')

export function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return
    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      .filter((el) => !el.parentElement?.closest('.reveal') && !el.classList.contains('is-visible'))
    els.forEach((el) => el.classList.add('reveal'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((e, i) => {
            const el = e.target as HTMLElement
            el.style.transitionDelay = `${Math.min(i, 8) * 140}ms`
            el.classList.add('is-visible')
            io.unobserve(el)
          })
      },
      { threshold: 0.2, rootMargin: '0px 0px -12% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [active])
}
