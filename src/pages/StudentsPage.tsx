import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { StudentTable } from '../components/StudentTable'
import { StudentModal } from '../components/modals/StudentModal'
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal'
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../api/students'
import { getFields, getStudentId, initForm, studentToForm } from '../utils/studentHelpers'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import type { Student, FormData } from '../types'

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  const [form, setForm] = useState<FormData>({})
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { showToast } = useToast()
  const { token } = useAuth()

  const fields = getFields(students)

  const loadStudents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchStudents(token)
      setStudents(data)
    } catch {
      showToast('error', 'Impossible de charger les étudiants')
    } finally {
      setLoading(false)
    }
  }, [token, showToast])

  useEffect(() => { loadStudents() }, [loadStudents])

  const openCreate = () => {
    setForm(initForm(fields))
    setShowCreate(true)
  }

  const openEdit = (s: Student) => {
    setForm(studentToForm(s, fields))
    setEditTarget(s)
  }

  const handleFormChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      await createStudent(form, token)
      showToast('success', 'Étudiant créé avec succès')
      setShowCreate(false)
      loadStudents()
    } catch {
      showToast('error', 'Échec de la création')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editTarget) return
    setSubmitting(true)
    const id = getStudentId(editTarget)
    try {
      await updateStudent(id, form, token)
      showToast('success', 'Étudiant mis à jour')
      setEditTarget(null)
      loadStudents()
    } catch {
      showToast('error', 'Échec de la mise à jour')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const id = getStudentId(deleteTarget)
    try {
      await deleteStudent(id, token)
      showToast('success', 'Étudiant supprimé')
      setDeleteTarget(null)
      loadStudents()
    } catch {
      showToast('error', 'Échec de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = students.filter(s =>
    fields.some(f => String(s[f] ?? '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      <Sidebar totalCount={students.length} filteredCount={filtered.length} />

      <div className="ml-60 min-h-screen flex flex-col">
        <Header search={search} onSearchChange={setSearch} onRefresh={loadStudents} onCreate={openCreate} />

        <main className="flex-1 px-8 py-6">
          <StudentTable
            fields={fields}
            students={students}
            filtered={filtered}
            loading={loading}
            search={search}
            onEdit={openEdit}
            onDeleteRequest={setDeleteTarget}
          />
        </main>
      </div>

      {showCreate && (
        <StudentModal
          title="Nouvel étudiant"
          mode="create"
          fields={fields}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleCreate}
          onClose={() => setShowCreate(false)}
          submitting={submitting}
        />
      )}

      {editTarget && (
        <StudentModal
          title="Modifier l'étudiant"
          mode="edit"
          fields={fields}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          student={deleteTarget}
          fields={fields}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
