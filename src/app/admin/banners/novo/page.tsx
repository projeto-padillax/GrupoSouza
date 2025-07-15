"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BannerForm from "@/components/admin/bannerForm";

const bannerSchema = z.object({
  status: z.boolean(),
  imagem: z.any().refine((file) => file instanceof File, {
    message: "O banner é obrigatório.",
  }),
  titulo: z.string().min(1, "Título é obrigatório."),
  subtitulo: z.string().min(1, "Subtítulo é obrigatório."),
  url: z
    .string()
    .url("URL inválida (deve começar com https://).")
    .refine((url) => url.startsWith("https://"), {
      message: "URL deve começar com https://",
    }),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export default function NovoBannerPage() {
  // const router = useRouter();
  // const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      status: true,
      imagem: undefined,
      titulo: "",
      subtitulo: "",
      url: "",
    },
  });

  // const handlePreview = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const result = e.target?.result as string;
  //     setPreviewImage(result);
  //   };
  //   reader.readAsDataURL(file);
  // };


  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Novo Banner na Home
            </h1>
            <p className="text-lg text-gray-600">
              Crie um novo banner para a página inicial
            </p>
          </div>
        </div>

        <BannerForm></BannerForm>
      </div>
    </main>
  );
}
