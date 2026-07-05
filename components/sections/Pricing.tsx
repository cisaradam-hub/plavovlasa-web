'use client'

import { useEffect, useRef } from 'react'
import { revealLines, revealFade } from '@/lib/animations'
import { getLenis } from '@/lib/lenis'

const priceList = [
  {
    service:     'Makeup',
    price:       '50 €',
    description: 'Svadobné líčenie, denné líčenie, makeup na fotenie, makeup na každú príležitosť.',
  },
  {
    service:     'Módne prehliadky, reklama',
    price:       'dohodou',
    description: 'Cena závisí od rozsahu a náročnosti projektu. Kontaktujte ma pre individuálnu ponuku.',
  },
  {
    service:     'Spoločenské účesy',
    price:       '30 – 60 €',
    description: 'Krátke vlasy / nenáročný účes 30 €, dlhé/husté vlasy, komplikovanejší účes 50 – 60 €.',
  },
  {
    service:     'Kurz samolíčenia',
    price:       '60 €',
    description: 'Individuálny kurz presne podľa vašich potrieb/požiadavok. Ku kurzu sa viažu cestovné náklady.',
  },
  {
    service:     'Cestovné náklady',
    price:       '0,50 €/km',
    description: 'Doprava v rámci BA zdarma. Príplatok platí pri výjazde mimo Bratislavu. Počíta sa cesta tam aj naspäť a bude počítaná z adresy Slnečnice (Viladomy), Bratislava.',
  },
]

const noBreakRange = (s: string) => s.replace(/(\d)\s–\s(\d)/g, '$1 – $2')

export default function Pricing() {
  const headingRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    if (listRef.current)    revealFade(listRef.current, { y: 20, duration: 1.0 })
  }, [])

  return (
    <section
      id="cennik"
      style={{
        background:    'var(--color-background)',
        paddingTop:    'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  '0 var(--margin-desktop)',
        }}
      >
        {/* Nadpis sekcie */}
        <div
          ref={headingRef}
          style={{ marginBottom: 'var(--space-xl)' }}
        >
          <p
            data-line
            className="small-caps"
            style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xs)' }}
          >
            Cenník
          </p>
          <h2
            data-line
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.8vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--color-text-primary)' }}
          >
            Transparentné ceny
          </h2>
        </div>

        {/* Zoznam položiek — plná šírka */}
        <div ref={listRef} style={{ opacity: 0 }}>
          {priceList.map((item, i) => (
            <div key={i}>
              {/* Riadok: názov ·········· cena */}
              <div
                className="price-row"
                style={{
                  display:     'flex',
                  alignItems:  'baseline',
                  gap:         '12px',
                  paddingTop:  'var(--space-md)',
                }}
              >
                {/* Názov služby */}
                <span
                  className="price-service"
                  style={{
                    fontFamily:  'var(--font-serif)',
                    fontSize:    'var(--text-subheading)',
                    fontWeight:  300,
                    color:       'var(--color-text-primary)',
                    whiteSpace:  'nowrap',
                    flexShrink:  0,
                  }}
                >
                  {item.service}
                </span>

                {/* Bodkovaná čiara */}
                <span
                  className="price-dots"
                  aria-hidden="true"
                  style={{
                    flex:              1,
                    height:            '1px',
                    backgroundImage:   'radial-gradient(circle, var(--color-text-tertiary) 1px, transparent 1px)',
                    backgroundSize:    '6px 1px',
                    backgroundRepeat:  'repeat-x',
                    backgroundPosition:'center',
                    opacity:           0.4,
                    alignSelf:         'center',
                    minWidth:          '24px',
                  }}
                />

                {/* Cena */}
                <span
                  className="price-val"
                  style={{
                    fontFamily:  'var(--font-serif)',
                    fontSize:    'var(--text-subheading)',
                    fontWeight:  300,
                    fontStyle:   'italic',
                    color:       'var(--color-text-secondary)',
                    whiteSpace:  'nowrap',
                    flexShrink:  0,
                  }}
                >
                  {item.price}
                </span>
              </div>

              {/* Popis */}
              <p
                className="price-desc"
                style={{
                  fontFamily:   'var(--font-sans)',
                  fontSize:     'clamp(13px, 1vw, 15px)',
                  color:        'var(--color-text-tertiary)',
                  lineHeight:   'var(--leading-body)',
                  marginTop:    '6px',
                  paddingBottom:'var(--space-md)',
                  letterSpacing:'var(--tracking-wide)',
                  textWrap:     'pretty',
                }}
              >
                {item.description.replace(/(\d)\s–\s(\d)/g, (_, a, b) => `${a} – ${b}`)}
              </p>

              {/* Oddeľovač */}
              {i < priceList.length - 1 && (
                <div
                  style={{
                    height:     '1px',
                    background: 'var(--color-border)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <button
            onClick={() => {
              const el = document.querySelector('#kontakt')
              if (!el) return
              const lenis = getLenis()
              if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.6 })
              else el.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '10px',
              fontFamily:    'var(--font-mono)',
              fontSize:      '13px',
              fontWeight:    700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         '#ffffff',
              background:    'var(--color-accent)',
              border:        'none',
              borderRadius:  '100px',
              padding:       '16px 32px',
              cursor:        'none',
              transition:    'background 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#001d6e'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            Chcem
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .price-desc { max-width: 50%; }
        }
        @media (max-width: 768px) {
          #cennik > div {
            padding: 0 var(--margin-mobile) !important;
          }
          .price-row {
            flex-wrap: wrap;
            gap: 2px !important;
          }
          .price-service {
            white-space: normal !important;
            flex-basis: 100%;
          }
          .price-dots { display: none; }
          .price-val  { padding-bottom: 4px; }
        }
      `}</style>
    </section>
  )
}
