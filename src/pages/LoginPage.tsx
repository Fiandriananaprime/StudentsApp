import { useState } from 'react'
import { AuthLayout, AuthField } from '../components/AuthLayout'
import { ICONS } from '../components/icons/Icon'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'


interface LoginPageProps {
  onGoToSignup: () => void
  onNeedsVerification: (email: string) => void
}

export function LoginPage({ onGoToSignup, onNeedsVerification }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { setSession } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast('error', 'Renseignez votre email et votre mot de passe')
      return
    }
    setSubmitting(true)
    try {
      const res = await login({ email, password })
      if (!res.token) throw new Error('Aucun token reçu')
      setSession(res.token, res.user ?? null)
      showToast('success', 'Connexion réussie')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Échec de la connexion'
      if (msg.toLowerCase().includes('email not verified')) {
        showToast('error', 'Email non vérifié, entrez votre code')
        onNeedsVerification(email)
        return
      }
      showToast('error', msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace de gestion des étudiants">
      <div className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" icon={ICONS.mail} />
        <AuthField label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon={ICONS.lock} />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
          Pas encore de compte ?{' '}
          <button onClick={onGoToSignup} className="font-medium" style={{ color: 'var(--color-accent-light)' }}>
            Créer un compte
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
