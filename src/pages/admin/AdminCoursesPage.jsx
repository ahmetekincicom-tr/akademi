import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', status: 'draft' })

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    const { data } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*))')
      .order('sort_order')
    setCourses(data || [])
    setLoading(false)
  }

  async function handleSaveCourse(e) {
    e.preventDefault()
    if (editingCourse) {
      await supabase
        .from('courses')
        .update({ title: form.title, description: form.description, status: form.status })
        .eq('id', editingCourse.id)
    } else {
      await supabase
        .from('courses')
        .insert({ title: form.title, description: form.description, status: form.status, sort_order: courses.length })
    }
    setShowForm(false)
    setEditingCourse(null)
    setForm({ title: '', description: '', status: 'draft' })
    fetchCourses()
  }

  function handleEdit(course) {
    setEditingCourse(course)
    setForm({ title: course.title, description: course.description || '', status: course.status })
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Bu kursu silmek istediğine emin misin? Tüm modüller ve dersler de silinecek.')) return
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  async function toggleStatus(course) {
    const newStatus = course.status === 'published' ? 'draft' : 'published'
    await supabase.from('courses').update({ status: newStatus }).eq('id', course.id)
    fetchCourses()
  }

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
        <h1 className="text-2xl font-bold text-[var(--brand)]">Kurs Yönetimi</h1>
        <button
          onClick={() => { setShowForm(true); setEditingCourse(null); setForm({ title: '', description: '', status: 'draft' }) }}
          className="px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Kurs
        </button>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[var(--brand)] mb-4">
              {editingCourse ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}
            </h2>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Kurs Adı</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Örn: Meta Reklam Uzmanlığı"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Kurs hakkında kısa açıklama..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Durum</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingCourse(null) }}
                  className="flex-1 py-3 px-4 border border-[var(--border)] text-[var(--text-secondary)] font-medium rounded-xl hover:bg-[var(--surface-secondary)] transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium rounded-xl transition-all cursor-pointer"
                >
                  {editingCourse ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
          <h3 className="text-lg font-semibold text-[var(--brand)] mb-2">Henüz kurs eklenmemiş</h3>
          <p className="text-[var(--text-secondary)] text-sm">"Yeni Kurs" butonuna tıklayarak ilk kursunu ekle.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => handleEdit(course)}
              onDelete={() => handleDelete(course.id)}
              onToggleStatus={() => toggleStatus(course)}
              onRefresh={fetchCourses}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CourseCard({ course, onEdit, onDelete, onToggleStatus, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleTitle, setModuleTitle] = useState('')
  const [editingModule, setEditingModule] = useState(null)

  const modules = course.modules?.sort((a, b) => a.sort_order - b.sort_order) || []
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)

  async function handleSaveModule(e) {
    e.preventDefault()
    if (editingModule) {
      await supabase.from('modules').update({ title: moduleTitle }).eq('id', editingModule.id)
    } else {
      await supabase.from('modules').insert({
        course_id: course.id,
        title: moduleTitle,
        sort_order: modules.length
      })
    }
    setShowModuleForm(false)
    setModuleTitle('')
    setEditingModule(null)
    onRefresh()
  }

  async function deleteModule(id) {
    if (!confirm('Bu modülü ve içindeki tüm dersleri silmek istediğine emin misin?')) return
    await supabase.from('modules').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown size={16} className="text-[var(--text-secondary)]" /> : <ChevronRight size={16} className="text-[var(--text-secondary)]" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--brand)] truncate">{course.title}</h3>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {course.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{modules.length} modül · {totalLessons} ders</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggleStatus} className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] transition-all cursor-pointer" title={course.status === 'published' ? 'Taslağa çek' : 'Yayınla'}>
            {course.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={onEdit} className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] transition-all cursor-pointer">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-600 transition-all cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--border)] p-5 bg-[var(--surface-secondary)]">
          {modules.map(module => (
            <ModuleBlock
              key={module.id}
              module={module}
              onDelete={() => deleteModule(module.id)}
              onEdit={() => { setEditingModule(module); setModuleTitle(module.title); setShowModuleForm(true) }}
              onRefresh={onRefresh}
            />
          ))}

          {showModuleForm ? (
            <form onSubmit={handleSaveModule} className="flex gap-2 mt-3">
              <input
                type="text"
                value={moduleTitle}
                onChange={e => setModuleTitle(e.target.value)}
                required
                placeholder="Modül adı..."
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
              <button type="submit" className="px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl cursor-pointer">
                {editingModule ? 'Güncelle' : 'Ekle'}
              </button>
              <button type="button" onClick={() => { setShowModuleForm(false); setEditingModule(null); setModuleTitle('') }} className="px-4 py-2.5 border border-[var(--border)] text-sm rounded-xl cursor-pointer">
                İptal
              </button>
            </form>
          ) : (
            <button
              onClick={() => { setShowModuleForm(true); setEditingModule(null); setModuleTitle('') }}
              className="mt-3 text-sm text-[var(--accent)] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus size={14} /> Modül Ekle
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ModuleBlock({ module, onDelete, onEdit, onRefresh }) {
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [lessonForm, setLessonForm] = useState({ title: '', bunny_video_id: '', duration_seconds: 0, is_preview: false })

  const lessons = module.lessons?.sort((a, b) => a.sort_order - b.sort_order) || []

  async function handleSaveLesson(e) {
    e.preventDefault()
    if (editingLesson) {
      await supabase.from('lessons').update({
        title: lessonForm.title,
        bunny_video_id: lessonForm.bunny_video_id,
        duration_seconds: parseInt(lessonForm.duration_seconds) || 0,
        is_preview: lessonForm.is_preview
      }).eq('id', editingLesson.id)
    } else {
      await supabase.from('lessons').insert({
        module_id: module.id,
        title: lessonForm.title,
        bunny_video_id: lessonForm.bunny_video_id,
        duration_seconds: parseInt(lessonForm.duration_seconds) || 0,
        is_preview: lessonForm.is_preview,
        sort_order: lessons.length
      })
    }
    setShowLessonForm(false)
    setEditingLesson(null)
    setLessonForm({ title: '', bunny_video_id: '', duration_seconds: 0, is_preview: false })
    onRefresh()
  }

  async function deleteLesson(id) {
    if (!confirm('Bu dersi silmek istediğine emin misin?')) return
    await supabase.from('lessons').delete().eq('id', id)
    onRefresh()
  }

  function formatDuration(seconds) {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between py-2">
        <h4 className="font-medium text-sm text-[var(--brand)]">{module.title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white text-[var(--text-secondary)] transition-all cursor-pointer">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-600 transition-all cursor-pointer">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="ml-4 space-y-1">
        {lessons.map(lesson => (
          <div key={lesson.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white transition-all group">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-primary)]">{lesson.title}</span>
              {lesson.is_preview && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-100 text-blue-700 font-medium">Önizleme</span>
              )}
              {lesson.duration_seconds > 0 && (
                <span className="text-xs text-[var(--text-secondary)]">{formatDuration(lesson.duration_seconds)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingLesson(lesson); setLessonForm({ title: lesson.title, bunny_video_id: lesson.bunny_video_id || '', duration_seconds: lesson.duration_seconds || 0, is_preview: lesson.is_preview || false }); setShowLessonForm(true) }} className="p-1 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] cursor-pointer">
                <Pencil size={12} />
              </button>
              <button onClick={() => deleteLesson(lesson.id)} className="p-1 rounded hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-600 cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showLessonForm ? (
        <form onSubmit={handleSaveLesson} className="ml-4 mt-2 p-4 bg-white rounded-xl border border-[var(--border)] space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ders Adı</label>
            <input type="text" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} required placeholder="Örn: Facebook Reklam Yöneticisi Tanıtımı" autoFocus className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Bunny Video ID</label>
              <input type="text" value={lessonForm.bunny_video_id} onChange={e => setLessonForm({ ...lessonForm, bunny_video_id: e.target.value })} placeholder="Sonra eklenebilir" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Süre (saniye)</label>
              <input type="number" value={lessonForm.duration_seconds} onChange={e => setLessonForm({ ...lessonForm, duration_seconds: e.target.value })} placeholder="Örn: 600" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={lessonForm.is_preview} onChange={e => setLessonForm({ ...lessonForm, is_preview: e.target.checked })} className="rounded" />
            <span className="text-sm text-[var(--text-primary)]">Ücretsiz önizleme dersi</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg cursor-pointer">{editingLesson ? 'Güncelle' : 'Ders Ekle'}</button>
            <button type="button" onClick={() => { setShowLessonForm(false); setEditingLesson(null) }} className="px-4 py-2 border border-[var(--border)] text-sm rounded-lg cursor-pointer">İptal</button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setShowLessonForm(true); setEditingLesson(null); setLessonForm({ title: '', bunny_video_id: '', duration_seconds: 0, is_preview: false }) }} className="ml-4 mt-1 text-xs text-[var(--accent)] hover:underline cursor-pointer flex items-center gap-1">
          <Plus size={12} /> Ders Ekle
        </button>
      )}
    </div>
  )
}
