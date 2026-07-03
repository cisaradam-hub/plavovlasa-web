'use client'

import { useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'

const practiceAreas = [
  {
    index: '01',
    name: 'Editorial & Campaign',
    description: 'Fashion, beauty, and luxury campaigns. Print and digital.',
  },
  {
    index: '02',
    name: 'Film & Moving Image',
    description: 'Feature film, short form, music video, and commercial production.',
  },
  {
    index: '03',
    name: 'Private Clientele',
    description: 'Discrete, personal appointments for significant occasions.',
  },
  {
    index: '04',
    name: 'Collaboration',
    description: 'Long-form creative work with photographers, directors, and artists.',
  },
]

const topPaddings = [
  '0',
  'var(--space-xl)',
  'var(--space-md)',
  'var(--space-2xl)',
]

export default function Practice() {
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    if (gridRef.current) revealLines(gridRef.current)
    if (closingRef.current) revealLines(closingRef.current)
  }, [])

  return (
    <section
      id="practice"
      style={{
        paddingTop: 'var(--space-5xl)',
        paddingBottom: 'var(--space-3xl)',
        paddingLeft: 'var(--margin-desktop)',
      }}
    >
      <div ref={headingRef}>
        <p data-line className="small-caps" style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)' }}>
          Ways of Working
        </p>
        <h2 data-line className="display-lg" style={{ marginBottom: 'var(--space-xl)' }}>
          Practice Areas
        </h2>
      </div>

      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          columnGap: 'var(--gutter)',
          paddingRight: 'var(--margin-desktop)',
        }}
      >
        {practiceAreas.map((area, i) => (
          <div
            key={area.index}
            data-line
            style={{
              paddingTop: topPaddings[i],
              borderTop: '1px solid var(--color-border)',
              paddingBottom: 'var(--space-lg)',
            }}
          >
            <p className="small-caps" style={{ color: 'var(--color-text-tertiary)', marginTop: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              {area.index}
            </p>
            <h3
              className="display-md underline-draw"
              style={{
                marginBottom: 'var(--space-sm)',
                display: 'inline-block',
                transition: 'font-style 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.fontStyle = 'italic'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.fontStyle = 'normal'
              }}
            >
              {area.name}
            </h3>
            <p className="body-text">
              {area.description}
            </p>
          </div>
        ))}
      </div>

      <div
        ref={closingRef}
        style={{
          marginTop: 'var(--space-3xl)',
          paddingRight: 'var(--margin-desktop)',
        }}
      >
        <p data-line className="body-text">
          For inquiries regarding availability and collaboration —
        </p>
        {/* TODO: replace with real email */}
        <a
          data-line
          href="mailto:hello@plavovlasa.com"
          className="display-md"
          style={{
            fontStyle: 'italic',
            marginTop: 'var(--space-sm)',
            display: 'inline-block',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            transition: 'color 0.3s var(--ease-out-expo)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-accent)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)'
          }}
        >
          hello@plavovlasa.com
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          section {
            padding-left: var(--margin-mobile) !important;
          }
        }
      `}</style>
    </section>
  )
}
