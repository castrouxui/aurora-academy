import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/auth/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import Script from "next/script";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Aurora Academy - Aprendé a invertir desde cero",
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
        url: "/logo-full.png",
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
    images: ["/logo-full.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <Providers>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '26520014890924898');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=26520014890924898&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          {children}
          <Toaster richColors position="top-center" closeButton duration={4000} />
          <Analytics />
          {/* <ChatWidget /> */}
        </Providers>
      </body>
    </html>
  );
}
