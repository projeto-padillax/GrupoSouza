"use client";

import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image, Link, FileText, Save, X, Sparkles, Globe } from "lucide-react";
import { useState, useRef } from "react";

const formSchema = z.object({
  status: z.boolean().default(true),
  banner: z.string().min(1, { message: "Banner é obrigatório." }),
  titulo: z.string().min(1, { message: "Título é obrigatório." }),
  subtitulo: z.string().optional(),
  link: z.string().url({ message: "Link deve ser uma URL válida." }),
});

export default function AdminPage() {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("url"); // Estado para controlar o modo
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: true,
      banner: "",
      titulo: "",
      subtitulo: "",
      link: "",
    },
  });

  // Função para lidar com upload de arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        form.setValue("banner", result); // Atualizar o valor do formulário
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para lidar com mudança de URL
  const handleUrlChange = (value: string) => {
    setPreviewImage(value);
    form.setValue("banner", value);
  };

  // Função para alternar modo de imagem
  const handleImageModeChange = (mode: "upload" | "url") => {
    setImageMode(mode);
    setPreviewImage("");
    setUploadedFile(null);
    form.setValue("banner", "");
    
    // Limpar input de arquivo se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Dados do formulário:", values);
    console.log("Arquivo enviado:", uploadedFile);
    console.log("Modo da imagem:", imageMode);
    
    // Aqui você pode adicionar a lógica para enviar os dados
    // Se for upload, você precisará enviar o arquivo para um servidor
    // Se for URL, você já tem a URL no values.banner
  };

  const resetForm = () => {
    form.reset();
    setPreviewImage("");
    setUploadedFile(null);
    setImageMode("url");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <AdminHeader />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-lg mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Configurações do Banner
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Personalize o banner principal da sua aplicação
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Campo Status - Card destacado */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <FormLabel className="text-lg font-semibold text-gray-900">
                                Status do Banner
                              </FormLabel>
                              <FormDescription className="text-gray-600">
                                {field.value ? "Banner ativo e visível" : "Banner desativado"}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                          </div>
                          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Seletor de Modo da Imagem */}
                  <div className="space-y-4">
                    <label className="text-base font-medium text-gray-900 flex items-center gap-2">
                      <Image className="h-4 w-4 text-gray-600" />
                      Imagem do Banner *
                    </label>
                    
                    {/* Toggle para escolher modo */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-1 w-fit mx-auto">
                      <Button
                        type="button"
                        variant={imageMode === "upload" ? "default" : "ghost"}
                        size="sm"
                        className={`flex items-center gap-2 transition-all ${
                          imageMode === "upload" 
                            ? "bg-white shadow-sm text-gray-900" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => handleImageModeChange("upload")}
                      >
                        <Upload className="h-4 w-4" />
                        Upload de Arquivo
                      </Button>
                      <Button
                        type="button"
                        variant={imageMode === "url" ? "default" : "ghost"}
                        size="sm"
                        className={`flex items-center gap-2 transition-all ${
                          imageMode === "url" 
                            ? "bg-white shadow-sm text-gray-900" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => handleImageModeChange("url")}
                      >
                        <Globe className="h-4 w-4" />
                        URL da Imagem
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Preview Area */}
                      <div className="relative group">
                        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden transition-all hover:border-blue-400 hover:bg-blue-50/30">
                          {previewImage ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={() => {
                                  setPreviewImage("");
                                  setUploadedFile(null);
                                  form.setValue("banner", "");
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Image className="h-12 w-12 mb-2" />
                              <span className="text-sm">Preview do Banner</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="flex items-center justify-center">
                        {imageMode === "upload" ? (
                          <div className="w-full">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="banner-upload"
                            />
                            <label
                              htmlFor="banner-upload"
                              className="flex flex-col items-center justify-center w-full h-full min-h-[150px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                            >
                              <Upload className="h-10 w-10 mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                Clique para fazer upload
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG até 5MB
                              </p>
                              {uploadedFile && (
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                  {uploadedFile.name}
                                </p>
                              )}
                            </label>
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="banner"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      placeholder="https://exemplo.com/imagem-banner.jpg"
                                      className="h-12 pl-4 pr-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleUrlChange(e.target.value);
                                      }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <Image className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription className="text-sm text-gray-600">
                                  Cole a URL da imagem
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Campo Título */}
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          Título Principal *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Promoção Especial de Verão"
                            className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          Máximo de 60 caracteres para melhor visualização
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Subtítulo */}
                  <FormField
                    control={form.control}
                    name="subtitulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          Subtítulo
                          <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Até 70% de desconto em produtos selecionados"
                            className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          Complemente o título com informações adicionais
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Link */}
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Link className="h-4 w-4 text-gray-600" />
                          Link de Destino *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="https://exemplo.com/promocoes"
                              className="h-12 pl-4 pr-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              {...field}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Link className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          Para onde o usuário será direcionado ao clicar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 h-12 border-2 hover:bg-gray-50 font-medium transition-all"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <div className="mt-auto">
        <AdminFooter />
      </div>
    </div>
  );
}