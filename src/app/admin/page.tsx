import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";

export default function AdminPage() {
  return (
    // <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="py-8">
          <AdminDashboard />
        </main>
        <AdminFooter />
      </div>
    // </AuthGuard>
  )
}