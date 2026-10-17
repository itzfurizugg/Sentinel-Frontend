import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-base-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
