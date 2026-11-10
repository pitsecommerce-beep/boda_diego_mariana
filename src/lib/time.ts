// La Ciudad de México no tiene horario de verano desde 2022: siempre UTC-6.
const CDMX_OFFSET = '-06:00'
const TZ = 'America/Mexico_City'

/** "2027-03-20T17:30" (hora CDMX) → ISO UTC */
export function cdmxLocalToIso(local: string): string | null {
  if (!local) return null
  const d = new Date(`${local}:00${CDMX_OFFSET}`)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

/** ISO UTC → "2027-03-20T17:30" en hora CDMX, para <input type="datetime-local"> */
export function isoToCdmxLocal(iso: string | null): string {
  if (!iso) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(iso))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-MX', { timeZone: TZ, ...o }).format(d)
  return `${f({ day: '2-digit' })} · ${f({ month: '2-digit' })} · ${f({ year: 'numeric' })}`
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso))
}

/** "17 de abril de 2027" */
export function formatPrettyDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}
