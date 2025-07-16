"use client";

import CorretorForm from "@/components/admin/corretorForm";

export default function NovoCorretorPage() {
  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Novo Corretor
            </h1>
            <p className="text-lg text-gray-600">
              Crie um novo corretor
            </p>
          </div>
        </div>

        <CorretorForm />
      </div>
    </main>
  );
}