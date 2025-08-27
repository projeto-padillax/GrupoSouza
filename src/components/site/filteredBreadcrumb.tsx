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

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const TRANSLATIONS: Record<string, string> = {
  comprar: "Comprar",
  alugar: "Alugar",
  s: "Lançamentos",
  true: "Lançamentos",
  sim: "Mobiliados",
};

export default function BreadCrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbItems = useMemo(() => {
    const items: { name: string; href: string }[] = [];
    
    // Verificar se é uma rota de imóvel individual
    const segments = pathname.split("/").filter(Boolean);
    const isImovelRoute = segments[0] === "imovel";
    
    if (isImovelRoute && segments.length >= 3) {
      // Rota: /imovel/apartamento-com-86m-3-quartos-1-suite-1-vaga-no-bairro-paulista-em-piracicaba/21736
      const slugImovel = segments[1];
      const idImovel = segments[2];
      
      // Extrair informações do slug
      const decodedSlug = decodeURIComponent(slugImovel.replace(/\+/g, " "));
      
      // Extrair tipo (primeira palavra antes do primeiro hífen)
      const tipo = decodedSlug.split("-")[0];
      
      // Extrair cidade (após "em-")
      const cidadeMatch = decodedSlug.match(/em-([^-]+)(?:-|$)/);
      const cidade = cidadeMatch ? cidadeMatch[1] : "";
      
      // Extrair bairro (após "bairro-" e antes de "-em-")
      const bairroMatch = decodedSlug.match(/bairro-([^-]+(?:-[^-]+)*)-em-/);
      const bairro = bairroMatch ? bairroMatch[1].replace(/-/g, " ") : "";
      
      // Extrair quartos
      const quartosMatch = decodedSlug.match(/(\d+)-quartos?/);
      const quartos = quartosMatch ? quartosMatch[1] : "";
      
      // 1. Tipo à venda/aluguel em Cidade
      if (tipo && cidade) {
        const tipoCapitalized = capitalize(tipo);
        const cidadeCapitalized = capitalize(cidade);
        items.push({
          name: `${tipoCapitalized} em ${cidadeCapitalized}`,
          href: `/busca?action=comprar&tipos=${tipo}&cidade=${cidade}`,
        });
      }
      
      // 2. Bairro
      if (bairro) {
        const bairroCapitalized = capitalize(bairro);
        items.push({
          name: bairroCapitalized,
          href: `/busca?action=comprar&tipos=${tipo}&cidade=${cidade}&bairro=${bairro}`,
        });
      }
      
      // 3. Quartos
      if (quartos) {
        items.push({
          name: `${quartos} quartos`,
          href: `/busca?action=comprar&tipos=${tipo}&cidade=${cidade}&bairro=${bairro}&quartos=${quartos}`,
        });
      }
      
      // 4. ID do imóvel
      items.push({
        name: idImovel,
        href: pathname,
      });
      
      return items;
    }
    
    // Lógica original para outras rotas
    // Pegar os parâmetros de query
    const action = searchParams.get("action") ?? "";
    const cidadeParam = searchParams.get("cidade") ?? "";
    const bairroParam = searchParams.get("bairro") ?? "";
    const tiposParam = searchParams.get("tipos") ?? ""; // Array de tipos
    
    // Construir query string base
    const baseQuery = new URLSearchParams();
    const currentPath = pathname;

    // 1. Adicionar Action (Comprar/Alugar)
    if (action) {
      baseQuery.set("action", action);
      const actionName = TRANSLATIONS[action.toLowerCase()] || capitalize(action);
      items.push({
        name: actionName,
        href: `${currentPath}?${baseQuery.toString()}`,
      });
    }

    // 2. Adicionar tipo específico ou "Imóveis" após action
    if (action) {
      let tipoName = "Imóveis"; // padrão
      
      if (tiposParam) {
        // Se tipos é um array, pegar o primeiro tipo
        const tiposArray = tiposParam.split(",").map(t => t.trim()).filter(Boolean);
        if (tiposArray.length > 0) {
          tipoName = capitalize(decodeURIComponent(tiposArray[0].replace(/\+/g, " ")));
        }
      }
      
      items.push({
        name: tipoName,
        href: `${currentPath}?${baseQuery.toString()}`,
      });
    }

    // 3. Adicionar cidade se existir
    if (cidadeParam) {
      const cityName = decodeURIComponent(cidadeParam.replace(/\+/g, " "));
      baseQuery.set("cidade", cidadeParam);
      
      items.push({
        name: capitalize(cityName),
        href: `${currentPath}?${baseQuery.toString()}`,
      });
    }

    // 4. Adicionar bairro se existir
    if (bairroParam) {
      const bairroName = decodeURIComponent(bairroParam.replace(/\+/g, " "));
      // Separar múltiplos bairros por vírgula
      const bairros = bairroName.split(",").map(b => b.trim()).filter(Boolean);
      const firstBairro = bairros[0];
      
      // Se há mais de um bairro, mostrar contador
      let displayName = capitalize(firstBairro);
      if (bairros.length > 1) {
        displayName += ` (+${bairros.length - 1})`;
      }
      
      baseQuery.set("bairro", bairroParam);
      
      items.push({
        name: displayName,
        href: `${currentPath}?${baseQuery.toString()}`,
      });
    }

    return items;
  }, [pathname, searchParams]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbItems.map(({ name, href }, index) => (
          <Fragment key={`${name}-${index}`}>
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