export interface GiftRegistry {
  name: string
  url: string
}

export interface WeddingConfig {
  id: number
  bride_name: string
  groom_name: string
  wedding_date: string | null
  hero_phrase: string | null
  cover_photo_url: string | null
  music_url: string | null
  parents_phrase: string | null
  bride_father: string | null
  bride_mother: string | null
  groom_father: string | null
  groom_mother: string | null
  ceremony_name: string | null
  ceremony_time: string | null
  ceremony_address: string | null
  ceremony_maps_url: string | null
  reception_name: string | null
  reception_time: string | null
  reception_address: string | null
  reception_maps_url: string | null
  dress_code_title: string | null
  dress_code_text: string | null
  dress_code_photos: string[]
  gallery_urls: string[]
  rsvp_deadline: string | null
  rsvp_message: string | null
  gift_message: string | null
  gift_registries: GiftRegistry[]
  bank_details: string | null
  farewell_message: string | null
  farewell_photo_url: string | null
  updated_at?: string
}

export type RsvpStatus = 'pendiente' | 'si' | 'no' | 'quizas'
export type Side = 'novia' | 'novio' | 'ambos'

export interface Guest {
  id: string
  name: string
  slug: string
  phone: string | null
  seats: number
  side: Side | null
  group_name: string | null
  notes: string | null
  invitation_sent: boolean
  rsvp_status: RsvpStatus
  attending_count: number
  rsvp_message: string | null
  responded_at: string | null
  created_at: string
}

/** Fila editable antes de guardar (importación de Excel o alta manual). */
export interface GuestDraft {
  name: string
  phone: string
  seats: number
  side: Side | null
  group_name: string
  notes: string
}

/** Lo que la invitación pública puede ver de un invitado. */
export interface PublicGuest {
  id: string
  name: string
  seats: number
  rsvp_status: RsvpStatus
  attending_count: number
  rsvp_message: string | null
}
