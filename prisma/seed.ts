import { PrismaClient, PerfilUsuario } from "@prisma/client";
import { Secoes } from "./secoes";
const prisma = new PrismaClient();

async function main() {
  // superadmin
  const danton = await prisma.user.create({
    data: {
      name: "Danton",
      perfil: PerfilUsuario.SUPERADMIN,
      email: "Danton@prisma.io",
      telefone: "555191808322",
      login: "danton",
      senha: "samurai",
    },
  });

  const secoes = Secoes;

  await prisma.secao.createMany({
    data: secoes
  })
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
