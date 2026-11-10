import * as XLSX from 'xlsx'
import type { Guest, GuestDraft, Side } from '@/types'
import { STATUS_LABEL } from '@/lib/labels'

const HEADERS = ['nombre', 'celular', 'pases', 'invitado_de', 'grupo', 'notas']

function norm(h: string): string {
  return h.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, '_')
}

export function parseSide(v: unknown): Side | null {
  const s = norm(String(v ?? ''))
  if (['novia', 'bride', 'ella'].includes(s)) return 'novia'
  if (['novio', 'groom', 'el'].includes(s)) return 'novio'
  if (['ambos', 'los_dos', 'both'].includes(s)) return 'ambos'
  return null
}

/** Lee un Excel/CSV y devuelve filas editables. Acepta varios nombres de columna. */
export async function readGuestFile(file: File): Promise<GuestDraft[]> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  return raw
    .map((row) => {
      const r: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(row)) r[norm(k)] = v
      const pick = (...keys: string[]) => keys.map((k) => r[k]).find((v) => v !== undefined && v !== '') ?? ''
      const seats = Number(pick('pases', 'lugares', 'boletos', 'personas', 'seats'))
      return {
        name: String(pick('nombre', 'invitado', 'nombre_completo', 'name')).trim(),
        phone: String(pick('celular', 'telefono', 'whatsapp', 'phone')).trim(),
        seats: Number.isFinite(seats) && seats >= 1 ? Math.round(seats) : 1,
        side: parseSide(pick('invitado_de', 'lado', 'de', 'side')),
        group_name: String(pick('grupo', 'mesa', 'group')).trim(),
        notes: String(pick('notas', 'nota', 'comentarios', 'notes')).trim(),
      }
    })
    .filter((g) => g.name)
}

export function downloadTemplate(): void {
  const rows = [
    { nombre: 'Familia Hernández Ruiz', celular: '5512345678', pases: 4, invitado_de: 'novia', grupo: 'Familia', notas: '' },
    { nombre: 'Sofía Martínez', celular: '5598765432', pases: 2, invitado_de: 'novio', grupo: 'Universidad', notas: 'Va con pareja' },
    { nombre: 'Andrés Gómez', celular: '', pases: 1, invitado_de: 'ambos', grupo: 'Trabajo', notas: '' },
  ]
  const ws = XLSX.utils.json_to_sheet(rows, { header: HEADERS })
  ws['!cols'] = [{ wch: 30 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 16 }, { wch: 24 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invitados')
  XLSX.writeFile(wb, 'plantilla_invitados.xlsx')
}

export function exportGuests(guests: Guest[], linkFor: (g: Guest) => string): void {
  const rows = guests.map((g) => ({
    nombre: g.name,
    celular: g.phone ?? '',
    pases: g.seats,
    invitado_de: g.side ?? '',
    grupo: g.group_name ?? '',
    notas: g.notes ?? '',
    invitacion_enviada: g.invitation_sent ? 'Sí' : 'No',
    respuesta: STATUS_LABEL[g.rsvp_status],
    asistentes: g.rsvp_status === 'si' ? g.attending_count : 0,
    mensaje: g.rsvp_message ?? '',
    enlace: linkFor(g),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 30 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 16 }, { wch: 24 }, { wch: 10 }, { wch: 16 }, { wch: 10 }, { wch: 30 }, { wch: 50 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invitados')
  XLSX.writeFile(wb, `invitados_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
