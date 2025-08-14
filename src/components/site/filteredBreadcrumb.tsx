"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const decodeLabel = (s: string) =>
  decodeURIComponent(s).replace(/_/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const formatListWithCount = (items: string[], maxItems = 3) => {
  if (items.length <= maxItems) return items.join(", ");
  const remaining = items.length - maxItems;
  return `${items.slice(0, maxItems).join(", ")} (+${remaining})`;
};

export default function BreadCrumb() {
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(window.location.pathname);
    }
  }, []);

  const segments = path.split("/").filter(Boolean);

  type Crumb = { label: string; href?: string };
  const crumbs: Crumb[] = [];

  // Página "Anuncie seu Imóvel"
  if (segments[0] === "anuncie-seu-imovel") {
    crumbs.push({ label: "Início", href: "/" });
    crumbs.push({ label: "Anunciar Imóvel" });
  } else {
    // Caso seja página de imóvel individual
    const isSinglePropertyPage = segments[0] === "imovel" && segments.length >= 3;
    if (isSinglePropertyPage) {
      crumbs.push({ label: "Início", href: "/" });
      crumbs.push({ label: "Imóveis", href: "/imoveis" });
      crumbs.push({ label: decodeLabel(segments[1]) }); // nome do imóvel
    } else {
      // Página de listagem
      const actionSeg = segments.find((s) => s === "comprar" || s === "alugar");
      const action = actionSeg ? capitalize(decodeLabel(actionSeg)) : "Comprar";

      const tiposSeg = segments.find((s) => s.startsWith("tipo-"));
      const tipos: string[] = tiposSeg
        ? tiposSeg
            .slice("tipo-".length)
            .split("_")
            .filter(Boolean)
            .map((t) => capitalize(decodeLabel(t)))
        : [];

      const cidadeSegIndex = segments.findIndex((s) => s.startsWith("cidade-"));
      let cidadeNome = "";
      let bairros: string[] = [];
      let cidadeHref = "/";
      if (cidadeSegIndex >= 0) {
        const raw = segments[cidadeSegIndex].slice("cidade-".length);
        const pares = raw.split("_").filter(Boolean);
        if (pares[0]) cidadeNome = capitalize(decodeLabel(pares[0].split(":")[0]));
        bairros = pares.map((p) => capitalize(decodeLabel(p.split(":")[1] || ""))).filter(Boolean);

        const cidadeLimpa = pares[0].split(":")[0];
        const pathAteCidade = [...segments.slice(0, cidadeSegIndex), `cidade-${cidadeLimpa}`];
        cidadeHref = "/" + pathAteCidade.join("/");
      }

      const lancamentos = segments.some((s) => /^lancamentos(-s|-true)?$/i.test(s));
      const mobiliado = segments.some((s) => /^mobiliado(-sim|-true)?$/i.test(s));

      // Início
      crumbs.push({ label: "Início", href: "/" });

      // Ação
      if (actionSeg) {
        crumbs.push({
          label: action,
          href: `/${segments.slice(0, segments.indexOf(actionSeg) + 1).join("/")}`,
        });
      }

      // Tipos
      if (tipos.length > 0) {
        crumbs.push({
          label: formatListWithCount(tipos),
          href: `/${segments.slice(0, segments.indexOf(tiposSeg!) + 1).join("/")}`,
        });
      }

      // Cidade
      if (cidadeNome) {
        crumbs.push({ label: cidadeNome, href: cidadeHref });
      }

      // Bairros
      if (bairros.length > 0) {
        crumbs.push({ label: formatListWithCount(bairros) });
      }

      // Lançamentos / Mobiliado
      if (lancamentos) crumbs.push({ label: "Lançamentos" });
      if (mobiliado) crumbs.push({ label: "Mobiliados" });
    }
  }

  return (
    <Breadcrumb className="whitespace-nowrap">
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            <BreadcrumbItem>
              {c.href ? (
                <BreadcrumbLink asChild>
                  <a href={c.href}>{i === 0 ? <Home className="h-4 w-4" /> : c.label}</a>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink asChild>
                  <a href="#">{c.label}</a>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
