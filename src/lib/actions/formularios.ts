"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import {
  tipoFormulario,
  OrigemFormulario,
  InteresseFormulario,
  Formulario,
} from "@prisma/client";

const formularioServerSchema = z.object({
  tipo: z.enum(tipoFormulario),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  telefone: z.string().min(8, "Telefone é obrigatório"),
  urlRespondida: z.url("URL inválida"),
  origem: z.enum(OrigemFormulario).optional(),
  interesse: z.enum(InteresseFormulario).optional(),
  turnoVisita: z.string().optional(),
  DataVisita: z.coerce.date().optional(),
  codigoImovel: z.string().optional(),
  mensagem: z.string().optional(),
  condominio: z.string().optional(),
  assunto: z.string().optional(),
});

export type FormularioInput = z.infer<typeof formularioServerSchema>;

export async function getAllFormularios(): Promise<Formulario[]> {
  return await prisma.formulario.findMany({
    orderBy: { dataEnvio: "desc" },
  });
}

export async function findFormulario(id: string): Promise<Formulario | null> {
  return await prisma.formulario.findUnique({
    where: { id },
  });
}

export async function createFormulario(input: FormularioInput): Promise<void> {
  const validated = formularioServerSchema.parse(input);

  await prisma.formulario.create({
    data: {
      tipo: validated.tipo,
      nome: validated.nome,
      email: validated.email,
      telefone: validated.telefone,
      urlRespondida: validated.urlRespondida,
      origem: validated.origem ?? "ORGANICO",
      interesse: validated.interesse,
      turnoVisita: validated.turnoVisita,
      DataVisita: validated.DataVisita,
      codigoImovel: validated.codigoImovel,
      mensagem: validated.mensagem,
      condominio: validated.condominio,
      assunto: validated.assunto,
    },
  });
}

export async function deleteFormulario(id: string): Promise<void> {
  await prisma.formulario.delete({
    where: { id },
  });
}
