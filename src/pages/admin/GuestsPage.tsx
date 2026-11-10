import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deleteGuests, insertGuests, listGuests, supabaseConfigured, updateGuest } from '@/lib/supabase'
import { downloadTemplate, exportGuests, readGuestFile } from '@/lib/excel'
import { invitationLink, STATUS_LABEL } from '@/lib/labels'
import { useConfig } from '@/hooks/useConfig'
import type { Guest, GuestDraft, RsvpStatus, Side } from '@/types'
import DraftEditor, { emptyDraft } from '@/components/admin/DraftEditor'
import GuestRow from '@/components/admin/GuestRow'

export default function GuestsPage() {
  const { config } = useConfig()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<RsvpStatus | ''>('')
  const [side, setSide] = useState<Side | ''>('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [drafts, setDrafts] = useState<{ title: string; rows: GuestDraft[] } | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (!supabaseConfigured) { setLoading(false); return }
    try {
      setGuests(await listGuests())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return guests.filter((g) =>
      (!q || g.name.toLowerCase().includes(q) || (g.phone ?? '').includes(q) || (g.group_name ?? '').toLowerCase().includes(q)) &&
      (!status || g.rsvp_status === status) &&
      (!side || g.side === side),
    )
  }, [guests, query, status, side])

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    try {
      const rows = await readGuestFile(file)
      if (!rows.length) { setError('No encontramos invitados en el archivo. Revisa que tenga una columna "nombre".'); return }
      setDrafts({ title: `Importar “${file.name}”`, rows })
    } catch {
      setError('No se pudo leer el archivo. Usa un Excel (.xlsx, .xls) o CSV.')
    }
  }

  const saveDrafts = async (rows: GuestDraft[]) => {
    setSaving(true)
    try {
      await insertGuests(rows, guests.map((g) => g.slug))
      setDrafts(null)
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const update = async (id: string, patch: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
    try {
      await updateGuest(id, patch)
    } catch (e) {
      setError((e as Error).message)
      void load()
    }
  }

  const remove = async (ids: string[]) => {
    if (!ids.length) return
    const msg = ids.length === 1 ? '¿Eliminar esta invitación?' : `¿Eliminar ${ids.length} invitaciones?`
    if (!confirm(msg)) return
    try {
      await deleteGuests(ids)
      setGuests((prev) => prev.filter((g) => !ids.includes(g.id)))
      setSelected(new Set())
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const whatsappText = (g: Guest) =>
    `Hola ${g.name}, con mucho cariño te compartimos la invitación a la boda de ${config?.groom_name ?? ''} y ${config?.bride_name ?? ''}. ` +
    `Por favor confirma tu asistencia aquí: ${invitationLink(g.slug)}`

  const allSelected = filtered.length > 0 && filtered.every((g) => selected.has(g.id))
  const totalSeats = filtered.reduce((a, g) => a + g.seats, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Invitados</h1>
          <p className="muted">{guests.length} invitaciones · {guests.reduce((a, g) => a + g.seats, 0)} pases</p>
        </div>
        <div className="row-gap wrap">
          <button type="button" className="btn btn--ghost" onClick={downloadTemplate}>Descargar plantilla</button>
          <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>Importar Excel</button>
          <button type="button" className="btn btn--ghost" disabled={!guests.length} onClick={() => exportGuests(filtered, (g) => invitationLink(g.slug))}>Exportar Excel</button>
          <button type="button" className="btn btn--primary" onClick={() => setDrafts({ title: 'Nuevos invitados', rows: [emptyDraft()] })}>+ Agregar</button>
          <input ref={fileInput} type="file" accept=".xlsx,.xls,.csv" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
        </div>
      </div>

      <p className="hint">
        Columnas del Excel: <b>nombre</b>, celular, pases, invitado_de (novia / novio / ambos), grupo, notas.
        Cada fila es una invitación; “pases” es el número de personas que incluye. Al importar podrás revisar y editar todo antes de guardar.
      </p>

      {error && <div className="notice notice--error" onClick={() => setError(null)}>{error}</div>}

      <div className="filters">
        <input className="search" placeholder="Buscar por nombre, celular o grupo" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value as RsvpStatus | '')}>
          <option value="">Todas las respuestas</option>
          {(Object.keys(STATUS_LABEL) as RsvpStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select value={side} onChange={(e) => setSide(e.target.value as Side | '')}>
          <option value="">Novia y novio</option>
          <option value="novia">Novia</option><option value="novio">Novio</option><option value="ambos">Ambos</option>
        </select>
        {selected.size > 0 && (
          <button type="button" className="btn btn--danger-ghost" onClick={() => void remove([...selected])}>
            Eliminar {selected.size}
          </button>
        )}
      </div>

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : !guests.length ? (
        <div className="empty">
          <p>Aún no hay invitados.</p>
          <p className="muted small">Descarga la plantilla, llénala y vuelve para importarla.</p>
        </div>
      ) : (
        <div className="table-wrap card card--flush">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((g) => g.id)) : new Set())}
                    aria-label="Seleccionar todos"
                  />
                </th>
                <th>Nombre</th><th>Celular</th><th>Pases</th><th>De</th><th>Grupo</th>
                <th>Respuesta</th><th>Asisten</th><th>Enviada</th><th>Notas</th><th>Mensaje</th><th>Enlace</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <GuestRow
                  key={g.id}
                  guest={g}
                  selected={selected.has(g.id)}
                  onSelect={(v) => setSelected((prev) => {
                    const next = new Set(prev)
                    if (v) next.add(g.id); else next.delete(g.id)
                    return next
                  })}
                  onUpdate={(patch) => void update(g.id, patch)}
                  onDelete={() => void remove([g.id])}
                  whatsappText={whatsappText}
                />
              ))}
            </tbody>
          </table>
          <p className="table-foot muted small">Mostrando {filtered.length} invitaciones · {totalSeats} pases</p>
        </div>
      )}

      {drafts && (
        <DraftEditor
          title={drafts.title}
          initial={drafts.rows}
          saving={saving}
          onCancel={() => setDrafts(null)}
          onSave={(rows) => void saveDrafts(rows)}
        />
      )}
    </div>
  )
}
