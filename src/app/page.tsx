// import { db } from "@/lib/firebase/clientApp"
// import { getDocs, collection } from "firebase/firestore"

import ChamadasNaHomeSection from "@/components/site/chamadasNaHomeSection";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import { HeroSection } from "@/components/site/heroSection";
import SlideSection from "@/components/site/slideSection";
import { getRandomBannerImage } from "@/lib/actions/banner";
import { getDestaques } from "@/lib/firebase/imoveis/destaques";
import { getFirstSlides } from "@/lib/actions/slide";
import { DestaquesSection } from "@/components/site/destaquesSection";

export default async function Home() {
  const [imageHero, slide, destaques] = await Promise.all([
    getRandomBannerImage(),
    getFirstSlides(),
    getDestaques(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>
      <main className="flex-1 pb-8">
        <HeroSection imageUrl={imageHero.imagem} subtitulo={imageHero.subtitulo} titulo={imageHero.titulo} url={imageHero.url}></HeroSection>
        <SlideSection imageUrl={slide?.imagem} titulo={slide?.titulo} url={slide?.url}></SlideSection>
        <ChamadasNaHomeSection ></ChamadasNaHomeSection>
        <DestaquesSection destaques={destaques} />
        <Footer></Footer>
      </main>
    </div>
  );
}
