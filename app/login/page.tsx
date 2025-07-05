'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) setError('Credenciales incorrectas');
    if (res?.ok) window.location.href = '/';
  };

  return (
    <div className='max-w-md mx-auto mt-20 bg-white p-8 rounded shadow'>
      <h1 className='text-2xl font-bold mb-6'>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='w-full mb-4 p-2 border rounded'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='w-full mb-4 p-2 border rounded'
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className='mb-4 text-red-600'>{error}</div>}
        <button className='w-full bg-green-600 text-white py-2 rounded' type='submit'>
          Entrar
        </button>
      </form>
    </div>
  );
}
