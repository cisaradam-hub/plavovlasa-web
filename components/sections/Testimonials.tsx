'use client'

import { useState, useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'

const testimonials = [
  {
    quote:
      'Maximálna spokojnosť! Veľmi milý a profesionálny prístup, všetko prebiehalo v príjemnej a uvoľnenej atmosfére. Dokonale vystihnuté, čo som chcela – líčenie aj účes vyzerali nádherne, prirodzene a všetko vydržalo bezchybne celý deň a noc. Určite odporúčam!',
    author:  'Alexandra',
    context: 'Make-up & účes',
  },
  {
    quote:
      'Linda vie na žene nájsť to najkrajšie a zvýrazniť to tak, ako by si to sama doma nedokázala. Tak krásne spravenú pleťovku, obočie a pery som ešte nemala, ten odtieň, ktorý pre mňa našla, bol dokonalý! Navyše — makeup vydržal krásne celý večer.',
    author:  'Vanda',
    context: 'Make-up',
  },
  {
    quote:
      'Absolvovala som u Lindy kurz samolíčenia a bolo to úplne skvelé – nielenže ma naučila super triky priamo pre moju tvár, ale pri káve a výbornom pokeci to ubehlo ako s kamoškou, pričom som odchádzala s obrovskou dávkou sebavedomia. :)',
    author:  'Jana',
    context: 'Kurz samolíčenia',
  },
  {
    quote:
      'Linda mi robila make-up a vlasy na svadbu. Už na skúške vypočula všetky moje predstavy a výsledok bol skvelý — v deň svadby taktiež. Veľmi som ocenila, že prišla priamo k nám domov, čo celé svadobné ráno spríjemnilo. Make-up aj účes vydržali celý deň aj noc. Určite odporúčam.',
    author:  'Andrea',
    context: 'Make-up & účes — svadba',
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
