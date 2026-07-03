'use client'

import { useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'
import { testimonials } from '@/data/testimonials'

export default function Testimonial() {
  const containerRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    if (quoteRef.current) revealLines(quoteRef.current as unknown as Element)
    if (containerRef.current) revealLines(containerRef.current)
  }, [])

  const t = testimonials[0]

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
          maxWidth: '800px',
          marginLeft: '15%',
          paddingRight: 'var(--margin-desktop)',
        }}
      >
        <p
          data-line
          className="small-caps"
          style={{
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          Client Voice
        </p>

        {/* TODO: Replace with real client testimonial */}
        <blockquote
          ref={quoteRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-display-lg)',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.3,
            fontFeatureSettings: '"liga" 1, "kern" 1',
          }}
        >
          {t.quote.map((line, i) => (
            <span
              key={i}
              data-line
              style={{ display: 'block', opacity: 0 }}
            >
              {line}
            </span>
          ))}
        </blockquote>

        {/* TODO: Replace with real client attribution */}
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <hr
            data-line
            style={{
              width: '24px',
              border: 'none',
              borderTop: '1px solid var(--color-border)',
              marginBottom: 'var(--space-sm)',
            }}
          />
          <p
            data-line
            className="small-caps"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.name}, {t.role}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div {
            margin-left: var(--margin-mobile) !important;
            padding-right: var(--margin-mobile) !important;
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
