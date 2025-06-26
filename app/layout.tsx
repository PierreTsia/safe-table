import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from '@/components/providers/query-provider'
import { Footer } from '@/components/ui/footer'
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeTable - Transparence Alimentaire en France",
  description: "Explorez les résultats des contrôles officiels sanitaires du dispositif Alim'confiance. Plus de 70 000 établissements alimentaires en France : restaurants, boulangeries, boucheries. Données officielles du Ministère de l'Agriculture.",
  keywords: [
    "Alim'confiance",
    "sécurité alimentaire",
    "contrôles sanitaires",
    "restaurants",
    "hygiène alimentaire",
    "France",
    "DDPP",
    "Ministère Agriculture"
  ],
  authors: [{ name: "SafeTable" }],
  creator: "SafeTable",
  publisher: "SafeTable",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://safetable.fr',
    siteName: 'SafeTable',
    title: 'SafeTable - Transparence Alimentaire en France',
    description: 'Explorez les résultats des contrôles officiels sanitaires des établissements alimentaires en France. Données Alim\'confiance du Ministère de l\'Agriculture.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SafeTable - Transparence Alimentaire en France',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeTable - Transparence Alimentaire en France',
    description: 'Explorez les résultats des contrôles officiels sanitaires des établissements alimentaires en France.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://safetable.fr',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://safe-table.vercel.app/",
              "name": "SafeTable",
              "description": "Transparence alimentaire en France. Explorez les résultats des contrôles officiels sanitaires du dispositif Alim'confiance.",
              "publisher": {
                "@type": "Organization",
                "name": "SafeTable",
                "url": "https://safe-table.vercel.app/"
              },
              "inLanguage": "fr-FR"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Analytics />
          <GoogleAnalytics gaId="G-D201S25KXZ" />
        </QueryProvider>
      </body>
    </html>
  );
}
