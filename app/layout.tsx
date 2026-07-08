import type { Metadata } from 'next'
import { DM_Sans, Space_Mono, Geist_Mono } from 'next/font/google'
import './globals.css'
import GrainOverlay from '@/components/layout/GrainOverlay'
import CustomCursor from '@/components/layout/CustomCursor'
import ClientInit from './ClientInit'

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const geistMono = Geist_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Person', 'LocalBusiness'],
  name: 'Linda Cisárová',
  alternateName: 'Plavovlasa',
  jobTitle: 'Make-up Artist',
  url: 'https://www.plavovlasa.sk',
  telephone: '+421911557032',
  email: 'hello@plavovlasa.sk',
  image: 'https://www.plavovlasa.sk/images/og-image.png',
  description: 'Make-up artistka Linda Cisárová (Plavovlasa) — profesionálne líčenie, vlasový styling a kurzy samolíčenia v Bratislave.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bratislava',
    addressCountry: 'SK',
  },
  areaServed: {
    '@type': 'City',
    name: 'Bratislava',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Služby',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Make-up',
          description: 'Profesionálne líčenie prispôsobené vašej príležitosti — od jemného denného looku po výrazný večerný alebo svadobný make-up.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Vlasy',
          description: 'Štylizácia a úprava vlasov pre každú príležitosť. Svadobné účesy, spoločenské účesy aj každodenný styling.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Kurz samolíčenia',
          description: 'Naučím vás zvýrazniť vašu prirodzenú krásu vlastnými rukami. Individuálny kurz šitý na mieru vášmu pleťovému typu.',
        },
      },
    ],
  },
}

export const metadata: Metadata = {
  verification: {
    google: 'GmFAQMzGIm0IT6mm7UwOvdTwZrllBgLmlwDNRQicqaU',
  },
  title: 'plavovlasa.sk – makeup · vlasy · kurzy líčenia',
  description: 'Keď sa cítiš dobre, je to vidieť.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title:       'plavovlasa.sk – makeup · vlasy · kurzy líčenia',
    description: 'Keď sa cítiš dobre, je to vidieť.',
    url:         'https://www.plavovlasa.sk',
    siteName:    'plavovlasa.sk',
    images: [
      {
        url:    '/images/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Plavovlasa — Make-Up Artist',
      },
    ],
    locale: 'sk_SK',
    type:   'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'plavovlasa.sk – makeup · vlasy · kurzy líčenia',
    description: 'Keď sa cítiš dobre, je to vidieť.',
    images:      ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" className={`${dmSans.variable} ${spaceMono.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <GrainOverlay />
        <CustomCursor />
        <ClientInit>{children}</ClientInit>
      </body>
    </html>
  )
}
