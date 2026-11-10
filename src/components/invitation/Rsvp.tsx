import { useState } from 'react'
import type { PublicGuest, RsvpStatus, WeddingConfig } from '@/types'
import { submitRsvp } from '@/lib/supabase'
import Ornament from '@/components/ui/Ornament'

type Answer = Exclude<RsvpStatus, 'pendiente'>

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'si', label: 'Ahí estaré' },
  { value: 'no', label: 'No podré asistir' },
  { value: 'quizas', label: 'No puedo confirmar aún' },
]

const THANKS: Record<Answer, string> = {
  si: '¡Gracias! Nos hace muy felices que nos acompañes.',
  no: 'Gracias por avisarnos. Te tendremos presente ese día.',
  quizas: 'Sin problema. Puedes volver a este enlace para confirmar más adelante.',
}

interface Props {
  config: WeddingConfig
  guest: PublicGuest | null
  slug?: string
}

export default function Rsvp({ config, guest, slug }: Props) {
  const initial = guest && guest.rsvp_status !== 'pendiente' ? guest.rsvp_status : null
  const [choice, setChoice] = useState<Answer | null>(initial)
  const [count, setCount] = useState(guest?.attending_count || guest?.seats || 1)
  const [message, setMessage] = useState(guest?.rsvp_message ?? '')
  const [saved, setSaved] = useState<Answer | null>(initial)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async () => {
    if (!slug || !choice) return
    setSending(true)
    setError(null)
    try {
      await submitRsvp(slug, choice, count, message)
      setSaved(choice)
    } catch {
      setError('No pudimos guardar tu respuesta. Inténtalo de nuevo, por favor.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section section--cream" id="confirmacion">
      <div className="section-inner reveal">
        <p className="eyebrow">Confirma tu asistencia</p>
        <h2 className="section-title">¿Nos acompañas?</h2>
        <Ornament />
        {config.rsvp_message && <p className="section-text">{config.rsvp_message}</p>}
        {config.rsvp_deadline && (
          <p className="rsvp-deadline">Agradecemos tu respuesta antes del {config.rsvp_deadline}</p>
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
              Hemos reservado <strong>{guest.seats}</strong> {guest.seats === 1 ? 'lugar' : 'lugares'} en tu honor
            </p>

            <div className="rsvp-options">
              {OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  className={`pill ${choice === o.value ? 'pill--solid' : ''}`}
                  onClick={() => { setChoice(o.value); setSaved(null) }}
                  aria-pressed={choice === o.value}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {choice && saved !== choice && (
              <div className="rsvp-extra">
                {choice === 'si' && guest.seats > 1 && (
                  <label className="rsvp-field">
                    <span>¿Cuántas personas asistirán?</span>
                    <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                      {Array.from({ length: guest.seats }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="rsvp-field">
                  <span>Un mensaje para los novios (opcional)</span>
                  <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
                </label>
                <button type="button" className="pill pill--solid" disabled={sending} onClick={() => void send()}>
                  {sending ? 'Enviando…' : 'Enviar respuesta'}
                </button>
              </div>
            )}

            {saved && saved === choice && <p className="rsvp-thanks">{THANKS[saved]}</p>}
            {error && <p className="rsvp-error">{error}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
