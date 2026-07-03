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
  title: 'Plavovlasa — Make-Up Artist',
  description: 'Editorial make-up artistry.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable} ${geistMono.variable}`}>
      <body>
        <GrainOverlay />
        <CustomCursor />
        <ClientInit>{children}</ClientInit>
      </body>
    </html>
  )
}
