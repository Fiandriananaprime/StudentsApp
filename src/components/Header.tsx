import { Icon, ICONS } from './icons/Icon'
import { STUDENTS_API } from '../api/students'

interface HeaderProps {
  search: string
  onSearchChange: (v: string) => void
  onRefresh: () => void
  onCreate: () => void
}

export function Header({ search, onSearchChange, onRefresh, onCreate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4" style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Gestion des étudiants</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          {STUDENTS_API}
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
            onChange={e => onSearchChange(e.target.value)}
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
          onClick={onRefresh}
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
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          <Icon d={ICONS.plus} size={14} />
          Nouvel étudiant
        </button>
      </div>
    </header>
  )
}
