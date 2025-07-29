// import { db } from "@/lib/firebase/clientApp"
// import { getDocs, collection } from "firebase/firestore"

import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import { HeroSection } from "@/components/site/heroSection";
import { getRandomBannerImage } from "@/lib/actions/banner";

export default async function Home() {
  const imageHero = await getRandomBannerImage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>
      <main className="flex-1 pb-8">
        <HeroSection imageUrl={imageHero.imagem} subtitulo={imageHero.subtitulo} titulo={imageHero.titulo} url={imageHero.url}></HeroSection>
        <Footer></Footer>
      </main>
    </div>
  );
}
