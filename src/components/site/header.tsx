import { Phone } from 'lucide-react';
import Link from 'next/link';
// import  { useSidebar } from './sidebar';
import SidebarWrapper from './sideBarWrapper';
import Image from 'next/image';
import FavoriteIcon from './favoritosIcon';
import { FaWhatsapp } from "react-icons/fa";


export default function Header() {
  // const { isOpen, openSidebar, closeSidebar } = useSidebar();

  return (
    <>
      <header className="bg-white h-28 content-center">
        <div className="max-w-7xl mx-auto w-[90%]">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image src={"/logoGrupoSouza.png"} alt={'Logo do Site'} width={200} height={69}></Image>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <Link href={"/favoritos"} prefetch={true}>
                  <FavoriteIcon />
                </Link>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>(19) 3417-8190</span>
                </div>
                <Link href='https://wa.me/5519992430041' className="flex items-center">
                  <FaWhatsapp className='h-8 w-8'></FaWhatsapp>
                </Link>
              </div>
              <SidebarWrapper />
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
