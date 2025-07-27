// import { db } from "@/lib/firebase/clientApp"
// import { getDocs, collection } from "firebase/firestore"

import Footer from "@/components/site/footer";
import Header from "@/components/site/header";

export default async function Home() {
  // const docRef = collection(db, 'teste')

  // const collections = await getDocs(docRef)

  // const testList: any = collections.docs.map(doc => ({
  //   ...doc.data(),
  //   id: doc.id
  // }))

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>
      <main className="flex-1 py-8">
        {/* {testList.map((test: any) => (
        <li key={test.id}>{test.name}</li>
      ))} */}
        <p> PAGINA INICIAL </p>
      </main>
      <Footer></Footer>
    </div>
  );
}
