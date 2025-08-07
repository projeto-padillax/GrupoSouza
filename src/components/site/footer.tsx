// components/Footer.tsx
import Link from "next/link";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image";
import { getConfiguracaoPagina } from "@/lib/actions/config";

export default async function Footer() {
  const siteConfig = await getConfiguracaoPagina();
  function formatTelefone(telefone: string): string {
    if (!telefone) return "";

    const cleaned = telefone.replace(/\D/g, "");

    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  }

  return (
    <>
      <footer className="text-black w-[90%] mx-auto max-w-7xl border-t border-b">
        {/* Container principal */}
        <div className="py-6 rounded-lg">
          {/* Seção superior */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center border-b pb-6">
            {/* Logo */}
            <div className="mb-6 lg:mb-0">
              <Link href="/">
                <Image
                  src={"/logoGrupoSouza.png"}
                  alt={"Logo do Site"}
                  width={150}
                  height={47}
                ></Image>
              </Link>
            </div>

            {/* Telefones e Redes Sociais */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <span>Siga-nos</span>
              <div className="flex space-x-3">
                <a
                  href="https://www.instagram.com/gruposouza/"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-7 h-7 text-[#4F7DC3]" />
                </a>
                <a
                  href="https://www.youtube.com/@souzasouza3147"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-7 h-7 text-[#4F7DC3]" />
                </a>
              </div>
            </div>
          </div>

          {/* Menu Horizontal */}
          <div className="w-full pt-6 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="col-span-1 place-self-center md:place-self-start">
              <h3 className="font-bold text-[#4F7DC3] mb-6">Navegação</h3>
              <nav className="flex flex-col gap-4 md:gap-8">
                <Link
                  href="/"
                  className="text-black hover:text-[#4F7DC3] transition-colors font-medium"
                >
                  Página Inicial
                </Link>
                <Link
                  href="/sobre"
                  className="text-black hover:text-[#4F7DC3] transition-colors font-medium"
                >
                  Sobre a Empresa
                </Link>
                <Link
                  href="/anuncie"
                  className="text-black hover:text-[#4F7DC3] transition-colors font-medium"
                >
                  Anuncie seu Imóvel
                </Link>
                <Link
                  href="/contato"
                  className="text-black hover:text-[#4F7DC3] transition-colors font-medium"
                >
                  Contato
                </Link>
              </nav>
            </div>

            <div className="md:col-span-2 lg:col-span-3 grow-1">
              {siteConfig?.enderecos?.map((endereco, index) => (
                <div className="flex flex-col mb-8" key={index}>
                  <h3 className="font-bold text-[#4F7DC3] mb-2">
                    Sede {index + 1}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 items-center text-black gap-4">
                    <span>{endereco.rua}</span>
                    {endereco.telefone1 && (
                      <Link
                        href={
                          endereco.isWhatsApp1
                            ? `https://wa.me/55${endereco.telefone1}`
                            : ""
                        }
                        className="flex items-center md:justify-center justify-start"
                      >
                        <span className="lg:ml-2">
                          {endereco.tituloTelefone1 != "" ? (
                            <strong>{endereco.tituloTelefone1}</strong>
                          ) : endereco.isWhatsApp1 ? (
                            <FaWhatsapp></FaWhatsapp>
                          ) : (
                            <FaPhoneAlt></FaPhoneAlt>
                          )}{" "}
                          {formatTelefone(endereco.telefone1)}
                        </span>
                      </Link>
                    )}
                    {endereco.telefone2 && (
                      <Link
                        href={
                          endereco.isWhatsApp2
                            ? `https://wa.me/55${endereco.telefone2}`
                            : ""
                        }
                        className="flex items-center md:justify-center justify-start"
                      >
                        <span className="lg:ml-2">
                          {endereco.tituloTelefone2 != "" ? (
                            <strong>{endereco.tituloTelefone2}</strong>
                          ) : endereco.isWhatsApp2 ? (
                            <FaWhatsapp></FaWhatsapp>
                          ) : (
                            <FaPhoneAlt></FaPhoneAlt>
                          )}{" "}
                          {formatTelefone(endereco.telefone2)}
                        </span>
                      </Link>
                    )}
                    {endereco.telefone3 && (
                      <Link
                        href={
                          endereco.isWhatsApp3
                            ? `https://wa.me/55${endereco.telefone3}`
                            : "#"
                        }
                        className="flex items-center md:justify-center justify-start"
                      >
                        <span className="lg:ml-2">
                          {endereco.tituloTelefone3 != "" ? (
                            <strong>{endereco.tituloTelefone3}</strong>
                          ) : endereco.isWhatsApp3 ? (
                            <FaWhatsapp></FaWhatsapp>
                          ) : (
                            <FaPhoneAlt></FaPhoneAlt>
                          )}{" "}
                          {formatTelefone(endereco.telefone3)}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <div className="justify-between pt-4 flex flex-row items-center w-[90%] mx-auto max-w-7xl">
        <a
          href="https://www.leadlink.com.br/templatepro/gruposouza/"
          style={{ color: "#4d4d4d", fontWeight: 400 }}
          className="text-sm"
        >
          Site desenvolvido por{" "}
          <strong style={{ color: "#4F7DC3" }}>Lead Link</strong>
        </a>
        <div className="text-sm">
          <Link
            href="/privacidade"
            className="text-black hover:text-gray-300 transition-colors font-medium"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </>
  );
}
