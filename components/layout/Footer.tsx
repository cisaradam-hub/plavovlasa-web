'use client'

import { getLenis } from '@/lib/lenis'

const navLinks = [
  { label: 'O mne',     href: '#o-mne'    },
  { label: 'Služby',    href: '#sluzby'   },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Cenník',    href: '#cennik'   },
  { label: 'Kontakt',   href: '#kontakt'  },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/plavovlasa.makeup/' },
  // TODO: doplniť ďalšie sociálne siete (Facebook, TikTok …)
]

export default function Footer() {
  const handleBackToTop = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 2.4 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { duration: 1.6 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      style={{
        background:   'var(--color-accent)',
        borderTop:    'none',
        padding:      'var(--space-xl) var(--margin-desktop)',
      }}
    >
      {/* Horný riadok */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          marginBottom:   'var(--space-lg)',
          gap:            'var(--space-md)',
          flexWrap:       'wrap',
        }}
      >
        {/* Logo */}
        <button
          onClick={handleBackToTop}
          style={{
            background:  'none',
            border:      'none',
            padding:     0,
            fontFamily:  'var(--font-serif)',
            fontSize:    'clamp(28px, 3vw, 40px)',
            fontWeight:  300,
            letterSpacing:'var(--tracking-tight)',
            color:       'var(--color-text-on-dark)',
            cursor:      'none',
            lineHeight:  1,
          }}
        >
          Plavovlasa
        </button>

        {/* Navigácia */}
        <nav>
          <ul
            style={{
              listStyle: 'none',
              padding:   0,
              margin:    0,
              display:   'flex',
              gap:       'var(--space-md)',
              flexWrap:  'wrap',
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="small-caps"
                  style={{
                    background:  'none',
                    border:      'none',
                    padding:     0,
                    color:       'var(--color-text-tertiary)',
                    cursor:      'none',
                    transition:  'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-on-dark)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-tertiary)'
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sociálne siete */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          {socialLinks.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="small-caps"
              style={{
                color:          'var(--color-text-tertiary)',
                textDecoration: 'none',
                transition:     'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-on-dark)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-tertiary)'
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Spodný riadok */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          paddingTop:     'var(--space-sm)',
          borderTop:      '1px solid rgba(245,242,236,0.06)',
          gap:            'var(--space-sm)',
          flexWrap:       'wrap',
        }}
      >
        <span
          className="small-caps"
          style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-micro)' }}
        >
          © 2025 Plavovlasa. Všetky práva vyhradené.
        </span>

        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize:   'var(--text-caption)',
            fontStyle:  'italic',
            color:      'rgba(245,242,236,0.2)',
          }}
        >
          Make-up &amp; Hair Artistry
        </span>

        <button
          onClick={handleBackToTop}
          className="small-caps"
          style={{
            background:  'none',
            border:      'none',
            padding:     0,
            color:       'var(--color-text-tertiary)',
            cursor:      'none',
            transition:  'color 0.3s ease',
            fontSize:    'var(--text-micro)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-on-dark)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-tertiary)'
          }}
        >
          Späť hore ↑
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: var(--space-xl) var(--margin-mobile) !important;
          }
          footer > div:first-child {
            flex-direction: column !important;
          }
          footer > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: var(--space-xs) !important;
          }
        }
      `}</style>
    </footer>
  )
}
