import { useEffect, useState } from 'react'
import { formatLongDate, formatTime } from '@/lib/time'

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    done: ms === 0,
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor(ms / 3_600_000) % 24,
    minutos: Math.floor(ms / 60_000) % 60,
  }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime()
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 20_000)
    return () => clearInterval(id)
  }, [target])

  return (
    <section className="section" id="cuenta">
      <div className="section-inner">
        <p className="countdown-date">{formatLongDate(date)}</p>
        <p className="countdown-time">a las {formatTime(date)}, hora del centro de México</p>
        {t.done ? (
          <p className="countdown-lead">Hoy es el día</p>
        ) : (
          <div className="countdown">
            <p className="countdown-lead">faltan</p>
            <p className="countdown-num">{t.dias}</p>
            <p className="countdown-lead">{t.dias === 1 ? 'día' : 'días'}</p>
            <p className="countdown-rest">
              {plural(t.horas, 'hora', 'horas')} y {plural(t.minutos, 'minuto', 'minutos')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
