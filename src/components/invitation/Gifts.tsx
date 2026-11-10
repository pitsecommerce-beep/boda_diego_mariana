import { useState } from 'react'
import type { WeddingConfig } from '@/types'

const GIFT_DEFAULT = 'Lo que más nos ilusiona es celebrar contigo. Si además quieres hacernos un regalo, aquí te dejamos un par de opciones.'

export default function Gifts({ config }: { config: WeddingConfig }) {
  const [copied, setCopied] = useState(false)
  const registries = (config.gift_registries ?? []).filter((r) => r.name || r.url)
  if (!registries.length && !config.bank_details && !config.bank_clabe) return null

  const copy = async () => {
    if (!config.bank_clabe) return
    // Copia sólo los dígitos para pegarlos directo en la app del banco
    await navigator.clipboard.writeText(config.bank_clabe.replace(/\s+/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section className="section" id="regalos">
      <div className="section-inner">
        <h2 className="section-title">Mesa de regalos</h2>
        <p className="section-text">{config.gift_message || GIFT_DEFAULT}</p>

        {registries.length > 0 && (
          <div className="gift-links">
            {registries.map((r) => (
              <a key={r.name + r.url} className="pill" href={r.url} target="_blank" rel="noreferrer">
                {r.name || 'Ver mesa de regalos'}
              </a>
            ))}
          </div>
        )}

        {(config.bank_details || config.bank_clabe) && (
          <div className="gift-bank">
            <p className="eyebrow">Transferencia</p>
            {config.bank_details && <p className="gift-bank-info">{config.bank_details}</p>}
            {config.bank_clabe && (
              <>
                <p className="gift-clabe">{config.bank_clabe}</p>
                <button type="button" className="text-link gift-copy" onClick={() => void copy()}>
                  {copied ? 'CLABE copiada' : 'Copiar CLABE'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
