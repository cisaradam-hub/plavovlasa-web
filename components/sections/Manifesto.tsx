'use client'

import { useEffect, useRef } from 'react'
import { revealLines, revealDisplay } from '@/lib/animations'

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (containerRef.current) revealLines(containerRef.current)
    if (quoteRef.current) revealDisplay(quoteRef.current as unknown as Element)
  }, [])

  return (
    <section
      style={{
        paddingTop: 'var(--space-5xl)',
        paddingBottom: 'var(--space-5xl)',
      }}
    >
      <div
        ref={containerRef}
        style={{
          maxWidth: '680px',
          marginLeft: '12%',
          paddingLeft: 'var(--space-md)',
        }}
      >
        <p
          data-line
          className="small-caps"
          style={{
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-md)',
          }}
        >
          On the Work
        </p>

        <p
          ref={quoteRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-display-md)',
            lineHeight: 1.4,
            fontStyle: 'italic',
            fontWeight: 300,
            fontFeatureSettings: '"liga" 1, "kern" 1',
          }}
        >
          I work in the space between the face as it is and the face
          as it wants to become. Every collaboration begins with
          listening — to the light, to the skin, to what is
          already there.
        </p>

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <hr
            data-line
            style={{
              width: '40px',
              border: 'none',
              borderTop: '1px solid var(--color-border)',
              marginBottom: 'var(--space-sm)',
            }}
          />
          <p data-line className="small-caps" style={{ color: 'var(--color-text-tertiary)' }}>
            Plavovlasa
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div {
            margin-left: var(--margin-mobile) !important;
            padding-top: var(--space-3xl) !important;
          }
          section {
            padding-top: var(--space-3xl) !important;
            padding-bottom: var(--space-3xl) !important;
          }
        }
      `}</style>
    </section>
  )
}
