import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loading from '@/components/ui/Loading'

const InvitationPage = lazy(() => import('@/pages/InvitationPage'))
const AdminApp = lazy(() => import('@/pages/admin/AdminApp'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route path="/invitacion/:slug" element={<InvitationPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<InvitationPage />} />
      </Routes>
    </Suspense>
  )
}
