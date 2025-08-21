"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ExternalLink, Edit } from "lucide-react";
import { Secao } from "@/lib/types/secao";

interface Props {
  secoes: Secao[];
}

export default function Secoes({ secoes }: Props) {
  const columns = [
    {
      header: "Título",
      accessor: "titulo",
      cell: (item: Secao) => (
        <span
          className="text-gray-900 font-medium text-base"
          dangerouslySetInnerHTML={{ __html: item.titulo }}
        />
      ),
    },
    {
      header: "URL",
      accessor: "url",
      cell: (item: Secao) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium text-base bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200"
        >
          Abrir URL
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ),
    },
    {
      header: "Edição de Texto/Fundo",
      accessor: "edicao",
      cell: (item: Secao) => (
        <span className="text-gray-700 text-base">{item.edicaoTextoFundo}</span>
      ),
    },
    {
      header: "Sitemap",
      accessor: "sitemap",
      cell: (item: Secao) => (
        <span className="text-gray-700 text-base">{item.sitemap}</span>
      ),
    },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (item: Secao) => (
        <Link href={`/admin/secoes/${item.id}/edit`}>
          <Button variant="outline" size="sm" className="bg-transparent cursor-pointer hover:opacity-90">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Seções do site e SEO
            </h1>
            <p className="text-lg text-gray-600">
              Gerencie as seções no Painel de Controle
            </p>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  {columns.map((col) => (
                    <TableHead
                      key={col.accessor}
                      className="font-semibold text-gray-900 text-base py-5 text-center"
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {secoes.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.accessor}
                        className="py-5 text-center"
                      >
                        {col.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}