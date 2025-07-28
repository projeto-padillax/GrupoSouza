// components/Footer.tsx
import Link from 'next/link';
import { Phone, Instagram, Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';


export default function Footer() {
  return (
    <footer className="bg-[#001c40] text-white rounded-lg w-11/12 mx-auto max-w-6xl">
      {/* Container principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Seção superior */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center mb-8">
          
          {/* Logo */}
          <div className="mb-6 lg:mb-0">
            <Link href="/">
                <Image src={"/logo_rodape.png"} alt={'Logo do Site'} width={150} height={47}></Image>
              </Link>
          </div>

          {/* Telefones e Redes Sociais */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Telefones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center text-white">
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-medium">(19) 3417-8190</span>
              </div>
              <div className="flex items-center text-white">
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-medium">(19) 99243-0041</span>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/gruposouza/" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://www.facebook.com/imobiliariagruposouza/" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://www.youtube.com/@souzasouza3147" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Menu Horizontal */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <nav className="flex flex-wrap gap-6 md:gap-8 justify-center lg:justify-start">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Página Inicial
            </Link>
            <Link 
              href="/anuncie" 
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Anuncie seu Imóvel
            </Link>
            <Link 
              href="/sobre" 
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Sobre a Empresa
            </Link>
            <Link 
              href="/contato" 
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              Contato
            </Link>
          </nav>
        </div>

        {/* Seção inferior */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Endereço */}
            <div className="text-gray-300 text-sm">
              <p>
                Rua Benjamin Constant, 724 - Centro - Piracicaba/SP - CEP: 13400-050 - CRECI: 33164 PJ
              </p>
            </div>

            {/* Política de Privacidade */}
            <div className="text-sm">
              <Link 
                href="/privacidade" 
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}