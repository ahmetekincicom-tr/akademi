import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Users, Search, Mail } from 'lucide-react'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const { data } = await supabase
      .from('profiles')
      .select('*, enrollments(course_id, courses(title))')
      .order('created_at', { ascending: false })
    setStudents(data || [])
    setLoading(false)
  }

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.id?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand)]">Öğrenciler</h1>
        <span className="text-sm text-[var(--text-secondary)]">{students.length} kayıtlı kullanıcı</span>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
          <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--brand)] mb-2">Henüz kayıtlı öğrenci yok</h3>
          <p className="text-[var(--text-secondary)] text-sm">Öğrenciler kayıt oldukça burada listelenecek.</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="İsim ile ara..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>

          {/* Student List */}
          <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_100px] gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-secondary)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Öğrenci</span>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Kayıt Tarihi</span>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Rol</span>
            </div>
            {filtered.map(student => (
              <div key={student.id} className="grid grid-cols-[1fr_120px_100px] gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)] transition-all">
                <div>
                  <p className="font-medium text-sm text-[var(--brand)]">{student.full_name || 'İsimsiz'}</p>
                  {student.enrollments?.length > 0 && (
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {student.enrollments.length} kursa kayıtlı
                    </p>
                  )}
                </div>
                <span className="text-sm text-[var(--text-secondary)] self-center">
                  {new Date(student.created_at).toLocaleDateString('tr-TR')}
                </span>
                <span className={`self-center px-2 py-0.5 text-xs rounded-full font-medium w-fit ${
                  student.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {student.role === 'admin' ? 'Admin' : 'Öğrenci'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
