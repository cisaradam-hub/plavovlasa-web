'use client'

import { useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'

export default function Contact() {
  const headingRef = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    if (infoRef.current)    revealLines(infoRef.current)
  }, [])

  return (
    <section
      id="kontakt"
      style={{
        background:    'var(--color-accent)',
        paddingTop:    'var(--space-3xl)',
        paddingBottom: 'var(--space-3xl)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  '0 var(--margin-desktop)',
          display:  'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:      'var(--space-2xl)',
          alignItems:'center',
        }}
      >
        {/* Ľavý stĺpec — nadpis */}
        <div ref={headingRef}>
          <p
            data-line
            className="small-caps"
            style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xs)' }}
          >
            Kontakt
          </p>
          <h2
            data-line
            className="display-lg"
            style={{
              color:        'var(--color-text-on-dark)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Napíšte mi.
          </h2>
          <p
            data-line
            className="body-text"
            style={{ color: 'rgba(245,242,236,0.55)', maxWidth: '38ch' }}
          >
            {/* TODO: doplniť skutočný text */}
            Rada si vypočujem vašu víziu a nájdeme spolu riešenie šité na mieru.
          </p>
        </div>

        {/* Pravý stĺpec — kontaktné údaje */}
        <div
          ref={infoRef}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}
        >
          {/* Email */}
          <div data-line>
            <p
              className="small-caps"
              style={{ color: 'var(--color-text-tertiary)', marginBottom: '6px' }}
            >
              E-mail
            </p>
            <a
              href="mailto:hello@plavovlasa.com"
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'var(--text-heading)',
                fontWeight:    300,
                color:         'var(--color-text-on-dark)',
                textDecoration:'none',
                display:       'block',
                transition:    'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.65' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              {/* TODO: nahradiť skutočným emailom */}
              hello@plavovlasa.com
            </a>
          </div>

          {/* Telefón */}
          <div data-line>
            <p
              className="small-caps"
              style={{ color: 'var(--color-text-tertiary)', marginBottom: '6px' }}
            >
              Telefón
            </p>
            <a
              href="tel:+421911557032"
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'var(--text-heading)',
                fontWeight:    300,
                color:         'var(--color-text-on-dark)',
                textDecoration:'none',
                display:       'block',
                transition:    'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.65' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              +421 911 557 032
            </a>
          </div>

          {/* Instagram */}
          <div data-line>
            <p
              className="small-caps"
              style={{ color: 'var(--color-text-tertiary)', marginBottom: '6px' }}
            >
              Instagram
            </p>
            <a
              href="https://www.instagram.com/plavovlasa.makeup/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '14px',
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.65' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              <span style={{
                width:          '44px',
                height:         '44px',
                borderRadius:   '50%',
                background:     'rgba(245,242,236,0.12)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F2EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.75" fill="#F5F2EC" stroke="none"/>
                </svg>
              </span>
              <span style={{
                fontFamily:  'var(--font-serif)',
                fontSize:    'var(--text-heading)',
                fontWeight:  300,
                color:       'var(--color-text-on-dark)',
              }}>
                @plavovlasa.makeup
              </span>
            </a>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #kontakt > div {
            grid-template-columns: 1fr !important;
            gap: var(--space-xl) !important;
            padding: 0 var(--margin-mobile) !important;
          }
        }
      `}</style>
    </section>
  )
}
