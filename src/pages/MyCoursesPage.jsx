import { BookOpen } from 'lucide-react'

export default function MyCoursesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand)] mb-6">Kurslarım</h1>
      <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
        <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={28} className="text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--brand)] mb-2">
          Kayıtlı kursun yok
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">
          Bir kursa kayıt olduğunda burada listelenecek.
        </p>
      </div>
    </div>
  )
}
