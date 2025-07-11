"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image, Link, FileText, Save, X, Sparkles, Globe } from "lucide-react";

const formSchema = z.object({
  status: z.boolean().default(true),
  banner: z.string().min(1, { message: "Banner é obrigatório." }),
  titulo: z.string().min(1, { message: "Título é obrigatório." }),
  subtitulo: z.string().optional(),
  link: z.string().url({ message: "Link deve ser uma URL válida." }),
});

export default function AdminPage() {
  const [previewImage, setPreviewImage] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("url");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        form.setValue("banner", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage("");
    setUploadedFile(null);
    form.setValue("banner", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    form.reset();
    clearImage();
    setImageMode("url");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form data:", values);
    console.log("Uploaded file:", uploadedFile);
    console.log("Image mode:", imageMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <AdminHeader />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
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
                  
                  {/* Status */}
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
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  console.log("Switch changed to:", checked);
                                }}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                          </div>
                          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Imagem */}
                  <div className="space-y-4">
                    <label className="text-base font-medium text-gray-900 flex items-center gap-2">
                      <Image className="h-4 w-4 text-gray-600" />
                      Imagem do Banner *
                    </label>
                    
                    {/* Toggle modo */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-1 w-fit mx-auto">
                      <Button
                        type="button"
                        variant={imageMode === "upload" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setImageMode("upload");
                          clearImage();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant={imageMode === "url" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setImageMode("url");
                          clearImage();
                        }}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        URL
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Preview */}
                      <div className="relative">
                        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
                          {previewImage ? (
                            <div className="relative w-full h-full">
                              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={clearImage}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Image className="h-12 w-12 mb-2" />
                              <span className="text-sm">Preview</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Input */}
                      <div className="flex items-center justify-center">
                        {imageMode === "upload" ? (
                          <div className="w-full">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="upload"
                            />
                            <label
                              htmlFor="upload"
                              className="flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
                            >
                              <Upload className="h-10 w-10 mb-3 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                Clique para upload
                              </span>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
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
                                  <Input
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="h-12"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setPreviewImage(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Título Principal *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Promoção Especial de Verão"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subtítulo */}
                  <FormField
                    control={form.control}
                    name="subtitulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Subtítulo (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Até 70% de desconto"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Link */}
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Link de Destino *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://exemplo.com/promocoes"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 h-12"
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
      
      <AdminFooter />
    </div>
  );
}