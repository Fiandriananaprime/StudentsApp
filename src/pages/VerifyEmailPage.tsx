import { useState, useEffect } from 'react'
import { AuthLayout, AuthField } from '../components/AuthLayout'
import { verifyEmail, resendVerificationCode } from '../api/auth'
import { useToast } from '../context/ToastContext'

const RESEND_COOLDOWN = 30

interface VerifyEmailPageProps {
  email: string
  onVerified: () => void
  onBackToLogin: () => void
}

export function VerifyEmailPage({ email, onVerified, onBackToLogin }: VerifyEmailPageProps) {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const { showToast } = useToast()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleVerify = async () => {
    if (!code) {
      showToast('error', 'Entrez le code reçu par email')
      return
    }
    setSubmitting(true)
    try {
      await verifyEmail({ email, code })
      showToast('success', 'Email vérifié, vous pouvez vous connecter')
      onVerified()
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Code invalide ou expiré')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerificationCode({ email })
      showToast('success', 'Nouveau code envoyé')
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : "Échec de l'envoi du code")
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout title="Vérifiez votre email" subtitle={`Un code de vérification a été envoyé à ${email}`}>
      <div className="space-y-4">
        <AuthField label="Code de vérification" value={code} onChange={setCode} placeholder="123456" />

        <button
          onClick={handleVerify}
          disabled={submitting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {submitting ? 'Vérification…' : 'Vérifier'}
        </button>

        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
        >
          {cooldown > 0 ? `Renvoyer le code (${cooldown}s)` : resending ? 'Envoi…' : 'Renvoyer le code'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
          <button onClick={onBackToLogin} className="font-medium" style={{ color: 'var(--color-accent-light)' }}>
            Retour à la connexion
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
