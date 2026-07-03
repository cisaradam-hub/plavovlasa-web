'use client'

import { useEffect, useRef } from 'react'
import { revealLines, revealFade } from '@/lib/animations'

// TODO: Replace with real client and collaboration names
const clients = [
  { name: 'Vogue', size: 'display-md', italic: false, muted: false },
  { name: "Harper's Bazaar", size: 'heading', italic: true, muted: true },
  { name: 'Independent Editorial', size: 'subheading', italic: false, muted: false },
  { name: 'Film Production', size: 'display-md', italic: true, muted: true },
  { name: 'Fashion Week', size: 'heading', italic: false, muted: false },
  { name: 'International Campaign', size: 'subheading', italic: true, muted: true },
  { name: 'Museum Exhibition', size: 'display-md', italic: false, muted: true },
  { name: 'Private Commission', size: 'heading', italic: true, muted: false },
  { name: 'Music Video', size: 'subheading', italic: false, muted: true },
  { name: 'Luxury Brand', size: 'display-md', italic: true, muted: false },
]

const fontSizeMap: Record<string, string> = {
  'display-md': 'var(--text-display-md)',
  'heading': 'var(--text-heading)',
  'subheading': 'var(--text-subheading)',
}

export default function Clients() {
  const headingRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    if (namesRef.current) revealFade(namesRef.current, { y: 16, duration: 1.0 })
  }, [])

  return (
    <section
      id="collaborations"
      style={{
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3xl)',
          paddingLeft: 'var(--margin-desktop)',
          paddingRight: 'var(--margin-desktop)',
        }}
      >
        {/* Left heading — 40% */}
        <div ref={headingRef} style={{ flexShrink: 0, width: '35%' }}>
          <p data-line className="small-caps" style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)' }}>
            Context
          </p>
          <h2 data-line className="display-lg">
            In Collaboration<br />With —
          </h2>
        </div>

        {/* Typographic river — right 60% */}
        <div
          ref={namesRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '0',
          }}
        >
          {clients.map((client, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: fontSizeMap[client.size],
                fontStyle: client.italic ? 'italic' : 'normal',
                fontWeight: 300,
                color: client.muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                padding: 'var(--space-sm) var(--space-md)',
                lineHeight: 1.2,
                fontFeatureSettings: '"liga" 1, "kern" 1',
                whiteSpace: 'nowrap',
              }}
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>

      <hr
        style={{
          marginTop: 'var(--space-4xl)',
          border: 'none',
          borderTop: '1px solid var(--color-border)',
        }}
      />

      <style>{`
        @media (max-width: 768px) {
          #collaborations > div {
            flex-direction: column !important;
            padding-left: var(--margin-mobile) !important;
            padding-right: var(--margin-mobile) !important;
          }
          #collaborations > div > div:first-child {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
