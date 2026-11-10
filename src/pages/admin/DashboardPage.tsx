import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listGuests, supabaseConfigured } from '@/lib/supabase'
import { useConfig } from '@/hooks/useConfig'
import { formatLongDate } from '@/lib/time'
import { STATUS_LABEL } from '@/lib/labels'
import type { Guest } from '@/types'

export default function DashboardPage() {
  const { config } = useConfig()
  const [guests, setGuests] = useState<Guest[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseConfigured) { setGuests([]); return }
    listGuests().then(setGuests).catch((e: Error) => { setError(e.message); setGuests([]) })
  }, [])

  if (!guests) return <p className="muted">Cargando…</p>

  const sum = (list: Guest[], f: (g: Guest) => number) => list.reduce((a, g) => a + f(g), 0)
  const by = (s: Guest['rsvp_status']) => guests.filter((g) => g.rsvp_status === s)
  const totalSeats = sum(guests, (g) => g.seats)
  const yes = by('si')
  const confirmedPeople = sum(yes, (g) => g.attending_count)
  const pendingSeats = sum(by('pendiente'), (g) => g.seats) + sum(by('quizas'), (g) => g.seats)
  const sent = guests.filter((g) => g.invitation_sent).length
  const progress = totalSeats ? Math.round((confirmedPeople / totalSeats) * 100) : 0

  const days = config?.wedding_date
    ? Math.floor((new Date(config.wedding_date).getTime() - Date.now()) / 86_400_000)
    : null

  const recent = guests
    .filter((g) => g.responded_at)
    .sort((a, b) => (b.responded_at ?? '').localeCompare(a.responded_at ?? ''))
    .slice(0, 8)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Resumen</h1>
          {config?.wedding_date ? (
            <p className="muted cap">{formatLongDate(config.wedding_date)}{days !== null && days > 0 ? ` · faltan ${days} días` : ''}</p>
          ) : (
            <p className="muted">Define la fecha en <Link to="/admin/contenido">Contenido</Link>.</p>
          )}
        </div>
      </div>
      {error && <div className="notice notice--error">{error}</div>}

      <div className="stats">
        <Stat label="Invitaciones" value={guests.length} sub={`${sent} enviadas`} />
        <Stat label="Pases totales" value={totalSeats} sub="personas invitadas" />
        <Stat label="Confirmados" value={confirmedPeople} sub={`${yes.length} invitaciones`} accent="olive" />
        <Stat label="No asistirán" value={by('no').length} sub="invitaciones" accent="terracotta" />
        <Stat label="Por confirmar" value={by('quizas').length} sub="aún no deciden" />
        <Stat label="Sin respuesta" value={by('pendiente').length} sub={`${pendingSeats} pases en espera`} />
      </div>

      <div className="card">
        <div className="progress-head">
          <span>Personas confirmadas</span>
          <strong>{confirmedPeople} de {totalSeats} · {progress}%</strong>
        </div>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="card">
        <h2 className="card-title">Respuestas recientes</h2>
        {recent.length === 0 ? (
          <p className="muted">Todavía no hay respuestas.</p>
        ) : (
          <ul className="recent">
            {recent.map((g) => (
              <li key={g.id}>
                <div>
                  <strong>{g.name}</strong>
                </div>
                <span className={`badge badge--${g.rsvp_status}`}>
                  {STATUS_LABEL[g.rsvp_status]}{g.rsvp_status === 'si' ? ` · ${g.attending_count}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, sub, accent }: { label: string; value: number; sub: string; accent?: 'olive' | 'terracotta' }) {
  return (
    <div className={`stat ${accent ? `stat--${accent}` : ''}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-sub">{sub}</p>
    </div>
  )
}
