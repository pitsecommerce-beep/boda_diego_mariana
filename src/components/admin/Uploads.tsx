import { useRef, useState } from 'react'
import { removeFile, uploadFile } from '@/lib/supabase'

function useUpload(folder: string) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = async (files: File[]): Promise<string[]> => {
    setBusy(true)
    setError(null)
    try {
      const urls: string[] = []
      for (const f of files) urls.push(await uploadFile(f, folder))
      return urls
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir el archivo')
      return []
    } finally {
      setBusy(false)
    }
  }
  return { busy, error, run }
}

interface SingleProps {
  value: string | null
  onChange: (url: string | null) => void
  folder: string
  label?: string
  aspect?: string
}

export function ImageUpload({ value, onChange, folder, label = 'Subir foto', aspect = '16 / 10' }: SingleProps) {
  const input = useRef<HTMLInputElement>(null)
  const { busy, error, run } = useUpload(folder)

  const pick = async (files: FileList | null) => {
    if (!files?.length) return
    const [url] = await run([files[0]])
    if (url) {
      void removeFile(value)
      onChange(url)
    }
  }

  return (
    <div className="upload">
      <div className="upload-preview" style={{ aspectRatio: aspect }} onClick={() => input.current?.click()}>
        {value ? <img src={value} alt="" /> : <span>{busy ? 'Subiendo…' : label}</span>}
        {busy && value && <div className="upload-busy">Subiendo…</div>}
      </div>
      <div className="upload-actions">
        <button type="button" className="btn btn--ghost" onClick={() => input.current?.click()} disabled={busy}>
          {value ? 'Cambiar' : 'Elegir archivo'}
        </button>
        {value && (
          <button type="button" className="btn btn--danger-ghost" onClick={() => { void removeFile(value); onChange(null) }}>
            Quitar
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { void pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}

interface MultiProps {
  value: string[]
  onChange: (urls: string[]) => void
  folder: string
}

export function MultiImageUpload({ value, onChange, folder }: MultiProps) {
  const input = useRef<HTMLInputElement>(null)
  const { busy, error, run } = useUpload(folder)

  const pick = async (files: FileList | null) => {
    if (!files?.length) return
    const urls = await run(Array.from(files))
    if (urls.length) onChange([...value, ...urls])
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const remove = (i: number) => {
    void removeFile(value[i])
    onChange(value.filter((_, k) => k !== i))
  }

  return (
    <div>
      <div className="thumbs">
        {value.map((src, i) => (
          <div className="thumb" key={src}>
            <img src={src} alt="" loading="lazy" />
            <span className="thumb-num">{i + 1}</span>
            <div className="thumb-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mover antes">‹</button>
              <button type="button" onClick={() => remove(i)} aria-label="Eliminar">✕</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Mover después">›</button>
            </div>
          </div>
        ))}
        <button type="button" className="thumb thumb--add" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? 'Subiendo…' : '+ Agregar fotos'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { void pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}

export function AudioUpload({ value, onChange, folder }: Omit<SingleProps, 'label' | 'aspect'>) {
  const input = useRef<HTMLInputElement>(null)
  const { busy, error, run } = useUpload(folder)

  const pick = async (files: FileList | null) => {
    if (!files?.length) return
    const [url] = await run([files[0]])
    if (url) {
      void removeFile(value)
      onChange(url)
    }
  }

  return (
    <div className="upload">
      {value ? <audio src={value} controls className="audio" /> : <p className="hint">Aún no hay canción cargada.</p>}
      <div className="upload-actions">
        <button type="button" className="btn btn--ghost" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? 'Subiendo…' : value ? 'Cambiar canción' : 'Subir canción (mp3)'}
        </button>
        {value && (
          <button type="button" className="btn btn--danger-ghost" onClick={() => { void removeFile(value); onChange(null) }}>
            Quitar
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      <input ref={input} type="file" accept="audio/*" hidden onChange={(e) => { void pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}
