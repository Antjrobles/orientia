'use client'

import { useSession, getSession, signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  useEffect(() => {
    getSession().then(s => {
      console.log('getSession manual:', s)
    })
  }, [])

  if (status === 'loading') {
    return <p>Cargando sesión...</p>
  }

  if (!session) {
    return (
      <div>
        <p>No estás autenticado.</p>
        <button onClick={() => signIn('google')}>Iniciar sesión con Google</button>
      </div>
    )
  }

  return (
    <div>
      <p>Hola, {session.user?.name}</p>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  )
}