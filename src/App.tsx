import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import AppLayout from './components/layout'
import LoginPage from './pages/auth/login'
import DashboardPage from './pages/dashboard'
import StudentPage from './pages/student'
import ProfilePage from './pages/profile'
import { getToken } from './services/api'

function RequireAuth({ children }: { children: ReactElement }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
