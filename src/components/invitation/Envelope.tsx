import { formatShortDate } from '@/lib/time'

interface Props {
  bride: string
  groom: string
  date: string | null
  guestName?: string
  opening: boolean
  onOpen: () => void
}

const initial = (s: string) => s.trim().charAt(0).toUpperCase()

/** Contorno orgánico de lacre derramado: ondulaciones suaves e irregulares. */
function waxPath(): string {
  const n = 90
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 90 + 4.5 * Math.sin(3 * a + 0.6) + 3 * Math.sin(5 * a + 2.1) + 1.8 * Math.sin(9 * a + 4) + 1.2 * Math.sin(13 * a + 1)
    pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${pts.join(' L')} Z`
}
const WAX = waxPath()

/**
 * Sobre de papel con sello de lacre. Al tocarlo: se rompe el sello, se abre la
 * solapa, sale la carta y la escena se desvanece hacia la invitación.
 */
export default function Envelope({ bride, groom, date, guestName, opening, onOpen }: Props) {
  const mono = `${initial(groom)}&${initial(bride)}`
  return (
    <div className={`env-scene ${opening ? 'is-opening' : ''}`}>
      <p className="env-top">{guestName ? 'Tenemos algo que contarte' : 'Nuestra boda'}</p>

      <button type="button" className="env" onClick={onOpen} disabled={opening} aria-label="Abrir el sobre de la invitación">
        <span className="env-shadow" />
        <span className="env-back" />

        <span className="env-letter">
          <span className="env-letter-top">Nos casamos</span>
          <span className="env-letter-names">
            {groom} <span className="amp">&amp;</span> {bride}
          </span>
          {date && <span className="env-letter-date">{formatShortDate(date)}</span>}
        </span>

        {/* Frente: solapas laterales e inferior */}
        <span className="env-pocket">
          <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="envSide" x1="0" x2="1">
                <stop offset="0" stopColor="#f6efe0" />
                <stop offset="1" stopColor="#ebdfc8" />
              </linearGradient>
              <linearGradient id="envSideR" x1="1" x2="0">
                <stop offset="0" stopColor="#f3ebda" />
                <stop offset="1" stopColor="#e8dbc2" />
              </linearGradient>
              <linearGradient id="envBottom" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#f5eddd" />
                <stop offset="1" stopColor="#eadcc3" />
              </linearGradient>
              <filter id="envEdge" x="-5%" y="-10%" width="110%" height="120%">
                <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor="#6b5a45" floodOpacity="0.16" />
              </filter>
              <filter id="envEdgeSide" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#6b5a45" floodOpacity="0.12" />
              </filter>
            </defs>
            <path d="M0,0 L462,368 Q486,388 462,408 L0,700 Z" fill="url(#envSide)" filter="url(#envEdgeSide)" />
            <path d="M1000,0 L538,368 Q514,388 538,408 L1000,700 Z" fill="url(#envSideR)" filter="url(#envEdgeSide)" />
            <path d="M0,700 L0,684 L430,412 Q500,372 570,412 L1000,684 L1000,700 Z" fill="url(#envBottom)" filter="url(#envEdge)" />
          </svg>
          <span className="env-grain" />
          <span className="env-to">
            {guestName ? (
              <>
                <span className="env-to-label">Para</span>
                <span className="env-to-name">{guestName}</span>
              </>
            ) : (
              <span className="env-to-name">
                {groom} <span className="amp">&amp;</span> {bride}
              </span>
            )}
          </span>
        </span>

        {/* Solapa superior con punta redondeada */}
        <span className="env-flap">
          <svg viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f8f2e5" />
                <stop offset="1" stopColor="#ecdfc8" />
              </linearGradient>
              <filter id="envFlapShadow" x="-5%" y="-5%" width="110%" height="125%">
                <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#5a4a38" floodOpacity="0.2" />
              </filter>
            </defs>
            <path d="M0,0 L1000,0 L566,392 Q500,446 434,392 Z" fill="url(#envFlap)" filter="url(#envFlapShadow)" />
          </svg>
          <span className="env-grain env-grain--flap" />
        </span>

        {/* Sello de lacre */}
        <span className="env-seal">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <radialGradient id="wax" cx="38%" cy="32%" r="75%">
                <stop offset="0" stopColor="#c9b08a" />
                <stop offset="0.55" stopColor="#a98e66" />
                <stop offset="1" stopColor="#7f6748" />
              </radialGradient>
              <radialGradient id="waxInner" cx="60%" cy="65%" r="70%">
                <stop offset="0" stopColor="#b79c74" />
                <stop offset="1" stopColor="#9a7f59" />
              </radialGradient>
              <filter id="waxShadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3d2f20" floodOpacity="0.35" />
              </filter>
            </defs>
            <path d={WAX} fill="url(#wax)" filter="url(#waxShadow)" />
            <circle cx="100" cy="100" r="66" fill="url(#waxInner)" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="#7a6243" strokeOpacity="0.55" strokeWidth="3" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#e6d4b6" strokeOpacity="0.45" strokeWidth="1.2" />
            <text x="100" y="114" textAnchor="middle" className="env-seal-text">{mono}</text>
            <path d="M52,70 Q70,40 104,36" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <p className="env-hint">Toca el sobre para abrirlo</p>
    </div>
  )
}
