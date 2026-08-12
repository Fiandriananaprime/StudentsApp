import { useState, useEffect, useCallback } from 'react'

const API = 'https://students-1-i5ss.onrender.com/students'

interface Student {
  id: number | string
  [key: string]: unknown
}

type FormData = Record<string, string>

function getFields(students: Student[]): string[] {
  if (!students.length) return ['name', 'email', 'age']
  const keys = Object.keys(students[0]).filter(k => k !== 'id' && k !== '__v' && k !== '_id')
  return keys.length ? keys : ['name', 'email', 'age']
}

function getStudentId(s: Student): string {
  return String(s._id ?? s.id ?? '')
}

function initForm(fields: string[]): FormData {
  return Object.fromEntries(fields.map(f => [f, '']))
}

function studentToForm(s: Student, fields: string[]): FormData {
  return Object.fromEntries(fields.map(f => [f, String(s[f] ?? '')]))
}

// ── Icons ──────────────────────────────────────────────────────────────────

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  plus: 'M12 5v14M5 12h14',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  close: 'M18 6 6 18M6 6l12 12',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  check: 'M20 6 9 17l-5-5',
  alert: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
}

// ── Toast ──────────────────────────────────────────────────────────────────

interface Toast { id: number; type: 'success' | 'error'; msg: string }

function ToastItem({ t, onDone }: { t: Toast; onDone: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(t.id), 3200)
    return () => clearTimeout(timer)
  }, [t.id, onDone])

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in"
      style={{
        background: t.type === 'success' ? '#16231e' : '#231616',
        border: `1px solid ${t.type === 'success' ? '#22c55e33' : '#ef444433'}`,
        color: t.type === 'success' ? '#4ade80' : '#f87171',
      }}
    >
      <Icon d={t.type === 'success' ? ICONS.check : ICONS.alert} size={14} />
      {t.msg}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────

interface ModalProps {
  title: string
  fields: string[]
  form: FormData
  onChange: (k: string, v: string) => void
  onSubmit: () => void
  onClose: () => void
  submitting: boolean
  mode: 'create' | 'edit'
}

function Modal({ title, fields, form, onChange, onSubmit, onClose, submitting, mode }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-light)' }}>
              <Icon d={mode === 'create' ? ICONS.plus : ICONS.edit} size={14} />
            </div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'var(--color-muted)' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--color-muted)')}>
            <Icon d={ICONS.close} size={14} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {fields.map(field => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1.5 capitalize" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                {field}
              </label>
              <input
                value={form[field] ?? ''}
                onChange={e => onChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: field === 'email' || field === 'id' ? 'var(--font-mono)' : 'inherit',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            {submitting ? 'Enregistrement…' : mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────

function ConfirmDelete({ student, fields, onConfirm, onClose, deleting }: {
  student: Student; fields: string[]; onConfirm: () => void; onClose: () => void; deleting: boolean
}) {
  const label = String(student[fields[0]] ?? getStudentId(student))
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl shadow-2xl" style={{ background: 'var(--color-surface)', border: '1px solid #ef444433' }}>
        <div className="px-6 pt-6 pb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#ef444415', color: '#ef4444' }}>
            <Icon d={ICONS.trash} size={18} />
          </div>
          <h3 className="font-semibold text-base mb-1">Supprimer l'étudiant</h3>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Voulez-vous supprimer <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{label}</span> ? Cette action est irréversible.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
            Annuler
          </button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: '#ef4444', color: '#fff' }}>
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastCounter, setToastCounter] = useState(0)

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  const [form, setForm] = useState<FormData>({})
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fields = getFields(students)

  const toast = useCallback((type: 'success' | 'error', msg: string) => {
    setToastCounter(c => {
      const id = c + 1
      setToasts(prev => [...prev, { id, type, msg }])
      return id
    })
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : data.data ?? data.students ?? [])
    } catch {
      toast('error', 'Impossible de charger les étudiants')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openCreate = () => {
    setForm(initForm(fields))
    setShowCreate(true)
  }

  const openEdit = (s: Student) => {
    setForm(studentToForm(s, fields))
    setEditTarget(s)
  }

  const handleFormChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast('success', 'Étudiant créé avec succès')
      setShowCreate(false)
      fetchAll()
    } catch {
      toast('error', 'Échec de la création')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editTarget) return
    setSubmitting(true)
    const id = getStudentId(editTarget)
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast('success', 'Étudiant mis à jour')
      setEditTarget(null)
      fetchAll()
    } catch {
      toast('error', 'Échec de la mise à jour')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const id = getStudentId(deleteTarget)
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast('success', 'Étudiant supprimé')
      setDeleteTarget(null)
      fetchAll()
    } catch {
      toast('error', 'Échec de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = students.filter(s =>
    fields.some(f => String(s[f] ?? '').toLowerCase().includes(search.toLowerCase()))
  )

  const initials = (s: Student) => {
    const name = String(s[fields[0]] ?? '?')
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const avatarColors = [
    ['#312e81', '#818cf8'], ['#14532d', '#4ade80'], ['#7c2d12', '#fb923c'],
    ['#4c0519', '#f472b6'], ['#0c4a6e', '#38bdf8'], ['#3b0764', '#c084fc'],
  ]

  const avatarColor = (s: Student) => {
    const idx = getStudentId(s).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length
    return avatarColors[idx]
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 flex flex-col" style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', zIndex: 10 }}>
        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Icon d={ICONS.user} size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>EduAdmin</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>v1.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <div className="px-3 mb-2 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>Navigation</div>
          {[
            { label: 'Étudiants', icon: ICONS.user, active: true },
          ].map(item => (
            <div key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={item.active ? { background: 'var(--color-accent-dim)', color: 'var(--color-accent-light)' } : { color: 'var(--color-muted)' }}>
              <Icon d={item.icon} size={14} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Stats */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>Total étudiants</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{students.length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-accent-light)' }}>
              {filtered.length !== students.length ? `${filtered.length} filtrés` : 'Tous affichés'}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4" style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Gestion des étudiants</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              {API}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }}>
                <Icon d={ICONS.search} size={13} />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-56 transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAll}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
              title="Actualiser"
              onMouseOver={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              <Icon d={ICONS.refresh} size={14} />
            </button>

            {/* Create */}
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              <Icon d={ICONS.plus} size={14} />
              Nouvel étudiant
            </button>
          </div>
        </header>

        {/* Table */}
        <main className="flex-1 px-8 py-6">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            {/* Table header */}
            <div
              className="grid text-xs font-medium uppercase tracking-wider px-4 py-3"
              style={{
                gridTemplateColumns: `2.5rem 1fr repeat(${Math.max(fields.length - 1, 0)}, 1fr) 7rem`,
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-mono)',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <span>#</span>
              {fields.map(f => <span key={f} className="capitalize">{f}</span>)}
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
                <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Chargement…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
                  <Icon d={ICONS.user} size={18} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Aucun étudiant trouvé</span>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {search ? 'Essayez un autre terme de recherche' : 'Commencez par créer un étudiant'}
                </span>
              </div>
            ) : (
              filtered.map((s, i) => {
                const [bg, fg] = avatarColor(s)
                return (
                  <div
                    key={getStudentId(s)}
                    className="grid items-center px-4 py-3 transition-colors group"
                    style={{
                      gridTemplateColumns: `2.5rem 1fr repeat(${Math.max(fields.length - 1, 0)}, 1fr) 7rem`,
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Index / avatar */}
                    <span className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                      {i + 1}
                    </span>

                    {/* First field with avatar */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: bg, color: fg }}>
                        {initials(s)}
                      </div>
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {String(s[fields[0]] ?? '—')}
                      </span>
                    </div>

                    {/* Remaining fields */}
                    {fields.slice(1).map(f => (
                      <span key={f} className="text-sm truncate pr-2"
                        style={{
                          color: f === 'email' ? 'var(--color-muted)' : 'var(--color-text)',
                          fontFamily: f === 'email' || f === 'id' ? 'var(--font-mono)' : 'inherit',
                          fontSize: f === 'email' ? '0.75rem' : '0.875rem',
                        }}>
                        {String(s[f] ?? '—')}
                      </span>
                    ))}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-light)' }}
                        title="Modifier"
                      >
                        <Icon d={ICONS.edit} size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        style={{ background: '#ef44441a', color: '#ef4444' }}
                        title="Supprimer"
                      >
                        <Icon d={ICONS.trash} size={12} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}

            {/* Footer */}
            {!loading && filtered.length > 0 && (
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                <span className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                  {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                  {search && ` pour "${search}"`}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                  {students.length} total
                </span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreate && (
        <Modal
          title="Nouvel étudiant"
          mode="create"
          fields={fields}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleCreate}
          onClose={() => setShowCreate(false)}
          submitting={submitting}
        />
      )}

      {editTarget && (
        <Modal
          title="Modifier l'étudiant"
          mode="edit"
          fields={fields}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          student={deleteTarget}
          fields={fields}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100]">
        {toasts.map(t => <ToastItem key={t.id} t={t} onDone={removeToast} />)}
      </div>
    </div>
  )
}
