/** "María José López" → "maria-jose-lopez" */
export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Genera un slug único frente a los ya usados (añade -2, -3…). */
export function uniqueSlug(name: string, taken: Set<string>): string {
  const base = slugify(name) || 'invitado'
  let slug = base
  let n = 2
  while (taken.has(slug)) slug = `${base}-${n++}`
  taken.add(slug)
  return slug
}
