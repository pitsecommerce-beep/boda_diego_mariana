import { useState } from 'react'
import type { GuestDraft, Side } from '@/types'

export const emptyDraft = (): GuestDraft => ({ name: '', phone: '', seats: 1, side: null, group_name: '', notes: '' })

interface Props {
  title: string
  initial: GuestDraft[]
  saving: boolean
  onCancel: () => void
  onSave: (rows: GuestDraft[]) => void
}

/** Tabla editable para revisar y corregir invitados antes de guardarlos. */
export default function DraftEditor({ title, initial, saving, onCancel, onSave }: Props) {
  const [rows, setRows] = useState<GuestDraft[]>(initial)
  const valid = rows.filter((r) => r.name.trim())
  const seats = valid.reduce((a, r) => a + r.seats, 0)

  const set = (i: number, patch: Partial<GuestDraft>) =>
    setRows((prev) => prev.map((r, k) => (k === i ? { ...r, ...patch } : r)))

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-box modal-box--wide">
        <div className="modal-head">
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>{title}</h2>
            <p className="muted small">{valid.length} invitaciones · {seats} pases. Puedes editar cualquier celda antes de guardar.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Cerrar">✕</button>
        </div>

        <div className="table-wrap">
          <table className="table table--edit">
            <thead>
              <tr>
                <th>#</th><th>Nombre</th><th>Celular</th><th>Pases</th><th>Invitado de</th><th>Grupo</th><th>Notas</th><th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={r.name.trim() ? '' : 'row-invalid'}>
                  <td className="muted">{i + 1}</td>
                  <td><input value={r.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="Nombre o familia" /></td>
                  <td><input value={r.phone} onChange={(e) => set(i, { phone: e.target.value })} inputMode="tel" /></td>
                  <td><input type="number" min={1} value={r.seats} onChange={(e) => set(i, { seats: Math.max(1, Number(e.target.value) || 1) })} className="num" /></td>
                  <td>
                    <select value={r.side ?? ''} onChange={(e) => set(i, { side: (e.target.value || null) as Side | null })}>
                      <option value="">—</option><option value="novia">Novia</option><option value="novio">Novio</option><option value="ambos">Ambos</option>
                    </select>
                  </td>
                  <td><input value={r.group_name} onChange={(e) => set(i, { group_name: e.target.value })} /></td>
                  <td><input value={r.notes} onChange={(e) => set(i, { notes: e.target.value })} /></td>
                  <td><button type="button" className="icon-btn" onClick={() => setRows(rows.filter((_, k) => k !== i))} aria-label="Quitar fila">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn--ghost" onClick={() => setRows([...rows, emptyDraft()])}>+ Agregar fila</button>
          <div className="row-gap">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
            <button type="button" className="btn btn--primary" disabled={saving || !valid.length} onClick={() => onSave(valid)}>
              {saving ? 'Guardando…' : `Guardar ${valid.length} invitaciones`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
