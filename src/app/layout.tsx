import type { Metadata } from "next";
import { Montserrat  } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200","400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Grupo Souza",
  description: "Grupo Souza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased font-[montserrat, sans-serif]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main>
            {children}
          </main>
          <Toaster richColors expand={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
