"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { ConfiguracaoPagina as ConfiguracaoPaginaORM } from "@prisma/client";

// Schema para validação no servidor
const configuracaoServerSchema = z.object({
  nomeSite: z
    .string()
    .max(100, "Nome do site deve ter no máximo 100 caracteres.").nullable().transform(v => v ?? undefined),
  CRECI: z
    .string()
    .max(20, "CRECI deve ter no máximo 20 caracteres.").nullable().transform(v => v ?? undefined),
  logoUrl: z.string().url("URL do logo inválida.").nullable().transform(v => v ?? undefined).or(z.literal("")),
  facebookUrl: z
    .string()
    .url("URL do Facebook inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  instagramUrl: z
    .string()
    .url("URL do Instagram inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  youtubeUrl: z
    .string()
    .url("URL do YouTube inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  twitterUrl: z
    .string()
    .url("URL do Twitter inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  whatsappNumber: z
    .string()
    .min(1, "Número do WhatsApp é obrigatório.")
    .max(20, "Número do WhatsApp deve ter no máximo 20 caracteres.").nullable().transform(v => v ?? undefined),
  linkedInUrl: z
    .string()
    .url("URL do LinkedIn inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  sobreNos: z
    .string()
    .max(2000, "Sobre nós deve ter no máximo 2000 caracteres.").nullable().transform(v => v ?? undefined),
  endereco: z
    .string()
    .max(200, "Endereço deve ter no máximo 200 caracteres.").nullable().transform(v => v ?? undefined),
  bairro: z
    .string()
    .max(100, "Bairro deve ter no máximo 100 caracteres.").nullable().transform(v => v ?? undefined),
  cidade: z
    .string()
    .max(100, "Cidade deve ter no máximo 100 caracteres.").nullable().transform(v => v ?? undefined),
  estado: z
    .string().nullable().transform(v => v ?? undefined),
  CEP: z.string().max(10, "CEP deve ter no máximo 10 caracteres.").nullable().transform(v => v ?? undefined),
  linkGoogleMaps: z
    .string()
    .url("URL do Google Maps inválida.")
    .or(z.literal("")).nullable().transform(v => v ?? undefined),
  telefone: z
    .array(z.string())
});

export type configuracaoSchema = z.infer<typeof configuracaoServerSchema>;

export async function getConfiguracaoPagina(): Promise<configuracaoSchema | null> {
  try {
    const record = await prisma.configuracaoPagina.findFirst({
      orderBy: { id: "asc" },
            select: {
        // Selecionamos apenas os campos necessários, excluindo o id
        nomeSite: true,
        CRECI: true,
        logoUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        youtubeUrl: true,
        linkedInUrl: true,
        twitterUrl: true,
        whatsappNumber: true,
        endereco: true,
        bairro: true,
        cidade: true,
        estado: true,
        CEP: true,
        linkGoogleMaps: true,
        telefone: true,
        sobreNos: true,
      },
    });

    if (!record) {
      return null;
    }

    // Reconstrói o objeto substituindo null/undefined
    const sanitized: configuracaoSchema = {
      nomeSite: record.nomeSite ?? "",
      CRECI: record.CRECI ?? "",
      sobreNos: record.sobreNos ?? "",
      logoUrl: record.logoUrl ?? "",
      facebookUrl: record.facebookUrl ?? "",
      instagramUrl: record.instagramUrl ?? "",
      youtubeUrl: record.youtubeUrl ?? "",
      linkedInUrl: record.linkedInUrl ?? "",
      twitterUrl: record.twitterUrl ?? "",
      whatsappNumber: record.whatsappNumber ?? "",
      endereco: record.endereco ?? "",
      bairro: record.bairro ?? "",
      cidade: record.cidade ?? "",
      estado: record.estado ?? "",
      CEP: record.CEP ?? "",
      linkGoogleMaps: record.linkGoogleMaps ?? "",
      telefone: record.telefone && record.telefone.length > 0 ? record.telefone : [""],
    };

    return sanitized;
  } catch (error) {
    console.error("Erro ao buscar configuração da página:", error);
    throw new Error("Erro ao buscar configuração da página");
  }
}

export async function createConfiguracaoPagina(
  configuracao: Omit<ConfiguracaoPaginaORM, "id"> 
) {
  try {
    const existingConfig = await prisma.configuracaoPagina.findFirst();
    if (existingConfig) {
      throw new Error("Já existe uma configuração. Use a função de atualizar.");
    }
    console.log(configuracao)
    const validatedData = configuracaoServerSchema.parse(configuracao);

    await prisma.configuracaoPagina.create({
      data: {
        nomeSite: validatedData.nomeSite ?? "",
        CRECI: validatedData.CRECI ?? "",
        logoUrl: validatedData.logoUrl ?? "",
        facebookUrl: validatedData.facebookUrl ?? "",
        instagramUrl: validatedData.instagramUrl ?? "",
        youtubeUrl: validatedData.youtubeUrl    ?? "",
        twitterUrl: validatedData.twitterUrl ?? "",
        whatsappNumber: validatedData.whatsappNumber ?? "",
        linkedInUrl: validatedData.linkedInUrl ?? "",
        sobreNos: validatedData.sobreNos ?? "",
        endereco: validatedData.endereco ?? "",
        bairro: validatedData.bairro ?? "",
        cidade: validatedData.cidade ?? "",
        estado: validatedData.estado ?? "",
        CEP: validatedData.CEP ?? "",
        linkGoogleMaps: validatedData.linkGoogleMaps ?? "",
        telefone: validatedData.telefone || [""],
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.message}`);
    }
    console.error("Erro ao criar configuração da página:", error);
    throw new Error("Erro ao criar configuração da página");
  }
}

export async function updateConfiguracaoPagina(
  configuracao: Omit<ConfiguracaoPaginaORM, "id">
) {
  try {
    const { ...configuracaoWithoutId } = configuracao;

    const existingConfig = await prisma.configuracaoPagina.findFirst();

    if (!existingConfig) {
      throw new Error("Configuração não encontrada");
    }

    const validatedData = configuracaoServerSchema.parse(configuracaoWithoutId);

    await prisma.configuracaoPagina.update({
      where: { id: existingConfig.id },
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.message}`);
    }
    console.error("Erro ao atualizar configuração da página:", error);
    throw new Error("Erro ao atualizar configuração da página");
  }
}
