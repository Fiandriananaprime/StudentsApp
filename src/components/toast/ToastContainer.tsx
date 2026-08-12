import { ToastItem } from './ToastItem'
import type { Toast } from '../../types'

export function ToastContainer({ toasts, onDone }: { toasts: Toast[]; onDone: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100]">
      {toasts.map(t => <ToastItem key={t.id} t={t} onDone={onDone} />)}
    </div>
  )
}
