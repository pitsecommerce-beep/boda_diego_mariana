import { useState } from 'react'
import { saveConfig } from '@/lib/supabase'
import { useConfig } from '@/hooks/useConfig'
import { MultiImageUpload } from '@/components/admin/Uploads'

export default function GalleryPage() {
  const { config, setConfig } = useConfig()
  const [status, setStatus] = useState<string | null>(null)

  if (!config) return <p className="muted">Cargando…</p>

  const update = async (urls: string[]) => {
    setConfig({ ...config, gallery_urls: urls })
    setStatus('Guardando…')
    try {
      await saveConfig({ gallery_urls: urls })
      setStatus('Guardado')
    } catch (e) {
      setStatus((e as Error).message)
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Galería</h1>
          <p className="muted">Fotos del carrusel, en el orden en que aparecerán. Los cambios se guardan solos.</p>
        </div>
        {status && <span className="muted small">{status}</span>}
      </div>
      <div className="card">
        <MultiImageUpload folder="galeria" value={config.gallery_urls ?? []} onChange={(v) => void update(v)} />
      </div>
    </div>
  )
}
