import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ src, start }: { src: string | null; start: boolean }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = audio.current
    if (!el || !start) return
    el.volume = 0.55
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [start, src])

  if (!src) return null

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play().then(() => setPlaying(true))
    else { el.pause(); setPlaying(false) }
  }

  return (
    <>
      <audio ref={audio} src={src} loop preload="auto" />
      {start && (
        <button
          type="button"
          className={`music-btn ${playing ? 'is-playing' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        >
          {playing ? (
            <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      )}
    </>
  )
}
