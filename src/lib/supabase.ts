import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Guest, GuestDraft, PublicGuest, RsvpStatus, WeddingConfig } from '@/types'
import { DEFAULT_CONFIG } from '@/lib/defaultConfig'
import { uniqueSlug } from '@/lib/slug'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url?.startsWith('http') && anonKey)

export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null

const BUCKET = 'boda'

function db(): SupabaseClient {
  if (!supabase) throw new Error('Supabase no está configurado (faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).')
  return supabase
}

// ─── Configuración ──────────────────────────────────────────────────────────

export async function getConfig(): Promise<WeddingConfig> {
  if (!supabase) return DEFAULT_CONFIG
  const { data, error } = await supabase.from('wedding_config').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return DEFAULT_CONFIG
  const cfg = { ...DEFAULT_CONFIG, ...data } as WeddingConfig
  cfg.gallery_urls ??= []
  cfg.dress_code_photos ??= []
  if (!Array.isArray(cfg.gift_registries)) cfg.gift_registries = []
  return cfg
}

export async function saveConfig(patch: Partial<WeddingConfig>): Promise<void> {
  const { id: _id, updated_at: _u, ...rest } = patch
  const { error } = await db().from('wedding_config').upsert({ id: 1, ...rest })
  if (error) throw error
}

// ─── Invitados (admin) ─────────────────────────────────────────────────────

export async function listGuests(): Promise<Guest[]> {
  const { data, error } = await db().from('guests').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Guest[]
}

export async function insertGuests(drafts: GuestDraft[], existingSlugs: string[]): Promise<void> {
  const taken = new Set(existingSlugs)
  const rows = drafts
    .filter((d) => d.name.trim())
    .map((d) => ({
      name: d.name.trim(),
      slug: uniqueSlug(d.name, taken),
      phone: d.phone.trim() || null,
      seats: Math.max(1, Math.round(d.seats) || 1),
      side: d.side,
      group_name: d.group_name.trim() || null,
      notes: d.notes.trim() || null,
    }))
  if (!rows.length) return
  const { error } = await db().from('guests').insert(rows)
  if (error) throw error
}

export async function updateGuest(id: string, patch: Partial<Guest>): Promise<void> {
  const { error } = await db().from('guests').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteGuests(ids: string[]): Promise<void> {
  if (!ids.length) return
  const { error } = await db().from('guests').delete().in('id', ids)
  if (error) throw error
}

// ─── Invitación pública ────────────────────────────────────────────────────

export async function getPublicGuest(slug: string): Promise<PublicGuest | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_guest', { p_slug: slug })
  if (error || !data?.length) return null
  return data[0] as PublicGuest
}

export async function submitRsvp(slug: string, status: Exclude<RsvpStatus, 'pendiente'>, count: number, message: string): Promise<void> {
  const { error } = await db().rpc('submit_rsvp', {
    p_slug: slug, p_status: status, p_count: count, p_message: message,
  })
  if (error) throw error
}

// ─── Archivos ───────────────────────────────────────────────────────────────

export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const { error } = await db().storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** Borra un archivo del bucket si la URL pertenece a él. Ignora errores. */
export async function removeFile(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl || !supabase) return
  const marker = `/object/public/${BUCKET}/`
  const i = publicUrl.indexOf(marker)
  if (i < 0) return
  await supabase.storage.from(BUCKET).remove([decodeURIComponent(publicUrl.slice(i + marker.length))])
}
