import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/auth/Providers";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Aurora Academy - Aprende a Invertir y Trading Institucional",
    template: "%s | Aurora Academy",
  },
  description: "Plataforma educativa líder en trading institucional y análisis financiero. Cursos de forex, índices y criptomonedas.",
  metadataBase: new URL("https://auroracademy.net"),
  keywords: ["trading", "forex", "inversiones", "cursos trading", "smart money concepts", "aurora academy"],
  authors: [{ name: "Aurora Academy" }],
  creator: "Aurora Academy",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://auroracademy.net",
    title: "Aurora Academy - Formación Profesional en Trading",
    description: "Domina los mercados financieros con nuestra metodología institucional. Unite a la comunidad de traders rentables.",
    siteName: "Aurora Academy",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this image later or use a valid path
        width: 1200,
        height: 630,
        alt: "Aurora Academy - Trading Institucional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Academy - Aprende a Invertir",
    description: "Plataforma educativa para inversores. Cursos de forex, índices y criptomonedas.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${manrope.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-center" closeButton />
        </Providers>
      </body>
    </html>
  );
}
