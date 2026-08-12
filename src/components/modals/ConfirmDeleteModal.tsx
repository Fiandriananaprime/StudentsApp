import { Icon, ICONS } from '../icons/Icon'
import { getStudentId } from '../../utils/studentHelpers'
import type { Student } from '../../types'

interface ConfirmDeleteModalProps {
  student: Student
  fields: string[]
  onConfirm: () => void
  onClose: () => void
  deleting: boolean
}

export function ConfirmDeleteModal({ student, fields, onConfirm, onClose, deleting }: ConfirmDeleteModalProps) {
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
