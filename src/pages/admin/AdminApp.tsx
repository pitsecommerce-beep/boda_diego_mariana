import { NavLink, Route, Routes } from 'react-router-dom'
import '@/styles/admin.css'
import { supabaseConfigured } from '@/lib/supabase'
import DashboardPage from './DashboardPage'
import GuestsPage from './GuestsPage'
import ContentPage from './ContentPage'
import GalleryPage from './GalleryPage'

const NAV = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/invitados', label: 'Invitados' },
  { to: '/admin/contenido', label: 'Contenido' },
  { to: '/admin/galeria', label: 'Galería' },
]

export default function AdminApp() {
  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          <span className="admin-arch" aria-hidden="true" />
          <div>
            <p className="admin-brand-title">Nuestra boda</p>
            <p className="admin-brand-sub">Panel de administración</p>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <a className="btn btn--ghost admin-view" href={import.meta.env.BASE_URL} target="_blank" rel="noreferrer">
          Ver invitación ↗
        </a>
      </header>

      <main className="admin-main">
        {!supabaseConfigured && (
          <div className="notice">
            <strong>Supabase no está configurado.</strong> Agrega los secrets <code>VITE_SUPABASE_URL</code> y{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> (o un archivo <code>.env.local</code> en desarrollo) y ejecuta{' '}
            las migraciones de <code>supabase/migrations</code>.
          </div>
        )}
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="invitados" element={<GuestsPage />} />
          <Route path="contenido" element={<ContentPage />} />
          <Route path="galeria" element={<GalleryPage />} />
        </Routes>
      </main>
    </div>
  )
}
