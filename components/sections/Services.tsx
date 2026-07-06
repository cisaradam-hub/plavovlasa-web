'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { revealLines, revealImage } from '@/lib/animations'

const services = [
  {
    id:    'makeup',
    label: '01',
    title: 'Make-up',
    description:
      'Profesionálne líčenie prispôsobené vašej príležitosti — od jemného denného looku po výrazný večerný alebo svadobný make-up.',
    image: '/images/service-makeup.jpg',
    imageAlt: 'Make-up služba',
  },
  {
    id:    'hair',
    label: '02',
    title: 'Vlasy',
    description:
      'Štylizácia a úprava vlasov pre každú príležitosť. Svadobné účesy, spoločenské účesy aj každodenný styling.',
    image: '/images/service-hair.jpg',
    imageAlt: 'Vlasový styling',
  },
  {
    id:    'kurz',
    label: '03',
    title: 'Kurz samolíčenia',
    description:
      'Naučím vás zvýrazniť vašu prirodzenú krásu vlastnými rukami. Individuálny kurz šitý na mieru vášmu pleťovému typu.',
    image: '/images/service-kurz.jpg',
    imageAlt: 'Kurz samolíčenia',
  },
]

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<HTMLDivElement[]>([])
  const imgRefs    = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    cardRefs.current.forEach((el) => { if (el) revealLines(el) })
    imgRefs.current.forEach((el)  => { if (el) revealImage(el) })
  }, [])

  return (
    <section
      id="sluzby"
      style={{
        background:    'var(--color-surface)',
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
          style={{ marginBottom: 'calc(var(--space-2xl) * 0.5)' }}
        >
          <h2 data-line style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.8vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--color-text-primary)' }}>
            Služby
          </h2>
        </div>

        {/* 3 karty */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 'var(--gutter)',
          }}
        >
          {services.map((svc, i) => (
            <article
              key={svc.id}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Obrázok */}
              <div
                ref={(el) => { if (el) imgRefs.current[i] = el }}
                className={`service-img service-img-${svc.id}`}
                style={{
                  overflow:    'hidden',
                  marginBottom:'var(--space-md)',
                  opacity:     0,
                }}
              >
                <Image
                  src={svc.image}
                  alt={svc.imageAlt}
                  width={500}
                  height={667}
                  quality={95}
                  style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>

              {/* Text */}
              <div
                ref={(el) => { if (el) cardRefs.current[i] = el }}
                className="service-text"
                style={{ flex: 1 }}
              >
                <h3
                  data-line
                  style={{
                    fontFamily:   'var(--font-serif)',
                    fontSize:     'var(--text-heading)',
                    fontWeight:   300,
                    lineHeight:   'var(--leading-heading)',
                    color:        'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {svc.title}
                </h3>
                <p
                  data-line
                  className="body-text"
                  style={{ maxWidth: '100%' }}
                >
                  {svc.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #sluzby > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          #sluzby > div {
            padding: 0 var(--margin-mobile) !important;
          }
          .service-text {
            padding-bottom: var(--space-xl) !important;
          }
          .service-img {
            aspect-ratio: 4 / 3 !important;
          }
          .service-img-hair img {
            object-position: center 25% !important;
          }
        }
      `}</style>
    </section>
  )
}
