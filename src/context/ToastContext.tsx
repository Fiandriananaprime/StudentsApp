import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { ToastContainer } from '../components/toast/ToastContainer'
import type { Toast, ToastType } from '../types'

interface ToastContextValue {
  showToast: (type: ToastType, msg: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [counter, setCounter] = useState(0)

  const showToast = useCallback((type: ToastType, msg: string) => {
    setCounter(c => {
      const id = c + 1
      setToasts(prev => [...prev, { id, type, msg }])
      return id
    })
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
