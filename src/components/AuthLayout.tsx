import type { ReactNode } from 'react'
import { Icon, ICONS } from './icons/Icon'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-accent)' }}>
            <Icon d={ICONS.user} size={16} />
          </div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h1>
          <p className="text-sm mt-1 text-center" style={{ color: 'var(--color-muted)' }}>{subtitle}</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function AuthField({
  label, type = 'text', value, onChange, placeholder, icon,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }}>
            <Icon d={icon} size={14} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            paddingLeft: icon ? '2.25rem' : '0.75rem',
            paddingRight: '0.75rem',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
        />
      </div>
    </div>
  )
}
