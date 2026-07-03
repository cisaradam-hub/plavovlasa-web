// COMING SOON MODE — uncomment the original below to restore the full site

export default function Home() {
  return (
    <main style={{
      minHeight:      '100svh',
      background:     '#F5F2EC',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 24px',
      fontFamily:     'var(--font-serif, Georgia, serif)',
    }}>
      <p style={{
        fontFamily:    'var(--font-mono, monospace)',
        fontSize:      '11px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         '#9A8F83',
        marginBottom:  '32px',
      }}>
        plavovlasa.sk
      </p>

      <h1 style={{
        fontFamily:    'var(--font-display, Georgia, serif)',
        fontSize:      'clamp(36px, 7vw, 72px)',
        fontWeight:    400,
        lineHeight:    1.05,
        letterSpacing: '-0.02em',
        color:         '#1A1612',
        textAlign:     'center',
        marginBottom:  '24px',
      }}>
        Čoskoro.
      </h1>

      <p style={{
        fontFamily:  'var(--font-serif, Georgia, serif)',
        fontSize:    'clamp(15px, 1.4vw, 18px)',
        fontWeight:  300,
        color:       '#6B6057',
        textAlign:   'center',
        maxWidth:    '36ch',
        lineHeight:  1.6,
        marginBottom:'48px',
      }}>
        Web sa práve dokončuje. Medzitým ma nájdete na Instagrame.
      </p>

      <a
        href="https://www.instagram.com/plavovlasa.makeup/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           '10px',
          fontFamily:    'var(--font-serif, Georgia, serif)',
          fontSize:      '16px',
          fontWeight:    300,
          color:         '#1A1612',
          textDecoration:'none',
          borderBottom:  '1px solid #C8BFB5',
          paddingBottom: '4px',
          transition:    'opacity 0.3s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.55' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
      >
        @plavovlasa.makeup
      </a>
    </main>
  )
}

/*
──────────────────────────────────────────────
ORIGINAL PAGE — uncomment to restore full site
──────────────────────────────────────────────

import fs   from 'fs'
import path from 'path'

import Preloader    from '@/components/sections/Preloader'
import Navigation  from '@/components/layout/Navigation'
import Hero        from '@/components/sections/Hero'
import About       from '@/components/sections/About'
import Services    from '@/components/sections/Services'
import Portfolio   from '@/components/sections/Portfolio'
import Testimonials from '@/components/sections/Testimonials'
import Pricing     from '@/components/sections/Pricing'
import Contact     from '@/components/sections/Contact'

function getPortfolioImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'portfolio')
  try {
    return fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map(f => `/images/portfolio/${f}`)
  } catch {
    return []
  }
}

export default function Home() {
  const portfolioImages = getPortfolioImages()

  return (
    <main>
      <Preloader />
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Portfolio images={portfolioImages} />
      <Pricing />
      <Contact />
    </main>
  )
}
*/
