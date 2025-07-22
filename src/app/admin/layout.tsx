import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = cookies();
    const session = (await cookieStore).get("session")?.value;

    if (!session) {
        redirect("/login");
    }
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader />
            <main className="flex-1 py-4">
                {children}
            </main>
            <AdminFooter />
        </div>
    )
}