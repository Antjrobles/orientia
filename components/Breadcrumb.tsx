'use client'

import { Button } from "@/components/ui/button";
import {ArrowRight, Sparkles, BookOpen} from "lucide-react"
import Link from "next/link";


export default function Breadcrumb() {
  return (
<nav aria-label="Breadcrumb" className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900" aria-current="page">
              Sistema de Informes Psicopedagógicos
            </li>
          </ol>
        </div>
      </nav>
  );
}