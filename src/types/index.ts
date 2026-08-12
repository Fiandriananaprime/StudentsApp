export interface Student {
  id: number | string
  [key: string]: unknown
}

export type FormData = Record<string, string>

export type ToastType = 'success' | 'error'

export interface Toast {
  id: number
  type: ToastType
  msg: string
}

export interface AuthUser {
  id: string | number
  email: string
  firstName?: string
  lastName?: string
  [key: string]: unknown
}
