import { useAuth } from '../context/AuthContext'
import { BookOpen, Clock, Award } from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--brand)]">
          Hoş geldin, {profile?.full_name?.split(' ')[0] || 'Öğrenci'}!
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Eğitim yolculuğuna devam et.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Aktif Kurslar</span>
          </div>
          <span className="text-2xl font-bold text-[var(--brand)]">0</span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Toplam Süre</span>
          </div>
          <span className="text-2xl font-bold text-[var(--brand)]">0 saat</span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Award size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Tamamlanan</span>
          </div>
          <span className="text-2xl font-bold text-[var(--brand)]">0 ders</span>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
        <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={28} className="text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--brand)] mb-2">
          Henüz bir kursun yok
        </h3>
        <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
          Kurs eklendikçe burada görünecek. Admin panelinden ilk kursunu ekleyebilirsin.
        </p>
      </div>
    </div>
  )
}
