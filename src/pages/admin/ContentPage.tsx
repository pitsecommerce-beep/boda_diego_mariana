import { useEffect, useState } from 'react'
import { saveConfig } from '@/lib/supabase'
import { useConfig } from '@/hooks/useConfig'
import { cdmxLocalToIso, formatLongDate, formatTime, isoToCdmxLocal } from '@/lib/time'
import type { GiftRegistry, WeddingConfig } from '@/types'
import { AudioUpload, ImageUpload, MultiImageUpload } from '@/components/admin/Uploads'

type Key = keyof WeddingConfig

export default function ContentPage() {
  const { config } = useConfig()
  const [draft, setDraft] = useState<WeddingConfig | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => { if (config) setDraft(config) }, [config])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!draft) return <p className="muted">Cargando…</p>

  const set = <K extends Key>(k: K, v: WeddingConfig[K]) => {
    setDraft({ ...draft, [k]: v })
    setDirty(true)
    setMsg(null)
  }

  const text = (k: Key, label: string, opts: { placeholder?: string; area?: boolean; hint?: string } = {}) => (
    <label className="field">
      <span>{label}</span>
      {opts.area ? (
        <textarea rows={3} value={(draft[k] as string | null) ?? ''} placeholder={opts.placeholder} onChange={(e) => set(k, (e.target.value || null) as never)} />
      ) : (
        <input value={(draft[k] as string | null) ?? ''} placeholder={opts.placeholder} onChange={(e) => set(k, (e.target.value || null) as never)} />
      )}
      {opts.hint && <small>{opts.hint}</small>}
    </label>
  )

  const save = async () => {
    setSaving(true)
    try {
      await saveConfig(draft)
      setDirty(false)
      setMsg({ ok: true, text: 'Cambios guardados' })
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const registries = draft.gift_registries ?? []
  const setRegistry = (i: number, patch: Partial<GiftRegistry>) =>
    set('gift_registries', registries.map((r, k) => (k === i ? { ...r, ...patch } : r)))

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Contenido</h1>
          <p className="muted">Todo lo que aparece en la invitación, en el mismo orden.</p>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">1 · Portada</h2>
        <div className="grid-2">
          {text('groom_name', 'Nombre del novio')}
          {text('bride_name', 'Nombre de la novia')}
        </div>
        {text('hero_phrase', 'Frase de portada', { placeholder: 'Nos casamos' })}
        <div className="grid-2">
          <div className="field">
            <span>Foto de portada</span>
            <ImageUpload folder="portada" value={draft.cover_photo_url} onChange={(v) => set('cover_photo_url', v)} aspect="3 / 4" />
          </div>
          <div className="field">
            <span>Música de fondo</span>
            <AudioUpload folder="musica" value={draft.music_url} onChange={(v) => set('music_url', v)} />
            <small>Empieza a sonar cuando el invitado toca “Abrir invitación”.</small>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">2 · Fecha y hora</h2>
        <label className="field">
          <span>Fecha y hora de la boda (hora de la Ciudad de México)</span>
          <input
            type="datetime-local"
            value={isoToCdmxLocal(draft.wedding_date)}
            onChange={(e) => set('wedding_date', cdmxLocalToIso(e.target.value))}
          />
          {draft.wedding_date && (
            <small className="cap">{formatLongDate(draft.wedding_date)} a las {formatTime(draft.wedding_date)} (CDMX). La cuenta regresiva usa esta hora para todos.</small>
          )}
        </label>
      </section>

      <section className="card">
        <h2 className="card-title">3 · Nuestros papás</h2>
        {text('parents_phrase', 'Frase', { area: true })}
        <div className="grid-2">
          {text('groom_mother', 'Mamá del novio')}
          {text('bride_mother', 'Mamá de la novia')}
          {text('groom_father', 'Papá del novio')}
          {text('bride_father', 'Papá de la novia')}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">4 · Detalles del gran día</h2>
        <div className="grid-2">
          <div>
            <p className="sub-title">Ceremonia religiosa</p>
            {text('ceremony_name', 'Iglesia', { placeholder: 'Parroquia de San Juan Bautista' })}
            {text('ceremony_time', 'Hora', { placeholder: '5:00 PM' })}
            {text('ceremony_address', 'Dirección', { area: true })}
            {text('ceremony_maps_url', 'Enlace de Google Maps', { placeholder: 'https://maps.app.goo.gl/…', hint: 'En Google Maps: Compartir > Copiar vínculo.' })}
          </div>
          <div>
            <p className="sub-title">Recepción</p>
            {text('reception_name', 'Lugar', { placeholder: 'Ex Hacienda …' })}
            {text('reception_time', 'Hora', { placeholder: '7:00 PM' })}
            {text('reception_address', 'Dirección', { area: true })}
            {text('reception_maps_url', 'Enlace de Google Maps', { placeholder: 'https://maps.app.goo.gl/…' })}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">5 · Etiqueta</h2>
        {text('dress_code_title', 'Código de vestimenta', { placeholder: 'Formal / Etiqueta rigurosa' })}
        {text('dress_code_text', 'Descripción', { area: true, placeholder: 'Ej. Reservamos el color blanco para la novia.' })}
        <div className="field">
          <span>Fotos de inspiración</span>
          <MultiImageUpload folder="etiqueta" value={draft.dress_code_photos ?? []} onChange={(v) => set('dress_code_photos', v)} />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">6 · Carrusel de fotos</h2>
        <p className="muted">Se administra en la pestaña <b>Galería</b>.</p>
      </section>

      <section className="card">
        <h2 className="card-title">7 · Confirmación</h2>
        {text('rsvp_message', 'Mensaje', { area: true, placeholder: 'Tu presencia es el mejor regalo…' })}
        {text('rsvp_deadline', 'Fecha límite para confirmar', { placeholder: '1 de marzo' })}
      </section>

      <section className="card">
        <h2 className="card-title">8 · Mesa de regalos</h2>
        {text('gift_message', 'Mensaje', { area: true, placeholder: 'Tu presencia es el mejor regalo. Si quieres regalarnos algo más, aquí te dejamos algunas opciones.', hint: 'Si lo dejas vacío se muestra este mismo texto.' })}
        <div className="field">
          <span>Mesas de regalos</span>
          {registries.map((r, i) => (
            <div className="registry" key={i}>
              <input placeholder="Nombre (Liverpool, Amazon…)" value={r.name} onChange={(e) => setRegistry(i, { name: e.target.value })} />
              <input placeholder="https://…" value={r.url} onChange={(e) => setRegistry(i, { url: e.target.value })} />
              <button type="button" className="icon-btn" onClick={() => set('gift_registries', registries.filter((_, k) => k !== i))} aria-label="Quitar">✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--ghost btn--self" onClick={() => set('gift_registries', [...registries, { name: '', url: '' }])}>
            + Agregar mesa de regalos
          </button>
        </div>
        <p className="sub-title">Datos bancarios (opcional)</p>
        <div className="grid-2">
          {text('bank_clabe', 'CLABE', { placeholder: '012 345 678 901 234 567', hint: 'El botón “Copiar” de la invitación copia sólo este número.' })}
          {text('bank_details', 'Otra información', { area: true, placeholder: 'Banco BBVA\nTitular: Diego …' })}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">9 · Despedida</h2>
        {text('farewell_message', 'Mensaje de despedida', { area: true })}
        <div className="field">
          <span>Foto de fondo (si no hay, se usa la portada)</span>
          <ImageUpload folder="despedida" value={draft.farewell_photo_url} onChange={(v) => set('farewell_photo_url', v)} />
        </div>
      </section>

      <div className={`savebar ${dirty || msg ? 'is-visible' : ''}`}>
        {msg ? <span className={msg.ok ? 'ok' : 'err'}>{msg.text}</span> : <span>Tienes cambios sin guardar</span>}
        <button type="button" className="btn btn--primary" disabled={saving || !dirty} onClick={() => void save()}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
