import { useState } from 'react'
import type { PublicGuest, WeddingConfig } from '@/types'
import { submitRsvp } from '@/lib/supabase'

type Answer = 'si' | 'no'

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'si', label: 'Ahí estaré' },
  { value: 'no', label: 'No podré asistir' },
]

const THANKS: Record<Answer, string> = {
  si: 'Qué alegría. Te esperamos con mucho cariño.',
  no: 'Gracias por avisarnos. Te vamos a extrañar.',
}

interface Props {
  config: WeddingConfig
  guest: PublicGuest | null
  slug?: string
}

export default function Rsvp({ config, guest, slug }: Props) {
  const initial: Answer | null = guest?.rsvp_status === 'si' || guest?.rsvp_status === 'no' ? guest.rsvp_status : null
  const [choice, setChoice] = useState<Answer | null>(initial)
  const [count, setCount] = useState(guest?.attending_count || guest?.seats || 1)
  const [saved, setSaved] = useState<Answer | null>(initial)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async (answer: Answer, people = count) => {
    if (!slug) return
    setSending(true)
    setError(null)
    try {
      await submitRsvp(slug, answer, people, '')
      setSaved(answer)
    } catch {
      setError('No pudimos guardar tu respuesta. Inténtalo de nuevo, por favor.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section" id="confirmacion">
      <div className="section-inner">
        <h2 className="section-title">¿Nos acompañas?</h2>
        {config.rsvp_message && <p className="section-text">{config.rsvp_message}</p>}
        {config.rsvp_deadline && (
          <p className="rsvp-deadline">Nos ayudas mucho si nos confirmas antes del {config.rsvp_deadline}</p>
        )}

        {!guest ? (
          <div className="rsvp-card">
            <p className="section-text" style={{ margin: 0 }}>
              Para confirmar, abre el enlace personal que te enviamos.
            </p>
          </div>
        ) : (
          <div className="rsvp-card">
            <p className="rsvp-guest">{guest.name}</p>
            <p className="rsvp-seats">
              Apartamos <strong>{guest.seats}</strong> {guest.seats === 1 ? 'lugar' : 'lugares'} para ti
            </p>

            <div className="rsvp-options">
              {OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  className={`pill ${choice === o.value ? 'pill--solid' : ''}`}
                  onClick={() => {
                    setChoice(o.value)
                    if (o.value === saved) return
                    setSaved(null)
                    if (o.value === 'no' || guest.seats === 1) void send(o.value, 1)
                  }}
                  disabled={sending}
                  aria-pressed={choice === o.value}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {choice === 'si' && saved !== 'si' && guest.seats > 1 && (
              <div className="rsvp-extra">
                <label className="rsvp-field">
                  <span>¿Cuántas personas asistirán?</span>
                  <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                    {Array.from({ length: guest.seats }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                </label>
                <button type="button" className="pill pill--solid" disabled={sending} onClick={() => void send('si')}>
                  {sending ? 'Enviando…' : 'Confirmar asistencia'}
                </button>
              </div>
            )}

            {saved && saved === choice && (
              <div className="rsvp-thanks">
                <p>{THANKS[saved]}</p>
                <p className="rsvp-sign">{config.groom_name} y {config.bride_name}</p>
              </div>
            )}
            {error && <p className="rsvp-error">{error}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
