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

/**
 * Sobre cerrado con sello de lacre. Al tocarlo: se rompe el sello, se abre la
 * solapa, sale la carta y la escena se desvanece hacia la invitación.
 */
export default function Envelope({ bride, groom, date, guestName, opening, onOpen }: Props) {
  return (
    <div className={`env-scene ${opening ? 'is-opening' : ''}`}>
      <p className="env-top eyebrow">{guestName ? 'Tienes una invitación' : 'Nuestra boda'}</p>

      <button type="button" className="env" onClick={onOpen} disabled={opening} aria-label="Abrir el sobre de la invitación">
        <span className="env-back" />

        <span className="env-letter">
          <span className="eyebrow">Nos casamos</span>
          <span className="env-letter-names">
            {groom} <span className="amp">&amp;</span> {bride}
          </span>
          {date && <span className="env-letter-date">{formatShortDate(date)}</span>}
        </span>

        <span className="env-pocket">
          <svg className="env-folds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 100 L50 47 L100 100" />
          </svg>
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

        <span className="env-flap" />

        <span className="env-seal">
          <span>{initial(groom)}<i>&amp;</i>{initial(bride)}</span>
        </span>
      </button>

      <p className="env-hint">Toca el sobre para abrirlo</p>
    </div>
  )
}
