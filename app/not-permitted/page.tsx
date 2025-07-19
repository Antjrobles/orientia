'use client';

import React from 'react';
import { Shield, ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotPermittedPage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            No tienes permisos para acceder a este recurso
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Contacta al administrador si crees que esto es un error.
          </p>

          {/* Error Code */}
          <div className="bg-gray-50 rounded-lg p-3 mb-8">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Error:</span> 403 - Forbidden
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Mi Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}