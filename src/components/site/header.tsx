import { Phone } from 'lucide-react';
import Link from 'next/link';
// import  { useSidebar } from './sidebar';
import SidebarWrapper from './sideBarWrapper';
import Image from 'next/image';

export default function Header() {
  // const { isOpen, openSidebar, closeSidebar } = useSidebar();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 h-24 content-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image src={"/logoGrupoSouza.png"} alt={'Logo do Site'} width={200} height={69}></Image>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>(19) 3417-8190</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>(19) 99243-0041</span>
                </div>
              </div>

                <SidebarWrapper/>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
