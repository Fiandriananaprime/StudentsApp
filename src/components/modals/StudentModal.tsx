import { Icon, ICONS } from '../icons/Icon'
import type { FormData } from '../../types'

interface StudentModalProps {
  title: string
  fields: string[]
  form: FormData
  onChange: (k: string, v: string) => void
  onSubmit: () => void
  onClose: () => void
  submitting: boolean
  mode: 'create' | 'edit'
}

export function StudentModal({ title, fields, form, onChange, onSubmit, onClose, submitting, mode }: StudentModalProps) {
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
