"use client"

import { useRouter } from "next/navigation"

export function AdminFooter() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <a href="/" className="text-sm hover:text-blue-400 transition-colors">
              Abrir o Site
            </a>
            <span className="text-gray-400">•</span>
            <a href="/admin" className="text-sm hover:text-blue-400 transition-colors">
              Painel de Controle
            </a>
            <span className="text-gray-400">•</span>
            <button onClick={handleLogout} className="text-sm hover:text-blue-400 transition-colors">
              Logout
            </button>
          </div>

          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>2025 © Lead Link - Site para Imobiliárias de Alta Performance. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
