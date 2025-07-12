import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import React from "react";

export default function AdminLayout({
    children,
}: { 
    children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminHeader />
            <main className="flex-1 py-4">
                { children }
            </main>
        <AdminFooter />
    </div>
  )
}