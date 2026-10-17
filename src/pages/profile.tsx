import { useNavigate } from 'react-router-dom'
import { clearSession, getStoredUser } from '../services/api'
import { LogOut, Mail, Shield, User } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const displayName = user ? user.email.split('@')[0] : 'Admin Sentinel'
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        <p className="text-sm text-base-content/70">Informasi akun dan pengaturan sesi</p>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xl shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <span className="badge badge-primary badge-sm mt-1 uppercase">
                {user?.role ?? 'admin'}
              </span>
            </div>
          </div>

          <div className="divider m-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-base-content/60">Email</p>
                <p className="text-sm font-medium truncate">{user?.email ?? '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-base-content/60">Peran / Role</p>
                <p className="text-sm font-medium capitalize">{user?.role ?? 'Admin'}</p>
              </div>
            </div>

            {user?.nis && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200">
                <User className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-base-content/60">NIS</p>
                  <p className="text-sm font-medium">{user.nis}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline btn-error btn-sm gap-2"
            >
              <LogOut className="h-4 w-4" />
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
