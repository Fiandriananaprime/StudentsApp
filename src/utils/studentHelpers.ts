import type { Student, FormData } from '../types'

export function getFields(students: Student[]): string[] {
  if (!students.length) {
    return ['firstName', 'lastName', 'email', 'age']
  }

  const keys = Object.keys(students[0])
    .filter(k => k !== 'id' && k !== '__v' && k !== '_id')

  return keys.length
    ? keys
    : ['firstName', 'lastName', 'email', 'age']
}

export function getStudentId(s: Student): string {
  return String(s._id ?? s.id ?? '')
}

export function initForm(fields: string[]): FormData {
  return Object.fromEntries(fields.map(f => [f, '']))
}

export function studentToForm(s: Student, fields: string[]): FormData {
  return Object.fromEntries(fields.map(f => [f, String(s[f] ?? '')]))
}

const AVATAR_COLORS: [string, string][] = [
  ['#312e81', '#818cf8'], ['#14532d', '#4ade80'], ['#7c2d12', '#fb923c'],
  ['#4c0519', '#f472b6'], ['#0c4a6e', '#38bdf8'], ['#3b0764', '#c084fc'],
]

export function avatarColor(s: Student): [string, string] {
  const idx = getStudentId(s).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export function initials(s: Student, fields: string[]): string {
  const name = String(s[fields[0]] ?? '?')
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
