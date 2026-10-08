import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gaz_style | Premium Mountain Experiences in Chile",
  description: "La experiencia outdoor con más estilo, seguridad y tecnología de Chile. Trekkings VIP y salidas al cerro en Santiago.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#020617" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary selection:text-white">
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) { console.log('SW registered: ', registration.scope); },
                  function(err) { console.log('SW registration failed: ', err); }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
