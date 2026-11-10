import { useState } from 'react'
import type { WeddingConfig } from '@/types'
import Ornament from '@/components/ui/Ornament'

export default function Gifts({ config }: { config: WeddingConfig }) {
  const [copied, setCopied] = useState(false)
  const registries = (config.gift_registries ?? []).filter((r) => r.name || r.url)
  if (!config.gift_message && !registries.length && !config.bank_details && !config.bank_clabe) return null

  const copy = async () => {
    if (!config.bank_clabe) return
    // Copia sólo los dígitos para pegarlos directo en la app del banco
    await navigator.clipboard.writeText(config.bank_clabe.replace(/\s+/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section className="section section--paper" id="regalos">
      <div className="section-inner">
        <div className="gift-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
            <rect x="7" y="18" width="34" height="8" />
            <path d="M10 26v16h28V26M24 18v24" />
            <path d="M24 18c-3-6-11-9-12-4s8 4 12 4zM24 18c3-6 11-9 12-4s-8 4-12 4z" />
          </svg>
        </div>
        <h2 className="section-title">Mesa de regalos</h2>
        <Ornament />
        {config.gift_message && <p className="section-text">{config.gift_message}</p>}

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
            <p className="eyebrow">Datos bancarios</p>
            {config.bank_details && <p className="gift-bank-info">{config.bank_details}</p>}
            {config.bank_clabe && (
              <>
                <p className="eyebrow gift-clabe-label">CLABE</p>
                <p className="gift-clabe">{config.bank_clabe}</p>
                <button type="button" className="pill pill--auto" onClick={() => void copy()}>
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
