import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LayoutDashboard, Settings, LogOut, Users, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/giris')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[var(--accent)] text-white'
        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
    }`

  return (
    <div className="min-h-screen flex bg-[var(--surface-secondary)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[var(--border)] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--brand)]">AE Akademi</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {profile?.full_name || 'Öğrenci'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/panel" end className={linkClass} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} />
            Ana Sayfa
          </NavLink>
          <NavLink to="/panel/kurslarim" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <BookOpen size={18} />
            Kurslarım
          </NavLink>

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-4">
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Yönetim
                </span>
              </div>
              <NavLink to="/panel/admin/kurslar" className={linkClass} onClick={() => setSidebarOpen(false)}>
                <Settings size={18} />
                Kurs Yönetimi
              </NavLink>
              <NavLink to="/panel/admin/ogrenciler" className={linkClass} onClick={() => setSidebarOpen(false)}>
                <Users size={18} />
                Öğrenciler
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600 transition-all w-full cursor-pointer"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--brand)]">AE Akademi</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-[var(--surface-secondary)] transition-all"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
