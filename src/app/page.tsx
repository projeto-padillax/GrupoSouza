import { db } from "@/lib/firebase/clientApp"
import { getDocs, collection } from "firebase/firestore"

export default async function Home() {
  const docRef = collection(db, 'teste')

  const collections = await getDocs(docRef)

  const testList: any = collections.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }))

  console.log(testList)

  return (
    <main >
      <ul>
      {testList.map((test: any) => (
        <li key={test.id}>{test.name}</li>
      ))}
      </ul>
    </main>
  );
}
