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

export const metadata: Metadata = {
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
      <body>
        <GrainOverlay />
        <CustomCursor />
        <ClientInit>{children}</ClientInit>
      </body>
    </html>
  )
}
