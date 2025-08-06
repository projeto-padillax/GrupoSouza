// import { db } from "@/lib/firebase/clientApp"
// import { getDocs, collection } from "firebase/firestore"

import ChamadasNaHomeSection from "@/components/site/chamadasNaHomeSection";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import { HeroSection } from "@/components/site/heroSection";
import SlideSection from "@/components/site/slideSection";
import { getRandomBannerImage } from "@/lib/actions/banner";
import { getAllSlides } from "@/lib/actions/slide";

export default async function Home() {
  const imageHero = await getRandomBannerImage();
  const slides = await getAllSlides();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>
      <main className="flex-1 pb-8 overflow-hidden">
        <HeroSection imageUrl={imageHero.imagem} subtitulo={imageHero.subtitulo} titulo={imageHero.titulo} url={imageHero.url}></HeroSection>
        <SlideSection slides={slides}></SlideSection>
        <ChamadasNaHomeSection ></ChamadasNaHomeSection>
        <Footer></Footer>
      </main>
    </div>
  );
}
