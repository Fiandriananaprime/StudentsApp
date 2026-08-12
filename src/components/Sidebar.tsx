import { Icon, ICONS } from './icons/Icon'
import { useAuth } from '../context/AuthContext'

export function Sidebar({ totalCount, filteredCount }: { totalCount: number; filteredCount: number }) {
  const { user, logout } = useAuth()

  return (
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
        {[{ label: 'Étudiants', icon: ICONS.user, active: true }].map(item => (
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
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{totalCount}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-accent-light)' }}>
            {filteredCount !== totalCount ? `${filteredCount} filtrés` : 'Tous affichés'}
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {user?.email ?? 'Connecté'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
            onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            <Icon d={ICONS.logout} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
