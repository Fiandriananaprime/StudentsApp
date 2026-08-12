import { useState } from 'react'
import { AuthLayout, AuthField } from '../components/AuthLayout'
import { ICONS } from '../components/icons/Icon'
import { signup } from '../api/auth'
import { useToast } from '../context/ToastContext'

interface SignupPageProps {
  onGoToLogin: () => void
  onSignedUp: (email: string) => void
}

export function SignupPage({ onGoToLogin, onSignedUp }: SignupPageProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useToast()

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      showToast('error', 'Merci de remplir tous les champs')
      return
    }
    if (password !== confirmPassword) {
      showToast('error', 'Les mots de passe ne correspondent pas')
      return
    }
    setSubmitting(true)
    try {
      await signup({ firstName, lastName, email, password })
      showToast('success', 'Compte créé, vérifiez votre email')
      onSignedUp(email)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : "Échec de l'inscription")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Inscrivez-vous pour gérer vos étudiants">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="Prénom" value={firstName} onChange={setFirstName} placeholder="Jean" />
          <AuthField label="Nom" value={lastName} onChange={setLastName} placeholder="Dupont" />
        </div>
        <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" icon={ICONS.mail} />
        <AuthField label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon={ICONS.lock} />
        <AuthField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" icon={ICONS.lock} />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
          Déjà inscrit ?{' '}
          <button onClick={onGoToLogin} className="font-medium" style={{ color: 'var(--color-accent-light)' }}>
            Se connecter
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
