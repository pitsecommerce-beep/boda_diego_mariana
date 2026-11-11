import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Desplazamiento suave y pausado para la invitación: la rueda y el dedo
 * mueven la página con más calma y la inercia se apaga poco a poco.
 */
let lenis: Lenis | null = null
let frame = 0

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({
    lerp: 0.06,
    wheelMultiplier: 0.75,
    syncTouch: true,
    syncTouchLerp: 0.05,
    touchInertiaExponent: 1.5,
    anchors: { duration: 2.4 },
  })
  const raf = (t: number) => {
    lenis?.raf(t)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)
}

export function stopSmoothScroll() {
  cancelAnimationFrame(frame)
  lenis?.destroy()
  lenis = null
}

/** Congela el desplazamiento mientras hay algo encima (por ejemplo, una foto ampliada). */
export function pauseSmoothScroll(paused: boolean) {
  if (paused) lenis?.stop()
  else lenis?.start()
}
