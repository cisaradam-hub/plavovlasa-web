'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { revealLines, revealImage } from '@/lib/animations'

export default function About() {
  const textRef = useRef<HTMLDivElement>(null)
  const imgRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) revealLines(textRef.current)
    if (imgRef.current)  revealImage(imgRef.current)
  }, [])

  return (
    <section
      id="o-mne"
      style={{
        background:   'var(--color-background)',
        paddingTop:   'var(--space-xl)',
        paddingBottom:'var(--space-2xl)',
      }}
    >
      <div
        style={{
          maxWidth:  'var(--container-max)',
          margin:    '0 auto',
          padding:   '0 var(--margin-desktop)',
          display:   'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:       'var(--space-2xl)',
          alignItems:'center',
        }}
      >
        {/* Ľavá strana — fotka */}
        <div
          ref={imgRef}
          className="about-img"
          style={{ overflow: 'hidden', opacity: 0, aspectRatio: '3 / 4' }}
        >
          <Image
            src="/images/about.jpg"
            alt="Plavovlasa — makeup artistka"
            width={600}
            height={600}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center 15%' }}
          />
        </div>

        {/* Pravá strana — text */}
        <div ref={textRef} className="about-text">
          <p
            data-line
            className="small-caps"
            style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)' }}
          >
            O mne
          </p>

          <h2
            data-line
            style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(22px, 2.8vw, 40px)',
              lineHeight:    1.05,
              letterSpacing: '-0.02em',
              fontWeight:    400,
              color:         'var(--color-text-primary)',
              marginBottom:  'var(--space-md)',
            }}
          >
            Menej makeupu,<br />
            viac teba.
          </h2>

          <p
            data-line
            className="body-text"
            style={{ marginBottom: 'var(--space-sm)' }}
          >
            Volám sa Linda a som certifikovaná makeup artistka (STUDIO22) so sídlom
            v Bratislave. Venujem sa svadobnému, módnemu aj filmovému líčeniu —
            a rovnako rada odovzdávam svoje skúsenosti ďalej, na vlastných kurzoch líčenia.
          </p>

          <p
            data-line
            className="body-text"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            Každá tvár je pre mňa jedinečná. Skôr, než siahnem po štetci,
            si vždy nájdem čas vás spoznať — pretože najkrajší make-up je ten,
            ktorý hovorí práve o vás.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #o-mne > div {
            grid-template-columns: 1fr !important;
            gap: var(--space-lg) !important;
            padding: 0 var(--margin-mobile) !important;
          }
          #o-mne .about-img  { order: 2; }
          #o-mne .about-text { order: 1; }
        }
      `}</style>
    </section>
  )
}
