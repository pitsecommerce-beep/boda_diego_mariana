import type { RsvpStatus, Side } from '@/types'

export const STATUS_LABEL: Record<RsvpStatus, string> = {
  pendiente: 'Sin respuesta',
  si: 'Asistirá',
  no: 'No asistirá',
  quizas: 'Por confirmar',
}

export const SIDE_LABEL: Record<Side, string> = {
  novia: 'Novia',
  novio: 'Novio',
  ambos: 'Ambos',
}

/** URL pública de la invitación personalizada. */
export function invitationLink(slug: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}invitacion/${slug}`
}
