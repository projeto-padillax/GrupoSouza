import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Secao } from "@/lib/types/secao";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const secoes: Secao[] = [
  {
    id: 1,
    titulo: "Página Inicial",
    url: "https://www.template.leadlink.com.br/",
    edicaoTextoFundo: false,
    sitemap: true,
    descricao: "Dummy description",
    palavrasChave: "dummy palavras chave, por virgula, separas, pao"
  },
]