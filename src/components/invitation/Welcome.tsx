import Ornament from '@/components/ui/Ornament'

interface Props {
  bride: string
  groom: string
  guestName?: string
  closing: boolean
  onOpen: () => void
}

/** Pantalla inicial: el toque del invitado habilita la música de fondo. */
export default function Welcome({ bride, groom, guestName, closing, onOpen }: Props) {
  return (
    <div className={`welcome ${closing ? 'welcome--closing' : ''}`}>
      <div className="welcome-arch">
        <p className="eyebrow">Nuestra boda</p>
        <h1 className="welcome-names">
          <span>{groom}</span>
          <span className="amp">&amp;</span>
          <span>{bride}</span>
        </h1>
        <Ornament />
        {guestName ? (
          <>
            <p className="welcome-for">Invitación especial para</p>
            <p className="welcome-guest">{guestName}</p>
          </>
        ) : (
          <p className="welcome-for">Tenemos algo que contarte</p>
        )}
        <button type="button" className="pill pill--solid welcome-btn" onClick={onOpen}>
          Abrir invitación
        </button>
      </div>
    </div>
  )
}
