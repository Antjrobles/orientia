'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, Mail, User } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('email', {
      email,
      callbackUrl: '/profile',
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('No se pudo enviar el enlace. Intenta de nuevo.')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión en Orientia</h1>
        <Button
          className="w-full mb-4"
          variant="outline"
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
        >
          <User className="mr-2 h-4 w-4" />
          Continuar con Google
        </Button>
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading || sent}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="outline"
            disabled={loading || sent}
          >
            <Mail className="mr-2 h-4 w-4" />
            {sent ? 'Enlace enviado' : loading ? 'Enviando...' : 'Continuar con Email'}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {sent && <p className="text-green-600 text-sm">Revisa tu correo para continuar.</p>}
        </form>
      </div>
    </div>
  )
}