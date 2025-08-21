import { PrismaClient, PerfilUsuario } from "@prisma/client";
import { createUser } from "@/lib/actions/users";
const prisma = new PrismaClient();

async function main() {
  const danton = await createUser({
    status: true,
    name: "Danton",
    perfil: PerfilUsuario.SUPERADMIN,
    email: "Danton@prisma.io",
    telefone: "555191808322",
    login: "danton",
    senha: "samurai",
  });
  console.log(danton);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
