import { Icon, ICONS } from './icons/Icon'
import { getStudentId, avatarColor, initials } from '../utils/studentHelpers'
import type { Student } from '../types'

interface StudentTableProps {
  fields: string[]
  students: Student[]
  filtered: Student[]
  loading: boolean
  search: string
  onEdit: (s: Student) => void
  onDeleteRequest: (s: Student) => void
}

export function StudentTable({ fields, students, filtered, loading, search, onEdit, onDeleteRequest }: StudentTableProps) {
  const gridCols = `2.5rem 1fr repeat(${Math.max(fields.length - 1, 0)}, 1fr) 7rem`

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      {/* Table header */}
      <div
        className="grid text-xs font-medium uppercase tracking-wider px-4 py-3"
        style={{
          gridTemplateColumns: gridCols,
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
                gridTemplateColumns: gridCols,
                borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                {i + 1}
              </span>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: bg, color: fg }}>
                  {initials(s, fields)}
                </div>
                <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                  {String(s[fields[0]] ?? '—')}
                </span>
              </div>

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

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => onEdit(s)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-light)' }}
                  title="Modifier"
                >
                  <Icon d={ICONS.edit} size={12} />
                </button>
                <button
                  onClick={() => onDeleteRequest(s)}
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
  )
}
