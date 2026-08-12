import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { StudentsPage } from './pages/StudentsPage'

type View = 'login' | 'signup' | 'verify'

export function UnauthenticatedApp() {
  const [view, setView] = useState<View>('login')
  const [pendingEmail, setPendingEmail] = useState('')

  if (view === 'signup') {
    return (
      <SignupPage
        onGoToLogin={() => setView('login')}
        onSignedUp={email => {
          setPendingEmail(email)
          setView('verify')
        }}
      />
    )
  }

  if (view === 'verify') {
    return (
      <VerifyEmailPage
        email={pendingEmail}
        onVerified={() => setView('login')}
        onBackToLogin={() => setView('login')}
      />
    )
  }

  return (
    <LoginPage
      onGoToSignup={() => setView('signup')}
      onNeedsVerification={email => {
        setPendingEmail(email)
        setView('verify')
      }}
    />
  )
}
function AppShell() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <StudentsPage /> : <UnauthenticatedApp />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </AuthProvider>
  )
}
