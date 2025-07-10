"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold">Painel de Controle</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Bem-vindo, Administrador</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
