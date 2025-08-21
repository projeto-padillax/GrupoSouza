// import { GetServerSideProps } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getServerSideProps: GetServerSideProps = async ({ res }) => {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

//   // Fetch only sections that should appear in sitemap
//   const sections = await prisma.secao.findMany({
//     where: { sitemap: true },
//     select: { url: true, descricao: true, palavrasChave: true, updatedAt: true },
//   });

//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${sections
//     .map(
//       (secao) => `
//   <url>
//     <loc>${baseUrl}${secao.url}</loc>
//     <changefreq>weekly</changefreq>
//     <priority>0.8</priority>
//     <description>${secao.descricao}</description>
//     <keywords>${secao.palavrasChave}</keywords>
//   </url>`
//     )
//     .join("")}
// </urlset>`;

//   res.setHeader("Content-Type", "text/xml");
//   res.write(sitemap);
//   res.end();

//   return { props: {} };
// };

// export default function Sitemap() {
//   return null; // No UI
// }
