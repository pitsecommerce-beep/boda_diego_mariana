# Boda Diego & Mariana

Invitación digital con panel de administración. React + TypeScript + Vite, Supabase como base de datos y despliegue en GitHub Pages.

## Rutas

| URL | Qué es |
| --- | --- |
| `/` | Invitación general (sin confirmación) |
| `/invitacion/nombre-del-invitado` | Invitación personalizada con confirmación |
| `/admin` | Resumen de confirmaciones |
| `/admin/invitados` | Invitados: importar/exportar Excel, editar en línea, copiar enlace, WhatsApp |
| `/admin/contenido` | Novios, fecha (hora CDMX), portada, música, papás, lugares, etiqueta, regalos, despedida |
| `/admin/galeria` | Fotos del carrusel |

## Supabase

1. Crea un proyecto en Supabase.
2. Aplica las migraciones de `supabase/migrations` con la CLI:

   ```bash
   supabase link --project-ref TU_PROJECT_REF
   supabase db push
   ```

   La migración crea las tablas, las políticas RLS, las funciones `get_guest` / `submit_rsvp` y el bucket público `boda`.
   Para cambios futuros crea una migración nueva con `supabase migration new nombre`.

Sólo se necesitan la URL y la anon key; no hay usuarios ni login.

## GitHub Pages

1. En el repositorio: **Settings > Secrets and variables > Actions** agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
2. **Settings > Pages > Source**: GitHub Actions.
3. Cada push a `main` despliega con `.github/workflows/deploy.yml`. La ruta base (`/boda_diego_mariana/` o dominio propio) se detecta sola.

## Desarrollo local

```bash
cp .env.example .env.local   # y rellena los valores
npm install
npm run dev
```

## Excel de invitados

Columnas: `nombre` (obligatoria), `celular`, `pases`, `invitado_de` (novia / novio / ambos), `grupo`, `notas`.
Cada fila es una invitación y `pases` el número de personas que incluye. Al importar se abre una tabla editable para corregir antes de guardar; después todo se puede editar directamente en la lista.
