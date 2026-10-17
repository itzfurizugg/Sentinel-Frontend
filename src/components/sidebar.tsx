import { NavLink } from 'react-router-dom'
import { getStoredUser } from '../services/api'
import { ClipboardList, FolderUsers, Home, Settings, UsersRound } from 'lucide-react'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const user = getStoredUser()

  const displayName = user ? user.email.split('@')[0] : 'Admin Sentinel'
  const initials = displayName.slice(0, 2).toUpperCase()

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      to: '/attendance',
      label: 'Kehadiran',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      to: '/student',
      label: 'Data Siswa',
      icon: <UsersRound className="h-5 w-5" />,
    },
    {
      to: '/class',
      label: 'Kelas dan Jurusan',
      icon: <FolderUsers className="h-5 w-5" />,
    },
  ]

  return (
    <aside className={`w-80 bg-base-100 border-r border-base-300 flex flex-col justify-between h-screen shrink-0 ${className}`}>
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-base-300">
          <div>
            <h2 className="font-bold text-accent text-3xl tracking-tight leading-tight">Sentinel</h2>
            <span className="font-thin text-accent text-xs tracking-tight leading-tight">Sistem absensi tinggal tempel.</span>
          </div>
        </div>

        <div className="p-3">
          <span className="px-3 text-xs font-semibold uppercase text-base-content/50 tracking-wider">
            Menu Utama
          </span>
          <nav className="flex flex-col gap-2 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm shadow-none transition-colors ${isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className='p-3 justify-end'>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm shadow-none transition-colors ${isActive
                ? 'bg-primary/20 text-primary'
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Pengaturan</span>
          </NavLink>
        </div>
      </div>

      <div className="p-3 border-t border-base-300 space-y-3">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg shadow-none transition-colors w-full text-left ${isActive
              ? 'bg-primary/20 text-primary'
              : 'hover:bg-base-200 text-base-content'
            }`
          }
        >
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate leading-tight">{displayName}</p>
            <p className="text-xs text-base-content/60 truncate">{user?.email ?? 'admin@sentinel.id'}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
