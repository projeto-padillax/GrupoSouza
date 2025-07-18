"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createConfiguracaoPagina,
  updateConfiguracaoPagina,
} from "@/lib/actions/config";
import React, { useTransition } from "react";

const siteConfigSchema = z.object({
  nomeSite: z.string().optional(),
  CRECI: z.string().optional(),
  sobreNos: z.string().optional(),
  logoUrl: z.string().optional(),
  facebookUrl: z
    .string()
    .url("URL inválida para Facebook.")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("URL inválida para Instagram.")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("URL inválida para YouTube.")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("URL inválida para LinkedIn.")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("URL inválida para Twitter.")
    .optional()
    .or(z.literal("")),
  whatsappNumber: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.array(z.string().regex(/^55\d{11}$/, "Invalid Number!")).optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  linkGoogleMaps: z
    .string()
    .url("URL inválida para Google Maps.")
    .optional()
    .or(z.literal("")),
});

type SiteConfigSchema = z.infer<typeof siteConfigSchema>;

export default function ConfigPageForm({
  config,
}: {
  config?: SiteConfigSchema;
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const form = useForm<SiteConfigSchema>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      nomeSite: config?.nomeSite || "",
      CRECI: config?.CRECI || "",
      sobreNos: config?.sobreNos || "",
      logoUrl: config?.logoUrl || "",
      facebookUrl: config?.facebookUrl || "",
      instagramUrl: config?.instagramUrl || "",
      youtubeUrl: config?.youtubeUrl || "",
      linkedinUrl: config?.linkedinUrl || "",
      twitterUrl: config?.twitterUrl || "",
      whatsappNumber: config?.whatsappNumber || "",
      endereco: config?.endereco || "",
      telefone: config?.telefone || [""],
      bairro: config?.bairro || "",
      cidade: config?.cidade || "",
      estado: config?.estado || "",
      cep: config?.cep || "",
      linkGoogleMaps: config?.linkGoogleMaps || "",
    },
  });

  function convertFormDataToDbFormat(values: SiteConfigSchema) {
    return {
      nomeSite: values.nomeSite ?? null,
      CRECI: values.CRECI || null,
      sobreNos: values.sobreNos || null,
      logoUrl: values.logoUrl || null,
      facebookUrl: values.facebookUrl || null,
      instagramUrl: values.instagramUrl || null,
      youtubeUrl: values.youtubeUrl || null,
      linkedInUrl: values.linkedinUrl || null, // Note a diferença no nome
      twitterUrl: values.twitterUrl || null,
      whatsappNumber: values.whatsappNumber || null,
      endereco: values.endereco || null,
      bairro: values.bairro || null,
      cidade: values.cidade || null,
      estado: values.estado || null,
      CEP: values.cep || null, // Note a diferença no nome
      linkGoogleMaps: values.linkGoogleMaps || null,
      telefone: values.telefone || [""],
    };
  }

  const onSubmit = (values: SiteConfigSchema) => {
    startTransition(async () => {
      const valuesWithNull = convertFormDataToDbFormat(values);
      if (!config) {
        createConfiguracaoPagina(valuesWithNull);
        router.push("/admin");
        return;
      }
      updateConfiguracaoPagina(valuesWithNull);
      router.push("/admin");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Informações Básicas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nomeSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Site *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Imobiliária Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="CRECI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRECI *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 12345-J" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sobreNos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobre a Empresa *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a história e missão da sua imobiliária..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Logo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/logo.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL da imagem do logo da empresa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Redes Sociais */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Redes Sociais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/suaimobiliaria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/suaimobiliaria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/@suaimobiliaria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/suaimobiliaria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/suaimobiliaria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número com DDD para contato via WhatsApp
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Endereço e Contato */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Endereço e Contato
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua das Flores, 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="01234-567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 3333-4444" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkGoogleMaps"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Link do Google Maps</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://maps.google.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link direto para a localização no Google Maps
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="cursor-pointer" disabled={isPending}>
                {isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {"Salvando..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {"Salvar"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin")}
                size="lg"
                disabled={isPending}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
