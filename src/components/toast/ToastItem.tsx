import { useEffect } from 'react'
import { Icon, ICONS } from '../icons/Icon'
import type { Toast } from '../../types'

export function ToastItem({ t, onDone }: { t: Toast; onDone: (id: number) => void }) {
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
