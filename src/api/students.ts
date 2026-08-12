import type { Student, FormData } from '../types'

export const STUDENTS_API = 'http://localhost:8080/Students'

function authHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchStudents(token?: string | null): Promise<Student[]> {
  const res = await fetch(STUDENTS_API, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : data.data ?? data.students ?? []
}

export async function createStudent(form: FormData, token?: string | null): Promise<void> {
  const res = await fetch(STUDENTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(form),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function updateStudent(id: string, form: FormData, token?: string | null): Promise<void> {
  const res = await fetch(`${STUDENTS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(form),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function deleteStudent(id: string, token?: string | null): Promise<void> {
  const res = await fetch(`${STUDENTS_API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
