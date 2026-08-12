import type { AuthUser } from '../types'

export const AUTH_API = `${import.meta.env.VITE_API_URL}/auth`;

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface AuthResponse {
  token?: string
  message?: string
  user?: AuthUser
}

async function parseResponse(res: Response): Promise<AuthResponse> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Erreur ${res.status}`)
  }
  return data
}

// POST /auth/signup
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

// POST /auth/verify-email
export async function verifyEmail(payload: VerifyEmailPayload): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API}/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

// POST /auth/resend-verification
export async function resendVerificationCode(payload: ResendVerificationPayload): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API}/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

// POST /auth/login
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}
