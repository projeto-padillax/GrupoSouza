"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Search } from "lucide-react";

/**
 * Maps query parameter keys to user-friendly labels.
 */
const queryParamLabels: Record<string, string> = {
  action: "Ação",
  cidade: "Cidade",
  tipos: "Tipo",
  bairro: "Bairro",
  valorMin: "Valor Mín.",
  valorMax: "Valor Máx.",
  quartos: "Quartos",
  suites: "Suítes",
  vagas: "Vagas",
};

/**
 * Formats a value string for display in the breadcrumb, consolidating multiple values.
 */
const formatValue = (value: string) => {
  const parts = value.split(',');
  if (parts.length <= 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, ' ');
  }
  const firstPart = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, ' ');
  return `${firstPart} (+${parts.length - 1} outro${parts.length - 1 > 1 ? 's' : ''})`;
};

/**
 * A dynamic BreadCrumb component that generates breadcrumbs from both
 * URL path segments and search query parameters.
 * @param {string} pageTitle - The title for the last breadcrumb item on a detail page.
 */
export default function BreadCrumb({ pageTitle }: { pageTitle?: string }) {
  const [pathname, setPathname] = useState("");
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    // Simulate Next.js hooks in a client-side environment
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const pathSegments = pathname.split('/').filter(Boolean);
  const queryParams = new Map(searchParams);

  // Collect all filter parameters to be displayed in the breadcrumb.
  const filters: { key: string; value: string; label: string }[] = [];
  for (const [key, value] of queryParams.entries()) {
    if (queryParamLabels[key]) {
      filters.push({
        key,
        value: value,
        label: queryParamLabels[key],
      });
    }
  }

  // Determine if this is a single property page.
  const isImovelPage = pathSegments.includes('imovel') && pathSegments.length > 1;

  return (
    <Breadcrumb className="whitespace-nowrap">
      <BreadcrumbList>
        {/* Always include a Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/">
              <Home className="h-4 w-4" />
            </a>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator after Home link */}
        <BreadcrumbSeparator />
        
        {/* Path-based breadcrumbs (e.g., /imoveis) */}
        {pathSegments.map((segment, index) => {
          const isLastSegment = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          if (isLastSegment && isImovelPage) {
            return null;
          }

          const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href={href}>
                    {formattedSegment.replace(/-/g, ' ')}
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}

        {/* Filter-based breadcrumbs from query parameters, now consolidated */}
        {filters.map((filter, index) => {
          const isLastFilter = index === filters.length - 1;
          const remainingParams = new URLSearchParams(searchParams);
          remainingParams.delete(filter.key);
          const href = `${pathname}?${remainingParams.toString()}`;

          return (
            <Fragment key={filter.key}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href={href}>
                    <div className="flex items-center gap-1">
                      <Search className="h-4 w-4" />
                      <span className="font-semibold">{filter.label}:</span>
                      {formatValue(filter.value)}
                    </div>
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLastFilter && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}

        {/* Last item, which is the current page title (not a link) */}
        {(pageTitle || filters.length > 0) && (
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isImovelPage ? pageTitle : (
                <div className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Resultados
                </div>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
