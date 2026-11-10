import { useEffect, useState } from 'react'
import type { Guest, RsvpStatus, Side } from '@/types'
import { invitationLink, STATUS_LABEL } from '@/lib/labels'

interface Props {
  guest: Guest
  selected: boolean
  onSelect: (v: boolean) => void
  onUpdate: (patch: Partial<Guest>) => void
  onDelete: () => void
  whatsappText: (g: Guest) => string
}

/** Input que guarda al salir del campo sólo si cambió. */
function Cell({ value, onSave, type = 'text', className }: { value: string; onSave: (v: string) => void; type?: string; className?: string }) {
  const [v, setV] = useState(value)
  useEffect(() => setV(value), [value])
  return (
    <input
      type={type}
      min={type === 'number' ? 1 : undefined}
      className={className}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { if (v !== value) onSave(v) }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
    />
  )
}

export default function GuestRow({ guest: g, selected, onSelect, onUpdate, onDelete, whatsappText }: Props) {
  const [copied, setCopied] = useState(false)
  const link = invitationLink(g.slug)

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const phone = (g.phone ?? '').replace(/\D/g, '')
  const waPhone = phone.length === 10 ? `52${phone}` : phone
  const wa = `https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappText(g))}`

  return (
    <tr className={selected ? 'is-selected' : ''}>
      <td><input type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked)} aria-label={`Seleccionar ${g.name}`} /></td>
      <td><Cell value={g.name} onSave={(v) => v.trim() && onUpdate({ name: v.trim() })} className="wide" /></td>
      <td><Cell value={g.phone ?? ''} onSave={(v) => onUpdate({ phone: v.trim() || null })} /></td>
      <td><Cell type="number" className="num" value={String(g.seats)} onSave={(v) => onUpdate({ seats: Math.max(1, Number(v) || 1) })} /></td>
      <td>
        <select value={g.side ?? ''} onChange={(e) => onUpdate({ side: (e.target.value || null) as Side | null })}>
          <option value="">—</option><option value="novia">Novia</option><option value="novio">Novio</option><option value="ambos">Ambos</option>
        </select>
      </td>
      <td><Cell value={g.group_name ?? ''} onSave={(v) => onUpdate({ group_name: v.trim() || null })} /></td>
      <td>
        <select
          className={`status status--${g.rsvp_status}`}
          value={g.rsvp_status}
          onChange={(e) => {
            const s = e.target.value as RsvpStatus
            onUpdate({
              rsvp_status: s,
              attending_count: s === 'si' ? g.attending_count || g.seats : 0,
              responded_at: s === 'pendiente' ? null : new Date().toISOString(),
            })
          }}
        >
          {(Object.keys(STATUS_LABEL) as RsvpStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </td>
      <td>
        {g.rsvp_status === 'si' ? (
          <Cell type="number" className="num" value={String(g.attending_count)} onSave={(v) => onUpdate({ attending_count: Math.min(g.seats, Math.max(1, Number(v) || 1)) })} />
        ) : <span className="muted">—</span>}
      </td>
      <td className="center">
        <input type="checkbox" checked={g.invitation_sent} onChange={(e) => onUpdate({ invitation_sent: e.target.checked })} aria-label="Invitación enviada" />
      </td>
      <td><Cell value={g.notes ?? ''} onSave={(v) => onUpdate({ notes: v.trim() || null })} /></td>
      <td className="msg-cell" title={g.rsvp_message ?? ''}>{g.rsvp_message ?? <span className="muted">—</span>}</td>
      <td>
        <div className="row-actions">
          <button type="button" className="btn btn--tiny" onClick={() => void copy()}>{copied ? 'Copiado' : 'Copiar enlace'}</button>
          <a
            className="btn btn--tiny btn--wa"
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={() => { if (!g.invitation_sent) onUpdate({ invitation_sent: true }) }}
          >
            WhatsApp
          </a>
          <a className="btn btn--tiny" href={link} target="_blank" rel="noreferrer">Ver</a>
          <button type="button" className="icon-btn" onClick={onDelete} aria-label={`Eliminar ${g.name}`}>✕</button>
        </div>
      </td>
    </tr>
  )
}
