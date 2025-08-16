"use client";

import React, { Fragment, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BreadCrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbItems = useMemo(() => {
    // Moved capitalize and translateSegment inside useMemo
    const capitalize = (s: string) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    const translateSegment = (segment: string) => {
      switch (segment) {
        case "favoritos":
          return "Favoritos";
        case "anuncie-seu-imovel":
          return "Anuncie seu Imóvel";
        case "politica-de-privacidade":
          return "Política de Privacidade"
        case "imovel":
          return "Imóvel"
        default:
          return capitalize(segment.replace("-", " "));
      }
    };

    const segments = pathname.split("/").filter(Boolean);
    const items: { name: string; href: string }[] = [];

    // rota normal (mas ignoramos "busca")
    segments.forEach((segment, index) => {
      if (segment === "busca") return; // não inclui Busca
      const href = "/" + segments.slice(0, index + 1).join("/");
      items.push({ name: translateSegment(segment), href });
    });

    // rota especial de busca
    if (pathname === "/busca") {
      const query = new URLSearchParams();
      
      // Codigo
      const codigo = searchParams.get("codigo");
      if (codigo) {
        query.set("codigo", codigo);
        items.push({
          name: codigo,
          href: pathname + "?" + query.toString(),
        });
        return items;
      }

      // Action
      const action = searchParams.get("action");
      if (action) {
        query.set("action", action);
        items.push({
          name: action === "comprar" ? "Comprar" : "Alugar",
          href: pathname + "?" + query.toString(),
        });
      }

      // Cidade
      const cidade = searchParams.get("cidade");
      if (cidade) {
        query.set("cidade", cidade);
        items.push({
          name: capitalize(cidade),
          href: pathname + "?" + query.toString(),
        });
      }

      // Bairros
      const bairrosRaw = searchParams.get("bairro");
      if (bairrosRaw) {
        const bairros = bairrosRaw.split(",");
        if (bairros.length > 0) {
          let label: string;

          if (bairros[0].toLowerCase() === "all") {
            label = "Todos";
          } else {
            const first = capitalize(bairros[0].replace(/\+/g, " "));
            label =
              bairros.length > 1 ? `${first} (+${bairros.length - 1})` : first;
          }

          query.set("bairro", bairrosRaw);
          items.push({
            name: label,
            href: pathname + "?" + query.toString(),
          });
        }
      }

      // Tipo
      const tipo = searchParams.get("tipo");
      if (tipo) {
        query.set("tipo", tipo);
        items.push({
          name: capitalize(tipo),
          href: pathname + "?" + query.toString(),
        });
      }

      // Lançamentos
      const lancamentos = searchParams.get("lancamentos");
      if (lancamentos === "s" || lancamentos === "true") {
        query.set("lancamentos", lancamentos);
        items.push({
          name: "Lançamentos",
          href: pathname + "?" + query.toString(),
        });
      }

      // Mobiliado
      const mobiliado = searchParams.get("mobiliado");
      if (mobiliado === "sim" || mobiliado === "true") {
        query.set("mobiliado", mobiliado);
        items.push({
          name: "Mobiliados",
          href: pathname + "?" + query.toString(),
        });
      }
    }

    return items;
  }, [pathname, searchParams]); // No need to list capitalize or translateSegment here

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems.map(({ name, href }, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={href}>{name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
        </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}