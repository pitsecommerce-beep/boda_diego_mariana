import { useEffect, useState } from 'react'
import Ornament from '@/components/ui/Ornament'
import { formatLongDate, formatTime } from '@/lib/time'

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    done: ms === 0,
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor(ms / 3_600_000) % 24,
    minutos: Math.floor(ms / 60_000) % 60,
    segundos: Math.floor(ms / 1000) % 60,
  }
}

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime()
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units: [string, number][] = [
    ['Días', t.dias], ['Horas', t.horas], ['Minutos', t.minutos], ['Segundos', t.segundos],
  ]

  return (
    <section className="section section--sand" id="cuenta">
      <div className="section-inner">
        <p className="eyebrow">{t.done ? 'Llegó el gran día' : 'Faltan'}</p>
        <div className="countdown">
          {units.map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <span className="countdown-num">{String(value).padStart(2, '0')}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
        <Ornament />
        <p className="countdown-date">{formatLongDate(date)}</p>
        <p className="countdown-time">{formatTime(date)} · hora del centro de México</p>
      </div>
    </section>
  )
}
