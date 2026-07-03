'use client'

import { useState, useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'

// TODO: nahradiť skutočnými recenziami
const testimonials = [
  {
    quote:
      'Plavovlasa mi spravila svadobný make-up presne podľa mojich predstáv. Cítila som sa krásne a prirodzene — celý deň vydržal bez retuše. Odporúčam každej neveste!',
    author:  '[Meno klientky]',
    context: 'Svadobný make-up',
  },
  {
    quote:
      'Kurz samolíčenia mi otvoril oči. Za tri hodiny som sa naučila viac ako za celý život pokusov doma. Konečne viem, čo mi pristane a ako to dosiahnuť.',
    author:  '[Meno klientky]',
    context: 'Kurz samolíčenia',
  },
  {
    quote:
      'Profesionalita, jemnosť a úžasné výsledky. Vlasy aj make-up vyzerali presne ako z módneho časopisu. Budem sa vracať znova a znova.',
    author:  '[Meno klientky]',
    context: 'Make-up & vlasy',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
  }, [])

  const goTo = (index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 250)
  }

  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((current + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section
      id="recenzie"
      style={{
        background:    'var(--color-accent)',
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
        {/* Nadpis */}
        <div
          ref={headingRef}
          style={{ marginBottom: 'calc(var(--space-2xl) * 0.5)' }}
        >
          <p
            data-line
            className="small-caps"
            style={{ color: 'rgba(245,242,236,0.45)', marginBottom: 'var(--space-xs)' }}
          >
            Recenzie
          </p>
          <h2 data-line style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.8vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--color-text-on-dark)' }}>
            Hovoria moje klientky
          </h2>
        </div>

        {/* Slider */}
        <div
          style={{
            maxWidth:   '800px',
          }}
        >
          {/* Citát */}
          <blockquote
            style={{
              margin:      0,
              marginBottom:'var(--space-lg)',
              opacity:     isAnimating ? 0 : 1,
              transform:   isAnimating ? 'translateY(8px)' : 'translateY(0)',
              transition:  'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <p
              style={{
                fontFamily:  'var(--font-serif)',
                fontSize:    'clamp(16px, 1.4vw, 22px)',
                fontStyle:   'normal',
                fontWeight:  300,
                lineHeight:  'var(--leading-heading)',
                color:       'var(--color-text-on-dark)',
                marginBottom:'var(--space-md)',
              }}
            >
              „{t.quote}"
            </p>
            <footer>
              <span
                style={{
                  fontFamily:   'var(--font-sans)',
                  fontSize:     'var(--text-caption)',
                  color:        'rgba(245,242,236,0.7)',
                  letterSpacing:'var(--tracking-wide)',
                }}
              >
                {t.author}
              </span>
              <span
                className="small-caps"
                style={{
                  color:       'rgba(245,242,236,0.4)',
                  marginLeft:  '16px',
                }}
              >
                {t.context}
              </span>
            </footer>
          </blockquote>

          {/* Navigácia */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        'var(--space-md)',
            }}
          >
            {/* Šípky */}
            <button
              onClick={prev}
              aria-label="Predchádzajúca recenzia"
              style={{
                background:     'rgba(245,242,236,0.12)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border:         'none',
                borderRadius:   '50%',
                width:          '44px',
                height:         '44px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                cursor:         'none',
                color:          'var(--color-text-on-dark)',
                transition:     'background 0.2s ease',
                flexShrink:     0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,242,236,0.22)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,242,236,0.12)' }}
            >
              ←
            </button>

            {/* Bodky */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Recenzia ${i + 1}`}
                  style={{
                    background:   i === current ? 'var(--color-text-on-dark)' : 'rgba(245,242,236,0.3)',
                    border:       'none',
                    borderRadius: '50%',
                    width:        i === current ? '8px' : '6px',
                    height:       i === current ? '8px' : '6px',
                    padding:      0,
                    cursor:       'none',
                    transition:   'all 0.3s ease',
                    flexShrink:   0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Nasledujúca recenzia"
              style={{
                background:     'rgba(245,242,236,0.12)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border:         'none',
                borderRadius:   '50%',
                width:          '44px',
                height:         '44px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                cursor:         'none',
                color:          'var(--color-text-on-dark)',
                transition:     'background 0.2s ease',
                flexShrink:     0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,242,236,0.22)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,242,236,0.12)' }}
            >
              →
            </button>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #recenzie > div {
            padding: 0 var(--margin-mobile) !important;
          }
        }
      `}</style>
    </section>
  )
}
